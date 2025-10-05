const router = require("express").Router();
const Joi = require("joi");
const { query } = require("../models/queries");
const auth = require("../middlewares/auth");

// Soporte de imágenes
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");

// === carpeta uploads absoluta (api/uploads) ===
const uploadsPath = path.resolve(__dirname, "..", "..", "uploads");
fs.mkdirSync(uploadsPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsPath),
  filename: (_req, file, cb) =>
    cb(null, `${uuid()}${path.extname(file.originalname).toLowerCase()}`),
});

// (opcional) solo imágenes
const fileFilter = (_req, file, cb) => {
  const ok = /image\/(png|jpe?g|gif|webp)/i.test(file.mimetype);
  cb(ok ? null : new Error("Formato de imagen no permitido"), ok);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ========== LISTADO (filtro/paginación opcional) ==========
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

// ========== DETALLE ==========
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

// ========== CREAR ==========
const createSchema = Joi.object({
  categoria_id: Joi.number().integer().required(),
  titulo: Joi.string().min(3).required(),
  descripcion: Joi.string().allow(""),
  precio: Joi.number().min(0).required(),
  imagen_url: Joi.string().uri().all_
