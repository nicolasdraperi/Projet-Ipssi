const express = require('express');
const { isAdmin } = require('../middleware/authMiddleware');
const verifyToken = require('../middleware/verifyToken');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/admin/users', verifyToken, isAdmin, adminController.getUsers);
router.delete('/admin/users/:userId', verifyToken, isAdmin, adminController.deleteUser);
router.get('/admin/stats', verifyToken, isAdmin, adminController.getStats);
router.get('/admin/invoices/:userId', verifyToken, isAdmin, adminController.getInvoicesByUser);

module.exports = router;
