import axios from 'axios';
import { useState, useEffect } from 'react';
import PaymentForm from './PaymentForm';

function OdemeContent() {

    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const [showPayment, setShowPayment] = useState(false);
    const [order, setOrder] = useState(null);


    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        phone: '',
        paymentMethod: 'credit_card',
    });

    useEffect(() => {
        const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(storedCartItems);

        const total = storedCartItems.reduce(
            (acc, item) => acc + (item.product.price * item.quantity),
            0
        );
        setTotalAmount(total);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const calculateTotalQuantity = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    const handleSubmit = async (e) => {

        e.preventDefault();


        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const sessionId = localStorage.getItem('sessionId');

            const orderData = {
                userId: userId,
                sessionId: !userId ? sessionId : null,
                items: cartItems.map((item) => ({
                    product: item.product._id,
                    quantity: item.quantity,
                    price: item.product.price,
                    link: item.link,
                })),
                totalAmount,
                name: formData.name,
                surname: formData.surname,
                email: formData.email,
                phone: formData.phone,
                paymentMethod: formData.paymentMethod,
            };

            console.log(orderData, 'order');

            const response = await axios.post('http://localhost:8000/api/orders/add', orderData, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },

                params: {
                    sessionId: sessionId,
                }
            });
            setOrder(response.data);
            setShowPayment(true);

        } catch (error) {
            console.error('Sipariş oluşturulurken hata:', error);
            alert(error.response?.data?.message || 'Sipariş oluşturulurken bir hata oluştu!');
        }
    };

    const formatTurkishLira = (price) => {
        return price.toLocaleString('tr-TR', {
            style: 'currency',
            currency: 'TRY',
        });
    };


    const handlePaymentForm = async () => {
        try {
            const token = localStorage.getItem('token');
            const sessionId = localStorage.getItem('sessionId');

            await axios.delete('http://localhost:8000/api/cart/clear', {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json',
                },
                data: {
                    sessionId: sessionId
                }
            });
            localStorage.removeItem('cartItems');
            alert('Ödeme sayfasına yönlendiriliyorsunuz...');
            setTimeout(() => {
                navigate('/');
            }, 1500)
        } catch (error) {
            console.error('Sepet temizlenirken hata:', error);
        }
    };


    if (cartItems.length === 0) {
        return (
            <section className="container mx-auto mt-20 bg-sky-100 p-5">
                <div className="bg-white rounded-lg p-8 shadow-xl text-center">
                    <h1 className="text-2xl font-semibold mb-4">Sepetiniz Boş</h1>
                    <p className="text-gray-600">Ödeme yapmak için sepetinizde ürün bulunmalıdır.</p>
                </div>
            </section>
        );
    }

    return (
        <section className="container mx-auto mt-20 bg-sky-100 p-5">
            <div className="flex items-start flex-wrap md:flex-nowrap gap-8 justify-center w-full">
                {/* Form Bölümü */}
                <div className="bg-white w-full md:w-1/2 rounded-lg p-8 shadow-xl">
                    <form onSubmit={handleSubmit}>
                        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-700">Sipariş Formu</h1>

                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm text-gray-600">Adınız</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={formData.name}
                                    placeholder='Ad'
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600">Soyadınız</label>
                                <input
                                    type="text"
                                    name="surname"
                                    className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={formData.surname}
                                    onChange={handleChange}
                                    placeholder='Soyad'
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600">E-posta Adresiniz</label>
                                <input
                                    type="email"
                                    name="email"
                                    className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={formData.email}
                                    placeholder='E-Mail'
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600">Telefon Numaranız</label>
                                <input
                                    type="text"
                                    name="phone"
                                    className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    maxLength={11}
                                    placeholder='(05XX XXX XX XX)'
                                    required
                                />
                            </div>

                            <div>
                                <label className="text-sm text-gray-600">Ödeme Yöntemi</label>
                                <select
                                    name="paymentMethod"
                                    className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    value={formData.paymentMethod}
                                    onChange={handleChange}
                                >
                                    <option value="credit_card">Kredi Kartı</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-between items-center">
                            <p className="text-lg font-semibold">
                                Ödeme Tutarı: <span className="text-emerald-500 text-xl">{formatTurkishLira(totalAmount)}</span>
                            </p>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-emerald-500 text-white font-semibold rounded-md hover:bg-emerald-600 transition duration-300"
                            >
                                Ödemeye Geç
                            </button>
                        </div>
                    </form>

                    {showPayment && order && (
                        <PaymentForm 
                        order={order} 
                        onSuccess={handlePaymentForm}  />
                    )}
                </div>

                {/* Sepet Özeti Bölümü */}
                <div className="bg-white w-full md:w-1/2 shadow-xl rounded-lg p-6">
                    <h2 className="text-xl border-b-2 pb-2 font-semibold mb-4">Sepet Özeti</h2>
                    <div className="space-y-4 mb-6">
                        {cartItems.map((item) => (
                            <div key={item.product._id} className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <img
                                        src={`http://localhost:8000${item.product.imageUrl}`}
                                        alt={item.product.name}
                                        className="w-12 h-12 object-cover rounded-lg shadow-md"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '/placeholder.jpg';
                                        }}
                                    />
                                    <div className="ml-4">
                                        <p className="font-medium">{item.product.platform} {item.product.size} {item.product.category}</p>
                                        <p className="text-sm text-gray-500">Link: {item.link}</p>
                                        <p className="text-xs text-gray-600">{item.product.tags}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{formatTurkishLira(item.product.price * item.quantity)}</p>
                                    <p className="text-sm text-gray-500">Adet: {item.quantity}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-4">
                        <div className="flex justify-between mb-2">
                            <span>Toplam Ürün:</span>
                            <span>{calculateTotalQuantity()} adet</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg mt-4">
                            <span>Toplam Tutar:</span>
                            <span className="text-emerald-500">{formatTurkishLira(totalAmount)}</span>
                        </div>
                    </div>
                </div>
            </div>

        
        </section>
    );
}

export default OdemeContent;