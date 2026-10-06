// Validaciones puras (sin DOM): reciben datos y devuelven resultados.
// Migrado desde js/validacion.js. En React, cada formulario guarda los
// errores en un estado y los muestra junto a cada campo.

export const DOMINIOS_VALIDOS = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];

export const MSG_CORREO =
  'Correo requerido, máximo 100 caracteres, solo @duoc.cl, @profesor.duoc.cl o @gmail.com.';
export const MSG_PASSWORD = 'La contraseña debe tener entre 4 y 10 caracteres.';

export function correoTerminaEnDominioValido(correo) {
  return DOMINIOS_VALIDOS.some((dominio) => correo.endsWith(dominio));
}

export function correoTieneFormatoBasico(correo) {
  const arroba = correo.indexOf('@');
  if (arroba <= 0) return false;
  return correo.indexOf('.', arroba) !== -1;
}

export function correoEsValido(correo) {
  return (
    correo !== '' &&
    correo.length <= 100 &&
    correoTieneFormatoBasico(correo) &&
    correoTerminaEnDominioValido(correo)
  );
}

export function telefonoTieneFormatoValido(telefono) {
  const soloDigitos = telefono.replace(/[ +]/g, '');
  if (soloDigitos.length < 8 || soloDigitos.length > 15) return false;
  return /^[0-9]+$/.test(soloDigitos);
}

// Valida RUN chileno sin puntos ni guion (ej: 190110222) con dígito verificador.
export function validarRun(runCompleto) {
  const limpio = runCompleto.replace(/\./g, '').replace(/-/g, '').toUpperCase();
  if (limpio.length < 7 || limpio.length > 9) return false;
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  if (!/^[0-9]+$/.test(cuerpo)) return false;

  let suma = 0;
  let multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }
  const resto = 11 - (suma % 11);
  let dvEsperado;
  if (resto === 11) dvEsperado = '0';
  else if (resto === 10) dvEsperado = 'K';
  else dvEsperado = String(resto);
  return dv === dvEsperado;
}

export function passwordEsValida(password) {
  return password.length >= 4 && password.length <= 10;
}

// Cada función devuelve un objeto { campo: 'mensaje de error' }.
// Si el objeto viene vacío, el formulario es válido.

export function validarRegistro(datos) {
  const e = {};
  if (!validarRun(datos.run.trim()))
    e.run = 'RUN inválido. Ingresa sin puntos ni guion, ej: 190110222.';
  const nombre = datos.nombre.trim();
  if (nombre === '' || nombre.length > 50) e.nombre = 'Nombre requerido (máximo 50 caracteres).';
  const apellidos = datos.apellidos.trim();
  if (apellidos === '' || apellidos.length > 100)
    e.apellidos = 'Apellidos requeridos (máximo 100 caracteres).';
  if (!correoEsValido(datos.email.trim())) e.email = MSG_CORREO;
  if (!passwordEsValida(datos.password)) e.password = MSG_PASSWORD;
  if (datos.password2 === '' || datos.password2 !== datos.password)
    e.password2 = 'Las contraseñas no coinciden.';
  const telefono = datos.telefono.trim();
  if (telefono !== '' && !telefonoTieneFormatoValido(telefono))
    e.telefono = 'Ingresa un número de contacto válido (opcional).';
  if (datos.region === '') e.region = 'Selecciona una región.';
  if (datos.comuna === '') e.comuna = 'Selecciona una comuna.';
  const direccion = datos.direccion.trim();
  if (direccion === '' || direccion.length > 300)
    e.direccion = 'Dirección requerida (máximo 300 caracteres).';
  return e;
}

export function validarLogin(datos) {
  const e = {};
  if (!correoEsValido(datos.email.trim())) e.email = MSG_CORREO;
  if (!passwordEsValida(datos.password)) e.password = MSG_PASSWORD;
  return e;
}

export function validarContacto(datos) {
  const e = {};
  const nombre = datos.nombre.trim();
  if (nombre === '' || nombre.length > 100) e.nombre = 'Nombre requerido (máximo 100 caracteres).';
  if (!correoEsValido(datos.email.trim())) e.email = MSG_CORREO;
  const comentario = datos.comentario.trim();
  if (comentario === '' || comentario.length > 500)
    e.comentario = 'Comentario requerido (máximo 500 caracteres).';
  return e;
}

export function validarProducto(datos) {
  const e = {}
  if (datos.codigo.trim().length < 3) e.codigo = 'El código debe tener al menos 3 caracteres.'

  const nombre = datos.nombre.trim()
  if (nombre === '' || nombre.length > 100) e.nombre = 'Nombre requerido (máximo 100 caracteres).'

  if (datos.descripcion.trim().length > 500) e.descripcion = 'Máximo 500 caracteres.'

  if (datos.precio === '' || Number(datos.precio) < 0)
    e.precio = 'El precio es requerido y no puede ser negativo.'

  if (datos.stock === '' || !Number.isInteger(Number(datos.stock)) || Number(datos.stock) < 0)
    e.stock = 'El stock es requerido, debe ser un número entero mayor o igual a 0.'

  if (
    datos.stockCritico !== '' &&
    (!Number.isInteger(Number(datos.stockCritico)) || Number(datos.stockCritico) < 0)
  )
    e.stockCritico = 'El stock crítico debe ser un número entero mayor o igual a 0.'

  if (datos.categoria === '') e.categoria = 'Selecciona una categoría.'
  return e
}

export function validarUsuarioAdmin(datos, esNuevo) {
  const e = {}
  if (!validarRun(datos.run.trim()))
    e.run = 'RUN inválido. Ingresa sin puntos ni guion, ej: 190110222.'

  const nombre = datos.nombre.trim()
  if (nombre === '' || nombre.length > 50) e.nombre = 'Nombre requerido (máximo 50 caracteres).'

  const apellidos = datos.apellidos.trim()
  if (apellidos === '' || apellidos.length > 100)
    e.apellidos = 'Apellidos requeridos (máximo 100 caracteres).'

  if (!correoEsValido(datos.correo.trim())) e.correo = MSG_CORREO
  if (datos.tipo === '') e.tipo = 'Selecciona un tipo de usuario.'

  const direccion = datos.direccion.trim()
  if (direccion === '' || direccion.length > 300)
    e.direccion = 'Dirección requerida (máximo 300 caracteres).'

  // Al editar, la contraseña solo se valida si se escribió una nueva
  if (esNuevo || datos.password !== '') {
    if (!passwordEsValida(datos.password)) e.password = MSG_PASSWORD
    if (datos.password2 !== datos.password) e.password2 = 'Las contraseñas no coinciden.'
  }
  return e
}