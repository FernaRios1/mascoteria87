const router = require("express").Router();
const auth = require("../middlewares/auth");
const { query } = require("../models/queries");

router.get("/", auth, async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT f.publicacion_id, p.titulo, p.precio, p.imagen_url, p.categoria_id
       FROM favoritos f
       JOIN publicaciones p ON p.id = f.publicacion_id
       WHERE f.usuario_id = $1
       ORDER BY f.id DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (e) { next(e); }
});

router.post("/", auth, async (req, res, next) => {
  try {
    const { publicacion_id } = req.body;
    const { rows } = await query(
      `INSERT INTO favoritos (usuario_id, publicacion_id)
       VALUES ($1,$2)
       ON CONFLICT (usuario_id, publicacion_id) DO NOTHING
       RETURNING usuario_id, publicacion_id`,
      [req.user.id, Number(publicacion_id)]
    );
    if (!rows[0]) return res.status(200).json({ ok: true, ya_era_favorito: true });
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

router.delete("/:publicacion_id", auth, async (req, res, next) => {
  try {
    await query(
      "DELETE FROM favoritos WHERE usuario_id=$1 AND publicacion_id=$2",
      [req.user.id, Number(req.params.publicacion_id)]
    );
    res.status(204).send();
  } catch (e) { next(e); }
});

module.exports = router;
