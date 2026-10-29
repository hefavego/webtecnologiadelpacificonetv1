
const rateLimit = require('express-rate-limit');

// ── Mensaje de error estándar ─────────────────────────────────
const rateLimitMessage = (action) => ({
  success: false,
  message: `Demasiadas solicitudes de ${action}. Intenta más tarde.`,
});

// ── Limitador general para toda la API ───────────────────────
// 200 req / 10 min por IP
const apiLimiter = rateLimit({
  windowMs:         10 * 60 * 1000,
  max:              200,
  standardHeaders:  true,
  legacyHeaders:    false,
  message:          rateLimitMessage('API'),
  skipSuccessfulRequests: false,
});

// ── Limitador estricto para autenticación ─────────────────────
// 10 intentos / 15 min — previene fuerza bruta
const authLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             10,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         rateLimitMessage('autenticación'),
  skipSuccessfulRequests: true, // No penaliza logins exitosos
});

// ── Limitador para tracking de visitas ───────────────────────
// 120 req / min — permite navegación fluida sin abuso
const visitLimiter = rateLimit({
  windowMs:        60 * 1000,
  max:             120,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         rateLimitMessage('tracking'),
  skipSuccessfulRequests: false,
});

// ── Limitador para registro ───────────────────────────────────
// Solo 3 registros / hora por IP
const registerLimiter = rateLimit({
  windowMs:        60 * 60 * 1000,
  max:             3,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         rateLimitMessage('registro'),
});

// ── Limitador para formulario de contacto ────────────────────
// 5 cotizaciones / hora por IP — previene spam
const quotationLimiter = rateLimit({
  windowMs:        60 * 60 * 1000,
  max:             5,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         rateLimitMessage('cotizaciones'),
  skipSuccessfulRequests: false,
});

// ── Limitador para recuperación de contraseña ────────────────
// 5 solicitudes / hora por IP — evita abuso del envío de correos
const passwordResetLimiter = rateLimit({
  windowMs:        60 * 60 * 1000,
  max:             5,
  standardHeaders: true,
  legacyHeaders:   false,
  message:         rateLimitMessage('recuperación de contraseña'),
});

module.exports = {
  passwordResetLimiter,
  apiLimiter,
  authLimiter,
  visitLimiter,
  registerLimiter,
  quotationLimiter,
};
