import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { obtenerProductoPorId } from '../../services/productosService'
import { formatearPrecio } from '../../utils/formatearPrecio'

function AdminProductoVer() {
  const { id } = useParams()
  const { sesion } = useAuth()
  const producto = obtenerProductoPorId(id)

  if (!producto) {
    return (
      <>
        <h1 className="h3 mb-3">Producto no encontrado</h1>
        <Link to="/admin/productos" className="btn btn-success">Volver a productos</Link>
      </>
    )
  }

  const precioTexto =
    producto.precio !== null
      ? formatearPrecio(producto.precio) + (producto.unidad ? ` por ${producto.unidad}` : '')
      : 'No especificado'

  return (
    <>
      <h1 className="h3 mb-3">{producto.nombre}</h1>
      <div className="row g-4">
        <div className="col-12 col-md-5">
          <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded shadow-sm" />
        </div>
        <div className="col-12 col-md-7">
          <dl className="row">
            <dt className="col-sm-4">Código</dt>
            <dd className="col-sm-8">{producto.id}</dd>
            <dt className="col-sm-4">Categoría</dt>
            <dd className="col-sm-8">{producto.categoria}</dd>
            <dt className="col-sm-4">Precio</dt>
            <dd className="col-sm-8">{precioTexto}</dd>
            <dt className="col-sm-4">Stock</dt>
            <dd className="col-sm-8">{producto.stock !== null ? producto.stock : 'No especificado'}</dd>
            <dt className="col-sm-4">Stock crítico</dt>
            <dd className="col-sm-8">{producto.stockCritico !== null ? producto.stockCritico : 'No definido'}</dd>
            <dt className="col-sm-4">Descripción</dt>
            <dd className="col-sm-8">{producto.descripcion}</dd>
          </dl>
          <Link to="/admin/productos" className="btn btn-outline-secondary me-2">Volver</Link>
          {sesion.tipo === 'Administrador' && (
            <Link to={`/admin/productos/${producto.id}/editar`} className="btn btn-success">Editar</Link>
          )}
        </div>
      </div>
    </>
  )
}

export default AdminProductoVer