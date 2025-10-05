const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

// Rutas
const categoriasRoutes = require("./routes/categorias.routes");
const authRoutes = require("./routes/auth.routes");
const publicacionesRoutes = require("./routes/publicaciones.routes");
const usuariosRoutes = require("./routes/usuarios.routes");
const misPublicacionesRoutes = require("./routes/mis-publicaciones.routes");
const favoritosRoutes = require("./routes/favoritos.routes");

const app = express();

// Middlewares base
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// === uploads: crear carpeta y servir estáticos ===
const uploadsPath = path.resolve(__dirname, "..", "uploads");
fs.mkdirSync(uploadsPath, { recursive: true });
app.use("/uploads", express.static(uploadsPath, { index: false }));
// ================================================

// Endpoint de diagnóstico (temporal) para verificar /uploads
app.get("/debug/uploads", (_req, res) => {
  try {
    fs.accessSync(uploadsPath, fs.constants.W_OK);
    const files = fs.readdirSync(uploadsPath);
    res.json({ uploadsPath, writable: true, files });
  } catch (e) {
    res.status(500).json({ uploadsPath, writable: false, detalle: e.message });
  }
});

// Montar rutas
app.use("/categorias", categoriasRoutes);
app.use("/auth", authRoutes);
app.use("/publicaciones", publicacionesRoutes);
app.use("/usuarios", usuariosRoutes);
app.use("/", misPublicacionesRoutes); // GET /mis-publicaciones
app.use("/favoritos", favoritosRoutes);

// Healthcheck
app.get("/", (_req, res) => res.json({ ok: true }));

// 404
app.use((req, res, next) => {
  if (res.headersSent) return next();
  res.status(404).json({ error: "Not found" });
});

// Manejador de errores (muestra detalle mientras depuramos)
app.use((err, _req, res, _next) => {
  console.error("ERR:", err);
  res.status(500).json({ error: "Error interno", detalle: err.message });
});

module.exports = app;
