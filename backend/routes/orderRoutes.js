const express = require('express');
const router = express.Router();
const { authToken, authenticateToken, isAdmin } = require('../middleware/authMiddleware');
const { getOrders, createOrder, updateOrder, deleteOrder } = require('../controllers/orderControllers');

router.get('/api/orders', authenticateToken, isAdmin, getOrders);
router.post('/api/orders/add', createOrder);
router.patch('/api/orders/update/:id', authToken, isAdmin, updateOrder);
router.delete('/api/orders/delete/:id', authenticateToken, isAdmin, deleteOrder);

module.exports = router;