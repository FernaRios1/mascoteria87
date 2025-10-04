// src/routes/usuarios.routes.js
const router = require("express").Router();
const auth = require("../middlewares/auth");
const { query } = require("../models/queries");

router.get("/me", auth, async (req, res, next) => {
  try {
    const { rows } = await query(
      "SELECT id, nombre, email, rol FROM usuarios WHERE id=$1",
      [req.user.id]
    );
    if (!rows[0]) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

module.exports = router;
