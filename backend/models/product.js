const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'Ürün adı zorunludur.'],
        trim: true
    },

    description: {
        type: String,
        required: [true, 'Ürün açıklaması zorunludur'],
        trim: true,
    },

    size: [{
        type: String,
        enum: {
            values: ['10', '25', '50', '100', '250', '500', '1000', '2500', '5000', '7500', '10000', '15000', '20000', '25000', '30000','50000','75000','100000','250000','500000','750000','1000000','2500000','5000000'],
            message: '{VALUE} geçerli bir değer girin'
        },
        required: [true, 'Paket adet sayısı zorunludur.']
    }],

    platform: [{
        type: String,
        enum: {
            values: ['Instagram', 'Twitter', 'Youtube', 'Tiktok', 'Facebook', 'Telegram', 'Spotify', 'SoundCloud', 'Twitch', 'Discord', 'Threads', 'Linkedin', 'Google Hizmetleri', 'Pinterest'],
            message: '{VALUE} geçerli bir platform değil'
        },
        required: [true, 'Platform Seçimi Zorunludur.']
    }],

    category: [{
        type: String,
        enum: {
            values: ['Takipçi','Beğeni','İzlenme','Yorum','Paylaşım','Kombo Paket'],
            message: '{VALUE} geçerli bir kategori değil'
        },
        required: [true, 'Kategori Seçimi Zorunludur.']
    }],

    tags: [{
        type: String,
        enum: {
            values: ['Güven Paket', 'Popüler Paket', 'Vip Paket','İşletme Paket','İndirimli Paket','Kampanya','Çok Satan','Etiket Yok'],
            message: '{VALUE} geçerli bir etiket giriniz!'
        },
        required: [true, 'Etiket seçimi zorunludur.']
    }],

    stock: {
        type: Number,
        required: [true, 'Stok miktarı zorunludur'],
        min: [0, 'Stok miktarı 0\'dan küçük olamaz.']
    },

    props1: {
        type: String,
        required: [true, 'Özellik1 açıklama zorunludur.'],
        trim: true
    },

    props2: {
        type: String,
        required: [true, 'Özellik2 açıklama zorunludur.'],
        trim: true
    },


    props3: {
        type: String,
        required: [true, 'Özellik3 açıklama zorunludur.'],
        trim: true
    },


    props4: {
        type: String,
        required: [true, 'Özellik4 açıklama zorunludur.'],
        trim: true
    },


    props5: {
        type: String,
        required: [true, 'Özellik5 açıklama zorunludur.'],
        trim: true
    },

    props6: {
        type: String,
        required: [true, 'Özellik6 açıklama zorunludur.'],
        trim: true
    },

    imageUrl: {
        type: String,
        required: [true, 'Ürün Görseli Zorunludur.']
    },

    price: {
        type: Number,
        required: [true, 'Fiyat bilgisi zorunludur'],
        trim: true
    },

    selling: {
        type: Boolean,
        default: false
    },

    fakeDiscount: {
        type: Boolean,
        default: false
    },

    createdDate: {
        type: Date,
        default: Date.now
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

}, {
    timestamps: true
});

module.exports = mongoose.model('product', ProductSchema);