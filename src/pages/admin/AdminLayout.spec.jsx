import { screen, fireEvent } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import AdminLayout from './AdminLayout'
import AdminInicio from './AdminInicio'
import { renderConProviders } from '../../test-utils'
import { iniciarSesion, sesionActual } from '../../services/authService'

// El layout se dibuja con una página hija (Outlet) y pantallas falsas de tienda y login
function dibujar() {
  return renderConProviders(
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminInicio />} />
      </Route>
      <Route path="/" element={<p>Pantalla de la tienda</p>} />
      <Route path="/login" element={<p>Pantalla de login</p>} />
    </Routes>,
    { ruta: '/admin' }
  )
}

describe('AdminLayout y AdminInicio', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra el tipo y el nombre de quien tiene la sesión', () => {
    iniciarSesion('admin@duoc.cl', 'admin123')
    dibujar()
    expect(screen.getByText('Administrador')).toBeTruthy()
  })

  it('muestra la página hija dentro del panel (Outlet) con el saludo', () => {
    iniciarSesion('admin@duoc.cl', 'admin123')
    dibujar()
    expect(screen.getByRole('heading', { level: 1, name: '¡Hola Admin!' })).toBeTruthy()
  })

  it('el administrador ve los enlaces Inicio, Productos y Usuarios', () => {
    iniciarSesion('admin@duoc.cl', 'admin123')
    dibujar()
    expect(screen.getByRole('link', { name: 'Inicio' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Productos' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Usuarios' })).toBeTruthy()
  })

  it('el vendedor ve Productos pero no Usuarios', () => {
    iniciarSesion('vendedor@duoc.cl', 'vend1234')
    dibujar()
    expect(screen.getByRole('link', { name: 'Productos' })).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'Usuarios' })).toBeNull()
  })

  it('"Volver a la tienda" enlaza a la página principal', () => {
    iniciarSesion('admin@duoc.cl', 'admin123')
    dibujar()
    expect(screen.getByRole('link', { name: 'Volver a la tienda' }).getAttribute('href')).toBe('/')
  })

  it('"Cerrar sesión" borra la sesión y lleva al login', () => {
    iniciarSesion('admin@duoc.cl', 'admin123')
    dibujar()

    fireEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))

    expect(screen.getByText('Pantalla de login')).toBeTruthy()
    expect(sesionActual()).toBeNull()
  })
})