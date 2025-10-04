// src/pages/private/EditPublication.jsx
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { api } from "../../services/api"

export default function EditPublication() {
  const { id } = useParams()
  const nav = useNavigate()

  const [titulo, setTitulo] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [precio, setPrecio] = useState("")
  const [stock, setStock] = useState(0)
  const [categorias, setCategorias] = useState([])
  const [selected, setSelected] = useState([])
  const [file, setFile] = useState(null)

  useEffect(() => {
    api.get("/categorias").then(({ data }) => setCategorias(data))
    api.get(`/publicaciones/${id}`).then(({ data: pub }) => {
      setTitulo(pub.titulo)
      setDescripcion(pub.descripcion)
      setPrecio(pub.precio)
      setStock(pub.stock)
      setSelected(pub.categorias?.map((c) => String(c.id)) || [])
    })
  }, [id])

  function toggleCat(catId) {
    setSelected((prev) =>
      prev.includes(catId) ? prev.filter((x) => x !== catId) : [...prev, catId]
    )
  }

  async function onSubmit(e) {
    e.preventDefault()

    const fd = new FormData()
    fd.append("titulo", titulo)
    fd.append("descripcion", descripcion)
    fd.append("precio", Number(precio))
    fd.append("stock", Number(stock))
    selected.forEach((cid) => fd.append("categoria_ids[]", cid))
    if (file) fd.append("imagen", file)

    await api.put(`/publicaciones/${id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    })

    alert("✅ Publicación actualizada")
    nav("/mis-publicaciones")
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Editar publicación</h2>
      <form onSubmit={onSubmit} className="vstack gap-3">
        <input
          className="form-control"
          placeholder="Nombre del producto"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <textarea
          className="form-control"
          placeholder="Descripción del producto"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <div className="row g-2">
          <div className="col-sm-4">
            <input
              className="form-control"
              type="number"
              step="0.01"
              placeholder="Precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
            />
          </div>
          <div className="col-sm-4">
            <input
              className="form-control"
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="form-label">Cambiar imagen</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <div>
          <div className="form-label">Categorías</div>
          <div className="d-flex flex-wrap gap-2">
            {categorias.map((c) => (
              <label
                key={c.id}
                className="badge rounded-pill text-bg-light border p-2"
              >
                <input
                  type="checkbox"
                  className="form-check-input me-2"
                  checked={selected.includes(String(c.id))}
                  onChange={() => toggleCat(String(c.id))}
                />
                {c.nombre}
              </label>
            ))}
          </div>
        </div>

        <button className="btn btn-success">Guardar cambios</button>
      </form>
    </div>
  )
}
