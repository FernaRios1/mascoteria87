
# 🐾 Mascotería G87 – Frontend

Este es el **frontend del Marketplace Mascotería G87**, desarrollado en **React + Vite**, que consume la **API REST del backend**.  
El proyecto incluye vistas públicas, privadas y de administración básica para usuarios autenticados.

---

## 🚀 Tecnologías principales
- **React 18**
- **Vite**
- **React Router DOM**
- **React Hook Form + Yup** (validaciones)
- **Axios** (servicio `api.js`)
- **Bootstrap 5 + Bootstrap Icons**
- **Context API** (Auth, Cart, Favorites)

---

## 📂 Estructura de carpetas

```
src/
│
├── components/        # Componentes reutilizables (Card, CardDetail, Navbar, Sidebar, etc.)
├── mocks/             # Datos mock (productos, categorías) para pruebas sin backend
├── pages/             # Páginas principales
│   ├── public/        # Rutas públicas (Home, Categorías, Login, Registro, ProductDetail)
│   └── private/       # Rutas privadas (Mis publicaciones, Crear/Editar publicación, Checkout, Perfil)
│
├── state/             # Contextos globales
│   ├── AuthContext.jsx
│   ├── CartContext.jsx
│   └── FavoritesContext.jsx
│
├── services/
│   └── api.js         # Cliente Axios configurado con baseURL y token JWT
│
├── App.jsx            # Definición de rutas
└── main.jsx           # Punto de entrada
```

---

## 🌐 Rutas del Frontend

- `/` → Home (categorías y productos destacados)  
- `/categorias` → Lista de categorías  
- `/categorias/:id` → Productos de una categoría  
- `/productos/:id` → Detalle de producto + comentarios  
- `/login` → Iniciar sesión  
- `/registro` → Registro de usuario  
- `/perfil` → Perfil de usuario autenticado  
- `/mis-publicaciones` → Publicaciones creadas por el usuario  
- `/publicar` → Crear publicación  
- `/publicaciones/:id/editar` → Editar publicación  
- `/checkout` → Carrito y compra  
- `/compra-exitosa` → Confirmación de compra  

---

## 🔑 Autenticación

- Basada en **JWT**.  
- El token se guarda en `localStorage` y se inyecta automáticamente en las cabeceras mediante `api.js`.  
- Los contextos (`AuthContext`) manejan el login/logout y el estado global del usuario.  

---

## 🛠️ Endpoints que consume

El frontend ya está preparado para consumir el backend usando el contrato **OpenAPI** que actualizamos (`api_contract_marketplace_v3.yaml`).  
Principales grupos de endpoints:

- `/auth/*` → Login, registro, usuario actual  
- `/categorias` → Listar y obtener categorías  
- `/publicaciones` → CRUD de publicaciones + relación con categorías + imágenes  
- `/mis-publicaciones` → Publicaciones propias  
- `/favoritos` → Listar, añadir y eliminar favoritos  
- `/publicaciones/{id}/comentarios` → Crear, listar y eliminar comentarios  
- `/compras` → Checkout de carrito  

---

## 🛒 Flujo principal de uso

1. Usuario visita el sitio → puede navegar categorías y productos.  
2. Si quiere comprar o comentar → debe **loguearse**.  
3. Una vez logueado:
   - Puede crear/editar publicaciones propias.  
   - Puede añadir/quitar productos de favoritos.  
   - Puede dejar comentarios en productos.  
   - Puede agregar al carrito y finalizar compra.  
4. Al hacer checkout → se consume `/compras` con los ítems del carrito.  

---

## ⚙️ Variables de entorno

El frontend espera una **URL base del backend**.  
En el archivo `.env` se debe definir:

```
VITE_API_URL=http://localhost:4000/api
```

---

## 👩‍💻 Para la gente de Backend

- El **contrato OpenAPI** (`api_contract_marketplace_v3.yaml`) describe todos los endpoints que deben implementar.  
- El frontend ya está adaptado para:
  - Manejar errores con fallback a mocks.  
  - Enviar **FormData** en creación/edición de publicaciones (para imagen + categorías).  
  - Usar **JWT** en rutas privadas.  
- Si alguna respuesta no sigue el contrato, el frontend puede romperse → se recomienda respetar los **schemas** definidos.  
- La base de datos debe incluir:
  - Usuarios  
  - Categorías  
  - Publicaciones (con relación usuario y categorías)  
  - Favoritos  
  - Comentarios  
  - Compras (con ítems)  

---
