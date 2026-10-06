import {
  obtenerUsuarios,
  obtenerUsuarioPorCorreo,
  obtenerUsuarioPorRun,
  guardarUsuario,
  eliminarUsuario,
} from './usuariosService'

const nuevo = {
  run: '123456785',
  nombre: 'Ana',
  apellidos: 'Pérez',
  correo: 'ana@gmail.com',
  password: 'clave1',
  tipo: 'Cliente',
}

describe('usuariosService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('la primera vez carga los 3 usuarios de ejemplo', () => {
    expect(obtenerUsuarios().length).toBe(3)
  })

  it('busca por correo sin distinguir mayúsculas', () => {
    expect(obtenerUsuarioPorCorreo('ADMIN@duoc.cl').tipo).toBe('Administrador')
  })

  it('devuelve null si el correo no existe', () => {
    expect(obtenerUsuarioPorCorreo('nadie@gmail.com')).toBeNull()
  })

  it('busca por RUN', () => {
    expect(obtenerUsuarioPorRun('111111111').correo).toBe('admin@duoc.cl')
    expect(obtenerUsuarioPorRun('000')).toBeNull()
  })

  it('guarda un usuario nuevo', () => {
    guardarUsuario(nuevo)
    expect(obtenerUsuarios().length).toBe(4)
    expect(obtenerUsuarioPorRun('123456785').nombre).toBe('Ana')
  })

  it('al guardar un usuario existente lo edita sin duplicarlo', () => {
    guardarUsuario({ ...obtenerUsuarioPorRun('111111111'), nombre: 'Cambiado' })
    expect(obtenerUsuarios().length).toBe(3)
    expect(obtenerUsuarioPorRun('111111111').nombre).toBe('Cambiado')
  })

  it('elimina un usuario', () => {
    eliminarUsuario('111111111')
    expect(obtenerUsuarios().length).toBe(2)
    expect(obtenerUsuarioPorRun('111111111')).toBeNull()
  })
})