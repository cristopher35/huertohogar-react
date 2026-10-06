import { screen, fireEvent } from '@testing-library/react'
import { Routes, Route } from 'react-router-dom'
import UsuarioForm from './UsuarioForm'
import { renderConProviders } from '../../test-utils'
import { iniciarSesion } from '../../services/authService'
import { obtenerUsuarioPorRun, obtenerUsuarios } from '../../services/usuariosService'

// El mismo formulario atiende dos rutas: crear (sin run) y editar (con run)
function dibujar(ruta) {
  return renderConProviders(
    <Routes>
      <Route path="/admin/usuarios/nuevo" element={<UsuarioForm />} />
      <Route path="/admin/usuarios/:run/editar" element={<UsuarioForm />} />
      <Route path="/admin/usuarios" element={<p>Lista de usuarios</p>} />
    </Routes>,
    { ruta }
  )
}

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } })
}

function guardar() {
  fireEvent.click(screen.getByRole('button', { name: 'Guardar usuario' }))
}

// Datos válidos para crear un usuario; "cambios" permite reemplazar alguno
function completarNuevo(cambios = {}) {
  const datos = {
    'RUN (sin puntos ni guion)': '12345678-5',
    Nombre: 'Ana',
    Apellidos: 'Pérez',
    Correo: 'ana@gmail.com',
    'Contraseña (4 a 10 caracteres)': 'clave1',
    'Confirmar contraseña': 'clave1',
    'Tipo de usuario': 'Vendedor',
    Dirección: 'Calle 1',
    ...cambios,
  }
  Object.entries(datos).forEach(([etiqueta, valor]) => escribir(etiqueta, valor))
}

describe('UsuarioForm', () => {
  beforeEach(() => {
    localStorage.clear()
    iniciarSesion('admin@duoc.cl', 'admin123')
  })

  describe('al crear', () => {
    it('muestra el título "Nuevo usuario" y el RUN habilitado', () => {
      dibujar('/admin/usuarios/nuevo')
      expect(screen.getByRole('heading', { name: 'Nuevo usuario' })).toBeTruthy()
      expect(screen.getByLabelText('RUN (sin puntos ni guion)').disabled).toBe(false)
    })

    it('al guardar vacío muestra los errores y no crea nada', () => {
      dibujar('/admin/usuarios/nuevo')
      guardar()
      expect(screen.getByText(/RUN inválido/)).toBeTruthy()
      expect(screen.getByText('Selecciona un tipo de usuario.')).toBeTruthy()
      expect(screen.getByText('La contraseña debe tener entre 4 y 10 caracteres.')).toBeTruthy()
      expect(obtenerUsuarios().length).toBe(3)
    })

    it('rechaza un RUN que ya está registrado', () => {
      dibujar('/admin/usuarios/nuevo')
      completarNuevo({ 'RUN (sin puntos ni guion)': '111111111' })
      guardar()
      expect(screen.getByText('Este RUN ya está registrado.')).toBeTruthy()
    })

    it('rechaza un correo que ya está registrado', () => {
      dibujar('/admin/usuarios/nuevo')
      completarNuevo({ Correo: 'cliente@gmail.com' })
      guardar()
      expect(screen.getByText('Este correo ya está registrado.')).toBeTruthy()
    })

    it('con datos válidos crea el usuario con el tipo elegido y vuelve a la lista', () => {
      dibujar('/admin/usuarios/nuevo')
      completarNuevo()
      guardar()

      expect(screen.getByText('Lista de usuarios')).toBeTruthy()
      const creado = obtenerUsuarioPorRun('123456785') // se guarda sin guion
      expect(creado.nombre).toBe('Ana')
      expect(creado.tipo).toBe('Vendedor')
      expect(obtenerUsuarios().length).toBe(4)
    })

    it('la comuna depende de la región elegida (select en cascada)', () => {
      dibujar('/admin/usuarios/nuevo')
      expect(screen.getByLabelText('Comuna (opcional)').disabled).toBe(true)

      escribir('Región (opcional)', 'Región del Biobío')
      expect(screen.getByLabelText('Comuna (opcional)').disabled).toBe(false)
      expect(screen.getByRole('option', { name: 'Concepción' })).toBeTruthy()
      expect(screen.queryByRole('option', { name: 'Valparaíso' })).toBeNull()
    })
  })

  describe('al editar', () => {
    it('carga los datos, bloquea el RUN y deja la contraseña en blanco', () => {
      dibujar('/admin/usuarios/222222222/editar')
      expect(screen.getByRole('heading', { name: 'Editar usuario' })).toBeTruthy()
      expect(screen.getByLabelText('RUN (sin puntos ni guion)').value).toBe('222222222')
      expect(screen.getByLabelText('RUN (sin puntos ni guion)').disabled).toBe(true)
      expect(screen.getByLabelText('Nombre').value).toBe('Vendedor')
      expect(screen.getByLabelText('Contraseña (en blanco para no cambiarla)').value).toBe('')
    })

    it('exige una dirección, incluso en los usuarios de ejemplo que no la tienen', () => {
      dibujar('/admin/usuarios/222222222/editar')
      guardar()
      expect(screen.getByText('Dirección requerida (máximo 300 caracteres).')).toBeTruthy()
    })

    it('con la contraseña en blanco guarda los cambios y conserva la contraseña', () => {
      dibujar('/admin/usuarios/222222222/editar')
      escribir('Apellidos', 'Nuevo')
      escribir('Dirección', 'Calle 5')
      guardar()

      expect(screen.getByText('Lista de usuarios')).toBeTruthy()
      const editado = obtenerUsuarioPorRun('222222222')
      expect(editado.apellidos).toBe('Nuevo')
      expect(editado.password).toBe('vend1234') // no cambió
      expect(obtenerUsuarios().length).toBe(3) // no se duplicó
    })

    it('si se escribe una contraseña nueva, la reemplaza', () => {
      dibujar('/admin/usuarios/222222222/editar')
      escribir('Dirección', 'Calle 5')
      escribir('Contraseña (en blanco para no cambiarla)', 'nueva1')
      escribir('Confirmar contraseña', 'nueva1')
      guardar()

      expect(obtenerUsuarioPorRun('222222222').password).toBe('nueva1')
    })

    it('no permite usar el correo de otro usuario', () => {
      dibujar('/admin/usuarios/222222222/editar')
      escribir('Dirección', 'Calle 5')
      escribir('Correo', 'admin@duoc.cl')
      guardar()
      expect(screen.getByText('Este correo ya está registrado.')).toBeTruthy()
    })

    it('el administrador no puede cambiar el tipo de su propia cuenta', () => {
      dibujar('/admin/usuarios/111111111/editar')
      expect(screen.getByLabelText('Tipo de usuario').disabled).toBe(true)
      expect(screen.getByText('No puedes cambiar el tipo de tu propia cuenta.')).toBeTruthy()
    })

    it('el tipo de otro usuario sí se puede cambiar', () => {
      dibujar('/admin/usuarios/222222222/editar')
      expect(screen.getByLabelText('Tipo de usuario').disabled).toBe(false)
    })

    it('con un RUN que no existe muestra "Usuario no encontrado"', () => {
      dibujar('/admin/usuarios/000/editar')
      expect(screen.getByText('Usuario no encontrado')).toBeTruthy()
    })
  })

  it('el botón Cancelar vuelve a la lista', () => {
    dibujar('/admin/usuarios/nuevo')
    expect(screen.getByRole('link', { name: 'Cancelar' }).getAttribute('href')).toBe('/admin/usuarios')
  })
})