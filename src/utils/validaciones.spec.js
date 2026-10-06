import {
  validarRun,
  correoEsValido,
  correoTerminaEnDominioValido,
  correoTieneFormatoBasico,
  telefonoTieneFormatoValido,
  passwordEsValida,
  validarRegistro,
  validarLogin,
  validarContacto,
  validarProducto,
  validarUsuarioAdmin,
  MSG_CORREO,
  MSG_PASSWORD,
} from './validaciones'

describe('validarRun', () => {
  it('acepta un RUN con dígito verificador numérico', () => {
    expect(validarRun('12345678-5')).toBe(true)
  })

  it('acepta un RUN con dígito verificador K (mayúscula o minúscula)', () => {
    expect(validarRun('10000013-K')).toBe(true)
    expect(validarRun('10000013-k')).toBe(true)
  })

  it('acepta el RUN con puntos, con guion o sin ellos', () => {
    expect(validarRun('12.345.678-5')).toBe(true)
    expect(validarRun('123456785')).toBe(true)
  })

  it('rechaza un dígito verificador incorrecto', () => {
    expect(validarRun('12345678-9')).toBe(false)
  })

  it('rechaza RUN demasiado cortos o demasiado largos', () => {
    expect(validarRun('123456')).toBe(false)
    expect(validarRun('1234567890')).toBe(false)
  })

  it('rechaza RUN con letras en el cuerpo o vacíos', () => {
    expect(validarRun('12A45678-5')).toBe(false)
    expect(validarRun('')).toBe(false)
  })
})

describe('correos', () => {
  it('acepta los tres dominios permitidos', () => {
    expect(correoEsValido('ana@duoc.cl')).toBe(true)
    expect(correoEsValido('ana@profesor.duoc.cl')).toBe(true)
    expect(correoEsValido('ana@gmail.com')).toBe(true)
  })

  it('rechaza dominios no permitidos', () => {
    expect(correoTerminaEnDominioValido('ana@hotmail.com')).toBe(false)
    expect(correoEsValido('ana@hotmail.com')).toBe(false)
  })

  it('rechaza un correo vacío o sin formato básico', () => {
    expect(correoEsValido('')).toBe(false)
    expect(correoTieneFormatoBasico('sinarroba.com')).toBe(false)
    expect(correoTieneFormatoBasico('@gmail.com')).toBe(false)
  })

  it('rechaza un correo de más de 100 caracteres', () => {
    const largo = 'a'.repeat(95) + '@gmail.com'
    expect(correoEsValido(largo)).toBe(false)
  })
})

describe('teléfono y contraseña', () => {
  it('acepta teléfonos con espacios y signo +', () => {
    expect(telefonoTieneFormatoValido('+56 9 1234 5678')).toBe(true)
  })

  it('rechaza teléfonos con letras o muy cortos', () => {
    expect(telefonoTieneFormatoValido('abcdefgh')).toBe(false)
    expect(telefonoTieneFormatoValido('1234')).toBe(false)
  })

  it('exige contraseñas de 4 a 10 caracteres', () => {
    expect(passwordEsValida('abc')).toBe(false)
    expect(passwordEsValida('abcd')).toBe(true)
    expect(passwordEsValida('abcdefghij')).toBe(true)
    expect(passwordEsValida('abcdefghijk')).toBe(false)
  })
})

