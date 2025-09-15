// src/pages/private/CreatePublication.jsx
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { api } from "../../services/api"
import UserSidebar from "../../components/UserSidebar"

const schema = yup.object({
  titulo: yup.string().required("El título es obligatorio"),
  descripcion: yup.string().required("La descripción es obligatoria"),
  precio: yup
    .number()
    .typeError("Debe ser un número")
    .positive("Debe ser mayor a 0")
    .required(),
  stock: yup.number().typeError("Debe ser un número").min(0).required(),
  categorias: yup.array().min(1, "Selecciona al menos una categoría"),
})

export default function CreatePublication() {
  const [file, setFile] = useState(null)
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    api.get("/categorias").then(({ data }) => setCategorias(data))
  }, [])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { categorias: [] },
  })

  async function onSubmit(values) {
    const fd = new FormData()
    fd.append("titulo", values.titulo)
    fd.append("descripcion", values.descripcion)
    fd.append("precio", values.precio)
    fd.append("stock", values.stock)
    values.categorias.forEach((id) => fd.append("categoria_ids[]", id))
    if (file) fd.append("imagen", file)

    await api.post("/publicaciones", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    alert("✅ Publicación creada")
  }

  function toggleCat(id) {
    const current = watch("categorias")
    if (current.includes(id)) {
      setValue("categorias", current.filter((x) => x !== id))
    } else {
      setValue("categorias", [...current, id])
    }
  }

  return (
    <div style={{ backgroundColor: "rgb(207,242,199)" }}>
      <div className="container py-4">
        <div className="mb-4">
          <UserSidebar />
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2>Crear publicación</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="vstack gap-3">
              <input
                className="form-control"
                placeholder="Nombre del producto"
                {...register("titulo")}
              />
              {errors.titulo && (
                <p className="text-danger small">{errors.titulo.message}</p>
              )}

              <textarea
                className="form-control"
                placeholder="Descripción del producto"
                {...register("descripcion")}
              />
              {errors.descripcion && (
                <p className="text-danger small">{errors.descripcion.message}</p>
              )}

              <div className="row g-2">
                <div className="col-sm-4">
                  <input
                    className="form-control"
                    placeholder="Precio"
                    type="number"
                    step="0.01"
                    {...register("precio")}
                  />
                  {errors.precio && (
                    <p className="text-danger small">{errors.precio.message}</p>
                  )}
                </div>
                <div className="col-sm-4">
                  <input
                    className="form-control"
                    placeholder="Stock"
                    type="number"
                    {...register("stock")}
                  />
                  {errors.stock && (
                    <p className="text-danger small">{errors.stock.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="form-label">Imagen</label>
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
                        checked={watch("categorias").includes(String(c.id))}
                        onChange={() => toggleCat(String(c.id))}
                      />
                      {c.nombre}
                    </label>
                  ))}
                </div>
                {errors.categorias && (
                  <p className="text-danger small">{errors.categorias.message}</p>
                )}
              </div>

              <button className="btn btn-success">Publicar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
