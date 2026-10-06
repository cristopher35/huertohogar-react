import { USUARIOS_SEED } from '../data/usuarios.js';

const CLAVE = 'huertohogar_usuarios';

export function obtenerUsuarios() {
  if (!localStorage.getItem(CLAVE)) {
    localStorage.setItem(CLAVE, JSON.stringify(USUARIOS_SEED));
  }
  return JSON.parse(localStorage.getItem(CLAVE));
}

export function obtenerUsuarioPorCorreo(correo) {
  return obtenerUsuarios().find((u) => u.correo.toLowerCase() === correo.toLowerCase()) || null;
}

export function obtenerUsuarioPorRun(run) {
  return obtenerUsuarios().find((u) => u.run === run) || null;
}

export function guardarUsuario(usuario) {
  const usuarios = obtenerUsuarios();
  const indice = usuarios.findIndex((u) => u.run === usuario.run);
  if (indice >= 0) usuarios[indice] = usuario;
  else usuarios.push(usuario);
  localStorage.setItem(CLAVE, JSON.stringify(usuarios));
}

export function eliminarUsuario(run) {
  const nuevos = obtenerUsuarios().filter((u) => u.run !== run);
  localStorage.setItem(CLAVE, JSON.stringify(nuevos));
}
