const fs = require("fs");
const path = require("path");

// Crea /api/uploads si no existe y sírvelo
const uploadsPath = path.resolve(__dirname, "..", "uploads");
fs.mkdirSync(uploadsPath, { recursive: true });
app.use("/uploads", express.static(uploadsPath, { index: false }));

// (Temporal) Endpoint de diagnóstico para verificar que existe y es escribible
app.get("/debug/uploads", (_req, res) => {
  try {
    fs.accessSync(uploadsPath, fs.constants.W_OK);
    const files = fs.readdirSync(uploadsPath);
    return res.json({ uploadsPath, writable: true, files });
  } catch (e) {
    return res.status(500).json({ uploadsPath, writable: false, detalle: e.message });
  }
});
