import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { REGIONES, obtenerComunas } from '../../data/regiones'
import {
  guardarUsuario,
  obtenerUsuarioPorRun,
  obtenerUsuarios,
} from '../../services/usuariosService'
import { validarUsuarioAdmin } from '../../utils/validaciones'

const FORMULARIO_VACIO = {
  run: '',
  nombre: '',
  apellidos: '',
  correo: '',
  password: '',
  password2: '',
  fechaNacimiento: '',
  tipo: '',
  region: '',
  comuna: '',
  direccion: '',
}

// La contraseña no se carga al editar: en blanco significa "no cambiarla"
function usuarioADatos(u) {
  return {
    run: u.run,
    nombre: u.nombre,
    apellidos: u.apellidos,
    correo: u.correo,
    password: '',
    password2: '',
    fechaNacimiento: u.fechaNacimiento || '',
    tipo: u.tipo,
    region: u.region || '',
    comuna: u.comuna || '',
    direccion: u.direccion || '',
  }
}

function UsuarioForm() {
  // Si la ruta trae ":run" estamos editando; si no, creando
  const { run } = useParams()
  const esEdicion = Boolean(run)
  const usuarioExistente = esEdicion ? obtenerUsuarioPorRun(run) : null

  const { sesion } = useAuth()
  const navigate = useNavigate()
  const [datos, setDatos] = useState(() =>
    usuarioExistente ? usuarioADatos(usuarioExistente) : FORMULARIO_VACIO
  )
  const [errores, setErrores] = useState({})

  if (esEdicion && !usuarioExistente) {
    return (
      <>
        <h1 className="h3 mb-3">Usuario no encontrado</h1>
        <Link to="/admin/usuarios" className="btn btn-success">Volver a usuarios</Link>
      </>
    )
  }

  // Protección: el administrador no puede cambiarse su propio tipo
  const esCuentaPropia = esEdicion && usuarioExistente.correo === sesion.correo

  const manejarCambio = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value })
  }

  // Select en cascada: al cambiar la región, la comuna se reinicia
  const manejarRegion = (e) => {
    setDatos({ ...datos, region: e.target.value, comuna: '' })
  }

  const manejarEnvio = (e) => {
    e.preventDefault()

    const erroresValidacion = validarUsuarioAdmin(datos, !esEdicion)
    const runFinal = esEdicion ? run : datos.run.trim().replace(/[.-]/g, '').toUpperCase()

    // RUN y correo no pueden repetirse en otro usuario
    if (!esEdicion && !erroresValidacion.run && obtenerUsuarioPorRun(runFinal)) {
      erroresValidacion.run = 'Este RUN ya está registrado.'
    }
    const correoOcupado = obtenerUsuarios().some(
      (u) => u.correo.toLowerCase() === datos.correo.trim().toLowerCase() && u.run !== runFinal
    )
    if (!erroresValidacion.correo && correoOcupado) {
      erroresValidacion.correo = 'Este correo ya está registrado.'
    }

    setErrores(erroresValidacion)
    if (Object.keys(erroresValidacion).length > 0) return

    guardarUsuario({
      run: runFinal,
      nombre: datos.nombre.trim(),
      apellidos: datos.apellidos.trim(),
      correo: datos.correo.trim(),
      password: datos.password !== '' ? datos.password : usuarioExistente.password,
      fechaNacimiento: datos.fechaNacimiento,
      tipo: datos.tipo,
      region: datos.region,
      comuna: datos.comuna,
      direccion: datos.direccion.trim(),
    })
    navigate('/admin/usuarios')
  }

  // Función auxiliar para no repetir el bloque de cada campo
  const campo = (nombre, etiqueta, tipo = 'text', extra = {}) => (
    <div className="col-12 col-md-6">
      <label htmlFor={nombre} className="form-label">{etiqueta}</label>
      <input
        id={nombre}
        name={nombre}
        type={tipo}
        className={`form-control ${errores[nombre] ? 'is-invalid' : ''}`}
        value={datos[nombre]}
        onChange={manejarCambio}
        {...extra}
      />
      {errores[nombre] && <div className="invalid-feedback">{errores[nombre]}</div>}
    </div>
  )

  return (
    <>
      <h1 className="h3 mb-3">{esEdicion ? 'Editar usuario' : 'Nuevo usuario'}</h1>

      <form onSubmit={manejarEnvio} noValidate>
        <div className="row g-3">
          {campo('run', 'RUN (sin puntos ni guion)', 'text', { disabled: esEdicion })}
          {campo('nombre', 'Nombre')}
          {campo('apellidos', 'Apellidos')}
          {campo('correo', 'Correo', 'email')}
          {campo(
            'password',
            esEdicion ? 'Contraseña (en blanco para no cambiarla)' : 'Contraseña (4 a 10 caracteres)',
            'password'
          )}
          {campo('password2', 'Confirmar contraseña', 'password')}
          {campo('fechaNacimiento', 'Fecha de nacimiento (opcional)', 'date')}

          <div className="col-12 col-md-6">
            <label htmlFor="tipo" className="form-label">Tipo de usuario</label>
            <select
              id="tipo"
              name="tipo"
              className={`form-select ${errores.tipo ? 'is-invalid' : ''}`}
              value={datos.tipo}
              onChange={manejarCambio}
              disabled={esCuentaPropia}
            >
              <option value="">-- Seleccione --</option>
              <option value="Administrador">Administrador</option>
              <option value="Vendedor">Vendedor</option>
              <option value="Cliente">Cliente</option>
            </select>
            {esCuentaPropia && (
              <div className="form-text">No puedes cambiar el tipo de tu propia cuenta.</div>
            )}
            {errores.tipo && <div className="invalid-feedback">{errores.tipo}</div>}
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="region" className="form-label">Región (opcional)</label>
            <select id="region" name="region" className="form-select" value={datos.region} onChange={manejarRegion}>
              <option value="">-- Seleccione la región --</option>
              {Object.keys(REGIONES).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="comuna" className="form-label">Comuna (opcional)</label>
            <select
              id="comuna"
              name="comuna"
              className="form-select"
              value={datos.comuna}
              onChange={manejarCambio}
              disabled={datos.region === ''}
            >
              <option value="">-- Seleccione la comuna --</option>
              {obtenerComunas(datos.region).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="direccion" className="form-label">Dirección</label>
            <input
              id="direccion"
              name="direccion"
              type="text"
              className={`form-control ${errores.direccion ? 'is-invalid' : ''}`}
              value={datos.direccion}
              onChange={manejarCambio}
            />
            {errores.direccion && <div className="invalid-feedback">{errores.direccion}</div>}
          </div>

          <div className="col-12 d-flex gap-2">
            <button type="submit" className="btn btn-success">Guardar usuario</button>
            <Link to="/admin/usuarios" className="btn btn-outline-secondary">Cancelar</Link>
          </div>
        </div>
      </form>
    </>
  )
}

export default UsuarioForm