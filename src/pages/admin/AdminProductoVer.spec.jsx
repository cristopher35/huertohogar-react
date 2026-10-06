import { screen } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import AdminProductoVer from './AdminProductoVer'
import { renderConProviders } from '../../test-utils'
import { iniciarSesion } from '../../services/authService'

function dibujar(codigo) {
  return renderConProviders(
    <Routes>
      <Route path="/admin/productos/:id" element={<AdminProductoVer />} />
    </Routes>,
    { ruta: `/admin/productos/${codigo}` }
  )
}

describe('AdminProductoVer', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra la ficha completa del producto', () => {
    iniciarSesion('admin@duoc.cl', 'admin123')
    dibujar('FR001')
    expect(screen.getByRole('heading', { level: 1, name: 'Manzanas Fuji' })).toBeTruthy()
    expect(screen.getByText('FR001')).toBeTruthy()
    expect(screen.getByText('Frutas Frescas')).toBeTruthy()
    expect(screen.getByText('$1.200 por kilo')).toBeTruthy()
    expect(screen.getByText('150')).toBeTruthy()
    expect(screen.getByText('No definido')).toBeTruthy()
  })

  it('un producto sin precio ni stock muestra "No especificado"', () => {
    iniciarSesion('admin@duoc.cl', 'admin123')
    dibujar('PL001')
    expect(screen.getAllByText('No especificado').length).toBe(2)
  })

  it('con un código que no existe muestra el aviso y un enlace para volver', () => {
    iniciarSesion('admin@duoc.cl', 'admin123')
    dibujar('XXXX')
    expect(screen.getByText('Producto no encontrado')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Volver a productos' }).getAttribute('href')).toBe(
      '/admin/productos'
    )
  })

  it('el administrador ve el botón Editar', () => {
    iniciarSesion('admin@duoc.cl', 'admin123')
    dibujar('FR001')
    expect(screen.getByRole('link', { name: 'Editar' }).getAttribute('href')).toBe(
      '/admin/productos/FR001/editar'
    )
  })

  it('el vendedor no ve el botón Editar', () => {
    iniciarSesion('vendedor@duoc.cl', 'vend1234')
    dibujar('FR001')
    expect(screen.queryByRole('link', { name: 'Editar' })).toBeNull()
  })
})