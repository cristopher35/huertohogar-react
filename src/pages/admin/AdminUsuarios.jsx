import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { obtenerUsuarios, eliminarUsuario } from '../../services/usuariosService'

function AdminUsuarios() {
  const { sesion } = useAuth()
  const [usuarios, setUsuarios] = useState(() => obtenerUsuarios())

  const manejarEliminar = (usuario) => {
    if (!window.confirm(`¿Eliminar a ${usuario.nombre} ${usuario.apellidos}?`)) return
    eliminarUsuario(usuario.run)
    setUsuarios(obtenerUsuarios())
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">Usuarios</h1>
        <Link to="/admin/usuarios/nuevo" className="btn btn-success">Nuevo usuario</Link>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>RUN</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => {
              const esCuentaPropia = u.correo === sesion.correo
              return (
                <tr key={u.run}>
                  <td>{u.run}</td>
                  <td>{u.nombre} {u.apellidos}</td>
                  <td>{u.correo}</td>
                  <td>{u.tipo}</td>
                  <td className="text-nowrap">
                    <Link to={`/admin/usuarios/${u.run}`} className="btn btn-outline-secondary btn-sm me-1">
                      Ver
                    </Link>
                    <Link to={`/admin/usuarios/${u.run}/editar`} className="btn btn-outline-success btn-sm me-1">
                      Editar
                    </Link>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => manejarEliminar(u)}
                      disabled={esCuentaPropia}
                      title={esCuentaPropia ? 'No puedes eliminar tu propia cuenta' : ''}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default AdminUsuarios