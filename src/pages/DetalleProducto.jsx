import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { obtenerProductoPorId } from '../services/productosService'
import { useCarrito } from '../context/CarritoContext'
import { formatearPrecio } from '../utils/formatearPrecio'

function DetalleProducto() {
  // useParams lee el valor de ":id" desde la dirección (/producto/FR001)
  const { id } = useParams()
  const producto = obtenerProductoPorId(id)

  const [cantidad, setCantidad] = useState(1)
  const [mensaje, setMensaje] = useState('')
  const { agregar } = useCarrito()

  if (!producto) {
    return (
      <>
        <h1 className="h3 mb-3">Producto no encontrado</h1>
        <Link to="/catalogo" className="btn btn-success">Volver al catálogo</Link>
      </>
    )
  }

  const disponible = producto.precio !== null

  const manejarAgregar = () => {
    agregar(producto.id, cantidad)
    setMensaje(`${cantidad} x ${producto.nombre} agregado al carrito`)
    setCantidad(1)
  }

  return (
    <>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/catalogo">Catálogo</Link></li>
          <li className="breadcrumb-item active" aria-current="page">{producto.nombre}</li>
        </ol>
      </nav>

      <div className="row g-4">
        <div className="col-12 col-md-6">
          <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded shadow-sm" />
        </div>

        <div className="col-12 col-md-6">
          <span className="badge bg-success mb-2">{producto.categoria}</span>
          <h1 className="h3">{producto.nombre}</h1>
          <p>{producto.descripcion}</p>

          {disponible ? (
            <>
              <p className="h4">
                {formatearPrecio(producto.precio)} <small className="text-muted fs-6">/ {producto.unidad}</small>
              </p>
              <p className="text-muted">Stock disponible: {producto.stock}</p>
            </>
          ) : (
            <p className="text-muted">Precio y stock no disponibles.</p>
          )}

          <div className="d-flex gap-2 mb-3" style={{ maxWidth: '320px' }}>
            <input
              type="number"
              min="1"
              className="form-control"
              style={{ maxWidth: '90px' }}
              value={cantidad}
              disabled={!disponible}
              onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
              aria-label="Cantidad"
            />
            <button className="btn btn-success flex-grow-1" disabled={!disponible} onClick={manejarAgregar}>
              Agregar al carrito
            </button>
          </div>

          {mensaje && <div className="alert alert-success py-2">{mensaje}</div>}
        </div>
      </div>
    </>
  )
}

export default DetalleProducto