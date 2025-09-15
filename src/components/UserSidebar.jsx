import { NavLink } from "react-router-dom"

export default function UserSidebar() {
  const baseStyle = {
    backgroundColor: "rgb(100,184,99)",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "8px 16px",
    textDecoration: "none",
    textAlign: "center", // 👈 asegura que el texto quede centrado
    whiteSpace: "nowrap" // 👈 evita que los textos se partan en varias líneas
  }

  const activeStyle = {
    backgroundColor: "rgb(54,138,41)",
    color: "white"
  }

  return (
    <div className="d-flex flex-column flex-lg-row justify-content-center align-items-center gap-2">
      <NavLink
        to="/perfil"
        className="btn w-100 w-lg-auto"
        style={({ isActive }) => (isActive ? { ...baseStyle, ...activeStyle } : baseStyle)}
      >
        <i className="bi bi-person me-2"></i> Perfil
      </NavLink>
      <NavLink
        to="/mis-publicaciones"
        className="btn w-100 w-lg-auto"
        style={({ isActive }) => (isActive ? { ...baseStyle, ...activeStyle } : baseStyle)}
      >
        <i className="bi bi-collection me-2"></i> Mis publicaciones
      </NavLink>
      <NavLink
        to="/publicar"
        className="btn w-100 w-lg-auto"
        style={({ isActive }) => (isActive ? { ...baseStyle, ...activeStyle } : baseStyle)}
      >
        <i className="bi bi-plus-circle me-2"></i> Crear publicación
      </NavLink>
      <NavLink
        to="/favoritos"
        className="btn w-100 w-lg-auto"
        style={({ isActive }) => (isActive ? { ...baseStyle, ...activeStyle } : baseStyle)}
      >
        <i className="bi bi-heart me-2"></i> Favoritos
      </NavLink>
    </div>
  )
}
