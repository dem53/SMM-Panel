const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OrderSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: false
    },

    sessionId: {
        type: String,
        required: false
    },

    items: [
        {
            product: {
                type: Schema.Types.ObjectId,
                ref: 'product',
                required: true
            },

            quantity: {
                type: Number,
                default: 1
            },

            price: {
                type: Number,
                required: true
            },

            link: {
                type: String,
                required: true
            }
        }
    ],

    totalAmount: {
        type: Number,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    surname: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: false
    },

    phone: {
        type: String,
        maxlength: 11,
        required: false
    },

    paymentMethod: {
        type: String,
        enum: ['bank_transfer', 'credit_card'],
        required: true
    },

    status: {
        type: String,
        enum: ['pending', 'success', 'red','loading', 'iade'],
        default: 'pending'
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }

});

// Middleware to set updatedAt before saving
OrderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});


OrderSchema.pre('save', function(next) {
    if (this.userId) {
        this.email = this.email || '';
    } else {
        this.sessionId = this.sessionId || '';
    }
    next();
});


module.exports = mongoose.model('orders', OrderSchema);