# Estructura de Datos

## Servicios (`src/data/services.js`)

Array exportado: `servicesData`

### Estructura de cada servicio

```typescript
{
  id: string,              // Slug para URL: /service/:id
  icon: LucideIcon,        // Componente icono de lucide-react
  title: string,           // Nombre del servicio
  shortDescription: string, // Descripción corta (tarjeta)
  fullDescription: string,  // Descripción completa (detalle)
  color: string,           // Clases de gradiente Tailwind para bg
  features: string[],      // Lista de características (4 ítems)
  benefits: string[]       // Lista de beneficios (4 ítems)
}
```

### Servicios disponibles

| id | title | color |
|----|-------|-------|
| `desarrollo-software` | Desarrollo de Software | `from-cyan-500 to-blue-500` |
| `soluciones-cloud` | Soluciones en la Nube | `from-blue-500 to-indigo-500` |
| `ciberseguridad` | Ciberseguridad | `from-indigo-500 to-purple-500` |
| `apps-moviles` | Apps Móviles | `from-purple-500 to-pink-500` |
| `big-data` | Big Data & Analytics | `from-pink-500 to-rose-500` |
| `soporte-tecnico` | Soporte Técnico | `from-rose-500 to-cyan-500` |

---

## Productos (`src/data/products.js`)

Array exportado: `productsData`

### Estructura de cada producto

```typescript
{
  id: number,           // ID único para el carrito
  name: string,         // Nombre del producto
  description: string,  // Descripción breve
  image_url: string,    // URL de imagen (Unsplash)
  price: number,        // Precio estimado en USD
  features: string[]   // Lista de 4 características
}
```

### Productos disponibles

| id | name | price (USD) |
|----|------|------------|
| 1 | Sistema ERP Cloud | $2,999 |
| 2 | Suite de Ciberseguridad | $1,499 |
| 3 | Plataforma E-Commerce | $999 |
| 4 | App Móvil Personalizada | $3,999 |
| 5 | Servidor Cloud Premium | $599 |
| 6 | Sistema POS Inteligente | $799 |

---

## Supabase — Esquema de Base de Datos

### Tabla `quotations`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | UUID / int | ID único de cotización |
| `name` | text | Nombre del cliente |
| `email` | text | Email del cliente |
| `phone` | text | Teléfono del cliente |
| `service` | text | Servicio/producto de interés |
| `description` | text | Mensaje + pedido adjunto |
| `budget` | text | Presupuesto estimado |
| `status` | text | Estado: Pending / In Progress / Completed / Rejected |
| `created_at` | timestamptz | Fecha de creación |

### Tabla `users`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | int | ID del usuario |
| `email` | text | Email del administrador |
| `password` | text | Contraseña en texto plano* |
| `created_at` | timestamptz | Fecha de registro |

> ⚠️ **Seguridad**: Las contraseñas están almacenadas en texto plano. Se recomienda migrar a Supabase Auth o implementar hashing (bcrypt) para producción.

---

## LocalStorage

| Clave | Tipo | Descripción |
|-------|------|-------------|
| `cart` | JSON Array | Ítems del carrito (persistido entre sesiones) |
| `localQuotations` | JSON Array | Cotizaciones enviadas localmente |

---

## SessionStorage

| Clave | Tipo | Descripción |
|-------|------|-------------|
| `adminSession` | JSON Object | `{ email, id, timestamp }` — Sesión del admin |
