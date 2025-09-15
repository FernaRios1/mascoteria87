import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { api } from "../../services/api"

export default function Categories() {
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    api.get("/categorias").then(({ data }) => setCategorias(data))
  }, [])

  return (
    <div style={{ backgroundColor: "rgb(207,242,199)" }}>
      <div className="container py-5">
        <h2 className="mb-4">Categorías</h2>
        <div className="row g-3">
          {categorias.map((c) => (
            <div className="col-6 col-md-4 col-lg-3" key={c.id}>
              <Link to={`/categorias/${c.id}`} className="text-decoration-none">
                <div className="card h-100 shadow-sm text-center p-4">
                  <i className={`bi bi-tags fs-1 text-primary`}></i>
                  <h5 className="mt-2">{c.nombre}</h5>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
