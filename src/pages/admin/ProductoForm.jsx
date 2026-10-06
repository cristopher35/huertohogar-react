import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CATEGORIAS } from '../../data/productos'
import { guardarProducto, obtenerProductoPorId } from '../../services/productosService'
import { validarProducto } from '../../utils/validaciones'

const FORMULARIO_VACIO = {
  codigo: '',
  nombre: '',
  descripcion: '',
  precio: '',
  unidad: '',
  stock: '',
  stockCritico: '',
  categoria: '',
  imagen: '',
}

// Convierte un producto guardado en los datos del formulario (todo como texto)
function productoADatos(p) {
  return {
    codigo: p.id,
    nombre: p.nombre,
    descripcion: p.descripcion || '',
    precio: p.precio !== null ? String(p.precio) : '',
    unidad: p.unidad || '',
    stock: p.stock !== null ? String(p.stock) : '',
    stockCritico: p.stockCritico !== null ? String(p.stockCritico) : '',
    categoria: p.categoria,
    imagen: p.imagen || '',
  }
}

function ProductoForm() {
  // Si la ruta trae ":id" estamos editando; si no, creando
  const { id } = useParams()
  const esEdicion = Boolean(id)
  const productoExistente = esEdicion ? obtenerProductoPorId(id) : null

  const [datos, setDatos] = useState(() =>
    productoExistente ? productoADatos(productoExistente) : FORMULARIO_VACIO
  )
  const [errores, setErrores] = useState({})
  const navigate = useNavigate()

  if (esEdicion && !productoExistente) {
    return (
      <>
        <h1 className="h3 mb-3">Producto no encontrado</h1>
        <Link to="/admin/productos" className="btn btn-success">Volver a productos</Link>
      </>
    )
  }

  const manejarCambio = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value })
  }

  const manejarEnvio = (e) => {
    e.preventDefault()

    const erroresValidacion = validarProducto(datos)
    // Al crear, el código no puede repetirse
    if (!esEdicion && !erroresValidacion.codigo && obtenerProductoPorId(datos.codigo.trim())) {
      erroresValidacion.codigo = 'Ya existe un producto con ese código.'
    }

    setErrores(erroresValidacion)
    if (Object.keys(erroresValidacion).length > 0) return

    guardarProducto({
      id: esEdicion ? id : datos.codigo.trim(),
      nombre: datos.nombre.trim(),
      categoria: datos.categoria,
      precio: Number(datos.precio),
      unidad: datos.unidad.trim() || null,
      stock: Number(datos.stock),
      stockCritico: datos.stockCritico !== '' ? Number(datos.stockCritico) : null,
      descripcion: datos.descripcion.trim(),
      imagen: datos.imagen.trim() || '/img/manzanas-fuji.jpg',
    })
    navigate('/admin/productos')
  }

  // Función auxiliar para no repetir el bloque de cada campo
  const campo = (nombre, etiqueta, tipo = 'text', extra = {}) => (
    <div className="col-12 col-md-6">
      <label htmlFor={nombre} className="form-label">{etiqueta}</label>
      <input
        id={nombre}
        name={nombre}
        type={tipo}
        className={`form-control ${errores[nombre] ? 'is-invalid' : ''}`}
        value={datos[nombre]}
        onChange={manejarCambio}
        {...extra}
      />
      {errores[nombre] && <div className="invalid-feedback">{errores[nombre]}</div>}
    </div>
  )

  return (
    <>
      <h1 className="h3 mb-3">{esEdicion ? 'Editar producto' : 'Nuevo producto'}</h1>

      <form onSubmit={manejarEnvio} noValidate>
        <div className="row g-3">
          {campo('codigo', 'Código de producto', 'text', { disabled: esEdicion })}
          {campo('nombre', 'Nombre')}
          {campo('precio', 'Precio (CLP)', 'number', { min: 0, step: 'any' })}
          {campo('unidad', 'Unidad de venta (ej: kilo)')}
          {campo('stock', 'Stock', 'number', { min: 0, step: 1 })}
          {campo('stockCritico', 'Stock crítico (opcional)', 'number', { min: 0, step: 1 })}

          <div className="col-12 col-md-6">
            <label htmlFor="categoria" className="form-label">Categoría</label>
            <select
              id="categoria"
              name="categoria"
              className={`form-select ${errores.categoria ? 'is-invalid' : ''}`}
              value={datos.categoria}
              onChange={manejarCambio}
            >
              <option value="">-- Seleccione la categoría --</option>
              {CATEGORIAS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errores.categoria && <div className="invalid-feedback">{errores.categoria}</div>}
          </div>

          {campo('imagen', 'Ruta de imagen (opcional, ej: /img/miel-organica.jpg)')}

          <div className="col-12">
            <label htmlFor="descripcion" className="form-label">Descripción (opcional)</label>
            <textarea
              id="descripcion"
              name="descripcion"
              rows="4"
              className={`form-control ${errores.descripcion ? 'is-invalid' : ''}`}
              value={datos.descripcion}
              onChange={manejarCambio}
            />
            {errores.descripcion && <div className="invalid-feedback">{errores.descripcion}</div>}
          </div>

          <div className="col-12 d-flex gap-2">
            <button type="submit" className="btn btn-success">Guardar producto</button>
            <Link to="/admin/productos" className="btn btn-outline-secondary">Cancelar</Link>
          </div>
        </div>
      </form>
    </>
  )
}

export default ProductoForm