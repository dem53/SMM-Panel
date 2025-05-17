const Favorite = require('../models/favorite');
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
        console.error('Token doğrulama hatası', error);
        return null;
    }
}

const getFavorites = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const userId = authToken(token);
        const sessionId = req.query.sessionId || req.sessionId;

        // Favori sorgusu, kullanıcı var mı kontrolü yapılır.
        const query = userId ? { user: userId } : { sessionId };

        const favorites = await Favorite.find(query).populate('product').sort('-createdAt');

        res.json({
            success: true,
            data: favorites
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Favoriler getirilirken hata'
        })
    }
};

const addToFavorites = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const userId = authToken(token);
        const sessionId = req.query.sessionId || req.sessionId;

        const { productId } = req.body;

        console.log("PRODUCT ID", productId);

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Ürün bulunamadı'
            });
        }

        const existingFavorite = await Favorite.findOne({
            user: userId,
            sessionId: !userId ? sessionId : undefined,
            product: productId
        });

        if (existingFavorite) {
            return res.status(400).json({
                success: false,
                message: 'Bu ürün zaten favorilerinizde mevcut'
            });
        }

        const favorite = new Favorite({
            user: userId,
            sessionId: !userId ? sessionId : undefined,
            product: productId
        });

        await favorite.save();

        console.log("FAVORİ", favorite);

        res.status(201).json({
            success: true,
            message: 'Ürün favorilerinize eklendi',
            data: favorite
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Favorilere eklenirken bir hata oluştu!'
        });
    }
};

const removeFromFavorites = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const userId = authToken(token);
        const sessionId = req.query.sessionId || req.sessionId;

        const { productId } = req.params;

        console.log("PRODUCT ID", productId);

        const favorite = await Favorite.findOneAndDelete({
            user: userId,
            sessionId: !userId ? sessionId : undefined,
            product: productId
        });

        if (!favorite) {
            return res.status(404).json({
                success: false,
                message: 'Favori bulunamadı'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Ürün favorilerimden kaldırıldı'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Favorilerimden kaldırılırken hata ile karşılaşıldı'
        });
    }
};

const checkFavoriteStatus = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const userId = authToken(token);
        const sessionId = req.query.sessionId || req.sessionId;

        const { productId } = req.params;

        const favorite = await Favorite.findOne({
            user: userId,
            sessionId: !userId ? sessionId : undefined,
            product: productId
        });

        res.status(200).json({
            success: true,
            isFavorite: !!favorite
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Favori durumu kontrol edilirken bir hata oluştu'
        });
    }
}

module.exports = { getFavorites, addToFavorites, removeFromFavorites, checkFavoriteStatus };
