
const { body, param, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

// ── Helper: strip ALL HTML tags ───────────────────────────────
const stripHtml = (value) =>
  sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} });

// ── Helper: send validation errors ───────────────────────────
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Datos inválidos.',
      errors: errors.array().map((e) => ({ field: e.path, msg: e.msg })),
    });
  }
  next();
};

// ── Login ─────────────────────────────────────────────────────
const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio.')
    .isEmail().withMessage('Formato de email inválido.')
    .normalizeEmail()
    .isLength({ max: 255 }).withMessage('Email demasiado largo.'),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria.')
    .isLength({ min: 6, max: 128 }).withMessage('Contraseña debe tener entre 6 y 128 caracteres.'),

  handleValidation,
];

// ── Register ──────────────────────────────────────────────────
const validateRegister = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio.')
    .isEmail().withMessage('Formato de email inválido.')
    .normalizeEmail()
    .isLength({ max: 255 }).withMessage('Email demasiado largo.'),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria.')
    .isLength({ min: 8, max: 128 }).withMessage('Contraseña debe tener entre 8 y 128 caracteres.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('La contraseña debe incluir mayúsculas, minúsculas y un número.'),

  handleValidation,
];

// ── Quotation ─────────────────────────────────────────────────
const validateQuotation = [
  body('name')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio.')
    .isLength({ min: 2, max: 150 }).withMessage('Nombre debe tener entre 2 y 150 caracteres.')
    .customSanitizer(stripHtml),

  body('email')
    .trim()
    .notEmpty().withMessage('El email es obligatorio.')
    .isEmail().withMessage('Formato de email inválido.')
    .normalizeEmail()
    .isLength({ max: 255 }).withMessage('Email demasiado largo.'),

  body('phone')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .matches(/^[0-9+\-\s()]{7,20}$/).withMessage('Teléfono inválido.'),

  body('service')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 255 }).withMessage('Servicio demasiado largo.')
    .customSanitizer(stripHtml),

  body('description')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 3000 }).withMessage('Descripción máximo 3000 caracteres.')
    .customSanitizer(stripHtml),

  body('budget')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Presupuesto demasiado largo.')
    .customSanitizer(stripHtml),

  handleValidation,
];

// ── Quotation update (admin) ──────────────────────────────────
const validateQuotationUpdate = [
  param('id')
    .isInt({ min: 1 }).withMessage('ID inválido.'),

  body('status')
    .optional()
    .isIn(['Pending', 'In Progress', 'Completed', 'Rejected'])
    .withMessage('Estado inválido.'),

  body('budget')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Presupuesto demasiado largo.')
    .customSanitizer(stripHtml),

  body('description')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 3000 }).withMessage('Descripción máximo 3000 caracteres.')
    .customSanitizer(stripHtml),

  handleValidation,
];

// ── Page visit ────────────────────────────────────────────────
const validateVisit = [
  body('page')
    .trim()
    .notEmpty().withMessage('El campo page es obligatorio.')
    .isLength({ max: 500 }).withMessage('URL demasiado larga.')
    .matches(/^\//).withMessage('page debe comenzar con /'),

  body('page_title')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 255 }).withMessage('Título demasiado largo.')
    .customSanitizer(stripHtml),

  body('browser')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Browser demasiado largo.')
    .customSanitizer(stripHtml),

  body('device_type')
    .optional({ nullable: true, checkFalsy: true })
    .isIn(['desktop', 'mobile', 'tablet', '']).withMessage('Tipo de dispositivo inválido.'),

  body('session_id')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 128 }).withMessage('Session ID demasiado largo.')
    .matches(/^[a-zA-Z0-9\-_]+$/).withMessage('Session ID contiene caracteres inválidos.'),

  body('screen_width')
    .optional({ nullable: true })
    .isInt({ min: 0, max: 10000 }).withMessage('screen_width inválido.'),

  handleValidation,
];

module.exports = {
  validateLogin,
  validateRegister,
  validateQuotation,
  validateQuotationUpdate,
  validateVisit,
};
