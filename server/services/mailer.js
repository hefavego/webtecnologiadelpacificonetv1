const nodemailer = require('nodemailer');

// ─────────────────────────────────────────────────────────────
//  Envío de correos (SMTP)
//  Configurar en .env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM
//  Si no está configurado, en desarrollo el correo se imprime en consola.
// ─────────────────────────────────────────────────────────────

const isConfigured = () =>
  Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

let _transporter = null;
const getTransporter = () => {
  if (!_transporter) {
    const port = parseInt(process.env.SMTP_PORT) || 465;
    _transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return _transporter;
};

/**
 * @param {{ to: string, subject: string, html: string, text: string }} mail
 */
const sendMail = async ({ to, subject, html, text }) => {
  if (!isConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SMTP no configurado (SMTP_HOST, SMTP_USER, SMTP_PASS).');
    }
    console.log('\n📧 [mailer] SMTP no configurado — correo de desarrollo:');
    console.log(`   Para:    ${to}\n   Asunto:  ${subject}\n   ${text}\n`);
    return;
  }

  await getTransporter().sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });
};

module.exports = { sendMail };
