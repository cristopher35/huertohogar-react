import { screen, fireEvent } from '@testing-library/react'
import Catalogo from './Catalogo'
import { renderConProviders } from '../test-utils'

// Cada producto se muestra como un título de nivel 2 dentro de su tarjeta
const contarProductos = () => screen.queryAllByRole('heading', { level: 2 }).length

function buscar(texto) {
  fireEvent.change(screen.getByPlaceholderText('Buscar producto...'), { target: { value: texto } })
}

function elegirCategoria(categoria) {
  fireEvent.change(screen.getByRole('combobox'), { target: { value: categoria } })
}

describe('Catalogo', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra los 8 productos al comienzo', () => {
    renderConProviders(<Catalogo />)
    expect(contarProductos()).toBe(8)
  })

  it('filtra por nombre mientras se escribe en el buscador', () => {
    renderConProviders(<Catalogo />)
    buscar('manz')
    expect(contarProductos()).toBe(1)
    expect(screen.getByText('Manzanas Fuji')).toBeTruthy()
    expect(screen.queryByText('Naranjas Valencia')).toBeNull()
  })

  it('el buscador no distingue mayúsculas de minúsculas', () => {
    renderConProviders(<Catalogo />)
    buscar('MIEL')
    expect(screen.getByText('Miel Orgánica')).toBeTruthy()
  })

  it('filtra por categoría', () => {
    renderConProviders(<Catalogo />)
    elegirCategoria('Frutas Frescas')
    expect(contarProductos()).toBe(3)
    expect(screen.queryByText('Miel Orgánica')).toBeNull()
  })

  it('combina el filtro de categoría con el de nombre', () => {
    renderConProviders(<Catalogo />)
    elegirCategoria('Verduras Orgánicas')
    buscar('espinaca')
    expect(contarProductos()).toBe(1)
    expect(screen.getByText('Espinacas Frescas')).toBeTruthy()
  })

  it('avisa cuando no hay resultados', () => {
    renderConProviders(<Catalogo />)
    buscar('zzzz')
    expect(contarProductos()).toBe(0)
    expect(screen.getByText('No se encontraron productos.')).toBeTruthy()
  })

  it('al agregar un producto muestra el mensaje y lo guarda en el carrito', () => {
    renderConProviders(<Catalogo />)
    buscar('manz')

    fireEvent.change(screen.getByLabelText('Cantidad de Manzanas Fuji'), { target: { value: '2' } })
    fireEvent.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(screen.getByText('2 x Manzanas Fuji agregado al carrito')).toBeTruthy()
    expect(JSON.parse(localStorage.getItem('huertohogar_carrito'))).toEqual([
      { id: 'FR001', cantidad: 2 },
    ])
  })

  it('el producto sin precio (Leche Entera) no se puede agregar', () => {
    renderConProviders(<Catalogo />)
    elegirCategoria('Productos Lácteos')
    expect(screen.getByRole('button', { name: 'Agregar' }).disabled).toBe(true)
  })
})