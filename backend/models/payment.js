const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PaymentSchema = new Schema({
    
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: false
    },

    sessionId: {
        type: String,
        required: false
    },

    orderId: {
        type: Schema.Types.ObjectId,
        ref: 'order',
        required: true,
    },

    conversationId: {
        type: String,
        required: true,
    },

    amount: {
        type: Number,
        required: true
    },

    paidPrice: {
        type: Number,
        required: true
    },

    paymentStatus: {
        type: String,
        enum: ['SUCCESS', 'FAİLED', 'PENDING'],
        required: true
    },

    paymentDate: {
        type: Date,
        default: Date.now
    },

    izyicoPaymentId: {
        type: String,
        required: false,
    },

    basketItems: [{
        id: String,
        name: String,
        category1: String,
        category2: String,
        itemType: String,
        price: Number,
        currency: String,
        quantity: Number
    }]
}, {
    timestamps: true
});



module.exports = mongoose.model('Payment', PaymentSchema);