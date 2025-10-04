const API = import.meta.env.VITE_API_URL;

export function imgSrc(p) {
  if (!p?.imagen_url) return "/placeholder.png";
  return p.imagen_url.startsWith("/uploads")
    ? `${API}${p.imagen_url}`   // ej: http://localhost:4000/uploads/abc.jpg
    : p.imagen_url;             // si ya es URL absoluta
}
