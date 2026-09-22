# Componentes React

## Componentes de Layout Global

### `Header.jsx`
**Ruta:** `src/components/Header.jsx`

Barra de navegación fija en la parte superior de todas las páginas.

**Props:** Ninguna (obtiene `location` de React Router vía `useLocation`)

**Estado local:**
- `isScrolled` — `boolean`: `true` cuando se ha hecho scroll > 20px; activa `shadow-lg`
- `isMobileMenuOpen` — `boolean`: controla la visibilidad del menú móvil

**Ítems de navegación:**
```js
[
  { path: '/',        label: 'Inicio' },
  { path: '/about',   label: 'Nosotros' },
  { path: '/services',label: 'Servicios' },
  { path: '/products',label: 'Productos' },
  { path: '/contact', label: 'Contacto' },
  { path: '/admin',   label: 'Admin' }
]
```

**Comportamiento:**
- En desktop: menú horizontal con subrayado animado en el ítem activo
- En móvil: menú colapsable (Framer Motion height animation)
- Fuente: `text-base` (16px), gap entre ítems: `gap-9` (36px)
- Al hacer clic en cualquier enlace: scroll to top suave

---

### `Footer.jsx`
**Ruta:** `src/components/Footer.jsx`

Pie de página con información corporativa, enlaces y redes sociales.

**Secciones:**
1. **Logo + Descripción + Redes sociales** (Facebook, Twitter, Instagram, LinkedIn)
2. **Empresa** — Links a rutas internas
3. **Servicios** — Links a `/services`
4. **Contacto** — Teléfono, email, dirección

---

## Componentes de Página

### `Hero.jsx`
**Ruta:** `src/components/Hero.jsx`

Banner principal de la página Home. Ocupa toda la altura de la pantalla (`min-h-screen`).

**Características:**
- Imagen de fondo: `/edificios-de-la-ciudad.jpg` con overlay oscuro
- Indicador animado "Líderes en Innovación Digital" (ping animation)
- H1 con gradiente cyan→blue
- Dos CTAs: "Solicitar Cotización" y "Nuestros Servicios"
- Badges de características: Soporte 24/7, Tecnología de Punta, Resultados Garantizados

---

### `About.jsx`
**Ruta:** `src/components/About.jsx`

Sección de presentación corporativa con misión, visión, valores y equipo.

**Imagen:** `/company.jpeg` (servida desde carpeta `public/`)

> ⚠️ **Bug corregido**: La ruta original `public/company.jpeg` era incorrecta. Debe ser `/company.jpeg`.

**Grid de valores:** 4 tarjetas (Misión, Visión, Valores, Equipo)

**Estadísticas:**
- 500+ Proyectos
- 98% Satisfacción
- 24/7 Soporte

---

### `Services.jsx`
**Ruta:** `src/components/Services.jsx`

Grid de tarjetas de servicios con animación hover (rotate del ícono).

**Datos:** Importados de `@/data/services` (`servicesData`)

**Link de tarjeta:** `/service/:id` donde `id` es el campo `id` del servicio

**CTA final:** Banner gradiente con botón "Solicitar Consulta Gratis"

---

### `Products.jsx`
**Ruta:** `src/components/Products.jsx`

Catálogo de productos con sistema de carrito para cotización.

**Props/Context:**
- `useCart()` → `{ addToCart, cartItems, removeFromCart }`
- `useToast()` → notificaciones al agregar/quitar

**Comportamiento por producto:**
- Botón toggle: "Agregar" / "Agregado"
- Al agregar: toast verde + borde cyan en la tarjeta
- Banner flotante cuando hay ítems en carrito → navega a `/contact`

---

### `Contact.jsx`
**Ruta:** `src/components/Contact.jsx`

Formulario de contacto + resumen de cotización del carrito.

**Campos del formulario:**
- Nombre Completo (requerido)
- Email (requerido)
- Teléfono (opcional)
- Mensaje (requerido)

**Lógica de envío:**
1. Combina el mensaje con los ítems del carrito
2. Guarda la cotización en `localStorage` (`localQuotations`)
3. Muestra toast de éxito
4. Limpia el formulario y el carrito

> ℹ️ El formulario actualmente no envía datos a Supabase desde el lado del cliente (solo los guarda localmente). El panel Admin sí lee de Supabase.

---

## Componentes UI (shadcn/ui)

### `button.jsx`
Variantes: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`  
Tamaños: `default`, `sm`, `lg`, `icon`

### `dialog.jsx`
Dialog modal de Radix UI con `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`.

### `toast.jsx` / `toaster.jsx` / `use-toast.js`
Sistema de notificaciones tipo toast. Uso:
```js
const { toast } = useToast();
toast({ title: "Éxito", description: "Mensaje..." });
toast({ title: "Error", description: "Mensaje...", variant: "destructive" });
```
