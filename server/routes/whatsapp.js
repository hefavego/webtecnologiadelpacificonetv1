const express = require('express');
const router  = express.Router();
const db      = require('../db');

// In-memory conversation state sessions
// In production, you would use Redis or a database table for persistency
const sessions = new Map();

// Helper to send text messages via Meta WhatsApp Cloud API
const sendWhatsAppMessage = async (to, text) => {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const version = process.env.WHATSAPP_VERSION || 'v20.0';

  if (!token || !phoneNumberId) {
    console.error('❌ WhatsApp Credentials missing in env (WHATSAPP_TOKEN or WHATSAPP_PHONE_NUMBER_ID)');
    return false;
  }

  const url = `https://graph.facebook.com/${version}/${phoneNumberId}/messages`;
  const data = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: to,
    type: 'text',
    text: {
      preview_url: false,
      body: text
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const resData = await response.json();
    if (!response.ok) {
      console.error('❌ Error response from Meta Cloud API:', JSON.stringify(resData));
      return false;
    }
    return true;
  } catch (error) {
    console.error('❌ Network error calling Meta Cloud API:', error.message);
    return false;
  }
};

// Menu helper builders
const sendMainMenu = async (to, userName) => {
  const welcomeText = `👋 ¡Hola, *${userName}*! Bienvenido al asistente virtual de *Tecnología del Pacífico S.A.S*.\n\n¿En qué podemos ayudarte hoy?\n\n1️⃣ *Nuestros Servicios* (Detalles del portafolio)\n2️⃣ *Solicitar Cotización* (Crear cotización en línea)\n3️⃣ *Información de Contacto*\n4️⃣ *Horarios de Atención*\n\nResponde con el número de la opción (ej. *1* o *2*):`;
  await sendWhatsAppMessage(to, welcomeText);
};

const sendServicesMenu = async (to) => {
  const servicesText = `🛠️ *Nuestros Servicios Especializados*:\n\n🌐 *Desarrollo Web & Software*:\nDiseño de páginas, hosting, dominios y copias de seguridad.\n\n🔌 *Redes y Conectividad*:\nInfraestructura LAN, WLAN, WAN y configuraciones.\n\n🛡️ *Ciberseguridad*:\nFirewalls y protección de datos contra ciberataques.\n\n🖥️ *Soporte y Mantenimiento*:\nMantenimiento preventivo y correctivo, presencial y remoto.\n\n📈 *Consultoría & Marketing Digital*:\nTransformación digital a la medida.\n\nEscribe *2* para iniciar una cotización o *MENU* para volver al inicio.`;
  await sendWhatsAppMessage(to, servicesText);
};

const sendContactInfo = async (to) => {
  const contactText = `📞 *Medios de Contacto*:\n\n📍 *Dirección:* Carrera 61 #3-06 Barrio Dorado, Buenaventura - Valle\n📧 *Correo:* cliente@tecnologiadelpacifico.net\n📱 *Celular/WhatsApp:* +57 3024892307\n🌐 *Sitio Web:* www.tecnologiadelpacifico.net\n\nEscribe *MENU* para regresar al menú principal.`;
  await sendWhatsAppMessage(to, contactText);
};

const sendOfficeHours = async (to) => {
  const hoursText = `🕒 *Horarios de Atención*:\n\n📅 Lunes a Viernes: 8:00 AM - 12:00 PM y 2:00 PM - 6:00 PM\n📅 Sábados: 8:00 AM - 1:00 PM\n🔴 Domingos y Festivos: Cerrado (Soporte de emergencias disponible para clientes corporativos).\n\nEscribe *MENU* para volver al inicio.`;
  await sendWhatsAppMessage(to, hoursText);
};

