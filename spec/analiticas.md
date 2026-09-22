# Módulo de Analíticas de Visitantes

## Descripción general

El módulo de analíticas registra automáticamente cada visita de página del sitio web y las muestra en un dashboard dentro del panel de administración (pestaña **"Visitantes"**).

---

## Arquitectura

```
Visitante navega → App.jsx (ScrollToTop) → trackPageVisit() → Supabase tabla page_visits
                                                                         ↓
Admin → /admin → Pestaña "Visitantes" → fetchVisitStats() → Dashboard con métricas
```

---

## Archivos involucrados

| Archivo | Rol |
|---------|-----|
| `src/lib/analytics.js` | Utilidades: tracking, parseo de user-agent, agregaciones |
| `src/App.jsx` | Dispara `trackPageVisit()` en cada cambio de ruta |
| `src/pages/AdminPage.jsx` | Dashboard de analíticas (AnalyticsTab) |

---

## Tabla de Supabase: `page_visits`

```sql
CREATE TABLE page_visits (
  id          BIGSERIAL PRIMARY KEY,
  page        TEXT NOT NULL,         -- Ruta: /, /about, /services, etc.
  page_title  TEXT,                  -- Nombre legible: Inicio, Nosotros...
  browser     TEXT,                  -- Chrome, Firefox, Safari, Edge...
  device_type TEXT,                  -- desktop | mobile | tablet
  referrer    TEXT,                  -- URL de origen (nullable)
  screen_width INTEGER,              -- Ancho de pantalla en px
  session_id  TEXT,                  -- UUID de sesión (sessionStorage)
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Políticas RLS requeridas:
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public insert" ON page_visits FOR INSERT WITH CHECK (true);
CREATE POLICY "admin select"  ON page_visits FOR SELECT USING (true);
```

---

## Datos rastreados por visita

| Campo | Fuente | Ejemplo |
|-------|--------|---------|
| `page` | `window.location.pathname` | `/services` |
| `page_title` | Mapa estático en `analytics.js` | `Servicios` |
| `browser` | `navigator.userAgent` parseado | `Chrome` |
| `device_type` | `navigator.userAgent` parseado | `mobile` |
| `referrer` | `document.referrer` | `https://google.com` |
| `screen_width` | `window.screen.width` | `1920` |
| `session_id` | UUID en `sessionStorage` | `sess-1749...` |

### Páginas excluidas del tracking
- `/admin` — para no contaminar métricas con visitas internas
- `/download` — página de uso interno

---

## API de `analytics.js`

### Funciones de tracking

```js
trackPageVisit(page: string) → Promise<void>
// Inserta un registro en Supabase. Falla silenciosamente si hay error.
```

### Funciones de consulta

```js
fetchVisitStats() → Promise<Visit[]>
// Obtiene todas las visitas ordenadas por fecha DESC.
```

### Funciones de agregación

```js
countToday(visits)           → number   // Visitas del día actual
countThisWeek(visits)        → number   // Visitas de los últimos 7 días
countUniqueSessions(visits)  → number   // Sesiones únicas (Set de session_id)
getTopPages(visits, limit)   → [{page, page_title, count}]
getDeviceBreakdown(visits)   → [{type, count, pct}]
getBrowserBreakdown(visits)  → [{browser, count, pct}]
getVisitsByDay(visits)       → [{date, label, count}] // últimos 7 días
getTopReferrers(visits)      → [{source, count, pct}] // top 6
```

---

## Dashboard de Visitantes (AnalyticsTab)

### Métricas KPI (4 tarjetas)
| Tarjeta | Valor |
|---------|-------|
| Total visitas | Suma total de registros |
| Hoy | Visitas del día actual |
| Esta semana | Visitas últimos 7 días |
| Sesiones únicas | `Set(session_id).size` |

### Visualizaciones
- **Barras verticales de 7 días** — columnas CSS animadas con Framer Motion
- **Páginas más visitadas** — barras horizontales ordenadas por conteo
- **Dispositivos** — círculos de color por tipo (desktop/mobile/tablet)
- **Navegadores** — barras horizontales con color por browser
- **Fuentes de tráfico** — hostname del referrer o "Directo"
- **Registro reciente** — tabla con las últimas 25 visitas

---

## Comportamiento de sesión

- Al primer acceso se genera un UUID y se guarda en `sessionStorage` bajo la clave `tp_session_id`
- El UUID persiste mientras la pestaña del navegador esté abierta
- Al cerrar y reabrir el navegador se genera un nuevo UUID → nueva sesión

---

## Manejo de errores

Si la tabla `page_visits` no existe en Supabase, el tab de Analíticas muestra:
- Mensaje de error amigable
- El SQL completo listo para copiar y ejecutar en Supabase → SQL Editor
- Botón "Reintentar"

El tracking en el frontend falla **silenciosamente** (solo `console.warn`) para no afectar la experiencia del usuario.
