import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { api } from "../../services/api"
import { useCart } from "../../state/CartContext"

export default function Home() {
  const [data, setData] = useState({ items: [], total: 0 })
  const [q, setQ] = useState("")
  const [categoriaId, setCategoriaId] = useState("")
  const [categorias, setCategorias] = useState([])
  const [page, setPage] = useState(1)
  const { addItem } = useCart()
  const perPage = 8 // cantidad de productos por página

  useEffect(() => {
    api.get("/categorias").then(r => setCategorias(r.data))
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (categoriaId) params.set("categoria_id", categoriaId)
    params.set("page", page)
    params.set("limit", perPage)

    api.get(`/publicaciones?${params.toString()}`).then(r =>
      setData(r.data.items ? r.data : { items: r.data, total: r.data.length })
    )
  }, [q, categoriaId, page])

  const totalPages = Math.ceil(data.total / perPage)

  return (
    <div>
      {/* Hero con banner y overlay */}
      <div
        className="p-5 mb-4 text-white rounded-3 shadow-sm position-relative"
        style={{
          backgroundImage: "url('/img/hero-banner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "280px"
        }}
      >
        {/* Overlay semitransparente */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100 rounded-3"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)" // negro al 50% de opacidad
          }}
        ></div>

        {/* Contenido encima del overlay */}
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <h1 className="display-5 fw-bold">Mascotería G87</h1>
          <p className="col-md-8 fs-5">
            Todo lo que tu mascota necesita, en un solo lugar 🐾
          </p>
          <Link to="/categorias" className="btn btn-light btn-lg mt-2">
            Ver categorías
          </Link>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="row g-2 align-items-end mb-4">
        <div className="col-sm-6">
          <label className="form-label">Buscar</label>
          <input
            className="form-control"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar productos"
          />
        </div>
        <div className="col-sm-6">
          <label className="form-label">Categoría</label>
          <select
            className="form-select"
            value={categoriaId}
            onChange={e => setCategoriaId(e.target.value)}
          >
            <option value="">Todas</option>
            {categorias.map(c => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Productos */}
      <div className="row g-4 mb-4">
        {data.items.map(p => (
          <div
            key={p.id}
            className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex"
          >
            <div className="card h-100 shadow-sm w-100">
              <img
                src={p.imagen_url || "/img/placeholder.jpg"}
                alt={p.titulo}
                className="card-img-top"
                style={{ height: "180px", objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{p.titulo}</h5>
                <p className="card-text small flex-grow-1">
                  {p.descripcion || "—"}
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-bold">${p.precio}</span>
                  <div className="btn-group">
                    <Link
                      className="btn btn-sm btn-outline-primary"
                      to={`/producto/${p.id}`}
                    >
                      Detalle
                    </Link>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => addItem(p)}
                    >
                      Añadir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {data.items.length === 0 && (
          <p className="text-muted">No hay productos para mostrar</p>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                «
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${page === i + 1 ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                »
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  )
}
