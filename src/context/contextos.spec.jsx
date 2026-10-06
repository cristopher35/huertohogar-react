import { render } from '@testing-library/react'
import { useCarrito } from './CarritoContext'
import { useAuth } from './AuthContext'

// Componentes de prueba que usan los hooks SIN estar dentro de su provider
function UsaCarrito() {
  useCarrito()
  return null
}

function UsaAuth() {
  useAuth()
  return null
}

describe('hooks de contexto usados fuera de su provider', () => {
  beforeEach(() => {
    // React escribe el error en la consola; se silencia para no ensuciar el resultado
    spyOn(console, 'error')
  })

  it('useCarrito falla con un mensaje claro', () => {
    expect(() => render(<UsaCarrito />)).toThrowError(
      'useCarrito debe usarse dentro de CarritoProvider'
    )
  })

  it('useAuth falla con un mensaje claro', () => {
    expect(() => render(<UsaAuth />)).toThrowError('useAuth debe usarse dentro de AuthProvider')
  })
})