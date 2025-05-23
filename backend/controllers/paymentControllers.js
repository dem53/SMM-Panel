const Iyzipay = require('iyzipay');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const Payment = require('../models/payment')

dotenv.config();

const iyzipayClient = new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY,
    secretKey: process.env.IYZICO_SECRET_KEY,
    uri: 'https://sandbox-api.iyzipay.com'
});

const authToken = (token) => {
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
        return decoded.id;
    } catch (error) {
        console.error('Token doğrulama hatası:', error);
        return null;
    }
};

const createPayment = async (req, res) => {

    const token = req.headers.authorization?.split(' ')[1];
    const userId = authToken(token);
    const sessionId = req.sessionId || req.query.sessionId;
    
    const { price, paidPrice, currency, basketId, conversationId, paymentCard, buyer, shippingAddress, billingAddress, basketItems, orderId } = req.body;

    const request = {
        locale: Iyzipay.LOCALE.TR,
        price: price,
        conversationId: conversationId,
        paidPrice: paidPrice,
        currency: currency,
        installment: '1',
        basketId: basketId,
        paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
        paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
        paymentCard: paymentCard,
        buyer: buyer,
        shippingAddress: shippingAddress,
        billingAddress: billingAddress,
        basketItems: basketItems
    };

    
    iyzipayClient.payment.create(request, async (err, result) => {
        if (err) {
            console.error('İyzico ödeme isteği hatası:', err);
            return res.status(500).json({
                success: false,
                message: 'Ödeme işlemi sırasında bir hata oluştu.',
                error: err.message || err
            });
        }

        if (result.status === 'success') {
            try {
                const paymentRecord = new Payment({
                    userId: userId,
                    sessionId: !userId ? sessionId : null,
                    orderId: orderId,
                    conversationId: conversationId,
                    amount: price,
                    paidPrice: paidPrice,
                    paymentStatus: 'SUCCESS',
                    iyzicoPaymentId: result.paymentId || null,
                    basketItems: basketItems,
                });

                await paymentRecord.save();

                return res.status(200).json({
                    success: true,
                    message: 'Ödeme işlemi başarılı!',
                    paymentUrl: result.paymentPageUrl,
                    paymentId: result.paymentId

                });
            } catch (saveError) {
                console.error('Ödeme kaydı kaydedilirken bir hata oluştu:', saveError);
                return res.status(500).json({
                    success: false,
                    message: 'Ödeme kaydı oluşturulurken bir hata oluştu.',
                    error: saveError.message || saveError
                });
            }
        } else {
            console.error('İyzico ödeme işlemi başarısız:', result);
            return res.status(400).json({
                success: false,
                message: 'Ödeme işlemi başarısız: ' + (result.errorMessage || 'Bilinmeyen hata'),
                error: result
            });
        }
    });
};



// Tüm ödemeleri almak için fonksiyon
const getPayments = async (req, res) => {

    try {
        const payments = await Payment.find();

        if (payments.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Hiç ödeme kaydı bulunamadı.'
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Ödeme kayıtları başarıyla alındı.',
            payments: payments
        });
    } catch (error) {
        console.error('Ödemeler alınırken hata:', error);
        return res.status(500).json({
            success: false,
            message: 'Ödemeler alınırken bir hata oluştu.',
            error: error.message || error
        });
    }
};


const getUserPayments = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const userId = authToken(token);

        const payments = await Payment.find({ userId }).populate({
            path: 'orderId',
            populate: {
                path: 'items.product',
                select: 'name brand imageUrls'
            }
        }).sort({ createdAt: -1 });

        // Ödeme verilerini formatla
        const formattedPayments = payments.map(payment => ({
            _id: payment._id,
            amount: payment.amount,
            paidPrice: payment.paidPrice,
            paymentStatus: payment.paymentStatus,
            paymentDate: payment.createdAt,
            order: payment.orderId ? {
                _id: payment.orderId._id,
                totalAmount: payment.orderId.totalAmount,
                status: payment.orderId.status,
                items: payment.orderId.items,
                createdAt: payment.orderId.createdAt
            } : null
        }));

        return res.status(200).json({
            success: true,
            count: formattedPayments.length,
            data: formattedPayments
        });

    } catch (error) {
        console.error('Ödemeler alınırken hata:', error);
        return res.status(500).json({
            success: false,
            message: 'Ödemeler alınırken bir hata oluştu',
            error: error.message
        });
    }
};



module.exports = { createPayment, getPayments, getUserPayments };
