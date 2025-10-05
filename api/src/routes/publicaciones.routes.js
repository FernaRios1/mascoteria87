const router = require("express").Router();
const Joi = require("joi");
const { query } = require("../models/queries");
const auth = require("../middlewares/auth");

// 👇 Soporte de imágenes
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");

// === Preparar carpeta uploads (Render arranca sin ella) ===
const uploadsPath = path.resolve(__dirname, "..", "..", "uploads");
fs.mkdirSync(uploadsPath, { recursive: true });

// Multer con ruta absoluta y nombre seguro
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsPath),
  filename: (_req, file, cb) =>
    cb(null, `${uuid()}${path.extname(file.originalname).toLowerCase()}`),
});

// (opcional) limitar a imágenes
const fileFilter = (_req, file, cb) => {
  const ok = /image\/(png|jpe?g|gif|webp)/i.test(file.mimetype);
  cb(ok ? null : new Error("Formato de imagen no permitido"), ok);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ================= LISTADO (con filtros/paginación) =================
router.get("/", async (req, res, next) => {
  try {
    const { categoria_id, page, limit } = req.query;

    const where = [];
    const params = [];
    if (categoria_id) {
      params.push(Number(categoria_id));
      where.push(`p.categoria_id = $${params.length}`);
    }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const pageNum = page ? Math.max(1, Number(page)) : null;
    const limitNum = limit ? Math.max(1, Number(limit)) : null;

    if (pageNum && limitNum) {
      const { rows: countRows } = await query(
        `SELECT COUNT(*)::int AS total FROM publicaciones p ${whereSql}`,
        params
      );
      const total = countRows[0]?.total ?? 0;
      const pages = Math.max(1, Math.ceil(total / limitNum));
      const offset = (pageNum - 1) * limitNum;

      const { rows: items } = await query(
        `SELECT p.*, c.nombre AS categoria
         FROM publicaciones p
         LEFT JOIN categorias c ON c.id = p.categoria_id
         ${whereSql}
         ORDER BY p.creado_en DESC
         LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, limitNum, offset]
      );
      return res.json({ items, total, page: pageNum, pages });
    }

    const { rows } = await query(
      `SELECT p.*, c.nombre AS categoria
       FROM publicaciones p
       LEFT JOIN categorias c ON c.id = p.categoria_id
       ${whereSql}
       ORDER BY p.creado_en DESC`,
      params
    );
    res.json(rows);
  } catch (e) { next(e); }
});

// ================= DETALLE =================
router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "ID inválido" });

    const { rows } = await query(
      `SELECT p.*, c.nombre AS categoria
       FROM publicaciones p
       LEFT JOIN categorias c ON c.id = p.categoria_id
       WHERE p.id = $1`,
      [id]
    );

    if (!rows[0]) return res.status(404).json({ error: "Publicación no encontrada" });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

// ================= CREAR =================
const createSchema = Joi.object({
  categoria_id: Joi.number().integer().required(),
  titulo: Joi.string().min(3).required(),
  descripcion: Joi.string().allow(""),
  precio: Joi.number().min(0).required(),
  imagen_url: Joi.string().uri().allow(null, "")
});

router.post("/", auth, upload.single("imagen"), async (req, res, next) => {
  try {
    const body = { ...req.body };
    const { error } = createSchema.validate(body, { abortEarly: false });
    if (error) return res.status(400).json({ error: "Validación", detalles: error.details });

    const categoria_id = Number(body.categoria_id);
    const precio = Number(body.precio);
    const titulo = body.titulo;
    const descripcion = body.descripcion || "";

    const imagenSubida = req.file ? `/uploads/${req.file.filename}` : null;
    const imagen = imagenSubida || body.imagen_url || null;

    const { rows } = await query(
      `INSERT INTO publicaciones (usuario_id, categoria_id, titulo, descripcion, precio, imagen_url)
       VALUES ($1,$2,$3,$4,$5,$6)
       RETURNING *`,
      [req.user.id, categoria_id, titulo, descripcion, precio, imagen]
    );

    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

// ================= EDITAR (PATCH) =================
const updateSchema = Joi.object({
  categoria_id: Joi.number().integer(),
  titulo: Joi.string().min(3),
  descripcion: Joi.string().allow(""),
  precio: Joi.number().min(0),
  imagen_url: Joi.string().uri().allow(null, "")
}).min(1);

router.patch("/:id", auth, upload.single("imagen"), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "ID inválido" });

    const dueño = await query("SELECT usuario_id FROM publicaciones WHERE id=$1", [id]);
    if (!dueño.rows[0]) return res.status(404).json({ error: "Publicación no encontrada" });
    if (dueño.rows[0].usuario_id !== req.user.id) return res.status(403).json({ error: "No autorizado" });

    const body = { ...req.body };
    const { error } = updateSchema.validate(body, { abortEarly: false });
    if (error) return res.status(400).json({ error: "Validación", detalles: error.details });

    const imagenSubida = req.file ? `/uploads/${req.file.filename}` : undefined;
    const imagen = imagenSubida ?? body.imagen_url;

    const updates = {
      categoria_id: body.categoria_id !== undefined ? Number(body.categoria_id) : undefined,
      titulo: body.titulo,
      descripcion: body.descripcion,
      precio: body.precio !== undefined ? Number(body.precio) : undefined,
      imagen_url: imagen
    };

    const fields = [];
    const vals = [];
    let i = 1;
    for (const [k, v] of Object.entries(updates)) {
      if (v !== undefined) { fields.push(`${k}=$${i++}`); vals.push(v); }
    }
    if (!fields.length) return res.status(400).json({ error: "Sin cambios" });
    vals.push(id);

    const { rows } = await query(
      `UPDATE publicaciones SET ${fields.join(", ")} WHERE id=$${i} RETURNING *`,
      vals
    );
    res.json(rows[0]);
  } catch (e) { next(e); }
});

// ================= ELIMINAR =================
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "ID inválido" });

    const pub = await query("SELECT usuario_id FROM publicaciones WHERE id=$1", [id]);
    if (!pub.rows[0]) return res.status(404).json({ error: "Publicación no encontrada" });
    if (pub.rows[0].usuario_id !== req.user.id) return res.status(403).json({ error: "No autorizado" });

    await query("DELETE FROM publicaciones WHERE id=$1", [id]);
    res.status(204).send();
  } catch (e) { next(e); }
});

module.exports = router;
