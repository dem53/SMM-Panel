const mongoose = require('mongoose');
const Schema = mongoose.Schema
const CartSchema = new Schema({

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
                required: true,
                min: 1
            },

            price: {
                type: Number,
                required: true
            },

            link: {
                type: String,
                required: true
            }
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }

});

CartSchema.pre('save', function (next) {
    if (!this.createdAt) {
        this.createdAt = Date.now();
    }
    this.updatedAt = Date.now();
    next();
});



module.exports = mongoose.model('cart', CartSchema);