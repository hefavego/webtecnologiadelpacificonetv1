
const db = require('../db');

// ─────────────────────────────────────────────────────────────
//  CRM de WhatsApp: guarda contactos y conversaciones del bot
//  para seguimiento comercial.
//  Tablas: server/database/migration_whatsapp_contacts.sql
//
//  No bloquea al bot: cada guardado se encola en segundo plano
//  (el bot no hace await) y los errores solo se registran en el
//  log. Si la BD falla o la migración no se ha ejecutado, el bot
//  sigue respondiendo igual.
// ─────────────────────────────────────────────────────────────

const QUERY_TIMEOUT_MS = 5000; // Evita que una BD colgada acumule tareas indefinidamente

let missingTablesWarned = false;

// ─── Cola por número: guarda en orden sin retrasar al bot ────
//  Los mensajes de un mismo contacto se escriben en el orden en
//  que ocurrieron (entrante → respuesta), contactos distintos
//  se guardan en paralelo.
const queues = new Map();
const enqueue = (phone, task) => {
  const next = (queues.get(phone) || Promise.resolve())
    .then(task)
    .catch(err => logError('procesar la cola del CRM', err));
  queues.set(phone, next);
  next.then(() => { if (queues.get(phone) === next) queues.delete(phone); });
  return next;
};

const query = (sql, values) => db.query({ sql, timeout: QUERY_TIMEOUT_MS }, values);

const logError = (action, err) => {
  if (err.code === 'ER_NO_SUCH_TABLE') {
    if (!missingTablesWarned) {
      missingTablesWarned = true;
      console.warn('⚠️ [whatsappCrm] Tablas del CRM no encontradas. Ejecuta server/database/migration_whatsapp_contacts.sql');
    }
    return;
  }
  console.error(`⚠️ [whatsappCrm] No se pudo ${action}:`, err.message);
};

// ─── Crear o actualizar el contacto y devolver su id ─────────
//  isIncoming = true solo cuando escribe el contacto: así
//  last_contact_at marca la ventana de 24 h de Meta.
const upsertContact = async (phone, profileName = null, isIncoming = false) => {
  const [result] = await query(
    `INSERT INTO whatsapp_contacts (phone, profile_name)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE
       id              = LAST_INSERT_ID(id),
       profile_name    = COALESCE(VALUES(profile_name), profile_name),
       last_contact_at = IF(?, CURRENT_TIMESTAMP, last_contact_at)`,
    [phone, profileName, isIncoming ? 1 : 0]
  );
  return result.insertId;
};

// ─── Mensaje entrante (contacto → bot) ───────────────────────
//  message: objeto de mensaje tal como llega de Meta
const recordIncoming = ({ phone, profileName, message }) => enqueue(phone, async () => {
  try {
    const contactId = await upsertContact(phone, profileName, true);
    // INSERT IGNORE: Meta puede reenviar el mismo webhook; no se duplica
    await query(
      `INSERT IGNORE INTO whatsapp_messages (contact_id, direction, message_type, body, wa_message_id, status)
       VALUES (?, 'in', ?, ?, ?, 'received')`,
      [contactId, message.type || 'text', describeIncomingMessage(message) || null, message.id || null]
    );
  } catch (err) {
    logError('guardar mensaje entrante', err);
  }
});

// ─── Mensaje saliente (bot → contacto) ───────────────────────
const recordOutgoing = ({ phone, body, waMessageId, status }) => enqueue(phone, async () => {
  try {
    const contactId = await upsertContact(phone);
    await query(
      `INSERT IGNORE INTO whatsapp_messages (contact_id, direction, message_type, body, wa_message_id, status)
       VALUES (?, 'out', 'text', ?, ?, ?)`,
      [contactId, body || null, waMessageId || null, status || 'sent']
    );
  } catch (err) {
    logError('guardar mensaje saliente', err);
  }
});

// ─── Datos capturados durante el flujo de cotización ─────────
//  fields: { full_name?, email?, interest_service?, budget_range?, quoted? }
const updateContactData = (phone, fields) => enqueue(phone, async () => {
  try {
    await upsertContact(phone);

    const sets = [];
    const values = [];
    if (fields.full_name)        { sets.push('full_name = ?');        values.push(fields.full_name); }
    if (fields.email)            { sets.push('email = ?');            values.push(fields.email); }
    if (fields.interest_service) { sets.push('interest_service = ?'); values.push(fields.interest_service); }
    if (fields.budget_range)     { sets.push('budget_range = ?');     values.push(fields.budget_range); }
    if (fields.quoted) {
      // Enlaza la cotización recién creada por el bot para este número
      sets.push(`last_quotation_id = (SELECT q.id FROM quotations q WHERE q.phone = ? ORDER BY q.id DESC LIMIT 1)`);
      values.push(phone);
      // Avanza a 'cotizado' sin retroceder a quien ya es cliente
      sets.push(`follow_up_status = IF(follow_up_status = 'cliente', follow_up_status, 'cotizado')`);
    }
    if (sets.length === 0) return;

    values.push(phone);
    await query(`UPDATE whatsapp_contacts SET ${sets.join(', ')} WHERE phone = ?`, values);
  } catch (err) {
    logError('actualizar datos del contacto', err);
  }
});

// ─── Texto legible de cualquier tipo de mensaje de Meta ──────
function describeIncomingMessage(message) {
  const type = message.type || 'unknown';
  switch (type) {
    case 'text':        return message.text?.body || '';
    case 'interactive': return message.interactive?.button_reply?.title
                             || message.interactive?.list_reply?.title || '[interactivo]';
    case 'button':      return message.button?.text || '[botón]';
    case 'image':
    case 'video':
    case 'document':    return message[type]?.caption || message[type]?.filename || `[${type}]`;
    case 'location':    return `[ubicación] ${message.location?.latitude},${message.location?.longitude}`;
    default:            return `[${type}]`;
  }
}

module.exports = {
  recordIncoming,
  recordOutgoing,
  updateContactData,
  describeIncomingMessage,
};
