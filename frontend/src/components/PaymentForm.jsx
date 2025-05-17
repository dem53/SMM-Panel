import React, { useState } from 'react';
import axios from 'axios';
import ÖdemeSecenekleri from '../images/odeme-secenekleri.jpg'

const PaymentForm = ({ order, onSuccess }) => {

    const [cardHolderName, setCardHolderName] = useState('');
    const [paymemtData, setPaymemtData] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expireDate, setExpireDate] = useState('');
    const [cvc, setCvc] = useState('');
    const [amount, setAmount] = useState('');

    // Kart numarası geçerliliğini kontrol etme
    const validateCardNumber = (number) => {
        const regex = /^[0-9]{16}$/;
        return regex.test(number);
    };

    // Son kullanma tarihi geçerliliğini kontrol etme
    const validateExpireDate = (date) => {
        const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
        return regex.test(date);
    };

    const [showModalKVKK, setShowModalKVKK] = useState(false);

    const handleShowModalKVKK = () => {
        setShowModalKVKK(!showModalKVKK);
    };

    const handleClick = () => {
        window.scrollTo(0, 0);
    }

    // Ödeme gönderme işlemi
    const handleSubmit = async (e) => {

        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const sessionId = localStorage.getItem('sessionId');

        e.preventDefault();

        console.log("ÖDEME FORM İŞLEM BAŞLATILIYOR.......");


        if (!validateExpireDate(expireDate)) {
            console.error('Son kullanma tarihi MM/YY formatında olmalıdır.');
            return;
        }

        if (!validateCardNumber(cardNumber)) {
            console.error('Kart numarası geçerli olmalıdır (16 haneli).');
            return;
        }

        const [expireMonth, expireYear] = expireDate.split('/');

        const paymentCard = {
            cardHolderName: cardHolderName,
            cardNumber: cardNumber,
            expireMonth: expireMonth,
            expireYear: expireYear,
            cvc: cvc,
            registerCard: '0'
        };

        const buyer = {
            id: userId || sessionId,
            name: order.data.name || 'Kullanici',
            surname: order.data.surname || 'kullanici',
            gsmNumber: order.data.phone ? order.data.phone : '905000000000',
            email: order.data.email ? order.data.email : 'kullanici@sosyalboost.com',
            identityNumber: '74324364791',
            lastLoginDate: '',
            registrationDate: '',
            registrationAddress: null || 'Adres bilgisi yok',
            buyerRegistrationAddress: null || 'Adres bilgisi yok',
            ip: '95.34.231.124',
            city: 'Istanbul', 
            country: 'Turkey',
            zipCode: '34160'
        };

        console.log("BUYER", buyer);


        const shippingAddress = {
            contactName: order.data.name || 'kullanici',
            city: 'Istanbul',
            country: 'Kadıköy',
            address: 'Kadıköy',
            zipCode: '34160'
        };

        const billingAddress = {
            contactName: order.data.name || 'kullanici',
            city: 'Istanbul',
            country: 'Kadıköy',
            address: 'Kadıköy',
            zipCode: '34160'
        };

        const basketItems = [
            {
                id: 'B1231',
                name: 'Binocular',
                category1: 'products',
                category2: 'products',
                itemType: 'PHYSICAL',
                price: amount,
            }
        ];


        const paymentData = {
            userId: userId,
            sessionId: !userId ? sessionId : null,
            orderId: order.data._id,
            price: amount,
            paidPrice: amount,
            conversationId: order.data._id,
            currency: 'TRY',
            basketId: 'B42374',
            paymentCard: paymentCard,
            buyer: buyer,
            shippingAddress: shippingAddress,
            billingAddress: billingAddress,
            basketItems: basketItems
        };

        try {
            const response = await axios.post('http://localhost:8000/api/payment/process', paymentData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },

                params: {
                    sessionId: !token ? sessionId : null,
                }
            });


            console.log("GÖDNERİLEN DATA", paymentData);
            console.log("RESPONSE" , response.data);

            setPaymemtData(response.data);
            setCardHolderName('');
            setCardNumber('');
            setAmount('');
            setCvc('');
            setExpireDate('');
            onSuccess();

            const gonderilenVeri = response.data;
            console.log("VERİİ -----", gonderilenVeri);

            if (response.data.success && response.data.paymentUrl) {
                const paymentUrl = response.data.paymentUrl;
                window.location.href = paymentUrl;
            } else {
                console.error('Ödeme işlemi başarısız: ' + (response.data.message || 'Bilinmeyen hata'));
            }
        } catch (error) {
            console.error('Ödeme işlemi hatası:', error);
            console.error('Ödeme işlemi sırasında bir hata oluştu: ' + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="flex flex-col md:flex-row w-full mx-auto p-6 border border-gray-300 rounded-lg shadow-md bg-white">
            <div className="w-full p-4 flex flex-col ">
                <h2 className="text-2xl font-bold montserrat text-start border-b-2 pb-3 mb-4">Kredi Kartı ile Ödeme</h2>
                <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                    {/* Kart sahibi ismi */}
                    <div className="form-group">
                        <input
                            type="text"
                            id="cardHolderName"
                            value={cardHolderName}
                            onChange={(e) => setCardHolderName(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none raleway py-3 focus:ring focus:ring-blue-300"
                            placeholder='Kart Üzerindeki Ad Soyad'
                        />
                    </div>

                    {/* Kart numarası */}
                    <div className="form-group flex space-x-2">
                        <input
                            type="text"
                            id='cardNumber'
                            value={cardNumber}
                            maxLength={16}
                            onChange={(e) => setCardNumber(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md raleway py-3 focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder="Kart Numarası"
                        />
                    </div>

                    {/* Son kullanma tarihi ve CVC */}
                    <div className='w-full flex items-center justify-center gap-4'>
                        <div className="form-group w-full">
                            <input
                                type="text"
                                id="expireDate"
                                value={expireDate}
                                onChange={(e) => setExpireDate(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none raleway py-3 focus:ring focus:ring-blue-300"
                                placeholder="Ay / Yıl"
                            />
                        </div>
                        <div className="form-group w-full">
                            <input
                                type="text"
                                id="cvc"
                                value={cvc}
                                onChange={(e) => setCvc(e.target.value)}
                                required
                                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none raleway py-3 focus:ring focus:ring-blue-300"
                                placeholder='CVC'
                            />
                        </div>
                    </div>

                    {/* Ödeme tutarı */}
                    <div className="form-group mb-6">
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 opacity-50 rounded-md raleway py-3 focus:outline-none focus:ring focus:ring-blue-300"
                            placeholder='Tutar'

                        />
                    </div>


                    <div className='w-full'>
                        <div className='flex flex-row cursor-pointer h-full items-start justify-center gap-2'>

                            <input type='checkbox'
                                className='border mt-0.5 rounded-md'
                                required

                            />
                            <label className='w-full'>
                                <h1 className='text-xs raleway'>Ödemeyi Tamamla butonuna basarak,
                                    <span onClick={() => (handleShowModalKVKK())}
                                        className='text-red-500 font-light cursor-pointer underline underline-offset-2' >Mesafeli Satış Sözleşmesi</span> ve <span onClick={() => (handleShowModalKVKK())}
                                            className='text-red-500 font-light cursor-pointer underline underline-offset-2' >Güvenlik ve Gizlilik Politikası</span> sözleşmesini kabul etmiş olursunuz.
                                </h1>
                            </label>

                        </div>
                    </div>


                    {/* Ödeme seçenekleri görseli */}
                    <div className='w-full mt-6'>
                        <img className='rounded-xl object-cover' alt='ödeme-2-img' src={ÖdemeSecenekleri} />
                    </div>

                    {/* Ödeme butonu */}
                    <div className='mt-6'>
                        <button onClick={handleClick} type="submit" className="w-full p-2 py-4 my-4 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition duration-200">
                            Ödemeyi Tamamla
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default PaymentForm;
