import { screen } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import AdminUsuarioVer from './AdminUsuarioVer'
import { renderConProviders } from '../../test-utils'

function dibujar(run) {
  return renderConProviders(
    <Routes>
      <Route path="/admin/usuarios/:run" element={<AdminUsuarioVer />} />
    </Routes>,
    { ruta: `/admin/usuarios/${run}` }
  )
}

describe('AdminUsuarioVer', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('muestra la ficha del usuario', () => {
    dibujar('111111111')
    expect(screen.getByRole('heading', { level: 1, name: 'Admin HuertoHogar' })).toBeTruthy()
    expect(screen.getByText('111111111')).toBeTruthy()
    expect(screen.getByText('admin@duoc.cl')).toBeTruthy()
    expect(screen.getByText('Administrador')).toBeTruthy()
  })

  it('los datos opcionales vacíos aparecen como "No especificada"', () => {
    dibujar('111111111')
    // región, comuna y dirección
    expect(screen.getAllByText('No especificada').length).toBe(3)
  })

  it('con un RUN que no existe muestra el aviso y un enlace para volver', () => {
    dibujar('000')
    expect(screen.getByText('Usuario no encontrado')).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Volver a usuarios' }).getAttribute('href')).toBe(
      '/admin/usuarios'
    )
  })

  it('el botón Editar lleva al formulario de ese usuario', () => {
    dibujar('222222222')
    expect(screen.getByRole('link', { name: 'Editar' }).getAttribute('href')).toBe(
      '/admin/usuarios/222222222/editar'
    )
  })
})