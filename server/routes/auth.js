
const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('../db');
const { validateLogin, validateRegister } = require('../middleware/validators');
const { authLimiter, registerLimiter }    = require('../middleware/rateLimiter');
const crypto   = require('crypto');
const { requireAuth } = require('../middleware/authMiddleware');
const { sendMail }    = require('../services/mailer');
const { passwordResetLimiter } = require('../middleware/rateLimiter');
const { validateForgotPassword, validateResetPassword, validateChangePassword } = require('../middleware/validators');

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

// ═════════════════════════════════════════════════════════════
//  RECUPERACIÓN Y CAMBIO DE CONTRASEÑA
// ═════════════════════════════════════════════════════════════

const RESET_TTL_MINUTES = 30;

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

// URL pública del frontend para armar el enlace (nunca desde headers del cliente)
const appUrl = () =>
  (process.env.APP_URL || process.env.CORS_ORIGIN || 'http://localhost:3000').replace(/\/+$/, '');

let _resetTableReady = false;
const ensureResetTable = async () => {
  if (_resetTableReady) return;
  await db.query(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      user_id    INT          NOT NULL,
      token_hash CHAR(64)     NOT NULL,
      expires_at DATETIME     NOT NULL,
      used_at    DATETIME     NULL,
      created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_token_hash (token_hash),
      INDEX idx_user (user_id),
      CONSTRAINT fk_password_resets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  _resetTableReady = true;
};

// ─── POST /api/auth/forgot-password ───────────────────────────
// Siempre responde igual, exista o no el email (no revela cuentas)
router.post('/forgot-password', passwordResetLimiter, validateForgotPassword, async (req, res) => {
  const { email } = req.body;
  const genericResponse = {
    success: true,
    message: 'Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.',
  };

  try {
    await ensureResetTable();

    const [rows] = await db.query('SELECT id, email FROM users WHERE email = ? LIMIT 1', [email]);
    if (rows.length === 0) return res.json(genericResponse);

    const user  = rows[0];
    const token = crypto.randomBytes(32).toString('hex');

    // Invalidar enlaces anteriores y crear uno nuevo de un solo uso
    await db.query('UPDATE password_resets SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL', [user.id]);
    await db.query(
      `INSERT INTO password_resets (user_id, token_hash, expires_at)
       VALUES (?, ?, DATE_ADD(NOW(), INTERVAL ${RESET_TTL_MINUTES} MINUTE))`,
      [user.id, hashToken(token)]
    );

    const link = `${appUrl()}/admin?reset=${token}`;
    await sendMail({
      to: user.email,
      subject: 'Restablecer contraseña — Tecnología del Pacífico',
      text: `Recibimos una solicitud para restablecer tu contraseña.\n\nAbre este enlace (válido por ${RESET_TTL_MINUTES} minutos):\n${link}\n\nSi no fuiste tú, ignora este correo.`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;color:#1f2937">
          <h2 style="color:#0066CC">Restablecer contraseña</h2>
          <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta del panel administrativo.</p>
          <p style="text-align:center;margin:28px 0">
            <a href="${link}" style="background:#0066CC;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Crear nueva contraseña</a>
          </p>
          <p style="font-size:13px;color:#6b7280">El enlace es válido por ${RESET_TTL_MINUTES} minutos y solo puede usarse una vez. Si no fuiste tú, ignora este correo; tu contraseña no cambiará.</p>
          <p style="font-size:12px;color:#9ca3af">Tecnología del Pacífico S.A.S</p>
        </div>`,
    });

    res.json(genericResponse);
  } catch (err) {
    console.error('[auth/forgot-password]', err.message);
    res.status(500).json({ success: false, message: 'No fue posible procesar la solicitud. Intenta más tarde.' });
  }
});

// ─── POST /api/auth/reset-password ────────────────────────────
router.post('/reset-password', passwordResetLimiter, validateResetPassword, async (req, res) => {
  const { token, password } = req.body;

  try {
    await ensureResetTable();

    const [rows] = await db.query(
      `SELECT id, user_id FROM password_resets
        WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW()
        LIMIT 1`,
      [hashToken(token)]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'El enlace no es válido o ya expiró. Solicita uno nuevo.',
      });
    }

    const reset  = rows[0];
    const hashed = await bcrypt.hash(password, ROUNDS);

    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, reset.user_id]);
    await db.query('UPDATE password_resets SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL', [reset.user_id]);

    res.json({ success: true, message: 'Contraseña actualizada. Ya puedes iniciar sesión.' });
  } catch (err) {
    console.error('[auth/reset-password]', err.message);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
});

// ─── POST /api/auth/change-password (requiere sesión) ─────────
router.post('/change-password', requireAuth, authLimiter, validateChangePassword, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const [rows] = await db.query('SELECT id, password FROM users WHERE id = ? LIMIT 1', [req.user.id]);
    const valid  = rows.length > 0 && await bcrypt.compare(currentPassword, rows[0].password);

    if (!valid) {
      return res.status(401).json({ success: false, message: 'La contraseña actual no es correcta.' });
    }

    const hashed = await bcrypt.hash(newPassword, ROUNDS);
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashed, req.user.id]);

    res.json({ success: true, message: 'Contraseña cambiada correctamente.' });
  } catch (err) {
    console.error('[auth/change-password]', err.message);
    res.status(500).json({ success: false, message: 'Error interno del servidor.' });
  }
});

module.exports = router;
