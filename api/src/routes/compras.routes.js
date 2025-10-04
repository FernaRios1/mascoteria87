const router = require("express").Router();
const Joi = require("joi");
const auth = require("../middlewares/auth");
const { query } = require("../models/queries");

router.get("/", auth, async (req, res, next) => {
  try {
    const { rows } = await query(
      `SELECT c.id, c.publicacion_id, c.cantidad, c.total, c.estado, p.titulo
       FROM compras c
       LEFT JOIN publicaciones p ON p.id=c.publicacion_id
       WHERE c.comprador_id=$1 ORDER BY c.id DESC`,
      [req.user.id]
    );
    res.json(rows);
  } catch (e) { next(e); }
});

const schema = Joi.object({
  publicacion_id: Joi.number().integer().required(),
  cantidad: Joi.number().integer().min(1).required()
});

router.post("/", auth, async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body, { abortEarly:false });
    if (error) return res.status(400).json({ error:"Validación", detalles:error.details });

    const { publicacion_id, cantidad } = req.body;
    // Buscar precio actual
    const pub = await query("SELECT precio FROM publicaciones WHERE id=$1", [publicacion_id]);
    if (!pub.rows[0]) return res.status(404).json({ error:"Publicación no encontrada" });

    const total = Number(pub.rows[0].precio) * Number(cantidad);
    const { rows } = await query(
      `INSERT INTO compras (comprador_id, publicacion_id, cantidad, total)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [req.user.id, publicacion_id, cantidad, total]
    );
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

module.exports = router;
