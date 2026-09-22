# Estado Global — CartContext

## Archivo

`src/context/CartContext.jsx`

## Descripción

Contexto React que gestiona el estado del carrito de cotización. Los productos agregados persisten en `localStorage`.

## API del Contexto

```typescript
interface CartContextValue {
  cartItems: Product[];                  // Ítems actuales en el carrito
  addToCart: (product: Product) => void; // Agrega un producto (sin duplicados)
  removeFromCart: (id: number) => void;  // Elimina un producto por ID
  clearCart: () => void;                 // Vacía el carrito completo
  total: number;                         // Suma de precios de todos los ítems
}
```

## Uso

```jsx
// 1. Envolver la app con el proveedor (en App.jsx)
<CartProvider>
  <App />
</CartProvider>

// 2. Consumir en cualquier componente hijo
import { useCart } from '@/context/CartContext';

const MyComponent = () => {
  const { cartItems, addToCart, removeFromCart, clearCart, total } = useCart();
  // ...
};
```

## Comportamiento

- **No permite duplicados:** Si el producto ya está en el carrito, `addToCart` no lo agrega de nuevo.
- **Persistencia:** El carrito se guarda automáticamente en `localStorage` bajo la clave `cart` cada vez que cambia.
- **Inicialización:** Al montar el `CartProvider`, se intenta cargar el carrito desde `localStorage`. Si hay un error de parsing, se inicializa vacío.
- **Total:** Se calcula en tiempo real sumando el campo `price` de cada ítem.

## Componentes que usan el carrito

| Componente | Operaciones |
|-----------|------------|
| `Products.jsx` | `addToCart`, `removeFromCart`, `cartItems` |
| `Contact.jsx` | `cartItems`, `removeFromCart`, `clearCart`, `total` |

## Ejemplo de flujo completo

```
Usuario en /products
  → Hace clic "Agregar" en "Sistema ERP Cloud" ($2,999)
  → addToCart({ id: 1, name: 'Sistema ERP Cloud', price: 2999, ... })
  → Banner aparece: "1 productos seleccionados. Ir a finalizar cotización →"
  → Navega a /contact
  → Ve resumen: "Sistema ERP Cloud — $2999 | Total: $2999"
  → Completa formulario y envía
  → clearCart() se ejecuta
  → Cotización guardada en localStorage
```
