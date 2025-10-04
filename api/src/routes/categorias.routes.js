const router = require("express").Router();
const { query } = require("../models/queries");

// Lista de categorías
router.get("/", async (_req, res, next) => {
  try {
    const { rows } = await query(
      "SELECT id, nombre FROM categorias ORDER BY id"
    );
    res.json(rows);
  } catch (e) { next(e); }
});

// Detalle de una categoría
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "ID inválido" });

    const { rows } = await query(
      "SELECT id, nombre FROM categorias WHERE id=$1",
      [id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Categoría no encontrada" });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

module.exports = router;
