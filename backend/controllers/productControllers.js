const Product = require('../models/product');

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        if (!products) {
            return res.status(404).json({
                success: false,
                message: 'Ürünler bulunamadı',
            });
        }
        res.status(200).json({
            success: true,
            products
        })

    } catch (error) {
        console.error('Get products error', error);
        res.status(500).json({
            success: false,
            message: 'Ürünler getirilirken bir hata oluştu.'
        });
    }
};


const getProductDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error('Get Detail Error:', error);
        res.status(500).json({
            success: false,
            message: "Ürün detayı alınırken hata oluştu",
            error: error.message
        });
    }
};


const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            size,
            platform,
            category,
            tags,
            stock,
            props1,
            props2,
            props3,
            props4,
            props5,
            props6,
            price,
            selling = false,
            fakeDiscount = false
        } = req.body;
        
        if (!name || !description || !size || !platform || !category || !tags || !stock || !props1 || !props2 || !props3 || !props4 || !props5 || !props6 || !price) {
            return res.status(400).json({
                success: false,
                message: 'Lütfen tüm zorunlu alanları doldurunuz.'
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Ürün görseli zorunludur.'
            });
        }

        const imageUrl = `/uploads/${req.file.filename}`;

        const newProduct = await Product.create({
            name,
            description,
            price: Number(price),
            stock: Number(stock),
            category,
            platform,
            imageUrl,
            tags,
            size,
            props1,
            props2,
            props3,
            props4,
            props5,
            props6,
            selling,
            fakeDiscount,
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Ürün başarıyla oluşturuldu',
            product: newProduct
        });

    } catch (error) {
        console.error('Create Product Error:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Geçersiz veri formatı.',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({
            success: false,
            message: 'Ürün oluşturulurken bir hata oluştu.',
            error: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        if (req.file) {
            updates.imageUrl = `/uploads/${req.file.filename}`;
        }

        if (updates.price) updates.price = Number(updates.price);
        if (updates.stock) updates.stock = Number(updates.stock);


        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Güncellenecek ürün bulunamadı."
            });
        }

        res.status(200).json({
            success: true,
            message: "Ürün başarıyla güncellendi",
            product: updatedProduct
        });
    } catch (error) {
        console.error('Update Product Error:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Geçersiz veri formatı.',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({
            success: false,
            message: 'Ürün güncellenirken bir hata oluştu.',
            error: error.message
        });
    }
};



const deleteProduct = async (req, res) => {
    try {

        const { id } = req.params;
        const deleteProduct = await Product.findByIdAndDelete(id);

        if (!deleteProduct) {
            res.status(404).json({
                success: false,
                message: 'Silinecek bir ürün ID bulunamadı'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Ürün başarıyla silindi',
            product: deleteProduct,
        });

    } catch (error) {
        console.error('Ürün silinirken hata ile karşılaşıldı.. Hata: ', error);
        res.status(500).json({
            success: false,
            message: "Ürün silinirken hata oluştu",
            error: error.message
        });
    }
}



module.exports = { getProducts, getProductDetail, createProduct, updateProduct, deleteProduct }