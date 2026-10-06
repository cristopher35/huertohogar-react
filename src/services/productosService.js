import { PRODUCTOS_SEED } from '../data/productos.js';

const CLAVE = 'huertohogar_productos';

export function obtenerProductos() {
  if (!localStorage.getItem(CLAVE)) {
    localStorage.setItem(CLAVE, JSON.stringify(PRODUCTOS_SEED));
  }
  return JSON.parse(localStorage.getItem(CLAVE));
}

export function obtenerProductoPorId(id) {
  return obtenerProductos().find((p) => p.id === id) || null;
}

export function guardarProducto(producto) {
  const productos = obtenerProductos();
  const indice = productos.findIndex((p) => p.id === producto.id);
  if (indice >= 0) productos[indice] = producto;
  else productos.push(producto);
  localStorage.setItem(CLAVE, JSON.stringify(productos));
}

export function eliminarProducto(id) {
  const nuevos = obtenerProductos().filter((p) => p.id !== id);
  localStorage.setItem(CLAVE, JSON.stringify(nuevos));
}
