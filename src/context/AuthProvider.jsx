import { useState } from 'react'
import { AuthContext } from './AuthContext'
import { iniciarSesion, cerrarSesion, sesionActual } from '../services/authService'

export function AuthProvider({ children }) {
  // Estado de la sesión: null si nadie ha ingresado
  const [sesion, setSesion] = useState(() => sesionActual())

  const valor = {
    sesion,
    // Devuelve true si el login fue correcto
    ingresar: (correo, password) => {
      const exito = iniciarSesion(correo, password)
      if (!exito) return null
      const nueva = sesionActual()
      setSesion(nueva)
      return nueva
    },
    salir: () => {
      cerrarSesion()
      setSesion(null)
    },
  }

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}