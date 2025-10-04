-- Tabla de usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabla de categorías
CREATE TABLE categorias (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

-- Tabla de publicaciones (productos)
CREATE TABLE publicaciones (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo VARCHAR(200) NOT NULL,
  descripcion TEXT NOT NULL,
  precio DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  imagen_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Relación N a N: publicaciones ↔ categorías
CREATE TABLE publicacion_categorias (
  publicacion_id INT NOT NULL REFERENCES publicaciones(id) ON DELETE CASCADE,
  categoria_id INT NOT NULL REFERENCES categorias(id) ON DELETE CASCADE,
  PRIMARY KEY (publicacion_id, categoria_id)
);

-- Tabla de favoritos
CREATE TABLE favoritos (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  publicacion_id INT NOT NULL REFERENCES publicaciones(id) ON DELETE CASCADE,
  UNIQUE (usuario_id, publicacion_id)
);

-- Tabla de comentarios en publicaciones
CREATE TABLE comentarios (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  publicacion_id INT NOT NULL REFERENCES publicaciones(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  fecha TIMESTAMP DEFAULT NOW()
);

-- Tabla de compras (ordenes)
CREATE TABLE compras (
  id SERIAL PRIMARY KEY,
  usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  total DECIMAL(10,2) NOT NULL,
  metodo_pago VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Items de compra (detalle de la orden)
CREATE TABLE compra_items (
  id SERIAL PRIMARY KEY,
  compra_id INT NOT NULL REFERENCES compras(id) ON DELETE CASCADE,
  publicacion_id INT NOT NULL REFERENCES publicaciones(id),
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED
);
