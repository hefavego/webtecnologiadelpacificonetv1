const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth } = require('../middleware/authMiddleware');

// ─── GET /api/products (Público) ─────────────────────────────
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM products ORDER BY id DESC');
    
    // Parsear campos JSON antes de responder
    const formatted = rows.map(p => ({
      ...p,
      features: p.features ? JSON.parse(p.features) : [],
      screenshots: p.screenshots ? JSON.parse(p.screenshots) : [],
      links: p.links ? JSON.parse(p.links) : []
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error('[products GET]', err.message);
    res.status(500).json({ success: false, message: 'Error al obtener productos.' });
  }
});

// ─── POST /api/products (🔒 Admin) ────────────────────────────
router.post('/', requireAuth, async (req, res) => {
  const { name, description, image_url, price, features, screenshots, links } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ success: false, message: 'El nombre y el precio son obligatorios.' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO products (name, description, image_url, price, features, screenshots, links)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        description || null,
        image_url || null,
        Number(price) || 0,
        JSON.stringify(features || []),
        JSON.stringify(screenshots || []),
        JSON.stringify(links || [])
      ]
    );

    const [newRow] = await db.query('SELECT * FROM products WHERE id = ?', [result.insertId]);
    const formatted = {
      ...newRow[0],
      features: newRow[0].features ? JSON.parse(newRow[0].features) : [],
      screenshots: newRow[0].screenshots ? JSON.parse(newRow[0].screenshots) : [],
      links: newRow[0].links ? JSON.parse(newRow[0].links) : []
    };

    res.status(201).json({
      success: true,
      message: 'Producto creado correctamente.',
      data: formatted
    });
  } catch (err) {
    console.error('[products POST]', err.message);
    res.status(500).json({ success: false, message: 'Error al crear el producto.' });
  }
});

// ─── PUT /api/products/:id (🔒 Admin) ───────────────────────────
router.put('/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  const { name, description, image_url, price, features, screenshots, links } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ success: false, message: 'El nombre y el precio son obligatorios.' });
  }

  try {
    const [result] = await db.query(
      `UPDATE products 
       SET name = ?, description = ?, image_url = ?, price = ?, features = ?, screenshots = ?, links = ?
       WHERE id = ?`,
      [
        name,
        description || null,
        image_url || null,
        Number(price) || 0,
        JSON.stringify(features || []),
        JSON.stringify(screenshots || []),
        JSON.stringify(links || []),
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
    }

    const [updatedRow] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    const formatted = {
      ...updatedRow[0],
      features: updatedRow[0].features ? JSON.parse(updatedRow[0].features) : [],
      screenshots: updatedRow[0].screenshots ? JSON.parse(updatedRow[0].screenshots) : [],
      links: updatedRow[0].links ? JSON.parse(updatedRow[0].links) : []
    };

    res.json({
      success: true,
      message: 'Producto actualizado correctamente.',
      data: formatted
    });
  } catch (err) {
    console.error('[products PUT]', err.message);
    res.status(500).json({ success: false, message: 'Error al actualizar el producto.' });
  }
});

// ─── DELETE /api/products/:id (🔒 Admin) ────────────────────────
router.delete('/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id);

  try {
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Producto no encontrado.' });
    }

    res.json({ success: true, message: 'Producto eliminado correctamente.' });
  } catch (err) {
    console.error('[products DELETE]', err.message);
    res.status(500).json({ success: false, message: 'Error al eliminar el producto.' });
  }
});

module.exports = router;
