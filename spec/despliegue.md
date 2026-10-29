# Guía de Despliegue

## Requisitos Previos

- **Node.js:** v18 o superior (ver `.nvmrc`)
- **npm:** v9 o superior
- **Git:** Para control de versiones

## Instalación Local

```bash
# 1. Clonar o abrir el proyecto
cd webtecnologiadelpacificonetv1/frontend

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
# → http://localhost:3000
```

## Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| `dev` | `vite --host :: --port 3000` | Servidor de desarrollo |
| `build` | `node tools/generate-llms.js \|\| true && vite build` | Build de producción |
| `preview` | `vite preview --host :: --port 3000` | Vista previa del build |
| `eslint` | `eslint src` | Verificación de código |

## Variables de Entorno

Actualmente las credenciales de Supabase están hardcodeadas en `src/lib/supabaseClient.js`. Para mayor seguridad en producción:

1. Crear archivo `.env` en `frontend/`:
```
VITE_SUPABASE_URL=https://ewdyldboyjphgjlcpgzv.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

2. Actualizar `supabaseClient.js`:
```js
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

3. Agregar `.env` al `.gitignore`

## Despliegue en Servidor Apache

El archivo `public/.htaccess` ya está configurado para servir la SPA correctamente (redirige todas las rutas a `index.html`):

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

### Pasos para Apache

```bash
# 1. Generar build
cd frontend
npm run build

# 2. Subir contenido de frontend/dist al servidor
# Ej. con rsync:
rsync -avz dist/ usuario@servidor:/var/www/html/

# 3. Verificar que .htaccess esté en la raíz del servidor
# 4. Habilitar mod_rewrite en Apache si no está activo
```

## Despliegue en Netlify / Vercel

```bash
# Base directory
frontend

# Build command
npm run build

# Publish directory
frontend/dist

# Para Netlify, crear public/_redirects:
echo "/*    /index.html   200" > public/_redirects
```

## Supabase — Configuración de Base de Datos

### Tablas requeridas

```sql
-- Tabla de cotizaciones
CREATE TABLE quotations (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  description TEXT,
  budget TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de usuarios admin
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,  -- ⚠️ considerar hashing en producción
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Políticas RLS (Row Level Security)

Para que el panel Admin funcione con la clave anon, se deben configurar políticas en Supabase:

```sql
-- Permitir SELECT en quotations para clave anon
CREATE POLICY "Allow anon select" ON quotations
  FOR SELECT USING (true);

-- Permitir UPDATE en quotations
CREATE POLICY "Allow anon update" ON quotations
  FOR UPDATE USING (true);

-- Permitir SELECT en users para login
CREATE POLICY "Allow anon select users" ON users
  FOR SELECT USING (true);

-- Permitir INSERT en users para registro
CREATE POLICY "Allow anon insert users" ON users
  FOR INSERT WITH CHECK (true);
```

## Estructura del Build (`/dist`)

```
dist/
├── index.html          # HTML principal
├── assets/
│   ├── index-[hash].js  # Bundle JavaScript
│   └── index-[hash].css # Estilos compilados
└── [archivos de public/]
    ├── company.jpeg
    ├── edificios-de-la-ciudad.jpg
    ├── hombre-en-casa.jpg
    └── .htaccess
```
