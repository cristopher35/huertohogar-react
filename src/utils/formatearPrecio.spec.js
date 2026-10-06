import { formatearPrecio } from './formatearPrecio'

describe('formatearPrecio', () => {
  it('agrega el signo $ y el separador de miles', () => {
    expect(formatearPrecio(1200)).toBe('$1.200')
  })

  it('formatea números de varios millones', () => {
    expect(formatearPrecio(1234567)).toBe('$1.234.567')
  })

  it('no agrega separador a números menores a mil', () => {
    expect(formatearPrecio(900)).toBe('$900')
  })

  it('redondea los decimales', () => {
    expect(formatearPrecio(1999.6)).toBe('$2.000')
  })
})