import { Link } from "react-router-dom"
import { useAuth } from "../state/AuthContext"
import { useFavorites } from "../state/FavoritesContext"
import { useCart } from "../state/CartContext"

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

  const isFavorite = favorites.some((f) => f.id === producto.id)

  // 🔹 Nombre de categoría (del backend viene como array de objetos)
  const categoriaNombre =
    producto.categorias?.map((c) => c.nombre).join(", ") || "Sin categoría"

  return (
    <div
      className="card h-100 shadow-sm w-100"
      style={{ backgroundColor: "rgb(217,245,211)" }}
    >
      <img
        src={producto.imagen_url || "/img/placeholder.jpg"}
        alt={producto.titulo}
        className="card-img-top"
        style={{ height: "200px", objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column">
        {/* 🔹 Título clickeable */}
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

        {/* Info extra */}
        <ul className="list-unstyled small mb-3 text-muted">
          <li>Categoría: {categoriaNombre}</li>
          {producto.stock !== undefined && <li>Stock: {producto.stock}</li>}
        </ul>

        <div className="d-flex justify-content-between align-items-center mt-auto">
          <span className="fw-bold h6 mb-0">${producto.precio}</span>

          {showActions && (
            <div className="btn-group">
              {/* Botón detalle */}
              <Link
                className="btn btn-sm btn-outline-success m-1"
                to={`/producto/${producto.id}`}
              >
                Detalle
              </Link>

              {/* Botón añadir al carrito */}
              <button
                className="btn btn-sm btn-dark m-1"
                onClick={() => addItem(producto)}
              >
                Añadir
              </button>

              {/* Favoritos (solo si hay usuario) */}
              {user && (
                <button
                  className={`btn btn-sm m-1 ${
                    isFavorite ? "btn-danger" : "btn-outline-danger"
                  }`}
                  onClick={() => toggleFavorite(producto.id)}
                  title={
                    isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"
                  }
                >
                  <i
                    className={`bi ${
                      isFavorite ? "bi-heart-fill" : "bi-heart"
                    }`}
                  ></i>
                </button>
              )}

              {/* Botones edición/eliminación */}
              {onEdit && (
                <button
                  className="btn btn-sm btn-outline-secondary m-1"
                  onClick={onEdit}
                >
                  Editar
                </button>
              )}
              {onDelete && (
                <button
                  className="btn btn-sm btn-outline-danger m-1"
                  onClick={onDelete}
                >
                  Eliminar
                </button>
              )}

              {/* Botón quitar (solo en Carrito) */}
              {onRemove && (
                <button
                  className="btn btn-sm btn-outline-danger m-1"
                  onClick={onRemove}
                >
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
