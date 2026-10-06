import { obtenerUsuarioPorCorreo } from './usuariosService.js';

const CLAVE = 'huertohogar_sesion';

// Devuelve true si las credenciales son correctas y guarda la sesión.
export function iniciarSesion(correo, password) {
  const usuario = obtenerUsuarioPorCorreo(correo);
  if (!usuario || usuario.password !== password) return false;
  const sesion = { correo: usuario.correo, nombre: usuario.nombre, tipo: usuario.tipo };
  localStorage.setItem(CLAVE, JSON.stringify(sesion));
  return true;
}

export function cerrarSesion() {
  localStorage.removeItem(CLAVE);
}

export function sesionActual() {
  const datos = localStorage.getItem(CLAVE);
  return datos ? JSON.parse(datos) : null;
}

// Reemplaza a requerirRol(): ya no redirige; solo responde si hay permiso.
// La redirección la hará un componente de ruta protegida en React Router.
export function tieneRol(rolesPermitidos) {
  const sesion = sesionActual();
  return !!sesion && rolesPermitidos.includes(sesion.tipo);
}
