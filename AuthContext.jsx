// File: src/state/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react"

const AuthCtx = createContext()
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 🔹 Recuperar usuario del localStorage en caso de recargar
    const storedUser = localStorage.getItem("mockUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  async function login(email, password) {
    // 🔹 Mock login (acepta cualquier email/contraseña)
    if (!email || !password) throw new Error("Credenciales inválidas")

    const fakeUser = {
      id: 1,
      nombre: "Usuario Demo",
      email,
    }

    setUser(fakeUser)
    localStorage.setItem("mockUser", JSON.stringify(fakeUser))
    return fakeUser
  }

  async function register(nombre, email, password) {
    // 🔹 Mock registro (genera un usuario "fake")
    if (!nombre || !email || !password) throw new Error("Datos inválidos")

    const fakeUser = {
      id: Date.now(),
      nombre,
      email,
    }

    setUser(fakeUser)
    localStorage.setItem("mockUser", JSON.stringify(fakeUser))
    return fakeUser
  }

  function logout() {
    setUser(null)
    localStorage.removeItem("mockUser")
  }

  const value = { user, loading, login, register, logout }
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}
