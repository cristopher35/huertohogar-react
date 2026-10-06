import { useState } from 'react'
import { Link } from 'react-router-dom'
import { REGIONES, obtenerComunas } from '../data/regiones'
import { validarRegistro } from '../utils/validaciones'
import { guardarUsuario, obtenerUsuarioPorCorreo, obtenerUsuarioPorRun } from '../services/usuariosService'

const FORMULARIO_VACIO = {
  run: '',
  nombre: '',
  apellidos: '',
  email: '',
  password: '',
  password2: '',
  telefono: '',
  fechaNacimiento: '',
  region: '',
  comuna: '',
  direccion: '',
}

function Registro() {
  const [datos, setDatos] = useState(FORMULARIO_VACIO)
  const [errores, setErrores] = useState({})
  const [registrado, setRegistrado] = useState(false)

  // Un solo manejador para todos los campos, según su atributo "name"
  const manejarCambio = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value })
  }

  // Select en cascada: al cambiar la región, la comuna elegida se reinicia
  const manejarRegion = (e) => {
    setDatos({ ...datos, region: e.target.value, comuna: '' })
  }

  const manejarEnvio = (e) => {
    e.preventDefault()
    setRegistrado(false)

    const erroresValidacion = validarRegistro(datos)

    // Validaciones que dependen de los datos guardados
    const run = datos.run.trim().replace(/[.-]/g, '').toUpperCase()
    if (!erroresValidacion.run && obtenerUsuarioPorRun(run)) {
      erroresValidacion.run = 'Este RUN ya está registrado.'
    }
    if (!erroresValidacion.email && obtenerUsuarioPorCorreo(datos.email.trim())) {
      erroresValidacion.email = 'Este correo ya está registrado.'
    }

    setErrores(erroresValidacion)
    if (Object.keys(erroresValidacion).length > 0) return

    guardarUsuario({
      run,
      nombre: datos.nombre.trim(),
      apellidos: datos.apellidos.trim(),
      correo: datos.email.trim(),
      password: datos.password,
      telefono: datos.telefono.trim(),
      fechaNacimiento: datos.fechaNacimiento,
      tipo: 'Cliente',
      region: datos.region,
      comuna: datos.comuna,
      direccion: datos.direccion.trim(),
    })

    setDatos(FORMULARIO_VACIO)
    setRegistrado(true)
  }

  // Función auxiliar para no repetir el bloque de cada campo de texto
  const campo = (id, etiqueta, tipo = 'text') => (
    <div className="col-12 col-md-6">
      <label htmlFor={id} className="form-label">{etiqueta}</label>
      <input
        id={id}
        name={id}
        type={tipo}
        className={`form-control ${errores[id] ? 'is-invalid' : ''}`}
        value={datos[id]}
        onChange={manejarCambio}
      />
      {errores[id] && <div className="invalid-feedback">{errores[id]}</div>}
    </div>
  )

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-lg-8">
        <h1 className="h3 mb-3">Crear cuenta</h1>

        {registrado && (
          <div className="alert alert-success">
            Registro exitoso. Ya puedes <Link to="/login">ingresar</Link>.
          </div>
        )}

        <form onSubmit={manejarEnvio} noValidate>
          <div className="row g-3">
            {campo('run', 'RUN (sin puntos ni guion)')}
            {campo('nombre', 'Nombre')}
            {campo('apellidos', 'Apellidos')}
            {campo('email', 'Correo', 'email')}
            {campo('password', 'Contraseña', 'password')}
            {campo('password2', 'Repetir contraseña', 'password')}
            {campo('telefono', 'Teléfono (opcional)')}
            {campo('fechaNacimiento', 'Fecha de nacimiento (opcional)', 'date')}

            <div className="col-12 col-md-6">
              <label htmlFor="region" className="form-label">Región</label>
              <select
                id="region"
                name="region"
                className={`form-select ${errores.region ? 'is-invalid' : ''}`}
                value={datos.region}
                onChange={manejarRegion}
              >
                <option value="">-- Seleccione la región --</option>
                {Object.keys(REGIONES).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {errores.region && <div className="invalid-feedback">{errores.region}</div>}
            </div>

            <div className="col-12 col-md-6">
              <label htmlFor="comuna" className="form-label">Comuna</label>
              <select
                id="comuna"
                name="comuna"
                className={`form-select ${errores.comuna ? 'is-invalid' : ''}`}
                value={datos.comuna}
                onChange={manejarCambio}
                disabled={datos.region === ''}
              >
                <option value="">-- Seleccione la comuna --</option>
                {obtenerComunas(datos.region).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errores.comuna && <div className="invalid-feedback">{errores.comuna}</div>}
            </div>

            <div className="col-12">
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

            <div className="col-12">
              <button type="submit" className="btn btn-success w-100">Registrarme</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Registro