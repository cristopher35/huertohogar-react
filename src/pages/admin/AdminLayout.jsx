import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function AdminLayout() {
  const { sesion, salir } = useAuth()
  const navigate = useNavigate()

  // Al cerrar sesión, el panel deja de ser accesible y se lleva al login
  const manejarSalir = () => {
    salir()
    navigate('/login')
  }

  // Sin sesión no hay nada que mostrar (evita leer datos de una sesión ya cerrada)
  if (!sesion) return null

  const claseEnlace = ({ isActive }) => `nav-link ${isActive ? 'active fw-bold' : ''}`

  return (
    <div className="row g-4">
      <aside className="col-12 col-md-3 col-lg-2">
        <div className="card shadow-sm">
          <div className="card-body">
            <p className="small text-muted mb-1">{sesion.tipo}</p>
            <p className="fw-bold mb-3">{sesion.nombre}</p>
            <nav className="nav nav-pills flex-column">
              <NavLink to="/admin" end className={claseEnlace}>Inicio</NavLink>
              <NavLink to="/admin/productos" className={claseEnlace}>Productos</NavLink>
              {sesion.tipo === 'Administrador' && (
                <NavLink to="/admin/usuarios" className={claseEnlace}>Usuarios</NavLink>
              )}
              <Link to="/" className="nav-link">Volver a la tienda</Link>
              <button className="nav-link btn btn-link text-start" onClick={manejarSalir}>
                Cerrar sesión
              </button>
            </nav>
          </div>
        </div>
      </aside>

      <section className="col-12 col-md-9 col-lg-10">
        <Outlet />
      </section>
    </div>
  )
}

export default AdminLayout