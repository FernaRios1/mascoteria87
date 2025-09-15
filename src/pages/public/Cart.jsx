// File: src/pages/public/Cart.jsx
import { useCart } from "../../state/CartContext"
import Card from "../../components/Card"
import { useAuth } from "../../state/AuthContext"
import { useNavigate } from "react-router-dom"

export default function Cart() {
  const { items, removeItem, total } = useCart()
  const { user } = useAuth()
  const nav = useNavigate()

  function goToCheckout() {
    if (!user) {
      nav("/login", { state: { from: "/compra" } }) // 🔹 redirige si no logeado
      return
    }
    if (items.length === 0) return
    nav("/compra")
  }

  return (
    <div style={{ backgroundColor: "rgb(207,242,199)" }}>
      <div className="container py-4">
        <h2 className="mb-4">Carrito</h2>

        {/* Si el carrito está vacío */}
        {items.length === 0 && (
          <p className="text-muted">
            Para comprar, primero agrega productos al carrito.
          </p>
        )}

        {/* Tarjeta de resumen */}
        {items.length > 0 && (
          <div className="card shadow-sm text-center mb-4">
            <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-center">
              <h5 className="mb-3 mb-md-0">
                Total: <span className="fw-bold">${total.toFixed(2)}</span>
              </h5>
              <button className="btn btn-success btn-lg" onClick={goToCheckout}>
                <i className="bi bi-cash-stack me-2"></i> Comprar
              </button>
            </div>
          </div>
        )}

        {/* Grilla de productos */}
        <div className="row g-4">
          {items.map((it) => (
            <div
              key={it.publicacion.id}
              className="col-12 col-sm-6 col-md-4 d-flex"
            >
              <Card
                producto={it.publicacion}
                onRemove={() => removeItem(it.publicacion.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
