const Order = require('../models/order');
const jwt = require('jsonwebtoken');
const User = require('../models/auth');

const authToken = (token) => {
    if (!token) {
        return null;
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
        return decoded.id;
    } catch (error) {
        console.error('Token doğrulama hatası', error);
        return null;
    }
};


const getOrders = async (req, res) => {

    try {

        const token = req.headers.authorization?.split(' ')[1];
        const userId = authToken(token);

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token bulunamadı'
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı'
            });
        }

        if (!user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Bu işlem için admin yetkisi gereklidir!'
            });
        }

        const orders = await Order.find().populate('items.product');

        res.status(200).json({
            success: true,
            message: 'Siparişler başarıyla getirildi',
            orders: orders
        })

    } catch (error) {
        console.error('Siparişler alınırken hata:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Geçersiz token.' });
        }
        res.status(500).json({ message: 'Siparişler alınırken bir hata oluştu', error: error.message });
    }
}


const createOrder = async (req, res) => {

    try {

        const token = req.headers.authorization?.split(' ')[1];
        const userId = authToken(token);
        const sessionId = req.sessionId || req.query.sessionId;

        const { totalAmount, name, surname, email, phone, paymentMethod, items } = req.body;

        if (!name || !surname || !email || !phone || !items || !totalAmount) {
            return res.status(400).json({
                success: false,
                message: 'Gerekli alanlar eksik'
            });
        }

        const newOrder = new Order({
            userId: userId || null,
            sessionId: !userId ? sessionId : null,
            totalAmount,
            name,
            surname,
            email,
            phone,
            paymentMethod,
            items,
        });

        res.status(201).json({
            success: true,
            message: 'Sipariş başarıyla oluşturuldu.',
            data: newOrder
        })

        await newOrder.save();

        console.log("Oluşturulan Sipariş", newOrder);

    } catch (error) {
        console.error('Sipariş oluşturulurken hata', error);
        return res.status(500).json({
            success: false,
            message: 'Sunucu hatası.'
        });
    }
}

const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: 'Sipariş Bulunamadı'
            });
        }

        res.status(200).json({
            success: true,
            data: updatedOrder
        })
    } catch (error) {
        console.error('Kullanıcı güncelleştirirken hata:', error);
        return res.status(500).json({ message: 'Kullanıcı güncelleştirirken bir hata oluştu.' });
    }
}


const deleteOrder = async (req, res) => {
    try {

        const { id } = req.params;

        const deleteOrder = await Order.findByIdAndDelete(id);

        if (!deleteOrder) {
            return res.status(404).json({
                success: false,
                message: 'Sipariş bulunamadı'
            })
        }

        res.status(200).json({
            success: true,
            message: 'Sipariş başarıyla silindi'
        });


    } catch (error) {
        console.error('Sipariş silinirken hata:', error);
        return res.status(500).json({ message: 'Sipariş silinirken bir hata oluştu.' });
    }
}



module.exports = { getOrders, createOrder, deleteOrder, updateOrder }