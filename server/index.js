
require('dotenv').config();

const express = require('express');
const helmet  = require('helmet');
const cors    = require('cors');
const hpp     = require('hpp');
const app     = express();
const PORT    = process.env.PORT || 5000;

// ─── Importar rutas ───────────────────────────────────────────
const quotationsRouter = require('./routes/quotations');
const visitsRouter     = require('./routes/visits');
const authRouter       = require('./routes/auth');
const whatsappRouter   = require('./routes/whatsapp');
const productsRouter   = require('./routes/products');
const siteContentRouter = require('./routes/siteContent');
const whatsappCrmRouter = require('./routes/whatsappCrm');
const { apiLimiter }   = require('./middleware/rateLimiter');

// ─── Variables de entorno requeridas ──────────────────────────
if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET no está definido en .env');
  process.exit(1);
}

// ─── 1. Helmet — cabeceras de seguridad HTTP ──────────────────
const isDev = process.env.NODE_ENV !== 'production';

app.use(helmet({
  contentSecurityPolicy: isDev ? false : {
    directives: {
      defaultSrc:  ["'self'"],
      scriptSrc:   ["'self'"],
      styleSrc:    ["'self'", "'unsafe-inline'"],
      imgSrc:      ["'self'", 'data:', 'https:'],
      connectSrc:  ["'self'"],
      fontSrc:     ["'self'", 'https:'],
      objectSrc:   ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // Necesario para assets externos
}));

// Ocultar el header X-Powered-By que revela que usamos Express
app.disable('x-powered-by');

// ─── 2. CORS ──────────────────────────────────────────────────
app.use(cors({
  origin: isDev
    ? true  // En desarrollo: cualquier origen (localhost, IP local, etc.)
    : (process.env.CORS_ORIGIN || 'http://localhost:3001'),
  methods:     ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
}));

// ─── 3. Parseo de body con límites ───────────────────────────
app.use(express.json({ limit: '15mb' }));       // Aumentado para soportar subidas en Base64
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// ─── 4. HPP — previene HTTP Parameter Pollution ──────────────
app.use(hpp());

// ─── 4.5. WhatsApp Meta Webhook (montado antes del rate limiter)
app.use('/api/whatsapp', whatsappRouter);

// ─── 5. Rate limiter general en toda la API ───────────────────
app.use('/api', apiLimiter);

// ─── 6. Logger de peticiones (solo en desarrollo) ────────────
if (isDev) {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toLocaleTimeString('es-CO')}] ${req.method} ${req.path}`);
    next();
  });
}

// ─── 7. Rutas de la API ───────────────────────────────────────
app.use('/api/quotations', quotationsRouter);
app.use('/api/visits',     visitsRouter);
app.use('/api/auth',       authRouter);
app.use('/api/products',   productsRouter);
app.use('/api/site-content', siteContentRouter);
app.use('/api/whatsapp-crm', whatsappCrmRouter);

// ─── 8. Health check (sin info sensible) ─────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    status:  'ok',
    time:    new Date().toISOString(),
  });
});

// ─── 9. Ruta 404 ─────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada.' });
});

// ─── 10. Manejador global de errores ─────────────────────────
// En producción: nunca enviar el stack trace al cliente
app.use((err, _req, res, _next) => {
  console.error('[Error global]', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: isDev ? (err.message || 'Error interno.') : 'Error interno del servidor.',
  });
});

// ─── 11. Iniciar servidor ────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('══════════════════════════════════════════════');
  console.log('  🚀 API Tecnología del Pacífico S.A.S');
  console.log(`  📡 Local:   http://localhost:${PORT}`);
  console.log(`  🌐 Red:     http://192.168.1.10:${PORT}`);
  console.log(`  🌱 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log('  🔒 Seguridad: Helmet + Rate Limit + JWT + Bcrypt');
  console.log('══════════════════════════════════════════════');
  console.log('');
});
