const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/authMiddleware');

// ─── GET /api/site-content (Público) ──────────────────────────
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT key_name, key_value FROM site_content');
    
    // Convertir de lista de filas a un objeto clave-valor
    const contentMap = {};
    rows.forEach(r => {
      contentMap[r.key_name] = r.key_value;
    });

    res.json({ success: true, data: contentMap });
  } catch (err) {
    console.error('[site-content GET]', err.message);
    res.status(500).json({ success: false, message: 'Error al obtener contenidos.' });
  }
});

// ─── PUT /api/site-content (🔒 Admin) ───────────────────────────
// Acepta un objeto con pares clave-valor, por ejemplo: { "hero_title": "Nuevo", "hero_badge": "Líder" }
router.put('/', requireAuth, async (req, res) => {
  const contentUpdates = req.body;

  if (!contentUpdates || typeof contentUpdates !== 'object') {
    return res.status(400).json({ success: false, message: 'Formato de datos inválido.' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    for (const [key, value] of Object.entries(contentUpdates)) {
      // Usar INSERT INTO ... ON DUPLICATE KEY UPDATE para insertar o actualizar
      await conn.query(
        `INSERT INTO site_content (key_name, key_value) 
         VALUES (?, ?) 
         ON DUPLICATE KEY UPDATE key_value = ?`,
        [key, value, value]
      );
    }

    await conn.commit();

    // Obtener y devolver el contenido actualizado completo
    const [rows] = await conn.query('SELECT key_name, key_value FROM site_content');
    const contentMap = {};
    rows.forEach(r => {
      contentMap[r.key_name] = r.key_value;
    });

    res.json({
      success: true,
      message: 'Contenidos actualizados correctamente.',
      data: contentMap
    });
  } catch (err) {
    await conn.rollback();
    console.error('[site-content PUT]', err.message);
    res.status(500).json({ success: false, message: 'Error al guardar los contenidos.' });
  } finally {
    conn.release();
  }
});

module.exports = router;
