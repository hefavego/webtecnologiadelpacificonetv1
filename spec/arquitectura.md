# Arquitectura del Proyecto

## Stack Tecnológico

| Capa | Tecnología | Versión | Rol |
|------|-----------|---------|-----|
| UI Framework | React | 18.3.x | Renderizado de componentes |
| Build Tool | Vite | 4.4.x | Bundler y servidor de desarrollo |
| Estilos | Tailwind CSS | 3.4.x | Clases utilitarias de CSS |
| Routing | React Router DOM | 6.21.x | Navegación SPA |
| Animaciones | Framer Motion | 11.15.x | Transiciones y microanimaciones |
| Componentes UI | Radix UI + shadcn/ui | Varias | Componentes accesibles (Dialog, Toast, etc.) |
| Backend / BD | Supabase | 2.30.x | Base de datos PostgreSQL + Auth |
| SEO | React Helmet | 6.1.x | Gestión de metaetiquetas dinámicas |
| PDF | html2pdf.js | 0.10.x | Generación de PDF en cliente |
| Iconos | Lucide React | 0.469.x | Iconos SVG |
| Variantes CSS | class-variance-authority | 0.7.x | Sistema de variantes de botones |
| Merge CSS | tailwind-merge | 2.6.x | Fusión de clases Tailwind sin conflictos |

## Estructura de Carpetas

El repositorio tiene el frontend y el backend al mismo nivel:

```
webtecnologiadelpacificonetv1/
├── frontend/                   # React + Vite (detalle abajo)
├── server/                     # API Node.js/Express + MySQL
├── spec/                       # Documentación del proyecto (esta carpeta)
└── .gitignore
```

Contenido de `frontend/`:

```
frontend/
├── public/                     # Assets estáticos servidos en /
│   ├── .htaccess               # Reglas Apache para SPA routing
│   ├── company.jpeg            # Foto corporativa
│   ├── edificios-de-la-ciudad.jpg  # Imagen hero
│   └── hombre-en-casa.jpg      # Imagen adicional
│
├── src/
│   ├── components/             # Componentes reutilizables
│   │   ├── ui/                 # Componentes base shadcn/ui
│   │   │   ├── button.jsx
│   │   │   ├── dialog.jsx
│   │   │   ├── toast.jsx
│   │   │   ├── toaster.jsx
│   │   │   └── use-toast.js
│   │   ├── About.jsx           # Sección "Quiénes somos"
│   │   ├── CallToAction.jsx    # Componente CTA reutilizable
│   │   ├── Contact.jsx         # Formulario de contacto + carrito
│   │   ├── Footer.jsx          # Pie de página global
│   │   ├── Header.jsx          # Navegación fija global
│   │   ├── Hero.jsx            # Banner principal (Home)
│   │   ├── HeroImage.jsx       # Variante de hero con imagen
│   │   ├── Products.jsx        # Catálogo de productos
│   │   ├── Services.jsx        # Grid de servicios
│   │   └── WelcomeMessage.jsx  # Mensaje de bienvenida
│   │
│   ├── context/
│   │   └── CartContext.jsx     # Estado global del carrito
│   │
│   ├── data/
│   │   ├── products.js         # Array de productos (estático)
│   │   └── services.js         # Array de servicios (estático)
│   │
│   ├── lib/
│   │   ├── supabaseClient.js   # Instancia del cliente Supabase
│   │   └── utils.js            # Utilidad cn() para merge de clases
│   │
│   ├── pages/                  # Páginas/rutas principales
│   │   ├── AdminPage.jsx       # Panel de administración
│   │   ├── Brochure.jsx        # Plantilla brochure (PDF)
│   │   ├── BusinessCard.jsx    # Plantilla tarjeta (PDF)
│   │   ├── DownloadPage.jsx    # Centro de descargas PDF
│   │   ├── Home.jsx            # Página de inicio
│   │   └── ServiceDetail.jsx   # Detalle de servicio
│   │
│   ├── App.jsx                 # Router y layout principal
│   ├── index.css               # Variables CSS globales + Tailwind
│   └── main.jsx                # Punto de entrada React
│
├── plugins/                    # Plugins Vite del entorno Horizons
├── tools/                      # Scripts de build
├── index.html                  # HTML raíz de la SPA
├── package.json                # Dependencias y scripts
├── tailwind.config.js          # Configuración Tailwind
├── vite.config.js              # Configuración Vite
└── postcss.config.js           # Configuración PostCSS
```

## Flujo de Datos

```
Usuario
  │
  ▼
index.html → main.jsx → App.jsx (Router + CartProvider)
  │
  ├── Header (fijo, Z-50)
  ├── Routes
  │     ├── / → Home → Hero + secciones
  │     ├── /about → About
  │     ├── /services → Services
  │     ├── /service/:id → ServiceDetail
  │     ├── /products → Products ← CartContext
  │     ├── /contact → Contact ← CartContext
  │     ├── /admin → AdminPage ← Supabase
  │     └── /download → DownloadPage → html2pdf
  ├── Footer
  └── Toaster (notificaciones globales)
```

## Alias de Importación

El alias `@` apunta a `./src/`. Ejemplo:

```js
import Header from '@/components/Header';
import { supabase } from '@/lib/supabaseClient';
```

Configurado en `vite.config.js`:

```js
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  }
}
```

## Variables de Entorno

> ⚠️ Las credenciales de Supabase están hardcodeadas en `src/lib/supabaseClient.js`. En producción se recomienda moverlas a `.env`:

```
VITE_SUPABASE_URL=https://ewdyldboyjphgjlcpgzv.supabase.co
VITE_SUPABASE_ANON_KEY=...
```
