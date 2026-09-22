
const express  = require('express');
const router   = express.Router();
const db       = require('../db');
const { requireAuth }      = require('../middleware/authMiddleware');
const { validateVisit }    = require('../middleware/validators');
const { visitLimiter }     = require('../middleware/rateLimiter');

// ─── POST /api/visits  [🌐 Público + rate-limit] ─────────────
router.post('/', visitLimiter, validateVisit, async (req, res) => {
  const { page, page_title, browser, device_type, referrer, screen_width, session_id } = req.body;

  // Captura IP con soporte a proxies — truncada a 45 chars (IPv6 max)
  const ip_address = (
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    null
  )?.substring(0, 45);

  const validDevices = ['desktop', 'mobile', 'tablet'];
  const device       = validDevices.includes(device_type) ? device_type : 'desktop';

  try {
    await db.query(
      `INSERT INTO page_visits
         (page, page_title, browser, device_type, referrer, screen_width, session_id, ip_address)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        page,
        page_title  || null,
        browser     || null,
        device,
        referrer    || null,
        screen_width ? Number(screen_width) : null,
        session_id  || null,
        ip_address,
      ]
    );
    // 204 No Content — mínima respuesta para tracking
    res.status(204).send();
  } catch (err) {
    console.error('[visits POST]', err.message);
    res.status(500).json({ success: false, message: 'Error al registrar la visita.' });
  }
});

// ─── GET /api/visits  [🔒 Admin] ─────────────────────────────
router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM page_visits ORDER BY created_at DESC LIMIT 5000'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('[visits GET]', err.message);
    res.status(500).json({ success: false, message: 'Error al obtener visitas.' });
  }
});

// ─── GET /api/visits/stats  [🔒 Admin] ───────────────────────
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const [[{ total }]]     = await db.query('SELECT COUNT(*) AS total FROM page_visits');
    const [[{ today }]]     = await db.query(
      "SELECT COUNT(*) AS today FROM page_visits WHERE DATE(created_at) = CURDATE()"
    );
    const [[{ this_week }]] = await db.query(
      "SELECT COUNT(*) AS this_week FROM page_visits WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)"
    );
    const [[{ sessions }]]  = await db.query(
      "SELECT COUNT(DISTINCT session_id) AS sessions FROM page_visits"
    );
    const [topPages] = await db.query(
      `SELECT page, page_title, COUNT(*) AS visits
       FROM page_visits GROUP BY page, page_title ORDER BY visits DESC LIMIT 8`
    );
    const [devices] = await db.query(
      `SELECT device_type, COUNT(*) AS visits FROM page_visits GROUP BY device_type ORDER BY visits DESC`
    );
    const [byDay] = await db.query(
      `SELECT DATE(created_at) AS date, COUNT(*) AS visits
       FROM page_visits WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       GROUP BY DATE(created_at) ORDER BY date ASC`
    );

    res.json({
      success: true,
      data: { total, today, this_week, sessions, topPages, devices, byDay },
    });
  } catch (err) {
    console.error('[visits/stats GET]', err.message);
    res.status(500).json({ success: false, message: 'Error al calcular estadísticas.' });
  }
});

// ─── DELETE /api/visits  [🔒 Admin] ─ Borra TODOS los registros de visitas
router.delete('/', requireAuth, async (req, res) => {
  try {
    // Contar antes de borrar para informar al cliente
    const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM page_visits');
    await db.query('DELETE FROM page_visits');
    // Reiniciar el auto_increment para que los nuevos IDs empiecen desde 1
    await db.query('ALTER TABLE page_visits AUTO_INCREMENT = 1');
    console.log(`[visits DELETE] ${total} registros eliminados por admin`);
    res.json({ success: true, data: { deleted: Number(total) } });
  } catch (err) {
    console.error('[visits DELETE]', err.message);
    res.status(500).json({ success: false, message: 'Error al limpiar los datos de visitas.' });
  }
});

module.exports = router;
