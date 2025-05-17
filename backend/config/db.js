const mongoose = require('mongoose');

const db = () => {
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Veri tabanı Bağlantı başarılı..');
}).catch((err) => {
    console.log(err, 'Veri tabanı Bağlantı Başarısız');
});
} 

module.exports = db;