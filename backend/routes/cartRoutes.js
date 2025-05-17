const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, clearCart } = require('../controllers/cartControllers');
const { authenticateToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/api/cart', getCart);
router.post('/api/cart/add', addToCart);
router.delete('/api/cart/remove/:productId', removeFromCart);
router.delete('/api/cart/clear', authenticateToken, clearCart);

module.exports = router;