describe('validarRegistro', () => {
  const datosValidos = {
    run: '12345678-5',
    nombre: 'Ana',
    apellidos: 'Pérez Soto',
    email: 'ana@gmail.com',
    password: 'clave1',
    password2: 'clave1',
    telefono: '',
    region: 'Región del Biobío',
    comuna: 'Concepción',
    direccion: 'Calle 123',
  }

  it('no devuelve errores con datos válidos', () => {
    expect(validarRegistro(datosValidos)).toEqual({})
  })

  it('devuelve un error por cada campo obligatorio vacío', () => {
    const vacio = {
      run: '', nombre: '', apellidos: '', email: '', password: '',
      password2: '', telefono: '', region: '', comuna: '', direccion: '',
    }
    const errores = validarRegistro(vacio)
    expect(Object.keys(errores).sort()).toEqual(
      ['apellidos', 'comuna', 'direccion', 'email', 'nombre', 'password', 'password2', 'region', 'run']
    )
  })

  it('detecta contraseñas que no coinciden', () => {
    const errores = validarRegistro({ ...datosValidos, password2: 'otra' })
    expect(errores.password2).toBe('Las contraseñas no coinciden.')
  })

  it('el teléfono es opcional pero se valida si se escribe', () => {
    expect(validarRegistro({ ...datosValidos, telefono: '' }).telefono).toBeUndefined()
    expect(validarRegistro({ ...datosValidos, telefono: 'xx' }).telefono).toBeDefined()
  })
})

describe('validarLogin', () => {
  it('acepta correo y contraseña válidos', () => {
    expect(validarLogin({ email: 'ana@gmail.com', password: 'clave1' })).toEqual({})
  })

  it('devuelve los mensajes estándar cuando los datos son inválidos', () => {
    const errores = validarLogin({ email: 'ana@hotmail.com', password: '1' })
    expect(errores.email).toBe(MSG_CORREO)
    expect(errores.password).toBe(MSG_PASSWORD)
  })
})

describe('validarContacto', () => {
  it('exige nombre, correo y comentario', () => {
    const errores = validarContacto({ nombre: '', email: '', comentario: '' })
    expect(Object.keys(errores).sort()).toEqual(['comentario', 'email', 'nombre'])
  })

  it('rechaza comentarios de más de 500 caracteres', () => {
    const errores = validarContacto({
      nombre: 'Ana', email: 'ana@gmail.com', comentario: 'x'.repeat(501),
    })
    expect(errores.comentario).toBeDefined()
  })
})

describe('validarProducto', () => {
  const producto = {
    codigo: 'FR010', nombre: 'Peras', descripcion: '', precio: '900',
    unidad: 'kilo', stock: '20', stockCritico: '', categoria: 'Frutas Frescas', imagen: '',
  }

  it('acepta un producto válido', () => {
    expect(validarProducto(producto)).toEqual({})
  })

  it('rechaza precio negativo y stock decimal', () => {
    const errores = validarProducto({ ...producto, precio: '-5', stock: '2.5' })
    expect(errores.precio).toBeDefined()
    expect(errores.stock).toBeDefined()
  })

  it('exige código de al menos 3 caracteres y una categoría', () => {
    const errores = validarProducto({ ...producto, codigo: 'AB', categoria: '' })
    expect(errores.codigo).toBeDefined()
    expect(errores.categoria).toBeDefined()
  })
})

describe('validarUsuarioAdmin', () => {
  const usuario = {
    run: '12345678-5', nombre: 'Ana', apellidos: 'Pérez', correo: 'ana@gmail.com',
    password: 'clave1', password2: 'clave1', tipo: 'Cliente', direccion: 'Calle 1',
  }

  it('acepta un usuario nuevo válido', () => {
    expect(validarUsuarioAdmin(usuario, true)).toEqual({})
  })

  it('al crear, exige contraseña', () => {
    const errores = validarUsuarioAdmin({ ...usuario, password: '', password2: '' }, true)
    expect(errores.password).toBeDefined()
  })

  it('al editar, permite dejar la contraseña en blanco', () => {
    const errores = validarUsuarioAdmin({ ...usuario, password: '', password2: '' }, false)
    expect(errores.password).toBeUndefined()
    expect(errores.password2).toBeUndefined()
  })

  it('al editar, valida la contraseña si se escribe una nueva', () => {
    const errores = validarUsuarioAdmin({ ...usuario, password: 'ab', password2: 'ab' }, false)
    expect(errores.password).toBeDefined()
  })

  it('exige un tipo de usuario', () => {
    expect(validarUsuarioAdmin({ ...usuario, tipo: '' }, true).tipo).toBeDefined()
  })
})