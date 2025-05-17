const express = require('express');
const router = express.Router();
const { getFavorites, addToFavorites, removeFromFavorites, checkFavoriteStatus } = require('../controllers/favoriteControllers');

router.get('/api/favorites', getFavorites);
router.post('/api/favorites/add', addToFavorites);
router.delete('/api/favorites/remove/:productId', removeFromFavorites);
router.get('/api/favorites/check/:productId', checkFavoriteStatus);

module.exports = router;