// Local fallback NLP responder using keywords from products.js and services.js
const getLocalNLPResponse = (text, userName) => {
  const normalizedText = text.trim().toLowerCase();
  
  // 1. SERVICES
  // Software / Web Development
  if (/\b(software|desarrollo|web|pág|pag|programacion|programación|aplicacion|aplicación|sistema|erp|pos)\b/.test(normalizedText)) {
    return `💻 *Desarrollo de Software & Aplicaciones Web*\n\nEn *Tecnología del Pacífico S.A.S.* diseñamos y desarrollamos soluciones a medida:\n\n• *Desarrollo Web & Software*: Sitios web corporativos, pasarelas de pago, ERPs y sistemas POS adaptados a su negocio.\n• *Apps Móviles*: Aplicaciones interactivas para iOS y Android utilizando React Native, Flutter, Swift y Kotlin.\n\n*Productos Destacados*:\n• *Sistema ERP Cloud*: Desde $2,999 USD (Contabilidad, stock, facturación electrónica).\n• *Sistema POS Inteligente*: Desde $799 USD (Punto de venta moderno y control de stock).\n• *Plataforma E-Commerce*: Desde $999 USD (Venda en línea con pasarelas integradas).\n\nSi desea una propuesta para su proyecto, responda con la palabra *COTIZAR* o presione *2*.`;
  }
  
  // Cloud Solutions
  if (/\b(cloud|nube|aws|azure|gcp|servidor|hosting|dominio|almacenamiento|backup|copia)\b/.test(normalizedText)) {
    return `☁️ *Soluciones en la Nube y Servidores*\n\nLlevamos la infraestructura de su empresa al siguiente nivel con alta disponibilidad y seguridad:\n\n• *Migración Cloud*: Servidores seguros en AWS, Azure o Google Cloud.\n• *Copias de Seguridad*: Backups automatizados para resguardar la información crítica.\n• *Servidor Cloud Premium*: Desde $599 USD (99.9% de uptime, discos SSD NVMe, soporte 24/7 e IP dedicada).\n\nPara solicitar una cotización de migración o hosting, escriba *COTIZAR* o responda con *2*.`;
  }

  // Cybersecurity
  if (/\b(ciberseguridad|seguridad|hacker|hacking|firewall|antivirus|proteger|protección|encriptación|datos|ataque|ransomware)\b/.test(normalizedText)) {
    return `🛡️ *Servicios de Ciberseguridad*\n\nProtegemos los activos más valiosos de su empresa contra amenazas y filtraciones:\n\n• *Ethical Hacking*: Auditorías de seguridad y análisis de vulnerabilidades.\n• *Seguridad de Datos*: Encriptación, firewalls de última generación y gestión de identidades (IAM).\n• *Suite de Ciberseguridad*: Desde $1,499 USD (Protección contra ransomware, monitoreo 24/7 y análisis continuo).\n\nSi desea auditar la seguridad de su plataforma, escriba *COTIZAR* o responda con *2*.`;
  }

  // Big Data & Analytics
  if (/\b(data|big|analytics|analisis|análisis|inteligencia|datos|bi|learning|reporte|dashboard)\b/.test(normalizedText)) {
    return `📈 *Big Data & Analytics*\n\nTransformamos los datos de su negocio en decisiones estratégicas inteligentes:\n\n• *Business Intelligence*: Cuadros de mando interactivos (Dashboards) para monitorear sus KPIs.\n• *Procesamiento ETL & ML*: Pipelines de datos automatizados e integración de Machine Learning.\n• *Beneficios*: Optimización de recursos, predicción de tendencias y decisiones informadas.\n\nEscriba *COTIZAR* o responda con *2* para recibir una consultoría de datos.`;
  }

  // Technical Support
  if (/\b(soporte|mantenimiento|técnico|tecnico|ayuda|reparacion|reparación|remoto|daño|dañado)\b/.test(normalizedText)) {
    return `🛠️ *Soporte Técnico Especializado*\n\nOfrecemos asistencia profesional permanente para asegurar la continuidad de su operación:\n\n• *Modalidades*: Soporte técnico remoto y presencial (en sitio) para hardware, software y redes LAN/WLAN.\n• *Mantenimiento*: Planes preventivos y correctivos periódicos.\n• *Help Desk*: Mesa de ayuda especializada con tiempos de respuesta ultra rápidos.\n\nSi tiene una incidencia o desea un contrato de soporte mensual, responda con *COTIZAR* o escriba *2*.`;
  }

  // 2. GENERAL INFO
  // Contact
  if (/\b(contacto|telefono|teléfono|celular|whatsapp|correo|email|direccion|dirección|ubicacion|ubicación|buenaventura|donde|dónde|oficina|oficinas)\b/.test(normalizedText)) {
    return `📞 *Información de Contacto y Ubicación*\n\nEn *Tecnología del Pacífico S.A.S.* estamos listos para atenderle:\n\n📍 *Ubicación:* Carrera 61 #3-06 Barrio Dorado, Buenaventura - Valle del Cauca, Colombia.\n📧 *Correo Electrónico:* cliente@tecnologiadelpacifico.net\n📱 *Celular/WhatsApp:* +57 3024892307\n🌐 *Sitio Web:* www.tecnologiadelpacifico.net\n\nEscriba *MENU* para ver todas las opciones disponibles.`;
  }

  // Hours
  if (/\b(horario|hora|abierto|cierra|dias|días|atencion|atención|sabado|sábado|domingo|festivo)\b/.test(normalizedText)) {
    return `🕒 *Horarios de Atención de la Oficina*\n\n📅 *Lunes a Viernes*:\n8:00 AM - 12:00 PM y 2:00 PM - 6:00 PM\n\n📅 *Sábados*:\n8:00 AM - 1:00 PM\n\n🔴 *Domingos y Festivos*:\nCerrado (Soporte de emergencias crítico disponible únicamente para clientes corporativos con contrato).\n\nEscriba *MENU* para ver la lista principal.`;
  }

  // General products or catalog query
  if (/\b(producto|productos|catálogo|catalogo|precio|precios|cuanto|cuánto|vale|costo|costos)\b/.test(normalizedText)) {
    return `🛍️ *Catálogo de Soluciones Tecnológicas*:\n\n1️⃣ *Sistema ERP Cloud* ($2,999 USD): Gestión integrada de inventario, contabilidad y facturación.\n2️⃣ *Suite de Ciberseguridad* ($1,499 USD): Protección empresarial contra ransomware y firewall.\n3️⃣ *Plataforma E-Commerce* ($999 USD): Tienda online completa con pasarela de pagos.\n4️⃣ *App Móvil Personalizada* ($3,999 USD): Diseño y desarrollo nativo Android/iOS.\n5️⃣ *Servidor Cloud Premium* ($599 USD): Hosting robusto con SSD NVMe y backup.\n6️⃣ *Sistema POS Inteligente* ($799 USD): Punto de venta moderno multi-sucursal.\n\nEscriba *COTIZAR* o responda con *2* para iniciar una solicitud formal.`;
  }

  // Greeting / general menu trigger
  if (/\b(hola|buenos|buenas|saludo|que tal|qué tal)\b/.test(normalizedText)) {
    return null; // Let the welcome handler show the menu
  }

  // Default fallback answer
  return `🤖 *Asistente Tecnología del Pacífico S.A.S.*\n\nHola *${userName}*, comprendo tu consulta sobre "${text}".\n\nOfrecemos servicios de *Desarrollo de Software*, *Soluciones Cloud*, *Ciberseguridad*, *Apps Móviles*, *Big Data* y *Soporte Técnico*.\n\n¿En qué puedo ayudarte? Puedes seleccionar una opción del menú:\n1️⃣ Ver portafolio detallado de servicios.\n2️⃣ Iniciar cotización en línea.\n3️⃣ Ver información de contacto y ubicación.\n4️⃣ Ver horarios de atención.\n\nO simplemente hazme cualquier pregunta específica sobre estos servicios.`;
};

