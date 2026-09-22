
const jwt = require('jsonwebtoken');

/**
 * Middleware que verifica el JWT en el header Authorization.
 * Uso: router.get('/ruta', requireAuth, handler)
 */
const requireAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Acceso denegado. Token no proporcionado.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, iat, exp }
    next();
  } catch (err) {
    const msg =
      err.name === 'TokenExpiredError'
        ? 'Sesión expirada. Inicia sesión nuevamente.'
        : 'Token inválido o manipulado.';
    return res.status(401).json({ success: false, message: msg });
  }
};

module.exports = { requireAuth };
