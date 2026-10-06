import { screen, fireEvent } from '@testing-library/react'
import Header from './Header'
import { renderConProviders } from '../test-utils'
import { agregarAlCarrito } from '../services/carritoService'
import { iniciarSesion } from '../services/authService'

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('sin sesión muestra "Ingresar" y no muestra "Panel"', () => {
    renderConProviders(<Header />)
    expect(screen.getByText('Ingresar')).toBeTruthy()
    expect(screen.queryByText('Panel')).toBeNull()
  })

  it('el contador del carrito refleja las unidades guardadas', () => {
    agregarAlCarrito('FR001', 2)
    agregarAlCarrito('VR001', 1)
    renderConProviders(<Header />)
    expect(screen.getByText('3')).toBeTruthy()
  })

  it('el menú móvil se abre y se cierra con el botón (estado)', () => {
    const { container } = renderConProviders(<Header />)
    const menu = container.querySelector('.navbar-collapse')
    const boton = screen.getByRole('button', { name: 'Abrir menú' })

    expect(menu.classList.contains('show')).toBe(false)

    fireEvent.click(boton)
    expect(menu.classList.contains('show')).toBe(true)

    fireEvent.click(boton)
    expect(menu.classList.contains('show')).toBe(false)
  })

  it('un cliente con sesión ve su nombre y no ve "Panel"', () => {
    iniciarSesion('cliente@gmail.com', 'cliente1')
    renderConProviders(<Header />)
    expect(screen.getByText(/Cerrar sesión \(/)).toBeTruthy()
    expect(screen.queryByText('Panel')).toBeNull()
  })

  it('un administrador con sesión ve el enlace "Panel"', () => {
    iniciarSesion('admin@duoc.cl', 'admin123')
    renderConProviders(<Header />)
    expect(screen.getByText('Panel')).toBeTruthy()
  })

  it('al cerrar sesión vuelve a aparecer "Ingresar"', () => {
    iniciarSesion('admin@duoc.cl', 'admin123')
    renderConProviders(<Header />)

    fireEvent.click(screen.getByText(/Cerrar sesión \(/))

    expect(screen.getByText('Ingresar')).toBeTruthy()
    expect(localStorage.getItem('huertohogar_sesion')).toBeNull()
  })
})