const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');

// Rutas CRUD
router.get('/', catalogController.getAllPosts);
router.post('/', catalogController.addItem);
router.put('/:id', catalogController.updateItem);
router.delete('/:id', catalogController.deleteItem);

module.exports = router;
