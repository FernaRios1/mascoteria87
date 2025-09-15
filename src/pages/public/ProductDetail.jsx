import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { api } from "../../services/api"
import CardDetail from "../../components/CardDetail"
import { useAuth } from "../../state/AuthContext"

export default function ProductDetail() {
  const { id } = useParams()
  const [p, setP] = useState(null)
  const { user } = useAuth()

  // Estado de comentarios
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState("")

  // Cargar producto
  useEffect(() => {
    api.get(`/publicaciones/${id}`)
      .then(({ data }) => setP(data))
      .catch(() =>
        setP({
          id,
          titulo: "Producto demo",
          descripcion: "Descripción de prueba",
          precio: 99,
          stock: 5,
          categorias: [{ id: 1, nombre: "Accesorios" }],
          imagen_url: "/img/placeholder.jpg",
        })
      )
  }, [id])

  // Cargar comentarios
  useEffect(() => {
    api.get(`/publicaciones/${id}/comentarios`)
      .then(({ data }) => setComments(data))
      .catch(() => setComments([]))
  }, [id])

  async function handleAddComment(e) {
    e.preventDefault()
    if (!newComment.trim()) return
    try {
      const { data } = await api.post(`/publicaciones/${id}/comentarios`, {
        texto: newComment,
      })
      setComments([...comments, data])
      setNewComment("")
    } catch (err) {
      console.error("Error creando comentario", err)
    }
  }

  async function handleDeleteComment(commentId) {
    try {
      await api.delete(`/comentarios/${commentId}`)
      setComments(comments.filter((c) => c.id !== commentId))
    } catch (err) {
      console.error("Error eliminando comentario", err)
    }
  }

  if (!p) return <div className="container py-5">Cargando…</div>

  return (
    <div style={{ backgroundColor: "rgb(207,242,199)" }}>
      <div className="container py-5">
        <CardDetail producto={p} />

        {/* Comentarios */}
        <div className="mt-5">
          <h4>Comentarios</h4>

          {comments.length === 0 && (
            <p className="text-muted">Todavía no hay comentarios.</p>
          )}

          <ul className="list-group mb-3">
            {comments.map((c) => (
              <li
                key={c.id}
                className="list-group-item d-flex justify-content-between align-items-start"
              >
                <div>
                  <strong>{c.usuario?.nombre || "Usuario"}</strong>{" "}
                  <span className="text-muted small">
                    ({new Date(c.fecha).toLocaleString()})
                  </span>
                  <p className="mb-0">{c.texto}</p>
                </div>
                {user && user.id === c.usuario_id && (
                  <button
                    className="btn btn-sm btn-outline-danger ms-3"
                    onClick={() => handleDeleteComment(c.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                )}
              </li>
            ))}
          </ul>

          {user && (
            <form onSubmit={handleAddComment} className="d-flex gap-2">
              <input
                type="text"
                className="form-control"
                placeholder="Escribe un comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <button className="btn btn-success" type="submit">
                Comentar
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
