import { screen, fireEvent } from '@testing-library/react'
import AdminProductos from './AdminProductos'
import { renderConProviders } from '../../test-utils'
import { iniciarSesion } from '../../services/authService'
import { obtenerProductoPorId } from '../../services/productosService'

// Filas de datos de la tabla (se descuenta la fila del encabezado)
const contarFilas = () => screen.getAllByRole('row').length - 1

describe('AdminProductos', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('lista los 8 productos con su precio formateado', () => {
    iniciarSesion('admin@duoc.cl', 'admin123')
    renderConProviders(<AdminProductos />)
    expect(contarFilas()).toBe(8)
    expect(screen.getByText('$1.200')).toBeTruthy()
  })

  it('un producto sin precio ni stock muestra "No especificado"', () => {
    iniciarSesion('admin@duoc.cl', 'admin123')
    renderConProviders(<AdminProductos />)
    expect(screen.getAllByText('No especificado').length).toBe(2)
  })

  it('el administrador ve Ver, Editar y Eliminar en cada fila, y "Nuevo producto"', () => {
    iniciarSesion('admin@duoc.cl', 'admin123')
    renderConProviders(<AdminProductos />)
    expect(screen.getAllByRole('link', { name: 'Ver' }).length).toBe(8)
    expect(screen.getAllByRole('link', { name: 'Editar' }).length).toBe(8)
    expect(screen.getAllByRole('button', { name: 'Eliminar' }).length).toBe(8)
    expect(screen.getByRole('link', { name: 'Nuevo producto' }).getAttribute('href')).toBe(
      '/admin/productos/nuevo'
    )
  })

  it('el vendedor solo ve el botón Ver', () => {
    iniciarSesion('vendedor@duoc.cl', 'vend1234')
    renderConProviders(<AdminProductos />)
    expect(screen.getAllByRole('link', { name: 'Ver' }).length).toBe(8)
    expect(screen.queryByRole('link', { name: 'Editar' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Eliminar' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Nuevo producto' })).toBeNull()
  })

  it('los enlaces de cada fila apuntan al producto correcto', () => {
    iniciarSesion('admin@duoc.cl', 'admin123')
    renderConProviders(<AdminProductos />)
    expect(screen.getAllByRole('link', { name: 'Ver' })[0].getAttribute('href')).toBe('/admin/productos/FR001')
    expect(screen.getAllByRole('link', { name: 'Editar' })[0].getAttribute('href')).toBe(
      '/admin/productos/FR001/editar'
    )
  })

  // MOCK: se reemplaza window.confirm para simular que el usuario acepta
  it('al confirmar, elimina el producto de la lista y del almacenamiento', () => {
    iniciarSesion('admin@duoc.cl', 'admin123')
    const confirmar = spyOn(window, 'confirm').and.returnValue(true)
    renderConProviders(<AdminProductos />)

    fireEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])

    expect(confirmar).toHaveBeenCalledWith('¿Eliminar "Manzanas Fuji"?')
    expect(contarFilas()).toBe(7)
    expect(obtenerProductoPorId('FR001')).toBeNull()
  })

  // MOCK: se simula que el usuario cancela
  it('si se cancela la confirmación, no elimina nada', () => {
    iniciarSesion('admin@duoc.cl', 'admin123')
    spyOn(window, 'confirm').and.returnValue(false)
    renderConProviders(<AdminProductos />)

    fireEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[0])

    expect(contarFilas()).toBe(8)
    expect(obtenerProductoPorId('FR001')).not.toBeNull()
  })
})