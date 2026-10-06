import { screen, fireEvent } from '@testing-library/react'
import AdminUsuarios from './AdminUsuarios'
import { renderConProviders } from '../../test-utils'
import { iniciarSesion } from '../../services/authService'
import { obtenerUsuarioPorRun } from '../../services/usuariosService'

// Filas de datos de la tabla (se descuenta la fila del encabezado)
const contarFilas = () => screen.getAllByRole('row').length - 1

describe('AdminUsuarios', () => {
  beforeEach(() => {
    localStorage.clear()
    iniciarSesion('admin@duoc.cl', 'admin123')
  })

  it('lista los 3 usuarios con su nombre completo y su correo', () => {
    renderConProviders(<AdminUsuarios />)
    expect(contarFilas()).toBe(3)
    expect(screen.getByText('Admin HuertoHogar')).toBeTruthy()
    expect(screen.getByText('Vendedor Demo')).toBeTruthy()
    expect(screen.getByText('cliente@gmail.com')).toBeTruthy()
  })

  it('muestra el enlace "Nuevo usuario"', () => {
    renderConProviders(<AdminUsuarios />)
    expect(screen.getByRole('link', { name: 'Nuevo usuario' }).getAttribute('href')).toBe(
      '/admin/usuarios/nuevo'
    )
  })

  it('los enlaces de cada fila usan el RUN del usuario', () => {
    renderConProviders(<AdminUsuarios />)
    expect(screen.getAllByRole('link', { name: 'Ver' })[0].getAttribute('href')).toBe('/admin/usuarios/111111111')
    expect(screen.getAllByRole('link', { name: 'Editar' })[1].getAttribute('href')).toBe(
      '/admin/usuarios/222222222/editar'
    )
  })

  it('no permite eliminar la propia cuenta, pero sí las demás', () => {
    renderConProviders(<AdminUsuarios />)
    const botones = screen.getAllByRole('button', { name: 'Eliminar' })

    expect(botones[0].disabled).toBe(true) // fila del administrador con sesión
    expect(botones[0].getAttribute('title')).toBe('No puedes eliminar tu propia cuenta')
    expect(botones[1].disabled).toBe(false)
    expect(botones[2].disabled).toBe(false)
  })

  // MOCK: se simula que el usuario acepta el cuadro de confirmación
  it('al confirmar, elimina al usuario de la lista y del almacenamiento', () => {
    const confirmar = spyOn(window, 'confirm').and.returnValue(true)
    renderConProviders(<AdminUsuarios />)

    fireEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[1])

    expect(confirmar).toHaveBeenCalledWith('¿Eliminar a Vendedor Demo?')
    expect(contarFilas()).toBe(2)
    expect(obtenerUsuarioPorRun('222222222')).toBeNull()
  })

  // MOCK: se simula que el usuario cancela
  it('si se cancela la confirmación, no elimina a nadie', () => {
    spyOn(window, 'confirm').and.returnValue(false)
    renderConProviders(<AdminUsuarios />)

    fireEvent.click(screen.getAllByRole('button', { name: 'Eliminar' })[1])

    expect(contarFilas()).toBe(3)
    expect(obtenerUsuarioPorRun('222222222')).not.toBeNull()
  })
})