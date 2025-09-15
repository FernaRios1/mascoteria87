// File: src/pages/private/Favorites.jsx
import { useFavorites } from "../../state/FavoritesContext"
import { useState } from "react"
import Card from "../../components/Card"
import { mockProducts } from "../../mocks/products"
import UserSidebar from "../../components/UserSidebar"

export default function Favorites() {
  const { favorites } = useFavorites()

  // 🔹 Usamos los productos del mock
  const [data] = useState(mockProducts)

  // 🔹 Filtramos solo los que estén en favoritos
  const favoriteItems = data.filter((p) => favorites.includes(p.id))

  const [page, setPage] = useState(1)
  const perPage = 12
  const totalPages = Math.ceil(favoriteItems.length / perPage)

  return (
    <div style={{ backgroundColor: "rgb(207,242,199)" }}>
      <div className="container py-4">
        {/* Sidebar horizontal */}
        <div className="mb-4">
          <UserSidebar />
        </div>

        <h2 className="mb-4">Mis favoritos</h2>
        {favoriteItems.length === 0 ? (
          <p className="text-muted">Todavía no has añadido favoritos.</p>
        ) : (
          <>
            <div className="row g-4">
              {favoriteItems
                .slice((page - 1) * perPage, page * perPage)
                .map((p) => (
                  <div key={p.id} className="col-12 col-sm-6 col-md-4 d-flex">
                    <Card producto={p} />
                  </div>
                ))}
            </div>
            {totalPages > 1 && (
              <nav className="mt-4">
                <ul className="pagination justify-content-center">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${page === i + 1 ? "active" : ""}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  )
}
