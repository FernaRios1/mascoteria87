import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useAuth } from "../../state/AuthContext"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { useState } from "react"

const schema = yup.object({
  email: yup.string().email("Email inválido").required("El email es obligatorio"),
  password: yup.string().min(6, "Mínimo 6 caracteres").required("Contraseña obligatoria"),
})

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const [authError, setAuthError] = useState("")

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  })

  async function onSubmit(values) {
    setAuthError("")
    try {
      await login(values.email, values.password)
      const to = loc.state?.from?.pathname || "/perfil"
      nav(to)
    } catch (err) {
      setAuthError("Credenciales inválidas")
    }
  }

  return (
    <div style={{ backgroundColor: "rgb(207,242,199)" }}>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-sm-8 col-md-6 col-lg-4">
            <h2 className="mb-3">Iniciar Sesión</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="vstack gap-2">
              <input className="form-control" placeholder="Email" type="email" {...register("email")} />
              {errors.email && <p className="text-danger small">{errors.email.message}</p>}

              <input className="form-control" placeholder="Contraseña" type="password" {...register("password")} />
              {errors.password && <p className="text-danger small">{errors.password.message}</p>}

              {authError && <div className="alert alert-danger py-2">{authError}</div>}
              <button
                className="btn w-100"
                style={{
                  backgroundColor: "rgb(100,184,99)",
                  color: "white",
                  border: "none"
                }}
              >
                Iniciar Sesión
              </button>
            </form>
            <p className="mt-2 small">¿Sin cuenta? <Link to="/registro">Registrate</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
