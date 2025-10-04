import { useCart } from "../../state/CartContext"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Checkout() {
  const { items, addItem, removeItem, total, checkout } = useCart()
  const [paymentMethod, setPaymentMethod] = useState("tarjeta")
  const nav = useNavigate()

  function handleQuantityChange(pubId, delta) {
    const item = items.find((i) => i.publicacion.id === pubId)
    if (!item) return
    if (item.cantidad + delta <= 0) {
      removeItem(pubId)
    } else {
      addItem(item.publicacion, delta)
    }
  }

  async function handlePay(e) {
    e.preventDefault()
    if (items.length === 0) return
    try {
      const compra = await checkout()
      nav("/compra-exitosa", { state: compra })
    } catch (err) {
      console.error("Error en checkout:", err)
      alert("Hubo un error al procesar la compra")
    }
  }

  return (
    <div style={{ backgroundColor: "rgb(207,242,199)" }}>
      <div className="container py-5">
        <h2 className="mb-4">Finalizar compra</h2>

        {items.length === 0 ? (
          <p className="text-muted">Tu carrito está vacío.</p>
        ) : (
          <>
            <div className="row g-4 mb-4">
              {items.map((it) => (
                <div key={it.publicacion.id} className="col-12 col-sm-6 col-md-4 d-flex">
                  <div className="card h-100 w-100 shadow-sm">
                    <img
                      src={it.publicacion.imagen_url || "/img/placeholder.jpg"}
                      alt={it.publicacion.titulo}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5>{it.publicacion.titulo}</h5>
                      <p className="small text-muted">${it.publicacion.precio} c/u</p>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleQuantityChange(it.publicacion.id, -1)}
                          >
                            -
                          </button>
                          <span className="px-3">{it.cantidad}</span>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => handleQuantityChange(it.publicacion.id, +1)}
                          >
                            +
                          </button>
                        </div>
                        <span className="fw-bold">
                          ${(it.publicacion.precio * it.cantidad).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handlePay} className="card p-4 shadow-sm">
              <h4 className="mb-3">Método de pago</h4>
              <div className="mb-3">
                <select
                  className="form-select"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="tarjeta">Tarjeta de crédito</option>
                  <option value="debito">Tarjeta de débito</option>
                  <option value="paypal">PayPal (ficticio)</option>
                </select>
              </div>

              <h5 className="mt-3">
                Total a pagar: <span className="fw-bold text-primary">${total.toFixed(2)}</span>
              </h5>

              <button className="btn btn-success btn-lg mt-3">
                <i className="bi bi-check-circle me-2"></i> Pagar
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
