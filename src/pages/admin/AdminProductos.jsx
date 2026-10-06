import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { obtenerProductos, eliminarProducto } from '../../services/productosService'
import { formatearPrecio } from '../../utils/formatearPrecio'

function AdminProductos() {
  const { sesion } = useAuth()
  const [productos, setProductos] = useState(() => obtenerProductos())
  const esAdmin = sesion.tipo === 'Administrador'

  const manejarEliminar = (producto) => {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) return
    eliminarProducto(producto.id)
    setProductos(obtenerProductos())
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <h1 className="h3 mb-0">Productos</h1>
        {esAdmin && (
          <Link to="/admin/productos/nuevo" className="btn btn-success">Nuevo producto</Link>
        )}
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>{p.precio !== null ? formatearPrecio(p.precio) : 'No especificado'}</td>
                <td>{p.stock !== null ? p.stock : 'No especificado'}</td>
                <td className="text-nowrap">
                  <Link to={`/admin/productos/${p.id}`} className="btn btn-outline-secondary btn-sm me-1">
                    Ver
                  </Link>
                  {esAdmin && (
                    <>
                      <Link to={`/admin/productos/${p.id}/editar`} className="btn btn-outline-success btn-sm me-1">
                        Editar
                      </Link>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => manejarEliminar(p)}>
                        Eliminar
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default AdminProductos