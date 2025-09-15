import { useAuth } from "../../state/AuthContext"
import { api } from "../../services/api"
import { useState, useEffect } from "react"
import UserSidebar from "../../components/UserSidebar"
import { useFavorites } from "../../state/FavoritesContext"   // 👈 importamos favoritos

export default function Profile() {
  const { user } = useAuth()
  const { favorites } = useFavorites()   // 👈 traemos favoritos en vivo
  const [stats, setStats] = useState({ publicaciones: 0, favoritos: 0 })

  // 🔹 Cargar estadísticas
  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get("/me/stats")
        setStats({
          publicaciones: data.publicaciones ?? 0,
          favoritos: data.favoritos ?? favorites.length   // fallback al contexto
        })
      } catch {
        setStats({ publicaciones: 0, favoritos: favorites.length })  // 👈 usamos contexto
      }
    }
    load()
  }, [favorites])   // 👈 se actualiza cada vez que cambien los favoritos

  if (!user) return null

  return (
    <div className="container py-4" style={{ backgroundColor: "rgb(207,242,199)" }}>
      {/* Sidebar horizontal */}
      <div className="mb-4">
        <UserSidebar />
      </div>

      {/* Contenido principal */}
      <h2 className="mb-4">Perfil de usuario</h2>
      <p className="lead">
        <strong>{user.nombre}</strong> <br />
        <span className="text-muted">{user.email}</span>
      </p>

      {/* Tarjetas de estadísticas */}
      <div className="row g-3 justify-content-center">
        <div className="col-12 col-md-4 col-lg-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <i className="bi bi-collection fs-2 text-primary"></i>
              <h5 className="mt-2">Publicaciones</h5>
              <p className="fw-bold">{stats.publicaciones}</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4 col-lg-3">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <i className="bi bi-heart fs-2 text-danger"></i>
              <h5 className="mt-2">Favoritos</h5>
              <p className="fw-bold">{stats.favoritos}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
