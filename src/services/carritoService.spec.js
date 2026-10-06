import {
  obtenerCarrito,
  agregarAlCarrito,
  actualizarCantidad,
  quitarDelCarrito,
  vaciarCarrito,
  totalUnidades,
  totalPrecio,
} from './carritoService'

describe('carritoService', () => {
  // Cada prueba parte con el almacenamiento limpio, para que no dependan entre sí
  beforeEach(() => {
    localStorage.clear()
  })

  it('el carrito parte vacío', () => {
    expect(obtenerCarrito()).toEqual([])
  })

  it('agrega un producto nuevo al carrito', () => {
    agregarAlCarrito('FR001', 2)
    expect(obtenerCarrito()).toEqual([{ id: 'FR001', cantidad: 2 }])
  })

  it('suma la cantidad si el producto ya estaba en el carrito', () => {
    agregarAlCarrito('FR001', 2)
    agregarAlCarrito('FR001', 1)
    expect(obtenerCarrito()).toEqual([{ id: 'FR001', cantidad: 3 }])
  })

  it('actualiza la cantidad de un producto', () => {
    agregarAlCarrito('FR001', 2)
    actualizarCantidad('FR001', 5)
    expect(obtenerCarrito()[0].cantidad).toBe(5)
  })

  it('quita el producto si la cantidad nueva es 0 o menor', () => {
    agregarAlCarrito('FR001', 2)
    actualizarCantidad('FR001', 0)
    expect(obtenerCarrito()).toEqual([])
  })

  it('quita un producto sin afectar a los demás', () => {
    agregarAlCarrito('FR001', 1)
    agregarAlCarrito('VR001', 1)
    quitarDelCarrito('FR001')
    expect(obtenerCarrito()).toEqual([{ id: 'VR001', cantidad: 1 }])
  })

  it('vacía el carrito completo', () => {
    agregarAlCarrito('FR001', 1)
    vaciarCarrito()
    expect(obtenerCarrito()).toEqual([])
  })

  it('cuenta el total de unidades', () => {
    agregarAlCarrito('FR001', 3)
    agregarAlCarrito('VR001', 1)
    expect(totalUnidades()).toBe(4)
  })

  it('calcula el precio total (1200 x 3 + 900 x 1)', () => {
    agregarAlCarrito('FR001', 3)
    agregarAlCarrito('VR001', 1)
    expect(totalPrecio()).toBe(4500)
  })

  it('un producto sin precio (Leche Entera) suma 0 al total', () => {
    agregarAlCarrito('PL001', 4)
    expect(totalPrecio()).toBe(0)
  })

  // MOCK: se reemplaza getItem por un espía que devuelve datos falsos
  it('lee el carrito desde el almacenamiento (mock de getItem)', () => {
    const espia = spyOn(Storage.prototype, 'getItem').and.returnValue(
      JSON.stringify([{ id: 'FR002', cantidad: 7 }])
    )
    expect(obtenerCarrito()).toEqual([{ id: 'FR002', cantidad: 7 }])
    expect(espia).toHaveBeenCalledWith('huertohogar_carrito')
  })

  // ESPÍA: se observa que setItem se llama con la clave correcta, sin cambiar su comportamiento
  it('guarda el carrito en el almacenamiento al agregar (espía de setItem)', () => {
    const espia = spyOn(Storage.prototype, 'setItem').and.callThrough()
    agregarAlCarrito('FR001', 1)
    expect(espia).toHaveBeenCalledWith('huertohogar_carrito', jasmine.any(String))
  })
})