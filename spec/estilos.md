# Sistema de Diseño

## Paleta de Colores

### Colores de Marca

| Nombre | Hex | Uso |
|--------|-----|-----|
| Azul corporativo | `#0066CC` | Botones primarios, links activos, Admin |
| Teal / Cian | `#00A8A8` | Acentos, hovers, gradientes |
| Azul marino | `#2C3E50` | Textos de marca, fondos oscuros |

### Colores del Sistema (Tailwind)

| Clase | Uso Principal |
|-------|-------------|
| `gray-900` | Textos principales |
| `gray-600` | Textos secundarios, subtítulos |
| `gray-400` | Textos terciarios, placeholders |
| `gray-50 / gray-100` | Fondos de tarjetas, secciones alternas |
| `cyan-600` | Botones, indicadores, links de servicio |
| `blue-600` | Gradientes combinados con cyan |
| `white` | Fondos principales, texto sobre oscuro |

### Gradientes Recurrentes

```css
/* Botones y CTAs principales */
bg-gradient-to-r from-cyan-600 to-blue-600

/* Hero fondo oscuro */
bg-gray-900 → overlay sobre imagen

/* Sección "¿Por qué elegirnos?" */
bg-gradient-to-br from-slate-900 to-slate-800

/* Footer */
bg-gradient-to-br from-gray-900 to-gray-800

/* Colores por servicio (en services.js) */
from-cyan-500 to-blue-500        /* Desarrollo Software */
from-blue-500 to-indigo-500      /* Cloud */
from-indigo-500 to-purple-500    /* Ciberseguridad */
from-purple-500 to-pink-500      /* Apps Móviles */
from-pink-500 to-rose-500        /* Big Data */
from-rose-500 to-cyan-500        /* Soporte Técnico */
```

---

## Tipografía

**Fuente principal:** Inter (Google Fonts)  
**Fallbacks:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...`

### Escala de texto usada

| Clase Tailwind | Tamaño | Uso |
|---------------|--------|-----|
| `text-xs` | 12px | Labels pequeños, badges |
| `text-sm` | 14px | Etiquetas, descripciones menores |
| `text-base` | 16px | **Navegación**, texto de párrafos |
| `text-lg` | 18px | Párrafos importantes |
| `text-xl` | 20px | Subtítulos de sección |
| `text-2xl` | 24px | Títulos de tarjetas |
| `text-3xl` | 30px | Títulos de sección |
| `text-4xl` | 36px | H2 de página |
| `text-5xl` | 48px | H1/H2 grandes (desktop) |
| `text-7xl` | 72px | H1 Hero desktop |

---

## Bordes y Radios

| Variable | Valor | Clase equivalente |
|----------|-------|-------------------|
| `--radius` | `0.5rem` | `rounded-lg` |
| — | `0.375rem` | `rounded-md` |
| — | `0.25rem` | `rounded-sm` |

Componentes usan frecuentemente: `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-full`

---

## Animaciones (Framer Motion)

### Patrones recurrentes

```jsx
// Entrada desde abajo
initial={{ opacity: 0, y: 30 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.6 }}

// Entrada desde la izquierda
initial={{ opacity: 0, x: -30 }}
whileInView={{ opacity: 1, x: 0 }}

// Hover elevación
whileHover={{ y: -10 }}

// Hover escala
whileHover={{ scale: 1.05 }}

// Header entrance
initial={{ y: -100 }}
animate={{ y: 0 }}
transition={{ duration: 0.5 }}
```

### Animaciones Tailwind

```html
<!-- Punto pulsante (Hero) -->
<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>

<!-- Spinner de carga (Admin) -->
<Loader2 class="animate-spin" />
```

---

## Variables CSS Globales

Definidas en `src/index.css`:

```css
:root {
  --background: 0 0% 100%;        /* Blanco */
  --foreground: 222.2 84% 4.9%;   /* Casi negro */
  --primary: 221.2 83.2% 53.3%;  /* Azul */
  --destructive: 0 84.2% 60.2%;  /* Rojo */
  --border: 214.3 31.8% 91.4%;   /* Gris claro */
  --ring: 221.2 83.2% 53.3%;     /* Azul (focus) */
  --radius: 0.5rem;
  /* ... (ver index.css para lista completa) */
}
```

---

## Espaciado y Layout

- **Contenedor:** `container mx-auto px-4` (max 1400px en 2xl)
- **Gap de navegación desktop:** `gap-9` (36px)
- **Padding de secciones:** `py-20` (80px arriba/abajo)
- **Padding interno de tarjetas:** `p-6` a `p-12` según tamaño

---

## Scrollbar personalizada

```css
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f5f9; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; }
```

Usada en el resumen del carrito en la página de Contacto.
