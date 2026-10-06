import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { CarritoProvider } from './context/CarritoProvider'
import Header from './components/Header'
import RutaProtegida from './components/RutaProtegida'

import Inicio from './pages/Inicio'
import Catalogo from './pages/Catalogo'
import DetalleProducto from './pages/DetalleProducto'
import Carrito from './pages/Carrito'
import Login from './pages/Login'
import Registro from './pages/Registro'

import AdminLayout from './pages/admin/AdminLayout'
import AdminInicio from './pages/admin/AdminInicio'
import AdminProductos from './pages/admin/AdminProductos'
import AdminProductoVer from './pages/admin/AdminProductoVer'
import ProductoForm from './pages/admin/ProductoForm'
import AdminUsuarios from './pages/admin/AdminUsuarios'
import AdminUsuarioVer from './pages/admin/AdminUsuarioVer'
import UsuarioForm from './pages/admin/UsuarioForm'

function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <BrowserRouter>
          <Header />
          <main className="container py-4">
            <Routes>
              {/* Rutas públicas de la tienda */}
              <Route path="/" element={<Inicio />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/producto/:id" element={<DetalleProducto />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Registro />} />

              {/* Panel de administración: Administrador y Vendedor */}
              <Route element={<RutaProtegida roles={['Administrador', 'Vendedor']} />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminInicio />} />
                  <Route path="productos" element={<AdminProductos />} />
                  <Route path="productos/:id" element={<AdminProductoVer />} />

                  {/* Solo Administrador: crear/editar productos y gestionar usuarios */}
                  <Route element={<RutaProtegida roles={['Administrador']} />}>
                    <Route path="productos/nuevo" element={<ProductoForm />} />
                    <Route path="productos/:id/editar" element={<ProductoForm />} />
                    <Route path="usuarios" element={<AdminUsuarios />} />
                    <Route path="usuarios/nuevo" element={<UsuarioForm />} />
                    <Route path="usuarios/:run" element={<AdminUsuarioVer />} />
                    <Route path="usuarios/:run/editar" element={<UsuarioForm />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </main>
        </BrowserRouter>
      </CarritoProvider>
    </AuthProvider>
  )
}

export default App