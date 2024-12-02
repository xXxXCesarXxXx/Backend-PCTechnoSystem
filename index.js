const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Crear la aplicación Express
const app = express();
const port = process.env.PORT || 3000;

// Configuración de CORS
const corsOptions = {
  origin: ' * ', // Cambia por el dominio de tu frontend
  optionsSuccessStatus: 200, // Para navegadores antiguos
};
app.use(cors(corsOptions)); // Habilitar CORS con opciones específicas

// Middleware
app.use(bodyParser.json()); // Procesar solicitudes JSON
app.use(bodyParser.urlencoded({ extended: true })); // Procesar datos de formularios

// Servir la carpeta de imágenes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes'); // Ruta corregida
const contactRoutes = require('./routes/contactRoutes');
const catalogRoutes = require('./routes/catalogRoutes');
const userRoutes = require('./routes/userRoutes'); // Importar las rutas de usuarios

// Asignación de rutas
app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api/posts', postRoutes); // Rutas de publicaciones
app.use('/api/contact', contactRoutes); // Rutas de contacto
app.use('/api/catalog', catalogRoutes); // Rutas del catálogo
app.use('/api/users', userRoutes); // Agregar las rutas al middleware de Express

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ message: 'Error en el servidor', error: err.message });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en https://backend-pctechnosystem-production.up.railway.app/ ${port}`);
});
