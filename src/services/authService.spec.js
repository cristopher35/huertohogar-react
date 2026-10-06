import { iniciarSesion, cerrarSesion, sesionActual, tieneRol } from './authService'

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('no hay sesión al comienzo', () => {
    expect(sesionActual()).toBeNull()
  })

  it('inicia sesión con credenciales correctas', () => {
    expect(iniciarSesion('admin@duoc.cl', 'admin123')).toBe(true)
    expect(sesionActual().tipo).toBe('Administrador')
  })

  it('no distingue mayúsculas en el correo', () => {
    expect(iniciarSesion('ADMIN@DUOC.CL', 'admin123')).toBe(true)
  })

  it('rechaza una contraseña incorrecta y no crea sesión', () => {
    expect(iniciarSesion('admin@duoc.cl', 'mala')).toBe(false)
    expect(sesionActual()).toBeNull()
  })

  it('rechaza un correo que no existe', () => {
    expect(iniciarSesion('nadie@gmail.com', 'admin123')).toBe(false)
  })

  it('la sesión guardada no incluye la contraseña', () => {
    iniciarSesion('cliente@gmail.com', 'cliente1')
    expect(Object.keys(sesionActual()).sort()).toEqual(['correo', 'nombre', 'tipo'])
  })

  it('cierra la sesión', () => {
    iniciarSesion('admin@duoc.cl', 'admin123')
    cerrarSesion()
    expect(sesionActual()).toBeNull()
  })

  it('tieneRol responde según el tipo de usuario', () => {
    iniciarSesion('vendedor@duoc.cl', 'vend1234')
    expect(tieneRol(['Administrador', 'Vendedor'])).toBe(true)
    expect(tieneRol(['Administrador'])).toBe(false)
  })

  it('tieneRol es falso si no hay sesión', () => {
    expect(tieneRol(['Administrador', 'Vendedor', 'Cliente'])).toBe(false)
  })
})