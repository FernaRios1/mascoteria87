// File: src/components/Navbar.jsx
import { Link, NavLink } from "react-router-dom"
import { useAuth } from "../state/AuthContext"
import { useCart } from "../state/CartContext"

export default function Navbar() {
  const { user, logout } = useAuth()
  const { items } = useCart()
  const cartCount = items.reduce((a, i) => a + i.cantidad, 0)

  return (
    <>
      <nav
        className="navbar navbar-expand-lg"
        style={{ backgroundColor: "rgb(54,138,41)" }}
      >
        <div className="container">
          {/* Marca */}
          <Link className="navbar-brand fw-bold text-white" to="/">
            Mascotería G87
          </Link>

          {/* Botón hamburguesa para tablet/móvil */}
          <button
            className="navbar-toggler text-white border-0"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="bi bi-list fs-3"></i>
          </button>

          {/* Opciones escritorio */}
          <div className="collapse navbar-collapse d-none d-lg-flex">
            <ul className="navbar-nav ms-auto align-items-center">
              {user ? (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link text-white" to="/">Inicio</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link text-white" to="/categorias">Categorías</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link text-white" to="/favoritos">Favoritos</NavLink>
                  </li>
                  <li className="nav-item position-relative">
                    <NavLink className="nav-link text-white" to="/carrito">
                      <i className="bi bi-cart"></i>
                      {cartCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">
                          {cartCount}
                        </span>
                      )}
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link text-white" to="/perfil">{user.nombre}</NavLink>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-outline-light btn-sm ms-2" onClick={logout}>
                      Salir
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link text-white" to="/categorias">Categorías</NavLink>
                  </li>
                  <li className="nav-item position-relative">
                    <NavLink className="nav-link text-white" to="/carrito">
                      <i className="bi bi-cart"></i>
                      {cartCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark">
                          {cartCount}
                        </span>
                      )}
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link text-white" to="/login">Iniciar Sesión</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link text-white" to="/registro">Registrarse</NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Dropdown flotante en mobile */}
          <ul
            className="dropdown-menu dropdown-menu-end mt-3 shadow fade"
            style={{ borderRadius: "0.5rem", animation: "fadeSlide 0.25s ease" }}
          >
            {user ? (
              <>
                <li><NavLink className="dropdown-item" to="/">Inicio</NavLink></li>
                <li><NavLink className="dropdown-item" to="/categorias">Categorías</NavLink></li>
                <li><NavLink className="dropdown-item" to="/favoritos">Favoritos</NavLink></li>
                <li><NavLink className="dropdown-item" to="/carrito">Carrito ({cartCount})</NavLink></li>
                <li><NavLink className="dropdown-item" to="/perfil">Perfil</NavLink></li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={logout}>
                    Salir
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><NavLink className="dropdown-item" to="/categorias">Categorías</NavLink></li>
                <li><NavLink className="dropdown-item" to="/carrito">Carrito ({cartCount})</NavLink></li>
                <li><NavLink className="dropdown-item" to="/login">Iniciar Sesión</NavLink></li>
                <li><NavLink className="dropdown-item" to="/registro">Registrarse</NavLink></li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {/* 🔹 Custom styles */}
      <style>{`
        .dropdown-menu .dropdown-item.active,
        .dropdown-menu .dropdown-item:active {
          background-color: rgb(54,138,41) !important;
          color: #fff !important;
        }

        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}
