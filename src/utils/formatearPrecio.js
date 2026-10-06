// Formatea un número como precio chileno: 1200 -> "$1.200"
export function formatearPrecio(numero) {
  const texto = String(Math.round(numero));
  return '$' + texto.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
