import { useAuth } from '../../context/AuthContext'

function AdminInicio() {
  const { sesion } = useAuth()

  return (
    <>
      <h1 className="h3">¡Hola {sesion.nombre}!</h1>
      <p>Desde aquí puedes gestionar el catálogo de productos y los usuarios del sistema.</p>
    </>
  )
}

export default AdminInicio