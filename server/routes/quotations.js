
const express     = require('express');
const router      = express.Router();
const db          = require('../db');
const { requireAuth }                         = require('../middleware/authMiddleware');
const { validateQuotation, validateQuotationUpdate } = require('../middleware/validators');
const { quotationLimiter }                    = require('../middleware/rateLimiter');

// ─── GET /api/quotations  [🔒 Admin] ─────────────────────────
router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM quotations ORDER BY created_at DESC'
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('[quotations GET]', err.message);
    res.status(500).json({ success: false, message: 'Error al obtener cotizaciones.' });
  }
});

// ─── POST /api/quotations  [🌐 Público + rate-limit] ────────
router.post('/', quotationLimiter, validateQuotation, async (req, res) => {
  const { name, email, phone, whatsapp, service, description, budget } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO quotations (name, email, phone, whatsapp, service, description, budget, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'Pending')`,
      [
        name,
        email,
        phone     || null,
        whatsapp  || null,
        service   || null,
        description || null,
        budget    || 'Por definir',
      ]
    );

    const [newRow] = await db.query(
      'SELECT * FROM quotations WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Cotización recibida correctamente.',
      data: newRow[0],
    });
  } catch (err) {
    console.error('[quotations POST]', err.message);
    res.status(500).json({ success: false, message: 'Error al crear la cotización.' });
  }
});

// ─── PUT /api/quotations/:id  [🔒 Admin] ─────────────────────
router.put('/:id', requireAuth, validateQuotationUpdate, async (req, res) => {
  const { id }    = req.params;
  const { status, budget, description } = req.body;

  try {
    const fields = [];
    const values = [];
    if (status      !== undefined) { fields.push('status = ?');      values.push(status); }
    if (budget      !== undefined) { fields.push('budget = ?');      values.push(budget); }
    if (description !== undefined) { fields.push('description = ?'); values.push(description); }

    if (fields.length === 0) {
      return res.status(400).json({ success: false, message: 'No hay campos a actualizar.' });
    }

    values.push(Number(id));
    await db.query(`UPDATE quotations SET ${fields.join(', ')} WHERE id = ?`, values);

    const [updated] = await db.query(
      'SELECT * FROM quotations WHERE id = ?',
      [Number(id)]
    );
    if (updated.length === 0) {
      return res.status(404).json({ success: false, message: 'Cotización no encontrada.' });
    }

    res.json({ success: true, message: 'Cotización actualizada.', data: updated[0] });
  } catch (err) {
    console.error('[quotations PUT]', err.message);
    res.status(500).json({ success: false, message: 'Error al actualizar.' });
  }
});

// ─── DELETE /api/quotations/:id  [🔒 Admin] ──────────────────
router.delete('/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ success: false, message: 'ID inválido.' });
  }

  try {
    const [result] = await db.query(
      'DELETE FROM quotations WHERE id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Cotización no encontrada.' });
    }
    res.json({ success: true, message: 'Cotización eliminada.' });
  } catch (err) {
    console.error('[quotations DELETE]', err.message);
    res.status(500).json({ success: false, message: 'Error al eliminar.' });
  }
});

module.exports = router;
