import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Props: roles (lista de roles que pueden entrar)
function RutaProtegida({ roles }) {
  const { sesion } = useAuth()

  // Sin sesión o con un rol no permitido: redirige al login
  if (!sesion || !roles.includes(sesion.tipo)) {
    return <Navigate to="/login" replace />
  }

  // Con permiso: muestra las rutas hijas
  return <Outlet />
}

export default RutaProtegida