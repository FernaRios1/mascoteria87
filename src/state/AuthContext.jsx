import { createContext, useContext, useEffect, useState } from "react"
import { api, setAuthToken } from "../services/api"

const AuthCtx = createContext()
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return setLoading(false)
    setAuthToken(token)
    api.get("/usuarios/me")
      .then(({ data }) => setUser(data))
      .catch(() => setAuthToken(null))
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    const { data } = await api.post("/auth/login", { email, password })
    setAuthToken(data.token)
    const me = await api.get("/usuarios/me")
    setUser(me.data)
  }

  async function register(nombre, email, password) {
    const { data } = await api.post("/auth/register", { nombre, email, password })
    setAuthToken(data.token)
    const me = await api.get("/usuarios/me")
    setUser(me.data)
  }

  function logout() {
    setUser(null)
    setAuthToken(null)
  }

  const value = { user, loading, login, register, logout }
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}
