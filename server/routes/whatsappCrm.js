
const express     = require('express');
const router      = express.Router();
const db          = require('../db');
const { requireAuth } = require('../middleware/authMiddleware');
const {
  validateWhatsappContactId,
  validateWhatsappContactList,
  validateWhatsappMessages,
  validateWhatsappContactUpdate,
} = require('../middleware/validators');

// ─────────────────────────────────────────────────────────────
//  CRM de WhatsApp — contactos y conversaciones del bot
//  Tablas: server/database/migration_whatsapp_contacts.sql
//  Todas las rutas son solo para el administrador (JWT)
// ─────────────────────────────────────────────────────────────

// ── Helper: respuesta de error (503 si falta la migración) ───
const sendDbError = (res, tag, err, message) => {
  console.error(`[whatsapp-crm ${tag}]`, err.message);
  if (err.code === 'ER_NO_SUCH_TABLE') {
    return res.status(503).json({
      success: false,
      message: 'El CRM de WhatsApp no está instalado. Ejecuta migration_whatsapp_contacts.sql.',
    });
  }
  res.status(500).json({ success: false, message });
};

// Meta solo permite mensajes libres 24 h después del último mensaje del contacto
const WINDOW_24H = '(c.last_contact_at > NOW() - INTERVAL 24 HOUR) AS within_24h_window';

