/**
 * Script de Simulación de WhatsApp Webhook
 * Ejecuta este script con Node.js para verificar el funcionamiento del bot.
 */

require('dotenv').config();
const express = require('express');
const whatsappRouter = require('../routes/whatsapp');

// Mockear base de datos para evitar fallos si no hay conexión activa
const db = require('../db');
db.query = async (query, params) => {
  console.log(`[MOCK DB QUERY] Ejecutando consulta de inserción de cotización.`);
  return { insertId: 999 };
};

const app = express();
app.use(express.json());
app.use('/api/whatsapp', whatsappRouter);

// Almacenaremos los mensajes enviados para poder validarlos en las pruebas
let lastSentMessages = [];

// Mockear global.fetch para interceptar llamadas a Meta y Gemini
const originalFetch = global.fetch;
global.fetch = async (url, options) => {
  const body = options.body ? JSON.parse(options.body) : null;

  // Interceptar llamada a la API de Meta Graph
  if (url.includes('graph.facebook.com')) {
    const textBody = body?.text?.body || '';
    const to = body?.to || '';
    console.log(`\n➡️  [WS RESPONDIDO A ${to}]:\n${textBody}\n`);
    lastSentMessages.push({ to, text: textBody });
    return {
      ok: true,
      json: async () => ({ messaging_product: 'whatsapp', contacts: [{ input: to, wa_id: to }], messages: [{ id: 'wamid.HBgLMDU3MzAyNDg5MjMwNxUCABEYEjQ0MzI1NTRCQ0Q5Q0Q5RTBDMgA=' }] })
    };
  }

  // Interceptar llamada a la API de Gemini
  if (url.includes('generativelanguage.googleapis.com')) {
    console.log(`🤖 [CONEXIÓN CON GEMINI API] Solicitud recibida.`);
    const textPrompt = body?.contents?.[0]?.parts?.[0]?.text || '';
    console.log(`   Pregunta enviada a la IA: "${textPrompt}"`);
    
    // Si la clave es de prueba o inválida, simulamos una respuesta
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'mock_key' || process.env.GEMINI_API_KEY.startsWith('your_')) {
      return {
        ok: true,
        json: async () => ({
          candidates: [{
            content: {
              parts: [{
                text: `✨ [Respuesta Inteligente de Gemini Mock] Hola, con respecto a tu consulta sobre "${textPrompt}", en Tecnología del Pacífico S.A.S ofrecemos servicios especializados de primer nivel. Si quieres cotizar, escribe *COTIZAR* o presiona *2*.`
              }]
            }
          }]
        })
      };
    }
  }

  // Fallback a llamada original para otros endpoints o si se desea probar Gemini real
  return originalFetch(url, options);
};

// Función auxiliar para enviar un mensaje simulado de WhatsApp al webhook
const simulateIncomingMessage = async (from, text, name = 'Cliente de Prueba') => {
  console.log(`\n💬 [WS RECIBIDO DE ${name} (${from})]: "${text}"`);
  
  const payload = {
    object: 'whatsapp_business_account',
    entry: [{
      id: 'WHATSAPP_BUSINESS_ACCOUNT_ID',
      changes: [{
        value: {
          messaging_product: 'whatsapp',
          metadata: {
            display_phone_number: '16505553333',
            phone_number_id: '123456789'
          },
          contacts: [{
            profile: { name },
            wa_id: from
          }],
          messages: [{
            from,
            id: 'wamid.HBgLMDU3MzAyNDg5MjMwNxUCABEYEjQ0MzI1NTRCQ0Q5Q0Q5RTBDMgA=',
            timestamp: Math.floor(Date.now() / 1000),
            text: { body: text },
            type: 'text'
          }]
        },
        field: 'messages'
      }]
    }]
  };

  // Enviar POST a la API local simulada
  const response = await new Promise((resolve) => {
    const req = require('http').request({
      hostname: 'localhost',
      port: 5002,
      path: '/api/whatsapp/webhook',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    });
    
    req.write(JSON.stringify(payload));
    req.end();
  });

  return response;
};

// Iniciar servidor local para pruebas
const server = app.listen(5002, async () => {
  console.log('🚀 Servidor de pruebas iniciado en el puerto 5002.');
  
  try {
    console.log('\n--- PRUEBA 1: Flujo de Bienvenida con Menú Estático ---');
    await simulateIncomingMessage('573001234567', 'Hola');
    await new Promise(r => setTimeout(r, 200));

    console.log('\n--- PRUEBA 2: Pregunta directa sobre Ciberseguridad (Modo Fallback NLP Local) ---');
    // Forzar desactivación de Gemini para probar el procesador local primero
    const savedKey = process.env.GEMINI_API_KEY;
    process.env.GEMINI_API_KEY = '';
    
    await simulateIncomingMessage('573001234567', '¿Qué servicios de ciberseguridad tienen y qué incluye el firewall?');
    await new Promise(r => setTimeout(r, 200));

    console.log('\n--- PRUEBA 3: Pregunta sobre Soporte Técnico (Modo Fallback NLP Local) ---');
    await simulateIncomingMessage('573001234567', 'necesito soporte tecnico remoto para computadores');
    await new Promise(r => setTimeout(r, 200));

    console.log('\n--- PRUEBA 4: Pregunta simulando Gemini IA activo ---');
    process.env.GEMINI_API_KEY = 'mock_key'; // Activar mock Gemini
    await simulateIncomingMessage('573001234567', '¿Me pueden desarrollar una app móvil personalizada y cuál es su precio?');
    await new Promise(r => setTimeout(r, 200));

    console.log('\n--- PRUEBA 5: Iniciar y completar flujo de cotización ---');
    // Restaurar clave si existía o dejar mock
    process.env.GEMINI_API_KEY = savedKey;

    await simulateIncomingMessage('573009999999', '2'); // Opción 2 del menú
    await new Promise(r => setTimeout(r, 200));
    
    await simulateIncomingMessage('573009999999', 'Esteban Quito'); // Nombre
    await new Promise(r => setTimeout(r, 200));

    await simulateIncomingMessage('573009999999', 'esteban@quito.com'); // Correo
    await new Promise(r => setTimeout(r, 200));

    await simulateIncomingMessage('573009999999', '1'); // Desarrollo de Software
    await new Promise(r => setTimeout(r, 200));

    await simulateIncomingMessage('573009999999', 'Requiero un software de facturación y control de inventarios integrado.'); // Descripción
    await new Promise(r => setTimeout(r, 200));

    await simulateIncomingMessage('573009999999', '3'); // Presupuesto > $3,000 USD
    await new Promise(r => setTimeout(r, 200));

  } catch (error) {
    console.error('❌ Error ejecutando simulación de pruebas:', error);
  } finally {
    server.close(() => {
      console.log('\n✅ Servidor de pruebas detenido.');
      process.exit(0);
    });
  }
});
