// src/pages/private/CreatePublication.jsx
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { api } from "../../services/api"
import UserSidebar from "../../components/UserSidebar"
import { useNavigate } from "react-router-dom"

const schema = yup.object({
  titulo: yup.string().required("El título es obligatorio"),
  descripcion: yup.string().required("La descripción es obligatoria"),
  precio: yup.number().typeError("Debe ser un número").positive("Debe ser mayor a 0").required(),
  stock: yup.number().typeError("Debe ser un número").min(0).required(),
  categorias: yup.array().min(1, "Selecciona al menos una categoría"),
})

export default function CreatePublication() {
  const [file, setFile] = useState(null)
  const [categorias, setCategorias] = useState([])
  const nav = useNavigate()

  useEffect(() => {
    api.get("/categorias").then(({ data }) => setCategorias(data))
  }, [])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,                              // ✅ IMPORTANTE
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { categorias: [] },
  })

  async function onSubmit(values) {
    try {
      // asegurar número
      const categoriaId = Number(values.categorias?.[0])
      const precioNum = Number(values.precio)

      if (file) {
        // ✅ con imagen → FormData (requiere backend con multer)
        const fd = new FormData()
        fd.append("categoria_id", String(categoriaId))
        fd.append("titulo", values.titulo)
        fd.append("descripcion", values.descripcion || "")
        fd.append("precio", String(precioNum))
        fd.append("imagen", file) // nombre de campo: 'imagen'
        await api.post("/publicaciones", fd)
      } else {
        // ✅ sin imagen → JSON simple
        await api.post("/publicaciones", {
          categoria_id: categoriaId,
          titulo: values.titulo,
          descripcion: values.descripcion,
          precio: precioNum,
        })
      }

      alert("✅ Publicación creada")
      reset({ titulo: "", descripcion: "", precio: "", stock: "", categorias: [] })
      setFile(null)
      nav("/mis-publicaciones") // para ver el “registro”
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || "Error al crear la publicación"
      alert(msg)
    }
  }

  function toggleCat(id) {
    // trabajar SIEMPRE con números
    const numId = Number(id)
    const current = watch("categorias")
    if (current.includes(numId)) {
      setValue("categorias", current.filter((x) => x !== numId))
    } else {
      setValue("categorias", [...current, numId])
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
              {errors.titulo && <p className="text-danger small">{errors.titulo.message}</p>}

              <textarea
                className="form-control"
                placeholder="Descripción del producto"
                {...register("descripcion")}
              />
              {errors.descripcion && <p className="text-danger small">{errors.descripcion.message}</p>}

              <div className="row g-2">
                <div className="col-sm-4">
                  <input
                    className="form-control"
                    placeholder="Precio"
                    type="number"
                    step="0.01"
                    {...register("precio")}
                  />
                  {errors.precio && <p className="text-danger small">{errors.precio.message}</p>}
                </div>
                <div className="col-sm-4">
                  <input
                    className="form-control"
                    placeholder="Stock"
                    type="number"
                    {...register("stock")}
                  />
                  {errors.stock && <p className="text-danger small">{errors.stock.message}</p>}
                </div>
              </div>

              <div>
                <label className="form-label">Imagen</label>
                <input
                  type="file"
                  accept="image/*"                      // ✅ opcional
                  className="form-control"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                {file && (                                 // ✅ previsualización opcional
                  <img
                    alt="preview"
                    src={URL.createObjectURL(file)}
                    style={{ maxWidth: 200, marginTop: 8, borderRadius: 8 }}
                  />
                )}
              </div>

              <div>
                <div className="form-label">Categorías</div>
                <div className="d-flex flex-wrap gap-2">
                  {categorias.map((c) => (
                    <label key={c.id} className="badge rounded-pill text-bg-light border p-2">
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={watch("categorias").includes(Number(c.id))}   // ✅ comparar número
                        onChange={() => toggleCat(c.id)}                        // ✅ pasar número
                      />
                      {c.nombre}
                    </label>
                  ))}
                </div>
                {errors.categorias && <p className="text-danger small">{errors.categorias.message}</p>}
              </div>

              <button className="btn btn-success">Publicar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
