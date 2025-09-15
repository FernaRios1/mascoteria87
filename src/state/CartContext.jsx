import { createContext, useContext, useMemo, useState, useEffect } from "react"
import { api } from "../services/api"

const CartCtx = createContext()
export const useCart = () => useContext(CartCtx)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("cart")
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  function addItem(pub, qty = 1) {
    setItems((prev) => {
      const i = prev.findIndex((p) => p.publicacion.id === pub.id)
      if (i >= 0) {
        const next = [...prev]
        next[i] = { ...next[i], cantidad: next[i].cantidad + qty }
        return next
      }
      return [...prev, { publicacion: pub, cantidad: qty }]
    })
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((p) => p.publicacion.id !== id))
  }

  function clear() {
    setItems([])
  }

  const total = useMemo(
    () => items.reduce((acc, it) => acc + it.publicacion.precio * it.cantidad, 0),
    [items]
  )

  async function checkout() {
    const payload = {
      items: items.map((it) => ({
        publicacion_id: it.publicacion.id,
        cantidad: it.cantidad,
        precio_unitario: it.publicacion.precio,
      })),
    }
    const { data } = await api.post("/compras", payload)
    clear()
    return data
  }

  return (
    <CartCtx.Provider value={{ items, addItem, removeItem, clear, total, checkout }}>
      {children}
    </CartCtx.Provider>
  )
}
