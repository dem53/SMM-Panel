const Cart = require('../models/cart');
const Product = require('../models/product');
const jwt = require('jsonwebtoken');

const authToken = (token) => {
    if (!token) {
        return null;
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
        return decoded.id;
    } catch (error) {
        console.error('Token doğrulama hatası');
        return null;
    }
};

const getCart = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const userId = authToken(token);
        const sessionId = req.query.sessionId;

        console.log("Request details:", {
            token: token ? "Kullanici" : "Misafir",
            userId,
            sessionId,
            headers: req.headers,
            query: req.query
        });

        if (!userId && !sessionId) {
            const newSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            return res.status(200).json({
                success: true,
                sessionId: newSessionId,
                items: []
            });
        }

        const query = userId ? { userId } : { sessionId };
        const update = { $setOnInsert: { items: [] } };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };

        const cart = await Cart.findOneAndUpdate(query, update, options).populate('items.product');

        res.json(cart);
    } catch (error) {
        console.error('Sepet getirilirken hata ile karşılaşıldı', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası',
            error: error.message
        });
    }
};

const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1, link } = req.body;
        const token = req.headers.authorization?.split(' ')[1];
        const userId = authToken(token);
        const sessionId = req.sessionId || req.query.sessionId;


        if (!userId && !sessionId) {
            const newSessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            return res.status(200).json({
                success: true,
                sessionId: newSessionId,
                message: 'Yeni oturum oluşturuldu, lütfen tekrar deneyin.'
            });
        }

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Ürün ID gereklidir!'
            });
        }
        
        if(!link){
            return res.status(200).json({
                success:false,
                message: 'Sipariş linki gereklidir!'
            });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({
                success: false,
                message: 'Ürün bulunamadı!'
            });
        }

        let cart = await Cart.findOne(userId ? { userId } : { sessionId });

        if (!cart) {
            cart = new Cart({
                userId: userId || null,
                sessionId: userId ? null : sessionId,
                items: []
            });
        }

        const existItem = cart.items.find(item => item.product.toString() === productId);

        if (existItem) {
            existItem.quantity += quantity;
        } else {
            cart.items.push({
                product: productId,
                quantity: quantity,
                price: product.price,
                link: link
            });
        }

        await cart.save();
        await cart.populate('items.product');

        res.status(200).json({
            success: true,
            message: 'Ürün sepete eklendi.',
            cart
        });

    } catch (error) {
        console.error('Ürün sepete eklenirken hata ile karşılaşıldı!', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası'
        });
    }
};

const removeFromCart = async (req, res) => {
    try {

        const { productId } = req.params;
        const token = req.headers.authorization?.split(' ')[1];
        const userId = authToken(token);
        const sessionId = req.sessionId || req.query.sessionId;

        if (!userId && !sessionId) {
            return res.status(400).json({
                success: false,
                message: 'Kullanıcı kimliği veya oturum bilgisi gereklidir!'
            });
        }

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Ürün ID gereklidir!'
            });
        }

        let cart = await Cart.findOne(userId ? { userId } : { sessionId });

        const itemIndex = cart.items.findIndex(item =>
            item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Ürün sepette bulunamadı' });
        }

        if (cart.items[itemIndex].quantity > 1) {
            cart.items[itemIndex].quantity -= 1;
        } else {
            cart.items.splice(itemIndex, 1);
        }

        await cart.save();

        await cart.populate('items.product');

        return res.status(200).json({
            success: true,
            message: 'Ürün sepetten kaldırıldı.',
            cart
        });

    } catch (error) {
        console.error('Ürün sepetten kaldırılırken hata ile karşılaşıldı!', error);
        res.status(500).json({
            success: false,
            message: 'Sunucu hatası'
        });
    }
};


const clearCart = async (req, res) => {

    try {
        const token = req.headers.authorization?.split(' ')[1];
        const userId = authToken(token);
        const sessionId = req.sessionId || req.query.sessionId;

        if (!userId && !sessionId) {
            return res.status(400).json({ message: 'Kullanıcı kimliği veya oturum bilgisi gerekli' });
        }

        let cart = await Cart.findOne(userId ? { userId } : { sessionId });

        if (!cart) {
            return res.status(404).json({ message: 'Sepet bulunamadı' });
        }

        cart.items = [];

        await cart.save();

        res.json({
            message: 'Sepet temizlendi',
            cart
        });

    } catch (error) {
        console.error('Sepet temizleme hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart };