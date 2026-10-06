import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { obtenerProductos } from '../services/productosService'
import { useCarrito } from '../context/CarritoContext'
import { BLOGS } from '../data/blogs'

function Inicio() {
  const { agregar } = useCarrito()

  // Destacados: los primeros 4 productos que tienen precio
  const [destacados] = useState(() =>
    obtenerProductos().filter((p) => p.precio !== null).slice(0, 4)
  )

  return (
    <>
      <section className="bg-white rounded shadow-sm p-4 p-md-5 mb-4 text-center">
        <h1 className="display-5 text-success fw-bold">HuertoHogar</h1>
        <p className="lead">Frutas y verduras frescas del campo chileno, directo a tu puerta.</p>
        <Link to="/catalogo" className="btn btn-success btn-lg">Ver catálogo</Link>
      </section>

      <h2 className="h4 mb-3">Productos destacados</h2>
      <div className="row g-3 mb-4">
        {destacados.map((p) => (
          <div key={p.id} className="col-12 col-sm-6 col-lg-3">
            <ProductCard producto={p} onAgregar={agregar} />
          </div>
        ))}
      </div>

      <h2 className="h4 mb-3">Desde el blog</h2>
      <div className="row g-3">
        {BLOGS.map((b) => (
          <div key={b.id} className="col-12 col-md-6">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h3 className="h5">{b.titulo}</h3>
                <p className="card-text">{b.resumen}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Inicio