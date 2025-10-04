// File: src/mocks/products.js
export const mockProducts = [
  // 🔹 Comida
  {
    id: 1,
    titulo: "Comedero Antideslizante",
    descripcion: "Ideal para perros medianos y grandes.",
    precio: 3500,
    imagen_url: "/img/mock-comedero.jpg",
    categoria_id: "1", // Comida
    stock: 15,
  },
  {
    id: 2,
    titulo: "Alimento Premium Gatos 5kg",
    descripcion: "Nutrición completa para gatos adultos.",
    precio: 8900,
    imagen_url: "/img/mock-alimento-gato.jpg",
    categoria_id: "1", // Comida
    stock: 20,
  },

  // 🔹 Cuidado
  {
    id: 3,
    titulo: "Cama Premium Mascotas",
    descripcion: "Cama acolchada, lavable y resistente.",
    precio: 12500,
    imagen_url: "/img/mock-cama.jpg",
    categoria_id: "2", // Cuidado
    stock: 8,
  },
  {
    id: 4,
    titulo: "Shampoo Hipoalergénico",
    descripcion: "Cuidado especial para piel sensible.",
    precio: 2200,
    imagen_url: "/img/mock-shampoo.jpg",
    categoria_id: "2", // Cuidado
    stock: 12,
  },

  // 🔹 Juguetes
  {
    id: 5,
    titulo: "Pelota Mordedora",
    descripcion: "Juguete interactivo para perros pequeños.",
    precio: 1200,
    imagen_url: "/img/mock-pelota.jpg",
    categoria_id: "3", // Juguetes
    stock: 30,
  },
  {
    id: 6,
    titulo: "Rascador Deluxe",
    descripcion: "Perfecto para gatos activos y juguetones.",
    precio: 8900,
    imagen_url: "/img/mock-rascador.jpg",
    categoria_id: "3", // Juguetes
    stock: 5,
  },

  // 🔹 Ropa
  {
    id: 7,
    titulo: "Chaleco Abrigado Perro",
    descripcion: "Protege del frío, ideal para invierno.",
    precio: 4800,
    imagen_url: "/img/mock-chaleco.jpg",
    categoria_id: "4", // Ropa
    stock: 10,
  },
  {
    id: 8,
    titulo: "Collar Elegante",
    descripcion: "Collar ajustable con diseño premium.",
    precio: 1500,
    imagen_url: "/img/mock-collar.jpg",
    categoria_id: "4", // Ropa
    stock: 25,
  },

  // 🔹 Farmacia
  {
    id: 9,
    titulo: "Antipulgas Pipeta",
    descripcion: "Protección efectiva contra pulgas y garrapatas.",
    precio: 3100,
    imagen_url: "/img/mock-pipeta.jpg",
    categoria_id: "5", // Farmacia
    stock: 40,
  },
  {
    id: 10,
    titulo: "Vitaminas Suplemento Mascotas",
    descripcion: "Refuerza defensas y mejora la energía.",
    precio: 2700,
    imagen_url: "/img/mock-vitaminas.jpg",
    categoria_id: "5", // Farmacia
    stock: 18,
  },
]
