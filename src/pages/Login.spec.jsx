import { screen, fireEvent } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import Login from './Login'
import { renderConProviders } from '../test-utils'
import { MSG_CORREO, MSG_PASSWORD } from '../utils/validaciones'

// Se dibuja el Login junto a dos pantallas falsas para comprobar a dónde navega
function dibujarLogin() {
  return renderConProviders(
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<p>Pantalla de inicio</p>} />
      <Route path="/admin" element={<p>Panel de administración</p>} />
    </Routes>,
    { ruta: '/login' }
  )
}

function escribir(correo, password) {
  fireEvent.change(screen.getByLabelText('Correo'), { target: { value: correo } })
  fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: password } })
}

function enviar() {
  fireEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
}

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('los campos son controlados: reflejan lo que se escribe', () => {
    dibujarLogin()
    escribir('ana@gmail.com', 'clave1')
    expect(screen.getByLabelText('Correo').value).toBe('ana@gmail.com')
    expect(screen.getByLabelText('Contraseña').value).toBe('clave1')
  })

  it('al enviar vacío muestra los dos errores de validación', () => {
    dibujarLogin()
    enviar()
    expect(screen.getByText(MSG_CORREO)).toBeTruthy()
    expect(screen.getByText(MSG_PASSWORD)).toBeTruthy()
    expect(screen.getByLabelText('Correo').classList.contains('is-invalid')).toBe(true)
  })

  it('rechaza un correo de un dominio no permitido', () => {
    dibujarLogin()
    escribir('ana@hotmail.com', 'clave1')
    enviar()
    expect(screen.getByText(MSG_CORREO)).toBeTruthy()
  })

  it('con credenciales incorrectas muestra el error y no navega', () => {
    dibujarLogin()
    escribir('cliente@gmail.com', 'incorrecta')
    enviar()
    expect(screen.getByText('Correo o contraseña incorrectos.')).toBeTruthy()
    expect(screen.queryByText('Pantalla de inicio')).toBeNull()
  })

  it('un cliente que ingresa es llevado a la tienda', () => {
    dibujarLogin()
    escribir('cliente@gmail.com', 'cliente1')
    enviar()
    expect(screen.getByText('Pantalla de inicio')).toBeTruthy()
  })

  it('un administrador que ingresa es llevado al panel y queda con sesión', () => {
    dibujarLogin()
    escribir('admin@duoc.cl', 'admin123')
    enviar()
    expect(screen.getByText('Panel de administración')).toBeTruthy()
    expect(localStorage.getItem('huertohogar_sesion')).toContain('Administrador')
  })
})