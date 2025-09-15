// File: src/App.jsx
import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/public/Home"
import Login from "./pages/public/Login"
import Register from "./pages/public/Register"
import ProductDetail from "./pages/public/ProductDetail"
import Cart from "./pages/public/Cart"
import Profile from "./pages/private/Profile"
import Favorites from "./pages/private/Favorites"
import CreatePublication from "./pages/private/CreatePublication"
import MyPublications from "./pages/private/MyPublications"
import EditPublication from "./pages/private/EditPublication"
import ProtectedRoute from "./components/ProtectedRoute"
import Categories from "./pages/public/Categories"
import CategoryDetail from "./pages/public/CategoryDetail"

// nuevas pantallas
import Checkout from "./pages/private/Checkout"
import PurchaseSuccess from "./pages/private/PurchaseSuccess"

export default function App() {
  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{ backgroundColor: "rgb(207,242,199)" }}
    >
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          {/* Pública */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/carrito" element={<Cart />} />
          <Route path="/categorias" element={<Categories />} />
          <Route path="/categorias/:id" element={<CategoryDetail />} />

          {/* Privada */}
          <Route element={<ProtectedRoute />}>
            <Route path="/perfil" element={<Profile />} />
            <Route path="/favoritos" element={<Favorites />} />
            <Route path="/publicar" element={<CreatePublication />} />
            <Route path="/mis-publicaciones" element={<MyPublications />} />
            <Route path="/publicaciones/:id/editar" element={<EditPublication />} />

            {/* compras */}
            <Route path="/compra" element={<Checkout />} />
            <Route path="/compra-exitosa" element={<PurchaseSuccess />} />
          </Route>
        </Routes>
      </main>

      <footer className="text-center py-4 border-top bg-light">
        @Todos los derechos reservados MascoteriaG87
      </footer>
    </div>
  )
}