// Call Gemini API to generate context-aware intelligent response
const getGeminiResponse = async (text, userName) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return null;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const systemPrompt = `Eres el asistente virtual inteligente de WhatsApp para la empresa 'Tecnología del Pacífico S.A.S' (proveedor de servicios tecnológicos en Buenaventura, Colombia). Tu objetivo es responder las dudas de los clientes de manera amable, profesional y concisa, utilizando un formato optimizado para WhatsApp (negritas, viñetas cortas, emojis). Limita tus respuestas a un máximo de 2 o 3 párrafos cortos para que sea legible en celulares.

Aquí tienes la información oficial de la empresa:
- Ubicación: Carrera 61 #3-06 Barrio Dorado, Buenaventura - Valle del Cauca, Colombia.
- Correo: cliente@tecnologiadelpacifico.net
- Teléfono/WhatsApp: +57 3024892307
- Sitio Web: www.tecnologiadelpacifico.net
- Horario de atención: Lunes a Viernes: 8:00 AM - 12:00 PM y 2:00 PM - 6:00 PM. Sábados: 8:00 AM - 1:00 PM. Domingos y Festivos cerrado (excepto emergencias para clientes corporativos).

Servicios Ofrecidos:
1. Desarrollo de Software & Web: Aplicaciones personalizadas, frontend y backend, integración de APIs, ERPs a medida.
2. Soluciones Cloud: Migración a AWS/Azure/GCP, servidores virtuales, arquitectura serverless, contenedores (Docker/Kubernetes), copias de seguridad.
3. Ciberseguridad: Auditorías (Ethical Hacking), encriptación de datos, cortafuegos (Firewalls), gestión de accesos (IAM), monitoreo defensivo.
4. Apps Móviles: Apps nativas y multiplataforma para iOS y Android (Swift, Kotlin, React Native, Flutter) con diseño UX/UI.
5. Big Data & Analytics: Procesamiento ETL, Business Intelligence (BI), Machine Learning y tableros interactivos (Dashboards).
6. Soporte Técnico: Mesa de ayuda (Help Desk), mantenimiento preventivo y correctivo, soporte presencial en Buenaventura y soporte remoto.

Productos y Precios Destacados:
- Sistema ERP Cloud ($2,999 USD): Gestión total de inventario, contabilidad y facturación electrónica.
- Suite de Ciberseguridad ($1,499 USD): Antiransomware, firewall e informes de vulnerabilidad.
- Plataforma E-Commerce ($999 USD): Tienda en línea auto-gestionable con pasarela de pagos integrada.
- App Móvil Personalizada ($3,999 USD): Aplicación nativa Android/iOS con panel web de administración.
- Servidor Cloud Premium ($599 USD): Hosting de alta capacidad con SSD NVMe y uptime del 99.9%.
- Sistema POS Inteligente ($799 USD): Punto de venta para comercios con control de stock multi-tienda.

Instrucciones Clave:
- El cliente actual se llama: ${userName}. Dirígete a él/ella de forma personalizada si es apropiado.
- Si el cliente quiere cotizar un servicio o adquirir un producto, invítalo a iniciar una cotización respondiendo con la palabra 'cotizar' o el número '2'.
- Mantén siempre un tono de respuesta educado, servicial, ágil e inspirado en tecnología de vanguardia.
- Si te preguntan algo fuera del ámbito de la tecnología o de la empresa, redirígelos amablemente hacia los servicios y productos que ofrece la empresa.
- Sé directo y estructurado.`;

  const payload = {
    contents: [
      {
        parts: [
          {
            text: text
          }
        ]
      }
    ],
    systemInstruction: {
      parts: [
        {
          text: systemPrompt
        }
      ]
    },
    generationConfig: {
      maxOutputTokens: 500,
      temperature: 0.5
    }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error('❌ Error response from Gemini API:', response.statusText);
      return null;
    }

    const data = await response.json();
    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text;
    }
    return null;
  } catch (error) {
    console.error('❌ Network error calling Gemini API:', error.message);
    return null;
  }
};

