
const mysql = require('mysql2/promise');
require('dotenv').config();

// ─────────────────────────────────────────────────────────────
//  Pool de conexiones MySQL
//  Se reutiliza a través de toda la aplicación
// ─────────────────────────────────────────────────────────────
const pool = mysql.createPool({
  host:               process.env.DB_HOST     || 'localhost',
  port:               Number(process.env.DB_PORT) || 3306,
  user:               process.env.DB_USER     || 'root',
  password:           process.env.DB_PASSWORD || '',
  database:           process.env.DB_NAME     || 'tecnologia_pacifico',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  timezone:           '-05:00',         // Colombia (UTC-5)
  charset:            'utf8mb4',
});

// Verificación inicial al arrancar
pool.getConnection()
  .then(conn => {
    console.log(`✅ MySQL conectado → ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
    conn.release();
    // Ejecutar inicialización y siembra de tablas
    initDatabase();
  })
  .catch(err => {
    console.error('❌ MySQL — error de conexión:', err.message);
    console.error('   Verifica que XAMPP esté activo y que la BD exista.');
  });

// ─────────────────────────────────────────────────────────────
//  Inicialización automática y Siembra (Seeding)
// ─────────────────────────────────────────────────────────────
async function initDatabase() {
  const conn = await pool.getConnection();
  try {
    // 1. Crear tablas si no existen
    await conn.query(`
      CREATE TABLE IF NOT EXISTS products (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        name        VARCHAR(255) NOT NULL,
        description TEXT DEFAULT NULL,
        image_url   LONGTEXT DEFAULT NULL,
        price       INT NOT NULL DEFAULT 0,
        features    TEXT DEFAULT NULL,
        screenshots LONGTEXT DEFAULT NULL,
        links       TEXT DEFAULT NULL,
        created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS site_content (
        key_name   VARCHAR(100) PRIMARY KEY,
        key_value  LONGTEXT DEFAULT NULL,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅ Tablas products y site_content verificadas.');

    // 2. Sembrar productos si la tabla está vacía
    const [prodRows] = await conn.query('SELECT COUNT(*) as count FROM products');
    if (prodRows[0].count === 0) {
      console.log('🌱 Sembrando datos iniciales en la tabla products...');
      // Datos por defecto basados en products.js
      const defaultProducts = [
        {
          name: 'Sistema ERP Cloud',
          description: 'Gestiona todos los procesos de tu empresa desde una sola plataforma integrada.',
          image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
          price: 2999,
          features: JSON.stringify([
            'Módulos de contabilidad y finanzas',
            'Gestión de inventario en tiempo real',
            'Recursos humanos y nómina',
            'Facturación electrónica nativa'
          ]),
          screenshots: JSON.stringify([
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80'
          ]),
          links: JSON.stringify([
            { label: 'Probar Demo', url: 'https://demo-erp.tecnologiadelpacifico.com' },
            { label: 'Ficha Técnica', url: 'https://tecnologiadelpacifico.com/docs/erp-spec.pdf' }
          ])
        },
        {
          name: 'Suite de Ciberseguridad',
          description: 'Protección completa contra amenazas digitales con tecnología de última generación.',
          image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80',
          price: 1499,
          features: JSON.stringify([
            'Protección contra ransomware',
            'Firewall de nueva generación',
            'Análisis de vulnerabilidades',
            'Respaldo automático en la nube'
          ]),
          screenshots: JSON.stringify([
            'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80'
          ]),
          links: JSON.stringify([
            { label: 'Soporte de Ciberseguridad', url: 'https://tecnologiadelpacifico.com/contact' }
          ])
        },
        {
          name: 'Plataforma E-Commerce',
          description: 'Solución completa para llevar tu negocio al mundo digital con todo lo necesario.',
          image_url: 'https://images.unsplash.com/photo-1563906478648-52b8004f1412?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          price: 999,
          features: JSON.stringify([
            'Pasarela de pagos integrada',
            'Diseño responsive y personalizable',
            'Gestión de catálogo ilimitado',
            'Integración con redes sociales'
          ]),
          screenshots: JSON.stringify([]),
          links: JSON.stringify([])
        },
        {
          name: 'App Móvil Personalizada',
          description: 'Aplicación móvil a medida para iOS y Android que conecta con tus clientes.',
          image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80',
          price: 3999,
          features: JSON.stringify([
            'Desarrollo nativo iOS y Android',
            'Notificaciones push',
            'Panel administrativo web',
            'Analíticas de uso detalladas'
          ]),
          screenshots: JSON.stringify([]),
          links: JSON.stringify([])
        },
        {
          name: 'Servidor Cloud Premium',
          description: 'Hosting cloud de alto rendimiento con escalabilidad y disponibilidad garantizada.',
          image_url: 'https://images.unsplash.com/photo-1594957685600-b6f728c31276?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
          price: 599,
          features: JSON.stringify([
            '99.9% de Uptime garantizado',
            'Discos SSD NVMe de alta velocidad',
            'IP dedicada incluida',
            'Soporte técnico 24/7'
          ]),
          screenshots: JSON.stringify([]),
          links: JSON.stringify([])
        },
        {
          name: 'Sistema POS Inteligente',
          description: 'Punto de venta moderno con inventario, facturación y análisis de ventas integrados.',
          image_url: 'https://images.unsplash.com/photo-1556742031-c6961e8560b0?auto=format&fit=crop&q=80',
          price: 799,
          features: JSON.stringify([
            'Pantalla táctil intuitiva',
            'Control de stock multi-sucursal',
            'Reportes de ventas en tiempo real',
            'Compatible con lector de códigos'
          ]),
          screenshots: JSON.stringify([]),
          links: JSON.stringify([])
        }
      ];

      for (const p of defaultProducts) {
        await conn.query(
          'INSERT INTO products (name, description, image_url, price, features, screenshots, links) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [p.name, p.description, p.image_url, p.price, p.features, p.screenshots, p.links]
        );
      }
      console.log('✅ Productos sembrados con éxito.');
    }

    // 3. Sembrar contenido general del sitio si está vacío
    const [contentRows] = await conn.query('SELECT COUNT(*) as count FROM site_content');
    if (contentRows[0].count === 0) {
      console.log('🌱 Sembrando datos iniciales en la tabla site_content...');
      const defaultContent = {
        // Hero section
        'hero_badge': 'Líderes en Innovación Digital',
        'hero_title': 'Impulsamos el Futuro de',
        'hero_title_highlight': 'Tu Empresa',
        'hero_description': 'Soluciones tecnológicas integrales que transforman desafíos en oportunidades de crecimiento.',
        'hero_image': '/edificios-de-la-ciudad.jpg',
        // Who We Are section (Home)
        'home_whoweare_badge': 'Quiénes Somos',
        'home_whoweare_title': 'Transformando visiones en realidad digital desde 2015',
        'home_whoweare_desc1': 'En Tecnología del Pacífico S.A.S, no solo escribimos código; construimos el futuro de las empresas. Nos especializamos en identificar los cuellos de botella tecnológicos y convertirlos en ventajas competitivas.',
        'home_whoweare_desc2': 'Nuestro enfoque se basa en la transparencia, la agilidad y la innovación constante, asegurando que cada solución entregada supere las expectativas.',
        'home_whoweare_image': 'https://images.unsplash.com/photo-1519241047957-be31d7379a5d',
        // About page text
        'about_page_badge': 'Nosotros',
        'about_page_title': 'Quiénes Somos',
        'about_page_description': 'Tecnología del Pacífico S.A.S es una empresa líder en soluciones tecnológicas, comprometida con la innovación y el éxito de nuestros clientes.',
        'about_page_exp_title': 'Más de 16 años de experiencia',
        'about_page_exp_desc1': 'Hemos ayudado a cientos de empresas a alcanzar sus objetivos mediante soluciones tecnológicas personalizadas y de alta calidad.',
        'about_page_exp_desc2': 'Nuestro equipo de expertos trabaja incansablemente para garantizar que cada proyecto supere las expectativas y genere resultados medibles.',
        'about_page_image': '/company.jpeg',
        // Contact details
        'contact_email': 'contacto@tecnologiadelpacifico.com',
        'contact_phone': '+57 (2) 123-4567',
        'contact_whatsapp': '+57 311 234 5678',
        'contact_address': 'Av. Principal #12-34, Cali, Colombia'
      };

      for (const [key, val] of Object.entries(defaultContent)) {
        await conn.query(
          'INSERT INTO site_content (key_name, key_value) VALUES (?, ?)',
          [key, val]
        );
      }
      console.log('✅ Contenido general sembrado con éxito.');
    }
  } catch (err) {
    console.error('❌ Error inicializando base de datos:', err.message);
  } finally {
    conn.release();
  }
}

module.exports = pool;

