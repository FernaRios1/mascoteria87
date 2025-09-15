// src/pages/public/CategoryDetail.jsx
import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { api } from "../../services/api"
import Card from "../../components/Card"

export default function CategoryDetail() {
  const { id } = useParams()
  const [categoria, setCategoria] = useState(null)
  const [productos, setProductos] = useState([])

  useEffect(() => {
    api.get(`/categorias/${id}`)
      .then(({ data }) => setCategoria(data))
      .catch(() => setCategoria({ id, nombre: "Categoría desconocida" }))

    api
      .get(`/publicaciones?categoria_id=${id}`)
      .then(({ data }) => setProductos(data.items || data))
      .catch(() => setProductos([]))
  }, [id])

  return (
    <div style={{ backgroundColor: "rgb(207,242,199)" }}>
      <div className="container py-5">
        <h2 className="mb-4">
          Productos en categoría:{" "}
          <span className="text-primary">{categoria?.nombre}</span>
        </h2>

        <div className="row g-4">
          {productos.length > 0 ? (
            productos.map((p) => (
              <div
                key={p.id}
                className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex"
              >
                <Card producto={p} />
              </div>
            ))
          ) : (
            <p className="text-muted">No hay productos en esta categoría.</p>
          )}
        </div>
      </div>
    </div>
  )
}
