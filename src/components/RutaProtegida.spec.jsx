import { screen } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import RutaProtegida from './RutaProtegida'
import { renderConProviders } from '../test-utils'
import { iniciarSesion } from '../services/authService'

// Zona protegida y pantalla de login falsas, para ver a dónde llega cada usuario
function dibujar(roles) {
  return renderConProviders(
    <Routes>
      <Route element={<RutaProtegida roles={roles} />}>
        <Route path="/admin" element={<p>Zona protegida</p>} />
      </Route>
      <Route path="/login" element={<p>Pantalla de login</p>} />
    </Routes>,
    { ruta: '/admin' }
  )
}

describe('RutaProtegida', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('sin sesión redirige al login', () => {
    dibujar(['Administrador'])
    expect(screen.getByText('Pantalla de login')).toBeTruthy()
    expect(screen.queryByText('Zona protegida')).toBeNull()
  })

  it('un cliente no puede entrar a una zona de administración', () => {
    iniciarSesion('cliente@gmail.com', 'cliente1')
    dibujar(['Administrador', 'Vendedor'])
    expect(screen.getByText('Pantalla de login')).toBeTruthy()
  })

  it('un vendedor no puede entrar a una zona solo de administrador', () => {
    iniciarSesion('vendedor@duoc.cl', 'vend1234')
    dibujar(['Administrador'])
    expect(screen.getByText('Pantalla de login')).toBeTruthy()
  })

  it('un vendedor sí entra si su rol está permitido', () => {
    iniciarSesion('vendedor@duoc.cl', 'vend1234')
    dibujar(['Administrador', 'Vendedor'])
    expect(screen.getByText('Zona protegida')).toBeTruthy()
  })

  it('un administrador entra a la zona protegida', () => {
    iniciarSesion('admin@duoc.cl', 'admin123')
    dibujar(['Administrador'])
    expect(screen.getByText('Zona protegida')).toBeTruthy()
  })
})