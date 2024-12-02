const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Rutas de usuarios
router.get('/', usersController.getAllUsers); // Obtener todos los usuarios
router.post('/', usersController.createUser); // Crear un nuevo usuario
router.put('/:id', usersController.updateUser); // Actualizar un usuario
router.delete('/:id', usersController.deleteUser); // Eliminar un usuario

module.exports = router;
