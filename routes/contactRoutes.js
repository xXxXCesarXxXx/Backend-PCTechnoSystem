const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Rutas para obtener, crear y actualizar información de contacto
router.get('/', contactController.getContactInfo);
router.post('/', contactController.createContactInfo);
router.put('/:id', contactController.updateContactInfo);
router.post('/send-email', contactController.sendEmail);

module.exports = router;
