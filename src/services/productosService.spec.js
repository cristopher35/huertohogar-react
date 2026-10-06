import {
  obtenerProductos,
  obtenerProductoPorId,
  guardarProducto,
  eliminarProducto,
} from './productosService'

const nuevo = {
  id: 'FR010',
  nombre: 'Peras',
  categoria: 'Frutas Frescas',
  precio: 900,
  unidad: 'kilo',
  stock: 20,
  stockCritico: null,
  descripcion: '',
  imagen: '/img/manzanas-fuji.jpg',
}

describe('productosService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('la primera vez carga los 8 productos de ejemplo y los guarda', () => {
    expect(obtenerProductos().length).toBe(8)
    expect(localStorage.getItem('huertohogar_productos')).not.toBeNull()
  })

  it('busca un producto por su código', () => {
    expect(obtenerProductoPorId('FR001').nombre).toBe('Manzanas Fuji')
  })

  it('devuelve null si el código no existe', () => {
    expect(obtenerProductoPorId('XXXX')).toBeNull()
  })

  it('guarda un producto nuevo', () => {
    guardarProducto(nuevo)
    expect(obtenerProductos().length).toBe(9)
    expect(obtenerProductoPorId('FR010').nombre).toBe('Peras')
  })

  it('al guardar un producto existente lo edita sin duplicarlo', () => {
    guardarProducto({ ...obtenerProductoPorId('FR001'), precio: 1500 })
    expect(obtenerProductos().length).toBe(8)
    expect(obtenerProductoPorId('FR001').precio).toBe(1500)
  })

  it('elimina un producto', () => {
    eliminarProducto('FR001')
    expect(obtenerProductos().length).toBe(7)
    expect(obtenerProductoPorId('FR001')).toBeNull()
  })

  it('los cambios se mantienen entre lecturas (persistencia)', () => {
    guardarProducto(nuevo)
    const leidoDeNuevo = JSON.parse(localStorage.getItem('huertohogar_productos'))
    expect(leidoDeNuevo.some((p) => p.id === 'FR010')).toBe(true)
  })
})