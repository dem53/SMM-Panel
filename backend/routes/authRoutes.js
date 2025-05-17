const express = require('express');
const router = express.Router();
const {authenticateToken, isAdmin} = require('../middleware/authMiddleware');
const {register, login, getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/authConrollers');

router.post('/api/register', register);
router.post('/api/login', login);

router.get('/api/users', authenticateToken, isAdmin, getUsers);
router.get('/api/user/:id', authenticateToken, getUserById);
router.post('/api/user/add', authenticateToken, isAdmin, createUser);
router.patch('/api/user/:id', authenticateToken, updateUser);
router.delete('/api/user/:id', authenticateToken, isAdmin, deleteUser);

module.exports = router;