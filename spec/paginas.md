# Páginas y Rutas

## Tabla de Rutas

| Ruta | Componente | Acceso | Descripción |
|------|-----------|--------|-------------|
| `/` | `Home.jsx` | Público | Página principal |
| `/about` | `About.jsx` | Público | Quiénes somos |
| `/services` | `Services.jsx` | Público | Catálogo de servicios |
| `/service/:id` | `ServiceDetail.jsx` | Público | Detalle de un servicio |
| `/products` | `Products.jsx` | Público | Catálogo de productos |
| `/contact` | `Contact.jsx` | Público | Formulario + cotización |
| `/admin` | `AdminPage.jsx` | Protegido* | Panel de administración |
| `/download` | `DownloadPage.jsx` | Público | Descargas PDF |
| `*` | Redirect → `/` | — | Ruta no encontrada |

> *La ruta `/admin` tiene protección por credenciales simples (formulario de login propio que verifica en tabla `users` de Supabase). No usa auth de Supabase directamente.

---

## Home (`/`)

Página de inicio compuesta por varias secciones:

1. **Hero** — Banner a pantalla completa con imagen `/edificios-de-la-ciudad.jpg`
2. **¿Quiénes Somos?** — Preview de 2 columnas con foto de Unsplash
3. **Servicios Destacados** — 3 tarjetas (Desarrollo, Cloud, Ciberseguridad)
4. **¿Por qué elegirnos?** — Panel oscuro con 3 beneficios
5. **Testimonios** — 3 tarjetas con citas de clientes

**SEO:**
```html
<title>Tecnología del Pacífico S.A.S - Transformación Digital</title>
<meta name="description" content="Soluciones tecnológicas innovadoras..." />
```

---

## Servicios (`/services`)

Grid 3 columnas de todos los servicios de `servicesData`. Cada tarjeta navega a `/service/:id`.

**IDs de servicios disponibles:**
- `desarrollo-software`
- `soluciones-cloud`
- `ciberseguridad`
- `apps-moviles`
- `big-data`
- `soporte-tecnico`

---

## Detalle de Servicio (`/service/:id`)

Carga el servicio por `id` desde `servicesData`. Si el ID no existe, redirige a `/services`.

**Secciones:**
- Hero con gradiente del color del servicio
- Descripción completa
- Características principales (grid 2 columnas)
- Beneficios (sidebar derecho)
- CTA "Solicitar Cotización" → `/contact`

---

## Productos (`/products`)

Catálogo de 6 productos de `productsData` con sistema de carrito.

**Flujo de cotización:**
```
Productos → [Agregar al carrito] → Banner "X productos seleccionados"
→ [Ir a finalizar cotización] → /contact
→ Formulario con resumen del carrito
→ [Enviar Solicitud] → localStorage + toast de confirmación
```

---

## Contacto (`/contact`)

Formulario de solicitud con integración del carrito.

**Estructura:**
- Columna izquierda (1/3): Información de contacto
- Columna derecha (2/3): 
  - Resumen de cotización (si hay ítems en carrito)
  - Formulario de contacto

**Almacenamiento:** Las cotizaciones se guardan en `localStorage` bajo la clave `localQuotations`.

---

## Admin (`/admin`)

Panel de administración protegido por login.

### Login
- Verifica credenciales contra tabla `users` en Supabase
- Usa `sessionStorage` para mantener la sesión activa

### Dashboard
Tabla de cotizaciones con columnas:
- Cliente (nombre, email, teléfono)
- Servicio
- Presupuesto
- Mensaje
- Estado (badge de color)
- Acciones (Editar, Completar, En Progreso)

**Estados posibles:** `Pending` | `In Progress` | `Completed` | `Rejected`

### Supabase
- Tabla: `quotations`
- Tabla: `users`
- URL: `https://ewdyldboyjphgjlcpgzv.supabase.co`

---

## Descargas (`/download`)

Genera documentos PDF usando `html2pdf.js` con plantillas HTML ocultas.

**Documentos disponibles:**

### Tarjeta de Presentación
- **Dimensiones:** 9cm × 5cm (landscape)
- **DPI target:** 300 dpi (escala ×4 en html2canvas)
- **Diseño:** Bicolor (izq. oscuro con logo, der. blanco con datos)
- **Datos de contacto:** Héctor Vergara Góngora, +57 3024892307

### Brochure Tríptico
- **Dimensiones:** Carta apaisada (11×8.5 in)
- **Columnas:** 3 (Presentación/Servicios | Herramientas/Beneficios | Portada/Contacto)
- **Escala:** ×2 en html2canvas
