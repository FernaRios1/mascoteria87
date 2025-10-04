const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
require("dotenv").config();

// importa rutas (solo declarar; NO usar app aquí)
const categoriasRoutes = require("./routes/categorias.routes");
const authRoutes = require("./routes/auth.routes");
const publicacionesRoutes = require("./routes/publicaciones.routes");
const usuariosRoutes = require("./routes/usuarios.routes");
const misPublicacionesRoutes = require("./routes/mis-publicaciones.routes");
const favoritosRoutes = require("./routes/favoritos.routes");


const app = express(); // ← primero creamos la app

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// estáticos (si usas imágenes)
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// montar rutas (recién aquí usamos app)
app.use("/categorias", categoriasRoutes);
app.use("/auth", authRoutes);
app.use("/publicaciones", publicacionesRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/", misPublicacionesRoutes); // expone GET /mis-publicaciones
app.use("/favoritos", favoritosRoutes);

app.get("/", (_req, res) => res.json({ ok: true }));

// manejador de errores al final
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno" });
});

module.exports = app;
