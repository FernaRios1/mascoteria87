const router = require("express").Router();
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../models/queries");

const registerSchema = Joi.object({
  nombre: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

router.post("/register", async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ error: "Validación", detalles: error.details });

    const { nombre, email, password } = req.body;
    const hash = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS || 10));

    const { rows } = await query(
      "INSERT INTO usuarios (nombre, email, password_hash) VALUES ($1,$2,$3) RETURNING id, nombre, email, rol",
      [nombre, email, hash]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    if (e.code === "23505") return res.status(409).json({ error: "Email ya registrado" });
    next(e);
  }
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

router.post("/login", async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ error: "Validación", detalles: error.details });

    const { email, password } = req.body;
    const { rows } = await query("SELECT * FROM usuarios WHERE email=$1", [email]);
    const user = rows[0];
    if (!user) return res.status(401).json({ error: "Credenciales inválidas" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    res.json({ token });
  } catch (e) { next(e); }
});

module.exports = router;
