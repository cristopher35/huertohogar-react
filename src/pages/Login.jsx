import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { validarLogin } from '../utils/validaciones'

function Login() {
  const [datos, setDatos] = useState({ email: '', password: '' })
  const [errores, setErrores] = useState({})
  const { ingresar } = useAuth()
  const navigate = useNavigate()

  
  const manejarCambio = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value })
  }

  const manejarEnvio = (e) => {
    e.preventDefault()

    const erroresValidacion = validarLogin(datos)
    setErrores(erroresValidacion)
    if (Object.keys(erroresValidacion).length > 0) return

    const nueva = ingresar(datos.email.trim(), datos.password)
    if (!nueva) {
      setErrores({ password: 'Correo o contraseña incorrectos.' })
      return
    }
// Administrador y Vendedor van al panel, el cliente va a la tienda
navigate(nueva.tipo === 'Cliente' ? '/' : '/admin')
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-5">
        <h1 className="h3 mb-3">Ingresar</h1>

        <form onSubmit={manejarEnvio} noValidate>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo</label>
            <input
              id="email"
              name="email"
              type="email"
              className={`form-control ${errores.email ? 'is-invalid' : ''}`}
              value={datos.email}
              onChange={manejarCambio}
            />
            {errores.email && <div className="invalid-feedback">{errores.email}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              className={`form-control ${errores.password ? 'is-invalid' : ''}`}
              value={datos.password}
              onChange={manejarCambio}
            />
            {errores.password && <div className="invalid-feedback">{errores.password}</div>}
          </div>

          <button type="submit" className="btn btn-success w-100">Ingresar</button>
        </form>
        <p className="mt-3 text-center">
          ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </div>
    </div>
  )
}

export default Login