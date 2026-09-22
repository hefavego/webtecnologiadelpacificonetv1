
const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('../db');
const { validateLogin, validateRegister } = require('../middleware/validators');
const { authLimiter, registerLimiter }    = require('../middleware/rateLimiter');

const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS) || 10;

// ─── POST /api/auth/login ─────────────────────────────────────
router.post('/login', authLimiter, validateLogin, async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT id, email, password FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    // Tiempo constante: siempre comparar aunque no exista el usuario
    // (previene timing attacks para enumerar emails)
    const fakeHash = '$2b$10$invalidhashfortimingprotection000000000000000000000000';
    const hash     = rows[0]?.password || fakeHash;
    const valid    = await bcrypt.compare(password, hash);

    if (rows.length === 0 || !valid) {
      // Mensaje genérico — no revelar si el email existe o no
      return res.status(401).json({
        success: false,
        message: 'Credenciales incorrectas.',
      });
    }

    const user  = rows[0];
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );

    res.json({
      success: true,
      message: 'Sesión iniciada correctamente.',
      data: {
        token,
        user: { id: user.id, email: user.email },
        expiresIn: process.env.JWT_EXPIRES_IN || '8h',
      },
    });
  } catch (err) {
    // En producción NO enviamos detalles del error
    const isProd = process.env.NODE_ENV === 'production';
    console.error('[auth/login]', err.message);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor.',
      ...(isProd ? {} : { debug: err.message }),
    });
  }
});

// ─── POST /api/auth/register ──────────────────────────────────
router.post('/register', registerLimiter, validateRegister, async (req, res) => {
  const { email, password } = req.body;

  try {
    const [existing] = await db.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (existing.length > 0) {
      // Mensaje genérico — no revelar si el email existe
      return res.status(409).json({
        success: false,
        message: 'No fue posible completar el registro.',
      });
    }

    const hashed = await bcrypt.hash(password, ROUNDS);
    const [result] = await db.query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashed]
    );

    res.status(201).json({
      success: true,
      message: 'Cuenta creada correctamente.',
      data: { id: result.insertId, email },
    });
  } catch (err) {
    console.error('[auth/register]', err.message);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
});

// ─── POST /api/auth/logout ────────────────────────────────────
// El logout real ocurre en el cliente (eliminar el token)
// Este endpoint es solo para registro de auditoría
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Sesión cerrada.' });
});

module.exports = router;
