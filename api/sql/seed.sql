INSERT INTO categorias (nombre) VALUES
('Perros'), ('Gatos'), ('Accesorios')
ON CONFLICT DO NOTHING;
