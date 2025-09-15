import { useAuth } from "../state/AuthContext"
import { useFavorites } from "../state/FavoritesContext"
import { useCart } from "../state/CartContext"

export default function CardDetail({ producto }) {
  const { user } = useAuth()
  const { favorites, toggleFavorite } = useFavorites()
  const { addItem } = useCart()

  const isFavorite = favorites.some((f) => f.id === producto.id)

  // 🔹 Categorías del backend
  const categoriaNombre =
    producto.categorias?.map((c) => c.nombre).join(", ") || "Sin categoría"

  return (
    <div
      className="card shadow-sm w-100"
      style={{ backgroundColor: "rgb(217,245,211)" }}
    >
      <div className="row g-0">
        {/* Imagen a la izquierda */}
        <div className="col-12 col-md-5">
          <img
            src={producto.imagen_url || "/img/placeholder.jpg"}
            alt={producto.titulo}
            className="img-fluid h-100 w-100 rounded-start"
            style={{ objectFit: "cover", maxHeight: "400px" }}
          />
        </div>

        {/* Contenido a la derecha */}
        <div className="col-12 col-md-7 d-flex flex-column">
          <div className="card-body d-flex flex-column h-100">
            <h3 className="fw-bold">{producto.titulo}</h3>
            <p className="text-muted mb-2">Categoría: {categoriaNombre}</p>
            <p className="mb-3">{producto.descripcion || "Sin descripción"}</p>

            <div className="mt-auto d-flex justify-content-between align-items-center">
              <div>
                <div className="h4 text-dark mb-0">${producto.precio}</div>
                <div className="small text-muted">
                  Stock: {producto.stock ?? 0}
                </div>
              </div>

              <div className="d-flex gap-2">
                {/* Botón añadir al carrito */}
                <button
                  className="btn btn-success btn-lg"
                  onClick={() => addItem(producto)}
                >
                  <i className="bi bi-cart-plus me-2"></i> Añadir
                </button>

                {/* Favoritos */}
                {user && (
                  <button
                    className={`btn btn-lg ${
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
