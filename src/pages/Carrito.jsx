import { Link } from 'react-router-dom'
import { useCarrito } from '../context/CarritoContext'
import { obtenerProductoPorId } from '../services/productosService'
import { formatearPrecio } from '../utils/formatearPrecio'

function Carrito() {
  const { items, total, cambiarCantidad, quitar, vaciar } = useCarrito()

  if (items.length === 0) {
    return (
      <>
        <h1 className="h3 mb-3">Carrito de compras</h1>
        <p className="text-muted">Tu carrito está vacío.</p>
        <Link to="/catalogo" className="btn btn-success">Ir al catálogo</Link>
      </>
    )
  }

  return (
    <>
      <h1 className="h3 mb-3">Carrito de compras</h1>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th style={{ width: '110px' }}>Cantidad</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const producto = obtenerProductoPorId(item.id)
              const precio = producto.precio || 0
              return (
                <tr key={item.id}>
                  <td>{producto.nombre}</td>
                  <td>{formatearPrecio(precio)}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={item.cantidad}
                      onChange={(e) => cambiarCantidad(item.id, Number(e.target.value))}
                    />
                  </td>
                  <td>{formatearPrecio(precio * item.cantidad)}</td>
                  <td>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => quitar(item.id)}>
                      Quitar
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
        <button className="btn btn-outline-secondary" onClick={vaciar}>Vaciar carrito</button>
        <h2 className="h4 mb-0">Total: {formatearPrecio(total)}</h2>
      </div>
    </>
  )
}

export default Carrito