# Backend Node.js + MySQL

## Descripción

Servidor REST API en **Express.js** que conecta el frontend React con la base de datos **MySQL de XAMPP** (puerto 3306).

---

## Estructura del servidor

```
server/
├── index.js              # Entrada principal — Express + middlewares + rutas
├── db.js                 # Pool de conexiones MySQL (mysql2/promise)
├── .env                  # Variables de entorno activas (no commitear)
├── .env.example          # Plantilla de variables de entorno
├── package.json          # Dependencias Node
├── routes/
│   ├── auth.js           # POST /api/auth/login, POST /api/auth/register
│   ├── quotations.js     # CRUD completo de cotizaciones
│   └── visits.js         # POST /api/visits, GET /api/visits, GET /api/visits/stats
└── database/
    └── schema.sql        # Esquema MySQL completo
```

---

## Puertos

| Servicio | Puerto | URL |
|---------|--------|-----|
| MySQL / XAMPP | 3306 | `localhost:3306` |
| Node.js API | 5000 | `http://localhost:5000` |
| React (Vite dev) | 3001 | `http://localhost:3001` |

---

## Endpoints de la API

### Health

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Estado del servidor |

### Autenticación

| Método | Ruta | Body | Descripción |
|--------|------|------|-------------|
| POST | `/api/auth/login` | `{email, password}` | Inicia sesión |
| POST | `/api/auth/register` | `{email, password}` | Registra admin |

### Cotizaciones

| Método | Ruta | Body | Descripción |
|--------|------|------|-------------|
| GET | `/api/quotations` | — | Obtiene todas |
| POST | `/api/quotations` | `{name, email, phone?, service?, description?, budget?}` | Crea nueva |
| PUT | `/api/quotations/:id` | `{status?, budget?, description?}` | Actualiza |
| DELETE | `/api/quotations/:id` | — | Elimina |

### Analíticas

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/visits` | Registra visita (llamado desde frontend) |
| GET | `/api/visits` | Todas las visitas (max 5000) |
| GET | `/api/visits/stats` | Estadísticas agregadas en SQL |

---

## Formato de respuestas

Todas las respuestas siguen la misma estructura:

```json
{
  "success": true,
  "message": "Texto descriptivo",
  "data": { }
}
```

En caso de error:
```json
{
  "success": false,
  "message": "Descripción del error"
}
```

---

## Variables de entorno (`server/.env`)

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=tecnologia_pacifico
CORS_ORIGIN=http://localhost:3001
NODE_ENV=development
```

---

## Variable única de URL (frontend)

**`src/lib/api.js`** es la **única fuente de verdad** para todas las URLs:

```js
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API = {
  health:     `${API_BASE_URL}/api/health`,
  login:      `${API_BASE_URL}/api/auth/login`,
  register:   `${API_BASE_URL}/api/auth/register`,
  quotations: `${API_BASE_URL}/api/quotations`,
  quotation:  (id) => `${API_BASE_URL}/api/quotations/${id}`,
  visits:     `${API_BASE_URL}/api/visits`,
  visitStats: `${API_BASE_URL}/api/visits/stats`,
};
```

Para cambiar de entorno, solo modificar `VITE_API_URL` en `.env`:

```env
# Desarrollo local
VITE_API_URL=http://localhost:5000

# Producción
VITE_API_URL=https://api.midominio.com
```

---

## Guía de arranque completa

### Paso 1 — Base de datos (XAMPP)

1. Abre **XAMPP Control Panel**
2. Inicia **Apache** y **MySQL**
3. Ve a `http://localhost/phpmyadmin`
4. Crea la base de datos o ejecuta el SQL:

```bash
# Opción CLI (si tienes MySQL en PATH):
mysql -u root -p < server/database/schema.sql
```

### Paso 2 — Servidor Node.js

```bash
cd server
npm install        # Solo la primera vez
npm run dev        # Con nodemon (recarga automática)
# o
npm start          # Producción
```

### Paso 3 — Frontend React

```bash
# (raíz del proyecto)
npm run dev
```

### Verificar que todo funciona

```bash
# El servidor responde en:
curl http://localhost:5000/api/health

# Respuesta esperada:
# { "success": true, "server": "Tecnología del Pacífico API", ... }
```

---

## Seguridad (pendiente para producción)

| Item | Estado | Recomendación |
|------|--------|---------------|
| Contraseñas en texto plano | ⚠️ | Usar `bcrypt` para hashear |
| Sin JWT | ⚠️ | Agregar tokens de sesión con `jsonwebtoken` |
| CORS abierto | ⚠️ | Restringir a dominio de producción |
| Sin rate limiting | ⚠️ | Usar `express-rate-limit` |
| Variables en `.env` | ✅ | No commitear `.env` al repositorio |
