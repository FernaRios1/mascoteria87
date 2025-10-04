import { Link } from "react-router-dom"
import { useAuth } from "../state/AuthContext"
import { useFavorites } from "../state/FavoritesContext"
import { useCart } from "../state/CartContext"

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";

// arma la URL de imagen según venga absoluta o relativa (/uploads/..)
function imgSrc(p) {
  const url = p?.imagen_url;
  if (!url) return "/img/placeholder.jpg";
  return url.startsWith("/uploads") ? `${API}${url}` : url;
}

export default function Card({
  producto,
  onEdit,
  onDelete,
  onRemove,
  showActions = true,
}) {
  const { user } = useAuth()
  const { favorites, toggleFavorite } = useFavorites()
  const { addItem } = useCart()

  // soporta arrays [{id,..}] o objetos {publicacion_id:..}
  const isFavorite = favorites?.some(
    (f) => (f.id ?? f.publicacion_id) === producto.id
  )

  // Soporta backend con string "categoria" o array "categorias"
  const categoriaNombre =
    (typeof producto.categoria === "string" && producto.categoria) ||
    (Array.isArray(producto.categorias) && producto.categorias.map(c => c?.nombre).filter(Boolean).join(", ")) ||
    "Sin categoría"

  return (
    <div
      className="card h-100 shadow-sm w-100"
      style={{ backgroundColor: "rgb(217,245,211)" }}
    >
      <img
        src={imgSrc(producto)}
        alt={producto.titulo}
        className="card-img-top"
        style={{ height: "200px", objectFit: "cover" }}
        onError={(e) => { e.currentTarget.src = "/img/placeholder.jpg" }}
      />

      <div className="card-body d-flex flex-column">
        <h5 className="card-title">
          <Link
            to={`/producto/${producto.id}`}
            className="text-decoration-none text-dark"
          >
            {producto.titulo}
          </Link>
        </h5>

        <p className="card-text small flex-grow-1">
          {producto.descripcion || "—"}
        </p>

        <ul className="list-unstyled small mb-3 text-muted">
          <li>Categoría: {categoriaNombre}</li>
          {producto.stock !== undefined && <li>Stock: {producto.stock}</li>}
        </ul>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span className="fw-bold h6 mb-0">
            ${Number(producto.precio || 0).toLocaleString()}
          </span>

          {showActions && (
            <div className="btn-group">
              <Link className="btn btn-sm btn-outline-success m-1" to={`/producto/${producto.id}`}>
                Detalle
              </Link>

              <button className="btn btn-sm btn-dark m-1" onClick={() => addItem(producto)}>
                Añadir
              </button>

              {user && (
                <button
                  className={`btn btn-sm m-1 ${isFavorite ? "btn-danger" : "btn-outline-danger"}`}
                  onClick={() => toggleFavorite(producto.id)}
                  title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
                >
                  <i className={`bi ${isFavorite ? "bi-heart-fill" : "bi-heart"}`}></i>
                </button>
              )}

              {onEdit && (
                <button className="btn btn-sm btn-outline-secondary m-1" onClick={onEdit}>
                  Editar
                </button>
              )}
              {onDelete && (
                <button className="btn btn-sm btn-outline-danger m-1" onClick={onDelete}>
                  Eliminar
                </button>
              )}
              {onRemove && (
                <button className="btn btn-sm btn-outline-danger m-1" onClick={onRemove}>
                  Quitar
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
