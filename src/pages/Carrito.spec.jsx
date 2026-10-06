import { screen, fireEvent } from '@testing-library/react'
import Carrito from './Carrito'
import { renderConProviders } from '../test-utils'
import { agregarAlCarrito } from '../services/carritoService'

describe('Carrito', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  // Deja en el carrito: 2 Manzanas ($1.200 c/u) y 1 Zanahoria ($900)
  function cargarCarrito() {
    agregarAlCarrito('FR001', 2)
    agregarAlCarrito('VR001', 1)
  }

  it('con el carrito vacío muestra el aviso y un enlace al catálogo', () => {
    renderConProviders(<Carrito />)
    expect(screen.getByText('Tu carrito está vacío.')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Ir al catálogo' }).getAttribute('href')).toBe('/catalogo')
  })

  it('muestra cada producto con su subtotal y el total', () => {
    cargarCarrito()
    renderConProviders(<Carrito />)
    expect(screen.getByText('Manzanas Fuji')).toBeTruthy()
    expect(screen.getByText('Zanahorias Orgánicas')).toBeTruthy()
    expect(screen.getByText('$2.400')).toBeTruthy()
    expect(screen.getByText('Total: $3.300')).toBeTruthy()
  })

  it('al cambiar una cantidad se actualizan el subtotal y el total', () => {
    cargarCarrito()
    renderConProviders(<Carrito />)

    const campos = screen.getAllByRole('spinbutton')
    fireEvent.change(campos[0], { target: { value: '3' } })

    expect(screen.getByText('$3.600')).toBeTruthy()
    expect(screen.getByText('Total: $4.500')).toBeTruthy()
  })

  it('una cantidad en 0 quita el producto del carrito', () => {
    cargarCarrito()
    renderConProviders(<Carrito />)

    fireEvent.change(screen.getAllByRole('spinbutton')[0], { target: { value: '0' } })

    expect(screen.queryByText('Manzanas Fuji')).toBeNull()
    expect(screen.getByText('Total: $900')).toBeTruthy()
  })

  it('el botón "Quitar" elimina solo ese producto', () => {
    cargarCarrito()
    renderConProviders(<Carrito />)

    fireEvent.click(screen.getAllByRole('button', { name: 'Quitar' })[1])

    expect(screen.getByText('Manzanas Fuji')).toBeTruthy()
    expect(screen.queryByText('Zanahorias Orgánicas')).toBeNull()
  })

  it('"Vaciar carrito" deja el carrito vacío y borra el almacenamiento', () => {
    cargarCarrito()
    renderConProviders(<Carrito />)

    fireEvent.click(screen.getByRole('button', { name: 'Vaciar carrito' }))

    expect(screen.getByText('Tu carrito está vacío.')).toBeTruthy()
    expect(JSON.parse(localStorage.getItem('huertohogar_carrito'))).toEqual([])
  })
})