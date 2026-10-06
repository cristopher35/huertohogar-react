import { useState } from 'react'
import ProductCard from '../components/ProductCard'
import { obtenerProductos } from '../services/productosService'
import { useCarrito } from '../context/CarritoContext' // CAMBIO 1
import { CATEGORIAS } from '../data/productos'

function Catalogo() {
  // Estados de la página
  const [productos] = useState(() => obtenerProductos())
  const [categoria, setCategoria] = useState('Todas')
  const [busqueda, setBusqueda] = useState('')
  const [mensaje, setMensaje] = useState('')
  const { agregar } = useCarrito() // CAMBIO 2

  // Lista derivada: se recalcula sola cuando cambia un estado
  const productosFiltrados = productos.filter((p) => {
    const coincideCategoria = categoria === 'Todas' || p.categoria === categoria
    const coincideBusqueda = p.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return coincideCategoria && coincideBusqueda
  })

  const manejarAgregar = (id, cantidad) => {
    agregar(id, cantidad) // CAMBIO 3
    const producto = productos.find((p) => p.id === id)
    setMensaje(`${cantidad} x ${producto.nombre} agregado al carrito`)
  }

  return (
    <>
      <h1 className="h3 mb-3">Catálogo de productos</h1>

      <div className="row g-2 mb-3">
        <div className="col-12 col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="col-12 col-md-6">
          <select className="form-select" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="Todas">Todas las categorías</option>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {mensaje && <div className="alert alert-success py-2">{mensaje}</div>}

      <div className="row g-3">
        {productosFiltrados.map((p) => (
          <div key={p.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
            <ProductCard producto={p} onAgregar={manejarAgregar} />
          </div>
        ))}
        {productosFiltrados.length === 0 && <p className="text-muted">No se encontraron productos.</p>}
      </div>
    </>
  )
}

export default Catalogo