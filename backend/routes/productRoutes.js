const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getProducts, getProductDetail, createProduct, deleteProduct, updateProduct } = require('../controllers/productControllers');
const { authenticateToken, isAdmin} = require('../middleware/authMiddleware');

// Multer konfigürasyonu
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Dosyaların kaydedileceği dizin
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Dosya ismi
    }
});

// Resim dosyaları dışında yüklemeyi engelleme
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Yalnızca resim dosyaları kabul edilir
    } else {
        cb(new Error('Sadece resim dosyaları yüklenebilir!'), false); 
    }
};

// Multer ayarları
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // Maksimum dosya boyutu 5MB
    }
});

// Rotalar
router.get('/api/products', getProducts);
router.get('/api/product/:id', getProductDetail);
router.post('/api/product/add', authenticateToken, isAdmin, upload.single('imageUrl'), createProduct);
router.patch('/api/product/update/:id', authenticateToken, isAdmin, upload.single('imageUrl'), updateProduct);
router.delete('/api/product/delete/:id', authenticateToken, isAdmin, deleteProduct);

module.exports = router;
