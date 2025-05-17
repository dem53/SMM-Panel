const jwt = require('jsonwebtoken');
const User = require('../models/auth');

const authToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Kullanıcı bulunamadı'
                });
            }
            req.user = user;
            return next();
        }
    } catch (error) {
        console.error('Authentication Middleware Error..', error);
        return res.status(500).json({
            success: false,
            message: 'Geçersiz veya süresi dolmuş token'
        });
    }
}

const authenticateToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (token) {
            const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Kullanıcı bulunamadı!!'
                });
            }

            req.user = user;
            return next();

        } else {
            const sessionId = req.body.sessionId || req.sessionId || req.query.sessionId;
            if (!sessionId) {
                return res.status(400).json({
                    success: false,
                    message: 'SessionID gerekli'
                });
            }

            req.sessionId = sessionId;
            return next();
        }

    } catch (error) {
        console.error('Authentication Middleware Error..', error);
        return res.status(500).json({
            success: false,
            message: 'Geçersiz veya süresi dolmuş token'
        });
    }
};


const isAdmin = (req, res, next) => {
    try {
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Admin yetkisi gereklidir!'
            });
        }
        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Yetkilendirme hatası!'
        });
    }
};


module.exports = { authToken, authenticateToken, isAdmin };