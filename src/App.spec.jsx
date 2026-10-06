import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

// App usa BrowserRouter, que lee la dirección real del navegador;
// por eso se cambia la dirección con pushState antes de dibujarla.
function dibujarEn(ruta) {
  window.history.pushState({}, '', ruta)
  return render(<App />)
}

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
}

describe('App (rutas e integración)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    window.history.pushState({}, '', '/')
  })

  describe('cada ruta muestra su página', () => {
    it('/ muestra el menú y la página de inicio', () => {
      dibujarEn('/')
      expect(screen.getByRole('heading', { level: 1, name: 'HuertoHogar' })).toBeTruthy()
      expect(screen.getByRole('link', { name: 'Catálogo' })).toBeTruthy()
    })

    it('/catalogo muestra el catálogo', () => {
      dibujarEn('/catalogo')
      expect(screen.getByRole('heading', { level: 1, name: 'Catálogo de productos' })).toBeTruthy()
    })

    it('/producto/FR001 muestra el detalle del producto', () => {
      dibujarEn('/producto/FR001')
      expect(screen.getByRole('heading', { level: 1, name: 'Manzanas Fuji' })).toBeTruthy()
    })

    it('/carrito muestra el carrito vacío', () => {
      dibujarEn('/carrito')
      expect(screen.getByText('Tu carrito está vacío.')).toBeTruthy()
    })

    it('/registro muestra el formulario de registro', () => {
      dibujarEn('/registro')
      expect(screen.getByRole('heading', { level: 1, name: 'Crear cuenta' })).toBeTruthy()
    })

    it('/admin sin sesión redirige al login', () => {
      dibujarEn('/admin')
      expect(screen.getByRole('heading', { level: 1, name: 'Ingresar' })).toBeTruthy()
    })
  })

  describe('flujos completos', () => {
    it('un cliente busca un producto, lo agrega y ve el total en el carrito', () => {
      const { container } = dibujarEn('/catalogo')

      fireEvent.change(screen.getByPlaceholderText('Buscar producto...'), { target: { value: 'manz' } })
      fireEvent.click(screen.getByRole('button', { name: 'Agregar' }))
      expect(container.querySelector('.badge').textContent).toBe('1')

      fireEvent.click(screen.getByRole('link', { name: /^Carrito/ }))
      expect(screen.getByText('Total: $1.200')).toBeTruthy()
    })

    it('un administrador inicia sesión, entra al panel y navega a Productos', () => {
      dibujarEn('/')

      fireEvent.click(screen.getByRole('link', { name: 'Ingresar' }))
      escribir('Correo', 'admin@duoc.cl')
      escribir('Contraseña', 'admin123')
      fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

      expect(screen.getByRole('heading', { level: 1, name: '¡Hola Admin!' })).toBeTruthy()
      expect(screen.getByText('Cerrar sesión (Admin)')).toBeTruthy()

      fireEvent.click(screen.getByRole('link', { name: 'Productos' }))
      expect(screen.getByRole('heading', { level: 1, name: 'Productos' })).toBeTruthy()
    })

    it('un cliente que inicia sesión no puede entrar al panel', () => {
      dibujarEn('/login')
      escribir('Correo', 'cliente@gmail.com')
      escribir('Contraseña', 'cliente1')
      fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))

      // El cliente va a la tienda y el menú no ofrece el panel
      expect(screen.getByText('Cerrar sesión (Cliente)')).toBeTruthy()
      expect(screen.queryByRole('link', { name: 'Panel' })).toBeNull()
    })
  })
})