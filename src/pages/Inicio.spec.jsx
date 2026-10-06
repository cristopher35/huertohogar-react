import { screen, fireEvent } from '@testing-library/react'
import Inicio from './Inicio'
import { renderConProviders } from '../test-utils'
import { BLOGS } from '../data/blogs'

describe('Inicio', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra la bienvenida y un enlace al catálogo', () => {
    renderConProviders(<Inicio />)
    expect(screen.getByRole('heading', { level: 1, name: 'HuertoHogar' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Ver catálogo' }).getAttribute('href')).toBe('/catalogo')
  })

  it('muestra 4 productos destacados, todos con precio', () => {
    renderConProviders(<Inicio />)
    expect(screen.getAllByRole('button', { name: 'Agregar' }).length).toBe(4)
    expect(screen.getByText('Manzanas Fuji')).toBeTruthy()
    expect(screen.queryByText('Leche Entera')).toBeNull()
  })

  it('muestra los artículos del blog', () => {
    renderConProviders(<Inicio />)
    BLOGS.forEach((articulo) => {
      expect(screen.getByText(articulo.titulo)).toBeTruthy()
    })
  })

  it('se puede agregar un destacado al carrito desde el inicio', () => {
    renderConProviders(<Inicio />)
    fireEvent.click(screen.getAllByRole('button', { name: 'Agregar' })[0])

    expect(JSON.parse(localStorage.getItem('huertohogar_carrito'))).toEqual([
      { id: 'FR001', cantidad: 1 },
    ])
  })
})