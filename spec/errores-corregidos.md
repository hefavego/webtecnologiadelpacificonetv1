# Errores Corregidos y Mejoras Aplicadas

> Registro de todos los bugs corregidos, mejoras de UX y optimizaciones aplicadas al proyecto.
> **Fecha de revisión:** 2026-06-07

---

## 🐛 Bugs Corregidos

### 1. Variables CSS faltantes en `index.css`

**Archivo:** `src/index.css`  
**Problema:** Los warnings de VS Code "Unknown at rule @apply" y "Unknown at rule @tailwind" se debían a que las variables CSS personalizadas requeridas por shadcn/ui (`--border`, `--background`, `--foreground`, `--primary`, etc.) no estaban definidas en el bloque `:root`. La clase `@apply border-border` fallaba en runtime porque `--border` no existía.

**Solución:** Se añadió el bloque `:root` completo con todas las variables HSL requeridas por el sistema de diseño shadcn/ui/Radix UI.

```css
/* ANTES: variables faltantes */
@layer base {
  * { @apply border-border; }   ← fallaba en runtime
}

/* DESPUÉS: variables definidas */
:root {
  --border: 214.3 31.8% 91.4%;
  --background: 0 0% 100%;
  /* ... todas las demás ... */
}
```

---

### 2. Ruta incorrecta de imagen corporativa

**Archivo:** `src/components/About.jsx` (línea 83)  
**Problema:** La imagen de la empresa se referenciaba como `src="public/company.jpeg"`. En Vite, la carpeta `public/` se sirve en la raíz del servidor, por lo que la URL correcta es `/company.jpeg`. El path relativo `public/company.jpeg` buscaba el archivo en un subdirectorio inexistente, causando una imagen rota.

**Solución:**
```jsx
// ANTES (roto)
src="public/company.jpeg"

// DESPUÉS (correcto)
src="/company.jpeg"
```

---

### 3. Idioma del HTML incorrecto

**Archivo:** `index.html`  
**Problema:** La etiqueta `<html>` tenía `lang="en"` cuando todo el contenido del sitio es en español. Esto afecta la accesibilidad (lectores de pantalla) y el SEO.

**Solución:**
```html
<!-- ANTES -->
<html lang="en">

<!-- DESPUÉS -->
<html lang="es">
```

---

### 4. Título del documento genérico

**Archivo:** `index.html`  
**Problema:** El título de la pestaña del navegador era "Hostinger Horizons" (título de la plataforma de desarrollo, no del sitio).

**Solución:**
```html
<!-- ANTES -->
<title>Hostinger Horizons</title>

<!-- DESPUÉS -->
<title>Tecnología del Pacífico S.A.S</title>
```

---

## ✨ Mejoras de UX y Navegación

### 5. Tamaño de fuente del menú aumentado

**Archivo:** `src/components/Header.jsx`  
**Mejora:** Los ítems del menú de navegación usaban `text-sm` (14px), resultando en texto pequeño difícil de leer. Se aumentó a `text-base` (16px) para mejor legibilidad.

```jsx
// ANTES
className="text-sm font-medium..."

// DESPUÉS
className="text-base font-medium..."
```

---

### 6. Separación entre ítems del menú aumentada

**Archivo:** `src/components/Header.jsx`  
**Mejora:** El gap entre ítems del menú era `gap-6` (24px), resultando en un menú muy comprimido. Se aumentó a `gap-9` (36px) para mejor separación visual y usabilidad.

```jsx
// ANTES
<ul className="hidden md:flex items-center gap-6">

// DESPUÉS
<ul className="hidden md:flex items-center gap-9">
```

---

### 7. Scroll al inicio en cambios de ruta

**Archivos:** `src/App.jsx`, `src/components/Header.jsx`  
**Problema:** Al navegar entre páginas, la posición de scroll no se reseteaba. Si el usuario estaba al final de la página de Servicios y hacía clic en "Contacto", llegaba al final de la página de Contacto.

**Solución:** Se añadió el componente `ScrollToTop` en `App.jsx` que detecta cambios en el pathname y ejecuta `window.scrollTo({ top: 0 })`.

```jsx
// Nuevo componente en App.jsx
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};
```

También se añadió `onClick={() => window.scrollTo({ top: 0 })}` a los links del menú para respuesta inmediata.

---

### 8. Menú móvil consistente con desktop

**Archivo:** `src/components/Header.jsx`  
**Mejora:** El menú móvil también aumentó el tamaño de texto a `text-base` para mantener consistencia visual y se añadió el scroll al inicio al navegar.

---

## 📦 Mejoras de CSS

### 9. Fuente Inter de Google Fonts

**Archivo:** `src/index.css`  
**Mejora:** Se añadió la importación de Google Fonts para cargar `Inter` correctamente. Anteriormente, la fuente estaba listada en el `font-family` pero no importada, por lo que el navegador usaba el fallback del sistema.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
```

---

### 10. Custom scrollbar para el carrito

**Archivo:** `src/index.css`  
**Mejora:** Se añadieron estilos CSS para personalizar la barra de scroll dentro del resumen de cotización en la página de Contacto, donde ya se usaba la clase `custom-scrollbar` pero sin los estilos correspondientes.

---

## 📋 Documentación

### 11. Carpeta `spec/` creada

Se creó la carpeta `spec/` en la raíz del proyecto con documentación completa:

| Archivo | Contenido |
|---------|-----------|
| `README.md` | Índice general del proyecto |
| `arquitectura.md` | Stack, estructura de carpetas, flujo de datos |
| `componentes.md` | Catálogo de componentes React |
| `paginas.md` | Rutas y descripción de páginas |
| `datos.md` | Estructura de servicios, productos y Supabase |
| `estilos.md` | Sistema de diseño, colores, tipografía |
| `contexto.md` | CartContext y estado global |
| `errores-corregidos.md` | Este archivo |
| `despliegue.md` | Guía de instalación y despliegue |
