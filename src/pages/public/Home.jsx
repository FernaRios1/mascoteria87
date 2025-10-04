import React, { useEffect, useState } from "react"
import Card from "../../components/Card"
import { api } from "../../services/api"

export default function Home() {
  const [productos, setProductos] = useState([])
  const [page, setPage] = useState(1)
  const perPage = 12
  const [total, setTotal] = useState(0)

  useEffect(() => {
    api.get(`/publicaciones?page=${page}&limit=${perPage}`)
      .then(({ data }) => {
        // El contrato puede devolver { items, total } o un array simple
        setProductos(data.items || data)
        setTotal(data.total || (data.items ? data.items.length : data.length))
      })
      .catch(() => {
        setProductos([])
        setTotal(0)
      })
  }, [page])

  const totalPages = Math.ceil(total / perPage)

  return (
    <div style={{ backgroundColor: "rgb(207,242,199)" }}>
      {/* Hero */}
      <div
        className="w-100 text-white position-relative d-flex align-items-center justify-content-center"
        style={{
          backgroundImage: "url('/img/hero-banner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "400px",
          width: "100vw"
        }}
      >
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        ></div>
        <div className="text-center position-relative" style={{ zIndex: 1 }}>
          <h1 className="display-4 fw-bold">Mascotería G87</h1>
          <p className="fs-5">
            Todo lo que tu mascota necesita, en un solo lugar 🐾
          </p>
          <a href="#productos" className="btn btn-dark btn-lg mt-3">
            Revisar productos
          </a>
        </div>
      </div>

      {/* Productos */}
      <div id="productos" className="container py-4">
        <div className="row g-4">
          {productos.map((p) => (
            <div key={p.id} className="col-12 col-sm-6 col-md-4 d-flex">
              <Card producto={p} />
            </div>
          ))}
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <nav className="mt-4">
            <ul className="pagination justify-content-center">
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
            </ul>
          </nav>
        )}
      </div>
    </div>
  )
}
