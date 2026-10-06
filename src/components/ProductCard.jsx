import { useState } from 'react'
import { Link } from 'react-router-dom'
import { formatearPrecio } from '../utils/formatearPrecio'


function ProductCard({ producto, onAgregar }) {
  
  const [cantidad, setCantidad] = useState(1)

  const disponible = producto.precio !== null

  const manejarAgregar = () => {
    onAgregar(producto.id, cantidad)
    setCantidad(1)
  }

  return (
    <div className="card h-100 shadow-sm">
      <Link to={`/producto/${producto.id}`}>
        <img
          src={producto.imagen}
          className="card-img-top"
          alt={producto.nombre}
          style={{ height: '180px', objectFit: 'cover' }}
        />
      </Link>
      <div className="card-body d-flex flex-column">
        <span className="badge bg-success align-self-start mb-2">{producto.categoria}</span>
        <h2 className="h5 card-title">
          <Link to={`/producto/${producto.id}`} className="text-decoration-none text-dark">
            {producto.nombre}
          </Link>
        </h2>

        {disponible ? (
          <p className="fw-bold mb-3">
            {formatearPrecio(producto.precio)} <small className="text-muted">/ {producto.unidad}</small>
          </p>
        ) : (
          <p className="text-muted mb-3">Precio no disponible</p>
        )}

        <div className="mt-auto d-flex gap-2">
          <input
            type="number"
            min="1"
            className="form-control"
            style={{ maxWidth: '80px' }}
            value={cantidad}
            disabled={!disponible}
            onChange={(e) => setCantidad(Math.max(1, Number(e.target.value)))}
            aria-label={`Cantidad de ${producto.nombre}`}
          />
          <button className="btn btn-success flex-grow-1" disabled={!disponible} onClick={manejarAgregar}>
            Agregar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard