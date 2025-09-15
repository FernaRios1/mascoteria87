import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useAuth } from "../../state/AuthContext"
import { useNavigate } from "react-router-dom"

const schema = yup.object({
  nombre: yup.string().required("El nombre es obligatorio"),
  email: yup.string().email("Email inválido").required("El email es obligatorio"),
  password: yup.string().min(6, "Mínimo 6 caracteres").required("Contraseña obligatoria"),
})

export default function Register() {
  const { register: registerUser } = useAuth()
  const nav = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  async function onSubmit(values) {
    await registerUser(values.nombre, values.email, values.password)
    nav("/")
  }

  return (
    <div style={{ backgroundColor: "rgb(207,242,199)" }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-sm-8 col-md-6 col-lg-4">
            <h2 className="mb-3">Crear cuenta</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="vstack gap-2">
              <input className="form-control" placeholder="Nombre" {...register("nombre")} />
              {errors.nombre && <p className="text-danger small">{errors.nombre.message}</p>}

              <input className="form-control" placeholder="Email" type="email" {...register("email")} />
              {errors.email && <p className="text-danger small">{errors.email.message}</p>}

              <input className="form-control" placeholder="Contraseña" type="password" {...register("password")} />
              {errors.password && <p className="text-danger small">{errors.password.message}</p>}

              <button
                className="btn w-100"
                style={{
                  backgroundColor: "rgb(100,184,99)",
                  color: "white",
                  border: "none"
                }}
              >
                Crear cuenta
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
