import { Link, useParams } from 'react-router-dom'
import { obtenerUsuarioPorRun } from '../../services/usuariosService'

function AdminUsuarioVer() {
  const { run } = useParams()
  const usuario = obtenerUsuarioPorRun(run)

  if (!usuario) {
    return (
      <>
        <h1 className="h3 mb-3">Usuario no encontrado</h1>
        <Link to="/admin/usuarios" className="btn btn-success">Volver a usuarios</Link>
      </>
    )
  }

  return (
    <>
      <h1 className="h3 mb-3">{usuario.nombre} {usuario.apellidos}</h1>
      <dl className="row">
        <dt className="col-sm-3">RUN</dt>
        <dd className="col-sm-9">{usuario.run}</dd>
        <dt className="col-sm-3">Correo</dt>
        <dd className="col-sm-9">{usuario.correo}</dd>
        <dt className="col-sm-3">Tipo de usuario</dt>
        <dd className="col-sm-9">{usuario.tipo}</dd>
        <dt className="col-sm-3">Región</dt>
        <dd className="col-sm-9">{usuario.region || 'No especificada'}</dd>
        <dt className="col-sm-3">Comuna</dt>
        <dd className="col-sm-9">{usuario.comuna || 'No especificada'}</dd>
        <dt className="col-sm-3">Dirección</dt>
        <dd className="col-sm-9">{usuario.direccion || 'No especificada'}</dd>
      </dl>
      <Link to="/admin/usuarios" className="btn btn-outline-secondary me-2">Volver</Link>
      <Link to={`/admin/usuarios/${usuario.run}/editar`} className="btn btn-success">Editar</Link>
    </>
  )
}

export default AdminUsuarioVer