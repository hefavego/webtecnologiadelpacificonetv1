# Tecnología del Pacífico S.A.S — Documentación del Proyecto

> Portal web corporativo de **Tecnología del Pacífico S.A.S**, empresa colombiana de soluciones tecnológicas integrales ubicada en Buenaventura, Valle del Cauca.

---

## Índice de Documentación

| Documento | Descripción |
|-----------|-------------|
| [arquitectura.md](./arquitectura.md) | Estructura del proyecto, tecnologías y decisiones de diseño |
| [componentes.md](./componentes.md) | Catálogo de componentes React y su uso |
| [paginas.md](./paginas.md) | Descripción de cada ruta/página del sitio |
| [datos.md](./datos.md) | Estructura de datos, servicios y productos |
| [estilos.md](./estilos.md) | Sistema de diseño, paleta de colores y tipografía |
| [contexto.md](./contexto.md) | Estado global y CartContext |
| [errores-corregidos.md](./errores-corregidos.md) | Registro de bugs corregidos y mejoras aplicadas |
| [despliegue.md](./despliegue.md) | Guía de instalación y despliegue |

---

## Resumen Ejecutivo

El sitio web es una **Single Page Application (SPA)** construida con React + Vite + Tailwind CSS, con las siguientes funcionalidades principales:

- Presentación corporativa de servicios y productos tecnológicos
- Sistema de cotización (carrito de productos → formulario de contacto)
- Panel de administración para gestión de cotizaciones (conectado a Supabase)
- Generación de documentos PDF: tarjeta de presentación y brochure tríptico
- Diseño responsivo con animaciones Framer Motion

## Comandos Rápidos

```bash
# Entrar a la carpeta del frontend
cd frontend

# Instalar dependencias
npm install

# Desarrollo local (puerto 3000)
npm run dev

# Build de producción
npm run build

# Vista previa del build
npm run preview
```
