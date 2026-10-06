import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductCard from './ProductCard'

const manzana = {
  id: 'FR001',
  nombre: 'Manzanas Fuji',
  categoria: 'Frutas Frescas',
  precio: 1200,
  unidad: 'kilo',
  imagen: '/img/manzanas-fuji.jpg',
}

const leche = { ...manzana, id: 'PL001', nombre: 'Leche Entera', precio: null }

// ProductCard usa <Link>, que necesita un Router a su alrededor
function dibujar(producto, onAgregar = () => {}) {
  return render(
    <MemoryRouter>
      <ProductCard producto={producto} onAgregar={onAgregar} />
    </MemoryRouter>
  )
}

describe('ProductCard', () => {
  it('muestra nombre, categoría, precio formateado y unidad (props)', () => {
    dibujar(manzana)
    expect(screen.getByText('Manzanas Fuji')).toBeTruthy()
    expect(screen.getByText('Frutas Frescas')).toBeTruthy()
    expect(screen.getByText(/\$1\.200/)).toBeTruthy()
    expect(screen.getByText(/kilo/)).toBeTruthy()
  })

  it('con un producto sin precio muestra el aviso y desactiva el botón', () => {
    dibujar(leche)
    expect(screen.getByText('Precio no disponible')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Agregar' }).disabled).toBe(true)
  })

  it('llama a onAgregar con el id y la cantidad elegida (mock)', () => {
    const onAgregar = jasmine.createSpy('onAgregar')
    dibujar(manzana, onAgregar)

    fireEvent.change(screen.getByLabelText('Cantidad de Manzanas Fuji'), { target: { value: '3' } })
    fireEvent.click(screen.getByRole('button', { name: 'Agregar' }))

    expect(onAgregar).toHaveBeenCalledTimes(1)
    expect(onAgregar).toHaveBeenCalledWith('FR001', 3)
  })

  it('vuelve la cantidad a 1 después de agregar (estado)', () => {
    dibujar(manzana)
    const campo = screen.getByLabelText('Cantidad de Manzanas Fuji')

    fireEvent.change(campo, { target: { value: '5' } })
    expect(campo.value).toBe('5')

    fireEvent.click(screen.getByRole('button', { name: 'Agregar' }))
    expect(campo.value).toBe('1')
  })

  it('no permite una cantidad menor a 1', () => {
    dibujar(manzana)
    const campo = screen.getByLabelText('Cantidad de Manzanas Fuji')

    fireEvent.change(campo, { target: { value: '-4' } })
    expect(campo.value).toBe('1')
  })

  it('la imagen y el nombre enlazan al detalle del producto', () => {
    dibujar(manzana)
    const enlaces = screen.getAllByRole('link')
    expect(enlaces.length).toBe(2)
    enlaces.forEach((enlace) => {
      expect(enlace.getAttribute('href')).toBe('/producto/FR001')
    })
  })
})