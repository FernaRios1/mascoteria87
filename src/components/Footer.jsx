// File: src/components/Footer.jsx
export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
        {/* Marca */}
        <div className="mb-3 mb-md-0">
          <span className="fw-bold">🐾 Mascotería</span> &copy; {new Date().getFullYear()}
        </div>

        {/* Links rápidos */}
        <ul className="nav">
          <li className="nav-item"><a href="/" className="nav-link px-2 text-light">Home</a></li>
          <li className="nav-item"><a href="/carrito" className="nav-link px-2 text-light">Carrito</a></li>
          <li className="nav-item"><a href="/perfil" className="nav-link px-2 text-light">Perfil</a></li>
        </ul>

        {/* Redes sociales */}
        <div className="d-flex gap-3">
          <a href="#" className="text-light"><i className="bi bi-facebook"></i></a>
          <a href="#" className="text-light"><i className="bi bi-instagram"></i></a>
          <a href="#" className="text-light"><i className="bi bi-twitter"></i></a>
        </div>
      </div>
    </footer>
  )
}