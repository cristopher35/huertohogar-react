import { obtenerProductos } from './productosService.js';

const CLAVE = 'huertohogar_carrito';

export function obtenerCarrito() {
  const datos = localStorage.getItem(CLAVE);
  return datos ? JSON.parse(datos) : [];
}

function guardarCarrito(items) {
  localStorage.setItem(CLAVE, JSON.stringify(items));
}

export function agregarAlCarrito(idProducto, cantidad) {
  const items = obtenerCarrito();
  const existente = items.find((i) => i.id === idProducto);
  if (existente) existente.cantidad += cantidad;
  else items.push({ id: idProducto, cantidad });
  guardarCarrito(items);
}

// Si la cantidad es 0 o menos, el producto se quita del carrito.
export function actualizarCantidad(idProducto, cantidad) {
  if (cantidad <= 0) {
    quitarDelCarrito(idProducto);
    return;
  }
  const items = obtenerCarrito().map((i) => (i.id === idProducto ? { ...i, cantidad } : i));
  guardarCarrito(items);
}

export function quitarDelCarrito(idProducto) {
  guardarCarrito(obtenerCarrito().filter((i) => i.id !== idProducto));
}

export function vaciarCarrito() {
  guardarCarrito([]);
}

export function totalUnidades() {
  return obtenerCarrito().reduce((total, i) => total + i.cantidad, 0);
}

export function totalPrecio() {
  const productos = obtenerProductos();
  return obtenerCarrito().reduce((total, item) => {
    const producto = productos.find((p) => p.id === item.id);
    const precio = producto && producto.precio ? producto.precio : 0;
    return total + precio * item.cantidad;
  }, 0);
}