// Conversational logic state machine handler
const handleBotLogic = async (from, text, userName) => {
  let session = sessions.get(from);
  if (!session) {
    session = { state: 'WELCOME', data: {} };
    sessions.set(from, session);
  }

  const normalizedText = text.trim().toLowerCase();

  // Reset conversation if keywords are sent
  if (['hola', 'menú', 'menu', 'buenos días', 'buenas tardes', 'buenas noches', 'reiniciar', 'inicio'].includes(normalizedText)) {
    session.state = 'WELCOME';
    session.data = {};
  }

  // Helper to handle menu navigation
  const handleMenuNavigation = async () => {
    if (normalizedText === '1' || normalizedText.includes('servicio')) {
      await sendServicesMenu(from);
      session.state = 'WELCOME';
      return true;
    } else if (normalizedText === '2' || normalizedText.includes('cotizar')) {
      await sendWhatsAppMessage(from, '¡Excelente! Vamos a iniciar con tu solicitud de cotización.\n\nPor favor, responde con tu *Nombre Completo*:');
      session.state = 'COTIZAR_NAME';
      return true;
    } else if (normalizedText === '3' || normalizedText.includes('contacto')) {
      await sendContactInfo(from);
      session.state = 'WELCOME';
      return true;
    } else if (normalizedText === '4' || normalizedText.includes('horario')) {
      await sendOfficeHours(from);
      session.state = 'WELCOME';
      return true;
    }
    return false;
  };

  switch (session.state) {
    case 'WELCOME': {
      const matched = await handleMenuNavigation();
      if (matched) break;

      // If not matching a menu option directly, check if it's a question
      const localResp = getLocalNLPResponse(text, userName);
      const geminiResp = await getGeminiResponse(text, userName);
      const answer = geminiResp || localResp;

      if (answer) {
        await sendWhatsAppMessage(from, answer);
        session.state = 'MENU_SELECTION';
      } else {
        await sendMainMenu(from, userName);
        session.state = 'MENU_SELECTION';
      }
      break;
    }

    case 'MENU_SELECTION': {
      const matched = await handleMenuNavigation();
      if (matched) break;

      // Run AI content responder for any other free text query
      const localQuestionResp = getLocalNLPResponse(text, userName);
      const geminiQuestionResp = await getGeminiResponse(text, userName);
      const resolvedAnswer = geminiQuestionResp || localQuestionResp;

      if (resolvedAnswer) {
        await sendWhatsAppMessage(from, resolvedAnswer);
      } else {
        await sendMainMenu(from, userName);
      }
      break;
    }

    case 'COTIZAR_NAME':
      session.data.name = text.trim();
      await sendWhatsAppMessage(from, `Gracias, *${session.data.name}*.\n\nAhora, por favor ingresa tu dirección de *Correo Electrónico*:`);
      session.state = 'COTIZAR_EMAIL';
      break;

    case 'COTIZAR_EMAIL':
      const email = text.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        await sendWhatsAppMessage(from, 'El correo electrónico ingresado no parece válido. Por favor, escribe un correo correcto (ejemplo: cliente@empresa.com):');
        break;
      }
      session.data.email = email;
      
      await sendWhatsAppMessage(from, '¿Qué servicio te interesa?\n\n1. Desarrollo Web / Software\n2. Infraestructura & Redes\n3. Soporte y Mantenimiento Técnico\n4. Consultoría y Marketing Digital\n5. Ciberseguridad / Protección\n6. Bases de Datos\n\nResponde con el número (1 al 6):');
      session.state = 'COTIZAR_SERVICE';
      break;

    case 'COTIZAR_SERVICE':
      const serviceOptions = {
        '1': 'Desarrollo de Software',
        '2': 'Infraestructura y Redes',
        '3': 'Mantenimiento y Soporte',
        '4': 'Consultoría TIC',
        '5': 'Ciberseguridad',
        '6': 'Bases de Datos'
      };
      const selectedService = serviceOptions[normalizedText];
      if (!selectedService) {
        await sendWhatsAppMessage(from, 'Por favor, selecciona un número del 1 al 6 correspondiente al servicio de tu interés:');
        break;
      }
      session.data.service = selectedService;
      await sendWhatsAppMessage(from, `Has seleccionado *${selectedService}*.\n\nPor favor, describe brevemente qué necesitas para tu proyecto o problema:`);
      session.state = 'COTIZAR_DESC';
      break;

    case 'COTIZAR_DESC':
      session.data.desc = text.trim();
      await sendWhatsAppMessage(from, '¿Cuál es tu presupuesto estimado para este proyecto?\n\n1. Menos de $1,000 USD\n2. Entre $1,000 USD y $3,000 USD\n3. Más de $3,000 USD\n4. Por definir / A convenir\n\nResponde con el número (1 al 4):');
      session.state = 'COTIZAR_BUDGET';
      break;

    case 'COTIZAR_BUDGET':
      const budgetOptions = {
        '1': 'Menos de $1,000 USD',
        '2': 'Entre $1,000 y $3,000 USD',
        '3': 'Más de $3,000 USD',
        '4': 'Por definir'
      };
      const selectedBudget = budgetOptions[normalizedText];
      if (!selectedBudget) {
        await sendWhatsAppMessage(from, 'Por favor, selecciona un número del 1 al 4 correspondiente a tu presupuesto estimado:');
        break;
      }
      session.data.budget = selectedBudget;

      // Insert quotation into the database
      try {
        await db.query(
          `INSERT INTO quotations (name, email, phone, service, description, budget, status)
           VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
          [
            session.data.name,
            session.data.email,
            from,
            session.data.service,
            session.data.desc,
            session.data.budget
          ]
        );

        await sendWhatsAppMessage(from, `🎉 *¡Cotización creada con éxito!* 🎉\n\nDetalles registrados:\n• *Nombre:* ${session.data.name}\n• *Correo:* ${session.data.email}\n• *Servicio:* ${session.data.service}\n• *Descripción:* ${session.data.desc}\n• *Presupuesto:* ${session.data.budget}\n\nUn asesor de *Tecnología del Pacífico S.A.S* revisará tu solicitud y se pondrá en contacto contigo pronto.\n\nEscribe *MENU* para iniciar otra consulta.`);
      } catch (err) {
        console.error('❌ Error saving quotation via bot:', err.message);
        await sendWhatsAppMessage(from, 'Ocurrió un error al guardar tu cotización en el sistema. Sin embargo, un asesor se comunicará contigo de inmediato para ayudarte.\n\nEscribe *MENU* para volver al inicio.');
      }
      
      sessions.delete(from); // Clear session
      break;

    default:
      session.state = 'WELCOME';
      await sendMainMenu(from, userName);
      session.state = 'MENU_SELECTION';
      break;
  }
};

// ─── GET /api/whatsapp/webhook (Meta Verification) ──────────
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  const localVerifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode && token) {
    if (mode === 'subscribe' && token === localVerifyToken) {
      console.log('✅ Webhook verificado correctamente por Meta.');
      return res.status(200).send(challenge);
    }
    console.warn('⚠️ Intento de verificación de webhook fallido (token incorrecto).');
    return res.sendStatus(403);
  }
  return res.sendStatus(400);
});

// ─── POST /api/whatsapp/webhook (Meta Callback Event Receiver) ──
router.post('/webhook', async (req, res) => {
  // Respond to Meta immediately (prevents duplicate retries from webhook timeouts)
  res.status(200).send('EVENT_RECEIVED');

  try {
    const body = req.body;

    if (body.object === 'whatsapp_business_account') {
      if (
        body.entry &&
        body.entry[0].changes &&
        body.entry[0].changes[0].value.messages &&
        body.entry[0].changes[0].value.messages[0]
      ) {
        const message = body.entry[0].changes[0].value.messages[0];
        const from = message.from;
        const msgType = message.type;
        const contact = body.entry[0].changes[0].value.contacts?.[0] || {};
        const userName = contact.profile?.name || 'Cliente';

        let userMessageText = '';
        if (msgType === 'text') {
          userMessageText = message.text.body;
        } else if (msgType === 'interactive') {
          const interactiveType = message.interactive.type;
          if (interactiveType === 'button_reply') {
            userMessageText = message.interactive.button_reply.title;
          } else if (interactiveType === 'list_reply') {
            userMessageText = message.interactive.list_reply.title;
          }
        }

        if (userMessageText) {
          console.log(`💬 Mensaje recibido de ${userName} (${from}): "${userMessageText}"`);
          await handleBotLogic(from, userMessageText, userName);
        }
      }
    }
  } catch (error) {
    console.error('❌ Error procesando el webhook de WhatsApp:', error.message);
  }
});

module.exports = router;
