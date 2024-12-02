const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const postController = require('../controllers/postController');

// Configuración de Multer (si aún no está configurada)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Rutas existentes
router.get('/', postController.getAllPosts); // Obtener todas las publicaciones
router.post('/', upload.single('image'), postController.createPost); // Crear una publicación
router.put('/:id', upload.single('image'), postController.updatePost); // Actualizar una publicación
router.delete('/:id', postController.deletePost); // Eliminar una publicación

// **Nuevo endpoint** para obtener una publicación por `id`
router.get('/:id', postController.getPostById); // Obtener una publicación específica por `id`

module.exports = router;
