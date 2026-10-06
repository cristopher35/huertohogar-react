import { useState } from 'react'
import { CarritoContext } from './CarritoContext'
import {
  obtenerCarrito,
  agregarAlCarrito,
  actualizarCantidad,
  quitarDelCarrito,
  vaciarCarrito,
  totalUnidades,
  totalPrecio,
} from '../services/carritoService'

export function CarritoProvider({ children }) {
  // Estado central del carrito: se inicia con lo guardado en localStorage
  const [items, setItems] = useState(() => obtenerCarrito())

  // Después de cada cambio, se vuelve a leer el carrito para refrescar el estado
  const sincronizar = () => setItems(obtenerCarrito())

  const valor = {
    items,
    unidades: totalUnidades(),
    total: totalPrecio(),
    agregar: (id, cantidad) => {
      agregarAlCarrito(id, cantidad)
      sincronizar()
    },
    cambiarCantidad: (id, cantidad) => {
      actualizarCantidad(id, cantidad)
      sincronizar()
    },
    quitar: (id) => {
      quitarDelCarrito(id)
      sincronizar()
    },
    vaciar: () => {
      vaciarCarrito()
      sincronizar()
    },
  }

  return <CarritoContext.Provider value={valor}>{children}</CarritoContext.Provider>
}