// Regiones y comunas de ejemplo (migrado desde js/regiones.js)
// En React los selects en cascada se arman con estado, no con el DOM.
export const REGIONES = {
  'Región Metropolitana de Santiago': ['Santiago', 'Providencia', 'Las Condes', 'Maipú'],
  'Región de Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué'],
  'Región del Biobío': ['Concepción', 'Nacimiento', 'Los Ángeles'],
  'Región de La Araucanía': ['Temuco', 'Villarica', 'Pucón'],
  'Región de Los Lagos': ['Puerto Montt', 'Osorno', 'Castro'],
};

export function obtenerComunas(region) {
  return REGIONES[region] || [];
}
