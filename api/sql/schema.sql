-- Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  rol VARCHAR(20) DEFAULT 'USER',
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Categorías
CREATE TABLE IF NOT EXISTS categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) UNIQUE NOT NULL
);

-- Publicaciones
CREATE TABLE IF NOT EXISTS publicaciones (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
  categoria_id INT REFERENCES categorias(id),
  titulo VARCHAR(150) NOT NULL,
  descripcion TEXT,
  precio NUMERIC(12,2) NOT NULL CHECK (precio >= 0),
  estado VARCHAR(20) DEFAULT 'ACTIVO',
  creado_en TIMESTAMP DEFAULT NOW()
);

-- Favoritos
CREATE TABLE IF NOT EXISTS favoritos (
  id SERIAL PRIMARY KEY,
  usuario_id INT REFERENCES usuarios(id) ON DELETE CASCADE,
  publicacion_id INT REFERENCES publicaciones(id) ON DELETE CASCADE,
  UNIQUE (usuario_id, publicacion_id)
);

-- Compras
CREATE TABLE IF NOT EXISTS compras (
  id SERIAL PRIMARY KEY,
  comprador_id INT REFERENCES usuarios(id) ON DELETE SET NULL,
  publicacion_id INT REFERENCES publicaciones(id) ON DELETE SET NULL,
  cantidad INT NOT NULL CHECK (cantidad > 0),
  total NUMERIC(12,2) NOT NULL CHECK (total >= 0),
  estado VARCHAR(20) DEFAULT 'PAGADA',
  creado_en TIMESTAMP DEFAULT NOW()
);
