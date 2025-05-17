const Auth = require('../models/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const register = async (req, res) => {

    try {

        const { ad, soyad, email, password, phone } = req.body;

        if (!ad || !soyad || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Tüm alanlar gereklidir!'
            });
        }

        const userExists = await Auth.findOne({
            $or: [
                { email }, { phone }
            ]
        });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: userExists.email === email ?
                    'Bu email zaten kayıtlı!' :
                    'Bu telefon numarası zaten kayıtlı!'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Parolanız 8 karakterden az olamaz!'
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const newUser = await Auth.create({
            ad,
            soyad,
            email,
            password: passwordHash,
            phone,
            isAdmin: false
        });

        const token = jwt.sign({
            id: newUser._id,
            isAdmin: newUser.isAdmin
        },
            process.env.SECRET_TOKEN,
            { expiresIn: '1d' }
        );


        res.status(201).json({
            success: true,
            user: {
                id: newUser._id,
                ad: newUser.ad,
                soyad: newUser.soyad,
                email: newUser.email,
                phone: newUser.phone,
                isAdmin: newUser.isAdmin
            },
            token
        });


        console.log('Yeni üye olan kullanıcı : ', newUser);

    } catch (error) {
        console.error('Kayıt olurken hata!', error);
        res.status(500).json({
            success: false,
            message: 'Kayıt işlemi başarısız oldu'
        })

    }

};


const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await Auth.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Böyle bir kullanıcı bulunamadı'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Parolanız Yanlış!'
            });
        }

        const token = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        },
            process.env.SECRET_TOKEN,
            { expiresIn: '1d' }
        );

        console.log('Sisteme giriş yapan kullanıcı', user);
        console.log('Kullanıcı UUID', user._id);


        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                ad: user.ad,
                soyad: user.soyad,
                email: user.email,
                phone: user.phone,
                isAdmin: user.isAdmin
            },
            token
        });

    } catch (error) {
        console.error('Giriş yaparken hata!', error);
        res.status(500).json({
            success: false,
            message: 'Giriş işlemi başarısız oldu.'
        })
    }
};


const getUsers = async(req, res) => {
    try {
        const users = await Auth.find().select('-password');
        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Kullanıcılar getirilirken hata!', error);
        res.status(500).json({
            success: false,
            message: 'Kullanıcılar getirilirken hata oluştu.'
        });
    }
};


const getUserById = async(req, res) => {
    try {
        const user = await Auth.findById(req.user.id).select('-password');

        if (!user){
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı..'
            });
        }

        if (req.user.id !== user._id.toString() && !req.user.isAdmin){
            return res.status(403).json({
                success: false,
                message: 'Erişim izniniz yok!.'
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error('Kullanıcı detayı hata!', error);
        return res.status(500).json({
            success: false,
            message: 'Sunucu hatası !'
        });
    }
};


const createUser = async (req, res) => {

    try {

        const { ad, soyad, email, password, phone, isAdmin } = req.body;

        const passwordHash = await bcrypt.hash(password, 12);

        const newUser = await Auth.create({
            ad,
            soyad,
            email,
            password: passwordHash,
            phone,
            isAdmin: isAdmin || false
        });

        res.status(201).json({
            success: true,
            message: "Yeni kullanıcı başarıyla eklendi.",
            user: {
                id: newUser._id,
                ad: newUser.ad,
                soyad: newUser.soyad,
                email: newUser.email,
                number: newUser.phone,
                isAdmin: newUser.isAdmin
            }
        });
    } catch (error) {
        console.error("Add User Error:", error);
        res.status(500).json({
            success: false,
            message: "Kullanıcı eklenirken hata oluştu."
        });
    }
};

const updateUser = async (req, res) => {

    try {
        const { id } = req.params;
        const {ad,soyad,email,phone,password} = req.body;

        const user = await Auth.findById(id);

        if (!user){
            return res.status(404).json({
                success: false,
                message: 'Böyle bir kullanıcı bulunamadı'
            });
        }

        if(req.user.id !== user._id.toString() && !req.user.isAdmin){
            return res.status(403).json({
                success: false,
                message: 'Bu bilgilere erişme yetkiniz bulunmamaktadır.'
            });
        }

        let passwordHash = user.password;
        if (password) {
            passwordHash = await bcrypt.hash(password, 12);
        }

        user.ad = ad || user.ad;
        user.soyad = soyad || user.soyad;
        user.email = email || user.email;
        user.phone = phone || user.phone;
        user.password = passwordHash;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Kullanıcı başarıyla güncellendi!',
            user: {
                id: user._id,
                ad: user.ad,
                soyad: user.soyad,
                email: user.email,
                phone: user.phone,
                isAdmin: user.isAdmin
            }
        });

    } catch (error) {
        console.error('Kullanıcı güncellenirken hata ', error);
        return res.status(500).json({
            success: false,
            message: 'Sunucu kaynaklı hata kullanıcı güncellenemedi!'
        })
    }
}


const deleteUser = async(req, res) => {
    try {
        const userId = req.params.id;
        const user = await Auth.findByIdAndDelete(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Kullanıcı bulunamadı.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Kullanıcı silindi!'
        });

        res.send({
            message: 'Kullanıcı başarıyla silindi!'
        });
    } catch (error) {
        console.error('Kullanıcı silerken hata', error);
        res.status(500).json({
            success: false,
            message: 'Kullanıcı silinirken bir hata oluştu..'
        });
    }
}



module.exports = { register, login, getUsers, getUserById, createUser, updateUser, deleteUser }