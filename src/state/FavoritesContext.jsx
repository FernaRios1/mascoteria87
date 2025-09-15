import { createContext, useContext, useEffect, useState } from "react"
import { api } from "../services/api"
import { useAuth } from "./AuthContext"

const FavCtx = createContext()
export const useFavorites = () => useContext(FavCtx)

export function FavoritesProvider({ children }) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState([]) // array de publicaciones

  // 🔹 Cargar favoritos (según si hay user o no)
  useEffect(() => {
    async function load() {
      if (user) {
        try {
          const { data } = await api.get("/favoritos")
          setFavorites(data) // backend devuelve lista de publicaciones
        } catch (err) {
          console.error("Error cargando favoritos", err)
        }
      } else {
        // fallback localStorage
        const saved = localStorage.getItem("favorites")
        setFavorites(saved ? JSON.parse(saved) : [])
      }
    }
    load()
  }, [user])

  // 🔹 Guardar en backend o localStorage
  async function toggleFavorite(pubId) {
    if (user) {
      const exists = favorites.find((f) => f.id === pubId)
      if (exists) {
        try {
          await api.delete(`/favoritos/${pubId}`)
          setFavorites((prev) => prev.filter((f) => f.id !== pubId))
        } catch (err) {
          console.error("Error quitando favorito", err)
        }
      } else {
        try {
          const { data } = await api.post(`/favoritos/${pubId}`)
          setFavorites((prev) => [...prev, data])
        } catch (err) {
          console.error("Error agregando favorito", err)
        }
      }
    } else {
      // fallback en localStorage
      setFavorites((prev) => {
        const next = prev.includes(pubId)
          ? prev.filter((id) => id !== pubId)
          : [...prev, pubId]
        localStorage.setItem("favorites", JSON.stringify(next))
        return next
      })
    }
  }

  const value = { favorites, toggleFavorite }
  return <FavCtx.Provider value={value}>{children}</FavCtx.Provider>
}
