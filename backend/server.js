const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const multer = require('multer');
const dotenv = require('dotenv');
const db = require('./config/db');
const Auth = require('./routes/authRoutes');
const Product = require('./routes/productRoutes');
const Cart = require('./routes/cartRoutes');
const Favorite = require('./routes/favoriteRoutes');
const Order = require('./routes/orderRoutes');
const Payment = require('./routes/paymentRoutes');


// DIŞ BAĞLANTI
dotenv.config();

// SERVER && APP
const app = express();

// DB
db();

// CORS
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://sandbox-api.iyzipay.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// Route
app.use('/', Auth);
app.use('/', Product);
app.use('/', Cart);
app.use('/', Favorite);
app.use('/', Order);
app.use('/', Payment);


// Multer ayarları
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda çalışıyor...`);
});