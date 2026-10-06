import { createContext, useContext } from 'react'

export const CarritoContext = createContext(null)

// Hook personalizado: así los componentes acceden al carrito con una sola línea
export function useCarrito() {
  const contexto = useContext(CarritoContext)
  if (!contexto) {
    throw new Error('useCarrito debe usarse dentro de CarritoProvider')
  }
  return contexto
}