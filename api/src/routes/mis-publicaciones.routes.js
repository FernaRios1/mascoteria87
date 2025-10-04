const router = require("express").Router();
const auth = require("../middlewares/auth");
const { query } = require("../models/queries");

// Lista SOLO las publicaciones del usuario logueado
router.get("/mis-publicaciones", auth, async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT p.*, c.nombre AS categoria
       FROM publicaciones p
       LEFT JOIN categorias c ON c.id = p.categoria_id
       WHERE p.usuario_id = $1
       ORDER BY p.creado_en DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (e) { next(e); }
});

module.exports = router;
