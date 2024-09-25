const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// Route pour générer une facture
router.post('/generate', invoiceController.generateInvoice);

module.exports = router;
