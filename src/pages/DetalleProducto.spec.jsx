import { screen, fireEvent } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import DetalleProducto from './DetalleProducto'
import { renderConProviders } from '../test-utils'

// La ruta con ":id" es la que permite que useParams lea el código del producto
function dibujar(codigo) {
  return renderConProviders(
    <Routes>
      <Route path="/producto/:id" element={<DetalleProducto />} />
    </Routes>,
    { ruta: `/producto/${codigo}` }
  )
}

describe('DetalleProducto', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('lee el código de la dirección y muestra los datos del producto', () => {
    dibujar('FR001')
    expect(screen.getByRole('heading', { level: 1, name: 'Manzanas Fuji' })).toBeTruthy()
    expect(screen.getByText(/Manzanas Fuji crujientes/)).toBeTruthy()
    expect(screen.getByText(/\$1\.200/)).toBeTruthy()
    expect(screen.getByText('Stock disponible: 150')).toBeTruthy()
  })

  it('con un código que no existe muestra "Producto no encontrado"', () => {
    dibujar('XXXX')
    expect(screen.getByText('Producto no encontrado')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Volver al catálogo' }).getAttribute('href')).toBe('/catalogo')
  })

  it('un producto sin precio (Leche Entera) no se puede agregar', () => {
    dibujar('PL001')
    expect(screen.getByText('Precio y stock no disponibles.')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Agregar al carrito' }).disabled).toBe(true)
  })

  it('agrega la cantidad elegida al carrito y muestra el mensaje', () => {
    dibujar('FR001')
    fireEvent.change(screen.getByLabelText('Cantidad'), { target: { value: '2' } })
    fireEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }))

    expect(screen.getByText('2 x Manzanas Fuji agregado al carrito')).toBeTruthy()
    expect(JSON.parse(localStorage.getItem('huertohogar_carrito'))).toEqual([
      { id: 'FR001', cantidad: 2 },
    ])
  })

  it('después de agregar, la cantidad vuelve a 1', () => {
    dibujar('FR001')
    const campo = screen.getByLabelText('Cantidad')
    fireEvent.change(campo, { target: { value: '4' } })
    fireEvent.click(screen.getByRole('button', { name: 'Agregar al carrito' }))
    expect(campo.value).toBe('1')
  })

  it('el enlace de migas de pan vuelve al catálogo', () => {
    dibujar('FR001')
    expect(screen.getByRole('link', { name: 'Catálogo' }).getAttribute('href')).toBe('/catalogo')
  })
})