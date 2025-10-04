import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../../services/api";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000";
function imgSrc(p) {
  if (!p?.imagen_url) return "/img/placeholder.jpg";
  return p.imagen_url.startsWith("/uploads") ? `${API}${p.imagen_url}` : p.imagen_url;
}

export default function ProductDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api.get(`/publicaciones/${id}`)
      .then(r => setItem(r.data))
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) return <div className="container py-4">Producto no encontrado.</div>;
  if (!item) return <div className="container py-4">Cargando…</div>;

  return (
    <div className="container py-4">
      <Link to="/" className="btn btn-link">&larr; Volver</Link>

      <div className="row g-4">
        <div className="col-md-6">
          <img
            src={imgSrc(item)}
            alt={item.titulo}
            className="img-fluid rounded"
            onError={e => e.currentTarget.src = "/img/placeholder.jpg"}
          />
        </div>
        <div className="col-md-6">
          <h2>{item.titulo}</h2>
          <p className="text-muted mb-1">Categoría: {item.categoria || "Sin categoría"}</p>
          <h4 className="my-3">${Number(item.precio || 0).toLocaleString()}</h4>
          <p>{item.descripcion || "—"}</p>
        </div>
      </div>
    </div>
  );
}