// ─── GET /api/whatsapp-crm/contacts  [🔒 Admin] ──────────────
//  ?status=nuevo  ?q=texto  ?due=1 (seguimientos vencidos o de hoy)
//  ?page=1&limit=50
router.get('/contacts', requireAuth, validateWhatsappContactList, async (req, res) => {
  const { status, q, due } = req.query;
  const page  = req.query.page  || 1;
  const limit = req.query.limit || 50;

  const where  = [];
  const values = [];
  if (status) {
    where.push('c.follow_up_status = ?');
    values.push(status);
  }
  if (q) {
    where.push('(c.phone LIKE ? OR c.profile_name LIKE ? OR c.full_name LIKE ? OR c.email LIKE ?)');
    const like = `%${q}%`;
    values.push(like, like, like, like);
  }
  if (due === '1') {
    where.push('c.next_follow_up_at IS NOT NULL AND c.next_follow_up_at < CURDATE() + INTERVAL 1 DAY');
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  try {
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) AS total FROM whatsapp_contacts c ${whereSql}`,
      values
    );

    const [rows] = await db.query(
      `SELECT c.*,
              ${WINDOW_24H},
              (SELECT COUNT(*) FROM whatsapp_messages m WHERE m.contact_id = c.id) AS total_messages,
              (SELECT m.body FROM whatsapp_messages m
                WHERE m.contact_id = c.id AND m.direction = 'in'
                ORDER BY m.id DESC LIMIT 1) AS last_incoming_message
         FROM whatsapp_contacts c
         ${whereSql}
        ORDER BY ${due === '1' ? 'c.next_follow_up_at ASC' : 'c.last_contact_at DESC'}
        LIMIT ? OFFSET ?`,
      [...values, limit, (page - 1) * limit]
    );

    res.json({
      success: true,
      data: rows,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    sendDbError(res, 'contacts GET', err, 'Error al obtener contactos.');
  }
});

// ─── GET /api/whatsapp-crm/contacts/:id  [🔒 Admin] ──────────
//  Ficha del contacto + cotizaciones de ese número
router.get('/contacts/:id', requireAuth, validateWhatsappContactId, async (req, res) => {
  const { id } = req.params;

  try {
    const [contacts] = await db.query(
      `SELECT c.*, ${WINDOW_24H} FROM whatsapp_contacts c WHERE c.id = ?`,
      [id]
    );
    if (contacts.length === 0) {
      return res.status(404).json({ success: false, message: 'Contacto no encontrado.' });
    }

    const [quotations] = await db.query(
      `SELECT id, service, description, budget, status, created_at
         FROM quotations
        WHERE phone = ?
        ORDER BY created_at DESC`,
      [contacts[0].phone]
    );

    res.json({ success: true, data: { ...contacts[0], quotations } });
  } catch (err) {
    sendDbError(res, 'contact GET', err, 'Error al obtener el contacto.');
  }
});

// ─── GET /api/whatsapp-crm/contacts/:id/messages  [🔒 Admin] ─
//  Historial en orden cronológico. Devuelve los `limit` más
//  recientes; para cargar anteriores: ?before=<id del más antiguo>
router.get('/contacts/:id/messages', requireAuth, validateWhatsappMessages, async (req, res) => {
  const { id }   = req.params;
  const limit    = req.query.limit || 100;
  const before   = req.query.before;

  try {
    const [contacts] = await db.query('SELECT id FROM whatsapp_contacts WHERE id = ?', [id]);
    if (contacts.length === 0) {
      return res.status(404).json({ success: false, message: 'Contacto no encontrado.' });
    }

    const [rows] = await db.query(
      `SELECT id, direction, message_type, body, wa_message_id, status, created_at
         FROM whatsapp_messages
        WHERE contact_id = ? ${before ? 'AND id < ?' : ''}
        ORDER BY id DESC
        LIMIT ?`,
      before ? [id, before, limit + 1] : [id, limit + 1]
    );

    const hasMore  = rows.length > limit;
    const messages = rows.slice(0, limit).reverse();

    res.json({
      success: true,
      data: messages,
      pagination: {
        limit,
        has_more: hasMore,
        next_before: hasMore && messages.length ? messages[0].id : null,
      },
    });
  } catch (err) {
    sendDbError(res, 'messages GET', err, 'Error al obtener el historial.');
  }
});

// ─── PUT /api/whatsapp-crm/contacts/:id  [🔒 Admin] ──────────
//  Campos: follow_up_status, notes, full_name, email, interest_service,
//          assigned_to, next_follow_up_at, marketing_opt_in
router.put('/contacts/:id', requireAuth, validateWhatsappContactUpdate, async (req, res) => {
  const { id } = req.params;
  const {
    follow_up_status, notes, full_name, email,
    interest_service, assigned_to, next_follow_up_at, marketing_opt_in,
  } = req.body;

  const fields = [];
  const values = [];
  const orNull = (v) => (v === '' || v === null ? null : v);

  if (follow_up_status  !== undefined) { fields.push('follow_up_status = ?');  values.push(follow_up_status); }
  if (notes             !== undefined) { fields.push('notes = ?');             values.push(orNull(notes)); }
  if (full_name         !== undefined) { fields.push('full_name = ?');         values.push(orNull(full_name)); }
  if (email             !== undefined) { fields.push('email = ?');             values.push(orNull(email)); }
  if (interest_service  !== undefined) { fields.push('interest_service = ?');  values.push(orNull(interest_service)); }
  if (assigned_to       !== undefined) { fields.push('assigned_to = ?');       values.push(orNull(assigned_to)); }
  if (next_follow_up_at !== undefined) {
    // Con zona horaria explícita se convierte; sin ella se toma tal cual (hora Colombia)
    const date = orNull(next_follow_up_at);
    fields.push('next_follow_up_at = ?');
    values.push(!date ? null : /(Z|[+-]\d{2}:?\d{2})$/.test(date) ? new Date(date) : date.replace('T', ' '));
  }
  if (marketing_opt_in  !== undefined) {
    // opt_in_at conserva la fecha original si ya estaba autorizado
    fields.push('opt_in_at = IF(?, IF(marketing_opt_in = 1, opt_in_at, NOW()), NULL)');
    values.push(marketing_opt_in);
    fields.push('marketing_opt_in = ?');
    values.push(marketing_opt_in);
  }

  if (fields.length === 0) {
    return res.status(400).json({ success: false, message: 'No hay campos a actualizar.' });
  }

  try {
    values.push(id);
    await db.query(`UPDATE whatsapp_contacts SET ${fields.join(', ')} WHERE id = ?`, values);

    const [updated] = await db.query(
      `SELECT c.*, ${WINDOW_24H} FROM whatsapp_contacts c WHERE c.id = ?`,
      [id]
    );
    if (updated.length === 0) {
      return res.status(404).json({ success: false, message: 'Contacto no encontrado.' });
    }

    res.json({ success: true, message: 'Contacto actualizado.', data: updated[0] });
  } catch (err) {
    sendDbError(res, 'contact PUT', err, 'Error al actualizar el contacto.');
  }
});

module.exports = router;
