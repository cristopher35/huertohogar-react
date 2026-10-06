import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { CarritoProvider } from './context/CarritoProvider'

// Dibuja un componente con todo lo que necesita en la app real:
// rutas (MemoryRouter), sesión (AuthProvider) y carrito (CarritoProvider).
export function renderConProviders(ui, { ruta = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <AuthProvider>
        <CarritoProvider>{ui}</CarritoProvider>
      </AuthProvider>
    </MemoryRouter>
  )
}