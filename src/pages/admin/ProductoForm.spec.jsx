import { screen, fireEvent } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import ProductoForm from './ProductoForm'
import { renderConProviders } from '../../test-utils'
import { obtenerProductoPorId, obtenerProductos } from '../../services/productosService'

// El mismo formulario atiende dos rutas: crear (sin id) y editar (con id)
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

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
}

function guardar() {
  fireEvent.click(screen.getByRole('button', { name: 'Guardar producto' }))
}

describe('ProductoForm', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('al crear', () => {
    it('muestra el título "Nuevo producto" y el código habilitado', () => {
      dibujar('/admin/productos/nuevo')
      expect(screen.getByRole('heading', { name: 'Nuevo producto' })).toBeTruthy()
      expect(screen.getByLabelText('Código de producto').disabled).toBe(false)
    })

    it('al guardar vacío muestra los errores y no crea nada', () => {
      dibujar('/admin/productos/nuevo')
      guardar()
      expect(screen.getByText('El código debe tener al menos 3 caracteres.')).toBeTruthy()
      expect(screen.getByText('Selecciona una categoría.')).toBeTruthy()
      expect(screen.getByLabelText('Nombre').classList.contains('is-invalid')).toBe(true)
      expect(obtenerProductos().length).toBe(8)
    })

    it('rechaza un código que ya existe', () => {
      dibujar('/admin/productos/nuevo')
      escribir('Código de producto', 'FR001')
      guardar()
      expect(screen.getByText('Ya existe un producto con ese código.')).toBeTruthy()
    })

    it('con datos válidos guarda el producto y vuelve a la lista', () => {
      dibujar('/admin/productos/nuevo')
      escribir('Código de producto', 'TEST1')
      escribir('Nombre', 'Peras')
      escribir('Precio (CLP)', '900')
      escribir('Stock', '20')
      escribir('Categoría', 'Frutas Frescas')
      guardar()

      expect(screen.getByText('Lista de productos')).toBeTruthy()
      const guardado = obtenerProductoPorId('TEST1')
      expect(guardado.nombre).toBe('Peras')
      expect(guardado.precio).toBe(900) // se guarda como número, no como texto
      expect(guardado.imagen).toBe('/img/manzanas-fuji.jpg') // imagen por defecto
      expect(obtenerProductos().length).toBe(9)
    })
  })

  describe('al editar', () => {
    it('carga los datos del producto y bloquea el código', () => {
      dibujar('/admin/productos/FR001/editar')
      expect(screen.getByRole('heading', { name: 'Editar producto' })).toBeTruthy()
      expect(screen.getByLabelText('Código de producto').value).toBe('FR001')
      expect(screen.getByLabelText('Código de producto').disabled).toBe(true)
      expect(screen.getByLabelText('Nombre').value).toBe('Manzanas Fuji')
    })

    it('guarda los cambios sin duplicar el producto', () => {
      dibujar('/admin/productos/FR001/editar')
      escribir('Precio (CLP)', '1500')
      guardar()

      expect(screen.getByText('Lista de productos')).toBeTruthy()
      expect(obtenerProductoPorId('FR001').precio).toBe(1500)
      expect(obtenerProductos().length).toBe(8)
    })

    it('con un código que no existe muestra "Producto no encontrado"', () => {
      dibujar('/admin/productos/XXXX/editar')
      expect(screen.getByText('Producto no encontrado')).toBeTruthy()
    })
  })

  it('el botón Cancelar vuelve a la lista', () => {
    dibujar('/admin/productos/nuevo')
    expect(screen.getByRole('link', { name: 'Cancelar' }).getAttribute('href')).toBe('/admin/productos')
  })
})