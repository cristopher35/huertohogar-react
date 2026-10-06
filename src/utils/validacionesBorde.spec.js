import { validarProducto } from './validaciones'

describe('validarProducto: stock crítico', () => {
  const base = {
    codigo: 'FR010', nombre: 'Peras', descripcion: '', precio: '900',
    unidad: 'kilo', stock: '20', stockCritico: '', categoria: 'Frutas Frescas', imagen: '',
  }

  it('el stock crítico es opcional', () => {
    expect(validarProducto({ ...base, stockCritico: '' }).stockCritico).toBeUndefined()
  })

  it('acepta un stock crítico entero mayor o igual a 0', () => {
    expect(validarProducto({ ...base, stockCritico: '5' }).stockCritico).toBeUndefined()
    expect(validarProducto({ ...base, stockCritico: '0' }).stockCritico).toBeUndefined()
  })

  it('rechaza un stock crítico negativo o decimal', () => {
    expect(validarProducto({ ...base, stockCritico: '-1' }).stockCritico).toBeDefined()
    expect(validarProducto({ ...base, stockCritico: '1.5' }).stockCritico).toBeDefined()
  })
})