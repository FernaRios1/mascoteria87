import { useLocation, Link } from "react-router-dom"

export default function PurchaseSuccess() {
  const loc = useLocation()
  const { items = [], total = 0 } = loc.state || {}

  return (
    <div style={{ backgroundColor: "rgb(207,242,199)" }}>
      <div className="container py-5 text-center">
        <h2 className="mb-4 text-success">
          <i className="bi bi-check-circle-fill me-2"></i> ¡Compra exitosa!
        </h2>
        <p className="mb-4">Gracias por tu compra. Aquí está el resumen:</p>

        <div className="row g-4 mb-4">
          {items.map((it) => (
            <div key={it.publicacion_id} className="col-12 col-sm-6 col-md-4 d-flex">
              <div className="card shadow-sm w-100" style={{ backgroundColor: "rgb(217,245,211)" }}>
                <div className="card-body">
                  <h5>Producto #{it.publicacion_id}</h5>
                  <p className="small text-muted">Cantidad: {it.cantidad}</p>
                  <p className="fw-bold">Subtotal: ${it.precio_unitario * it.cantidad}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h4 className="mb-4">Total pagado: ${total.toFixed(2)}</h4>

        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
