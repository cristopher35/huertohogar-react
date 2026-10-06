import { screen, fireEvent } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import Carrito from './pages/Carrito'
import AdminProductoVer from './pages/admin/AdminProductoVer'
import ProductoForm from './pages/admin/ProductoForm'
import { renderConProviders } from './test-utils'
import { agregarAlCarrito } from './services/carritoService'
import {
  guardarProducto,
  obtenerProductoPorId,
} from './services/productosService'
import { iniciarSesion } from './services/authService'

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
}

describe('casos borde de páginas', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('Carrito: un producto sin precio se muestra con $0', () => {
    agregarAlCarrito('PL001', 2)
    renderConProviders(<Carrito />)
    expect(screen.getByText('Leche Entera')).toBeTruthy()
    expect(screen.getAllByText('$0').length).toBe(2) // precio y subtotal
    expect(screen.getByText('Total: $0')).toBeTruthy()
  })

  describe('AdminProductoVer', () => {
    function dibujar(codigo) {
      iniciarSesion('admin@duoc.cl', 'admin123')
      return renderConProviders(
        <Routes>
          <Route path="/admin/productos/:id" element={<AdminProductoVer />} />
        </Routes>,
        { ruta: `/admin/productos/${codigo}` }
      )
    }

    it('un producto con precio pero sin unidad muestra solo el precio', () => {
      guardarProducto({ ...obtenerProductoPorId('FR001'), unidad: null })
      dibujar('FR001')
      expect(screen.getByText('$1.200')).toBeTruthy()
      expect(screen.queryByText(/por kilo/)).toBeNull()
    })

    it('un producto con stock crítico lo muestra', () => {
      guardarProducto({ ...obtenerProductoPorId('FR001'), stockCritico: 10 })
      dibujar('FR001')
      expect(screen.getByText('10')).toBeTruthy()
      expect(screen.queryByText('No definido')).toBeNull()
    })
  })

  describe('ProductoForm', () => {
    function dibujar(ruta) {
      return renderConProviders(
        <Routes>
          <Route path="/admin/productos/nuevo" element={<ProductoForm />} />
          <Route path="/admin/productos/:id/editar" element={<ProductoForm />} />
          <Route path="/admin/productos" element={<p>Lista de productos</p>} />
        </Routes>,
        { ruta }
      )
    }

    it('al editar un producto sin precio ni stock, esos campos quedan vacíos', () => {
      dibujar('/admin/productos/PL001/editar')
      expect(screen.getByLabelText('Precio (CLP)').value).toBe('')
      expect(screen.getByLabelText('Stock').value).toBe('')
      expect(screen.getByLabelText('Unidad de venta (ej: kilo)').value).toBe('')
    })

    it('guarda la unidad y el stock crítico cuando se completan', () => {
      dibujar('/admin/productos/nuevo')
      escribir('Código de producto', 'TEST2')
      escribir('Nombre', 'Peras')
      escribir('Precio (CLP)', '900')
      escribir('Unidad de venta (ej: kilo)', ' kilo ')
      escribir('Stock', '20')
      escribir('Stock crítico (opcional)', '5')
      escribir('Categoría', 'Frutas Frescas')
      fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }))

      const guardado = obtenerProductoPorId('TEST2')
      expect(guardado.unidad).toBe('kilo') // se quitan los espacios sobrantes
      expect(guardado.stockCritico).toBe(5)
    })

    it('rechaza una descripción de más de 500 caracteres', () => {
      dibujar('/admin/productos/nuevo')
      escribir('Descripción (opcional)', 'x'.repeat(501))
      fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }))

      expect(screen.getByText('Máximo 500 caracteres.')).toBeTruthy()
      expect(screen.getByLabelText('Descripción (opcional)').classList.contains('is-invalid')).toBe(true)
    })
  })
})