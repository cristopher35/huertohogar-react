import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { useAuth } from '../context/AuthContext'

function Header() {
  // Estado: indica si el menú está abierto en pantallas pequeñas
  const [menuAbierto, setMenuAbierto] = useState(false)
  const { unidades } = useCarrito()
  const { sesion, salir } = useAuth()
  const navigate = useNavigate()

  const cerrarMenu = () => setMenuAbierto(false)

  const manejarSalir = () => {
    salir()
    cerrarMenu()
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/" onClick={cerrarMenu}>
          HuertoHogar
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-label="Abrir menú"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${menuAbierto ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end onClick={cerrarMenu}>Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/catalogo" onClick={cerrarMenu}>Catálogo</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/carrito" onClick={cerrarMenu}>
                Carrito <span className="badge bg-light text-success">{unidades}</span>
              </NavLink>
            </li>
            {sesion && sesion.tipo !== 'Cliente' && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin" onClick={cerrarMenu}>Panel</NavLink>
              </li>
            )}
            <li className="nav-item">
              {sesion ? (
                <button className="nav-link btn btn-link" onClick={manejarSalir}>
                  Cerrar sesión ({sesion.nombre})
                </button>
              ) : (
                <NavLink className="nav-link" to="/login" onClick={cerrarMenu}>Ingresar</NavLink>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Header