import react, { use } from 'react';
import Header from '../components/Header'
import SepetimContent from '../components/SepetimContent'
import { useState, useEffect } from 'react';
import axios from 'axios'
import PageContentHeader from '../components/PageContentHeader';
import { CiShop } from 'react-icons/ci';

function Sepetim() {


    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(false);

    const [cart, setCart] = useState('');

    useEffect(() => {
        getCartFunc();
    }, [userId, sessionId]);

    useEffect(() => {
        cartLength();
    }, []);


    const getCartFunc = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            let sessionId = localStorage.getItem('sessionId');

            if (!sessionId || sessionId === 'undefined' || sessionId === 'null') {
                const response = await axios.get(`http://localhost:8000/api/cart`);
                if (response.data.sessionId) {
                    sessionId = response.data.sessionId;
                    localStorage.setItem('sessionId', sessionId);
                    setSessionId(sessionId);
                }
            }

            if (userId) {
                setUserId(userId);
            }

            const response = await axios.get(`http://localhost:8000/api/cart`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : undefined,
                    'Content-Type': 'application/json'
                },
                params: {
                    sessionId: !token ? sessionId : undefined
                }
            });

            if (response.data) {
                setCartItems(response.data.items || []);
                localStorage.setItem('cartItems', JSON.stringify(response.data.items || []));
            }

            console.log(response.data, "DEMİR")
        } catch (error) {
            console.error('Sepet yüklenirken hata', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (product) => {
        try {
            const token = localStorage.getItem('token');
            let sessionId = localStorage.getItem('sessionId');

            if (!sessionId || sessionId === 'undefined' || sessionId === 'null') {
                const response = await axios.get(`http://localhost:8000/api/cart`);
                if (response.data.sessionId) {
                    sessionId = response.data.sessionId;
                    localStorage.setItem('sessionId', sessionId);
                    setSessionId(sessionId);
                }
            }

            const payload = token
                ? { productId: product._id, quantity: 1, userId }
                : { productId: product._id, quantity: 1, sessionId };

            await axios.post('http://localhost:8000/api/cart/add', payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token ? `Bearer ${token}` : '',
                },
                params: {
                    sessionId: !token ? sessionId : undefined
                }
            });

            getCartFunc();

        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Ürün sepete eklenirken bir hata oluştu.');
        }
    };

    const handleRemoveFromCart = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            const sessionId = localStorage.getItem('sessionId');

            if (!token && !sessionId) {
                throw new Error('Oturum bilgisi bulunamadı');
            }

            await axios.delete(`http://localhost:8000/api/cart/remove/${productId}`, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                },
                params: {
                    productId: productId,
                    sessionId: !token ? sessionId : undefined
                }
            });

            getCartFunc();

        } catch (error) {
            console.error('Error removing from cart:', error);
            if (error.response?.status === 404) {
                alert('Ürün sepette bulunamadı. Lütfen sayfayı yenileyip tekrar deneyin.');
            } else {
                alert('Ürün sepetten çıkarılırken bir hata oluştu.');
            }
        }
    };



    const handleClearCart = async () => {
        try {
            const token = localStorage.getItem('token');
            const sessionId = localStorage.getItem('sessionId');

            if (!token && !sessionId) {
                throw new Error('Oturum bilgisi bulunmamadı!')
            }

            const payload = token
                ? { userId: localStorage.getItem('userId') }
                : { sessionId: sessionId };

            await axios.delete(`http://localhost:8000/api/cart/clear`, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                },
                data: payload
            });

            getCartFunc();

        } catch (error) {
            console.error('Sepet temizlenirken hata', error);
            if (error.response?.status === 400) {
                alert('Sepet temizlenirken bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin.');
            } else {
                alert('Sepet temizlenirken hata ile karşılaşıldı');
            }
        }
    };

    const cartLength = async () => {
        const token = localStorage.getItem('token');
        const sessionId = localStorage.getItem('sessionId');
        try {
            const response = await axios.get('http://localhost:8000/api/cart', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                params: {
                    sessionId: !token ? sessionId : undefined
                }
            });
            console.log("DATA1", response);
            const cartData = response.data.items.length;
            if (cartData) {
                setCart(cartData);
            }
            console.log("SEPET SAYISI", cartData);
        } catch (error) {
            console.error('Veri alınırken hata !!', error);
        }
    }



    return (
        <>
            <div className='flex flex-col gap-4'>
                
                <div>
                    <Header />
                </div>

                <div className='mt-10'>
                    <PageContentHeader
                        tittle={'Sepetim'}
                        subtittle={'Sepetinize eklediğiniz ürünleri inceleyin ve satın alma adımını tamamlayın.'}
                        size={cart}
                        icon={<CiShop />}
                        text={'ürün'}
                    />
                </div>

                <div className='mt-0'>

                    <SepetimContent
                        onAddToCart={handleAddToCart}
                        onClearCart={handleClearCart}
                        onRemoveFromCart={handleRemoveFromCart}
                        cartItems={cartItems}

                    />
                </div>

            </div>

        </>
    )
}

export default Sepetim