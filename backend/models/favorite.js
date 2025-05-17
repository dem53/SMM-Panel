const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FavoriteSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: false
    },


    sessionId: {
        type: String,
        required: false
    },


    product: {
        type: Schema.Types.ObjectId,
        ref : 'product',
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

FavoriteSchema.index({
    user:1, product: 1
}, {unique: true});

module.exports = mongoose.model('favorite', FavoriteSchema);