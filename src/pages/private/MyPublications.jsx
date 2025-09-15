import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../../services/api"
import UserSidebar from "../../components/UserSidebar"
import Card from "../../components/Card"

export default function MyPublications() {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const nav = useNavigate()
  const perPage = 12
  const totalPages = Math.ceil(items.length / perPage)

  useEffect(() => {
    api.get("/mis-publicaciones")
      .then(r => setItems(r.data.items || r.data))
      .catch(() => setItems([]))
  }, [])

  async function onDelete(id) {
    if (!confirm("¿Eliminar publicación?")) return
    await api.delete(`/publicaciones/${id}`)
    setItems(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div style={{ backgroundColor: "rgb(207,242,199)" }}>
      <div className="container py-4">
        <div className="mb-4">
          <UserSidebar />
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2>Mis publicaciones</h2>
          <Link to="/publicar" className="btn btn-success">Crear publicación</Link>
        </div>

        {items.length === 0 ? (
          <p className="text-muted">No has creado publicaciones todavía.</p>
        ) : (
          <>
            <div className="row g-4">
              {items.slice((page - 1) * perPage, page * perPage).map(p => (
                <div key={p.id} className="col-12 col-sm-6 col-md-4 d-flex">
                  <Card
                    producto={p}
                    onEdit={() => nav(`/publicaciones/${p.id}/editar`)}
                    onDelete={() => onDelete(p.id)}
                  />
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li key={i} className={`page-item ${page === i + 1 ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setPage(i + 1)}>
                        {i + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  )
}
