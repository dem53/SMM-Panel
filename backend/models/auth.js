const mongoose = require('mongoose');

const AuthSchema = new mongoose.Schema({

    ad: {
        type: String,
        required: true,
        trim: true
    },


    soyad: {
        type: String,
        required: true,
        trim: true
    },


    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    
    password: {
        type: String,
        required: true
    },


    phone: {
        type: String,
        required: true,
        unique: true
    },


    isAdmin: {
        type: Boolean,
        default: false
    },


    createdDate: {
        type: Date,
        default: new Date()
    }


});


module.exports = mongoose.model('user', AuthSchema);