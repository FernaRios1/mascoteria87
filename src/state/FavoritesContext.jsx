import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

const Ctx = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  // Carga inicial
  useEffect(() => {
    api.get("/favoritos")
      .then(r => setFavorites(r.data || []))
      .catch(() => setFavorites([]));
  }, []);

  async function toggleFavorite(publicacionId) {
    const isFav = favorites.some(f => (f.id ?? f.publicacion_id) === publicacionId);
    if (isFav) {
      await api.delete(`/favoritos/${publicacionId}`);
      setFavorites(prev => prev.filter(f => (f.id ?? f.publicacion_id) !== publicacionId));
    } else {
      await api.post("/favoritos", { publicacion_id: publicacionId });
      setFavorites(prev => [{ publicacion_id: publicacionId }, ...prev]); // quick add
      // opcional: refrescar desde backend para traer título/imagen
      // const { data } = await api.get("/favoritos"); setFavorites(data);
    }
  }

  return (
    <Ctx.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </Ctx.Provider>
  );
}

export const useFavorites = () => useContext(Ctx);
