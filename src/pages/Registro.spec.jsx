import { screen, fireEvent } from '@testing-library/react'
import Registro from './Registro'
import { renderConProviders } from '../test-utils'
import { obtenerUsuarioPorCorreo } from '../services/usuariosService'

// Escribe en un campo buscándolo por su etiqueta, como lo haría una persona
function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
}

// Completa el formulario con datos válidos; "cambios" permite reemplazar alguno
function completarFormulario(cambios = {}) {
  const datos = {
    'RUN (sin puntos ni guion)': '12345678-5',
    Nombre: 'Ana',
    Apellidos: 'Pérez Soto',
    Correo: 'ana@gmail.com',
    Contraseña: 'clave1',
    'Repetir contraseña': 'clave1',
    Dirección: 'Calle 123',
    ...cambios,
  }
  Object.entries(datos).forEach(([etiqueta, valor]) => escribir(etiqueta, valor))
  escribir('Región', 'Región del Biobío')
  escribir('Comuna', 'Concepción')
}

function enviar() {
  fireEvent.click(screen.getByRole('button', { name: 'Registrarme' }))
}

describe('Registro', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('la comuna está desactivada hasta elegir una región', () => {
    renderConProviders(<Registro />)
    expect(screen.getByLabelText('Comuna').disabled).toBe(true)

    escribir('Región', 'Región del Biobío')
    expect(screen.getByLabelText('Comuna').disabled).toBe(false)
  })

  it('al elegir una región solo ofrece las comunas de esa región (select en cascada)', () => {
    renderConProviders(<Registro />)
    escribir('Región', 'Región del Biobío')

    expect(screen.getByRole('option', { name: 'Concepción' })).toBeTruthy()
    expect(screen.getByRole('option', { name: 'Los Ángeles' })).toBeTruthy()
    expect(screen.queryByRole('option', { name: 'Valparaíso' })).toBeNull()
  })

  it('al cambiar de región se reinicia la comuna elegida', () => {
    renderConProviders(<Registro />)
    escribir('Región', 'Región del Biobío')
    escribir('Comuna', 'Concepción')
    expect(screen.getByLabelText('Comuna').value).toBe('Concepción')

    escribir('Región', 'Región de Valparaíso')
    expect(screen.getByLabelText('Comuna').value).toBe('')
  })

  it('al enviar vacío muestra los errores y marca los campos como inválidos', () => {
    renderConProviders(<Registro />)
    enviar()

    expect(screen.getByText(/RUN inválido/)).toBeTruthy()
    expect(screen.getByText('Nombre requerido (máximo 50 caracteres).')).toBeTruthy()
    expect(screen.getByText('Selecciona una región.')).toBeTruthy()
    expect(screen.getByLabelText('Nombre').classList.contains('is-invalid')).toBe(true)
    expect(obtenerUsuarioPorCorreo('ana@gmail.com')).toBeNull()
  })

  it('detecta contraseñas que no coinciden', () => {
    renderConProviders(<Registro />)
    completarFormulario({ 'Repetir contraseña': 'otra' })
    enviar()
    expect(screen.getByText('Las contraseñas no coinciden.')).toBeTruthy()
  })

  it('rechaza un RUN que ya está registrado', () => {
    renderConProviders(<Registro />)
    completarFormulario({ 'RUN (sin puntos ni guion)': '111111111' })
    enviar()
    expect(screen.getByText('Este RUN ya está registrado.')).toBeTruthy()
  })

  it('rechaza un correo que ya está registrado', () => {
    renderConProviders(<Registro />)
    completarFormulario({ Correo: 'admin@duoc.cl' })
    enviar()
    expect(screen.getByText('Este correo ya está registrado.')).toBeTruthy()
  })

  it('con datos válidos registra un cliente, muestra el éxito y limpia el formulario', () => {
    renderConProviders(<Registro />)
    completarFormulario()
    enviar()

    expect(screen.getByText(/Registro exitoso/)).toBeTruthy()
    expect(obtenerUsuarioPorCorreo('ana@gmail.com').tipo).toBe('Cliente')
    expect(screen.getByLabelText('Nombre').value).toBe('')
  })
})