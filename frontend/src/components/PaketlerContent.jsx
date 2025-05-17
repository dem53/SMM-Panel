import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCheck, FaInstagram, FaStar, FaTiktok, FaYoutube, FaCartPlus, FaTwitter } from 'react-icons/fa6';
import { FaFire } from "react-icons/fa";
import Cart from './Cart';
import FavoriteButton from './FavoriteButton';
import LinkModal from './LinkModal';

function PaketlerContent() {

    const [productData, setProductData] = useState([]);
    const [popularData, setPopularData] = useState([]);

    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(null);
    const [sessionId, setSessionId] = useState(null);

    const [showCartModal, setShowCartModal] = useState(false);
    const [showLinkModal, setShowLinkModal] = useState(false);

    const [platforms, setPlatforms] = useState({
        instagram: true,
        youtube: false,
        twitter: false,
        tiktok: false,
    })

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);



    useEffect(() => {
        const storedSessionId = localStorage.getItem('sessionId');
        if (!storedSessionId || storedSessionId === 'undefined' || storedSessionId === 'null') {
            const newSessionId = 'session_' + Date.now();
            localStorage.setItem('sessionId', newSessionId);
            setSessionId(newSessionId);
        } else {
            setSessionId(storedSessionId);
        }
    }, []);

    useEffect(() => {
        getCartFunc();
    }, [userId, sessionId]);

    useEffect(() => {
        productDataFunc();
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
        } catch (error) {
            console.error('Sepet yüklenirken hata', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async (product) => {
        setSelectedProduct(product);
        setShowLinkModal(true);
    };

    const handleLinkSubmit = async (inputLink) => {
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
                ? { productId: selectedProduct._id, quantity: 1, userId: userId, link: inputLink }
                : { productId: selectedProduct._id, quantity: 1, sessionId: sessionId, link: inputLink };

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
            setShowCartModal(true);
            setShowLinkModal(false);
            setSelectedProduct(null);

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

    const productDataFunc = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:8000/api/products', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response) {
                setProductData(response.data.products);
                const instagramPopular = response.data.products.filter(product =>
                    product.tags.includes('Popüler Paket') &&
                    product.platform.includes('Instagram')
                );
                setPopularData(instagramPopular);
            }
        } catch (error) {
            setError('Veri alınırken hata ile karşılaşıldı');
            console.error('Sunucu hatası', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = (platform) => {
        setPlatforms((prev) => {
            const updatedPlatforms = {
                instagram: false,
                youtube: false,
                twitter: false,
                tiktok: false
            };

            if (prev[platform.toLowerCase()]) {
                updatedPlatforms.instagram = true;
                const instagramFiltered = productData.filter((product) =>
                    product.tags.includes('Popüler Paket') &&
                    product.platform.includes('Instagram')
                );
                setPopularData(instagramFiltered);
            } else {
                updatedPlatforms[platform.toLowerCase()] = true;
                const filtered = productData.filter((product) =>
                    product.tags.includes('Popüler Paket') &&
                    product.platform.includes(platform)
                );
                setPopularData(filtered);
            }

            return updatedPlatforms;
        });
    };



    if (loading) {
        return <div>Loading...</div>;
    }

    const formatTurkishLira = (price) => {
        return price.toLocaleString('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        });
    };

    return (
        <div className='container mx-auto flex items-center flex-col my-6'>
            <div className='flex items-center w-full py-10 my-8 flex-wrap gap-6 bg-gray-200 p-2 justify-between px-4'>
                <div className='w-full flex items-center justify-center lg:w-auto'>
                    <div className='flex items-center gap-4 justify-center'>
                        <span className='px-2 p-2 rounded-md bg-sky-500'>
                            <FaStar className='text-yellow-400' size={25} />
                        </span>
                        <h1 className='text-xl lg:text-2xl font-stretch-75% font-semibold'>POPÜLER PAKETLERİMİZ</h1>
                    </div>
                </div>

                <div className='p-5 w-full lg:w-auto bg-white border border-gray-500 rounded-md'>
                    <div className='flex items-center cursor-pointer justify-center gap-3'>
                        <h2 className='font-stretch-75% font-semibold'>PLATFORMA GÖRE FİLTRELE :</h2>
                        <span
                            className={`p-2 px-2 rounded-md  border-gray-300 ${platforms.instagram ? 'bg-blue-500 text-white' : 'bg-fuchsia-600'}`}
                            onClick={() => handleFilter('Instagram')}
                        >
                            <FaInstagram className='text-white' />
                        </span>

                        <span
                            className={`p-2 px-2 rounded-md  border-gray-300 ${platforms.twitter ? 'bg-blue-500 text-white' : 'bg-sky-500'}`}
                            onClick={() => handleFilter('Twitter')}
                        >
                            <FaTwitter className='text-white' />
                        </span>

                        <span
                            className={`p-2 px-2 rounded-md  ${platforms.youtube ? 'bg-blue-500 text-white' : 'bg-red-500'}`}
                            onClick={() => handleFilter('Youtube')}
                        >
                            <FaYoutube className='text-white' />
                        </span>

                        <span
                            className={`p-2 px-2 rounded-md  ${platforms.tiktok ? 'bg-blue-500 text-white' : 'bg-black'}`}
                            onClick={() => handleFilter('Tiktok')}
                        >
                            <FaTiktok className='text-white' />
                        </span>
                    </div>
                </div>
            </div>

            <div className='flex items-center w-full shadow-lg flex-wrap justify-center p-10 m-0 gap-6'>
                {popularData.length > 0 ? (
                    popularData.map((product) => (
                        <div
                            key={product.id}
                            className={`border border-red-500 relative bg-slate-100 p-5 cursor-pointer justify-center w-80 rounded-lg shadow-2xl flex flex-col items-center`}
                        >
                            <div className='absolute p-1 px-1.5 flex items-center justify-center gap-1 text-center shadow-2xl border bg-red-500 border-hidden rounded-sm top-6 -left-4'>
                                <FaFire size={15} className='text-white' />
                                <h1 className='text-xs font-stretch-75% bg-red-500 text-white text-center font-sans'>Popüler Paket</h1>
                            </div>
                            <div className='flex items-center p-2 h-14 w-14 rounded-md bg-gray-200 justify-center'>
                                <img
                                    src={`http://localhost:8000${product.imageUrl}`}
                                    alt={product.name}
                                    className='w-12 object-cover'
                                />
                            </div>

                            <div className='flex items-center mt-4 justify-center flex-col gap-0'>
                                <h3 className='text-base font-bold'>{product.platform}</h3>
                                <p className='text-gray-700 text-sm font-semibold mb-6'>
                                    +{product.size} {product.category}
                                </p>
                            </div>

                            <div className='flex items-start font-extralight text-sm justify-center flex-col gap-1'>
                                {product.props1 && (
                                    <span className='mb-2 flex items-center justify-center gap-2'>
                                        <FaCheck className='text-emerald-500' size={15} />
                                        <h1 className='font-stretch-75% text-black'> {product.props1}</h1>
                                    </span>
                                )}
                                {product.props2 && (
                                    <span className='mb-2 flex items-center justify-center gap-2'>
                                        <FaCheck className='text-emerald-500' size={15} />
                                        <h1 className='font-stretch-75% text-black'> {product.props2}</h1>
                                    </span>
                                )}
                                {product.props3 && (
                                    <span className='mb-2 flex items-center justify-center gap-2'>
                                        <FaCheck className='text-emerald-500' size={15} />
                                        <h1 className='font-stretch-75% text-black'> {product.props3}</h1>
                                    </span>
                                )}
                                {product.props4 && (
                                    <span className='mb-2 flex items-center justify-center gap-2'>
                                        <FaCheck className='text-emerald-500' size={15} />
                                        <h1 className='font-stretch-75% text-black'> {product.props4}</h1>
                                    </span>
                                )}
                                {product.props5 && (
                                    <span className='mb-2 flex items-center justify-center gap-2'>
                                        <FaCheck className='text-emerald-500' size={15} />
                                        <h1 className='font-stretch-75% text-black'> {product.props5}</h1>
                                    </span>
                                )}
                                {product.props6 && (
                                    <span className='mb-2 flex items-center justify-center gap-2'>
                                        <FaCheck className='text-emerald-500' size={15} />
                                        <h1 className='font-stretch-75% text-black'> {product.props6}</h1>
                                    </span>
                                )}
                            </div>

                            <div className='flex items-center w-full justify-center gap-0 flex-col'>
                                <span className='text-xs font-sans font-light w-1/2 rounded-sm text-center mt-3 text-gray-300 line-through bg-gray-600 p-1 '>
                                    {formatTurkishLira(product.price * 1.40)}
                                </span>
                                <span className='text-xl font-sans w-full rounded-sm text-center text-black bg-gray-200 p-2 font-extrabold'>
                                    {formatTurkishLira(product.price)}
                                </span>
                            </div>

                            <div className='flex items-center justify-center gap-4'>
                                <div className='mt-3 cursor-pointer'>
                                    <FavoriteButton productId={product._id} />
                                </div>

                                <div>
                                    <button onClick={(e) => {
                                        e.preventDefault();
                                        handleAddToCart(product);
                                    }} className='mt-4 bg-blue-500 flex cursor-pointer items-center gap-2 justify-center text-white py-1.5 px-3 text-sm rounded-md hover:bg-blue-600'>
                                        <FaCartPlus size={18} />
                                        <h1 className='text-sm font-sans font-stretch-75%'>Sepete Ekle</h1>
                                    </button>
                                </div>


                            </div>


                        </div>
                    ))
                ) : (
                    <div>Veri bulunamadı</div>
                )}
            </div>

            <Cart
                isCartOpen={showCartModal}
                setIsCartOpen={() => setShowCartModal(false)}
                cartItems={cartItems}
                onAddToCart={handleAddToCart}
                onClearCart={handleClearCart}
                onRemoveFromCart={handleRemoveFromCart}
            />


            <LinkModal
                isOpen={showLinkModal}
                onClose={() => {
                    setShowLinkModal(false);
                    setSelectedProduct(null);
                }}
                onSubmit={handleLinkSubmit}
                product={selectedProduct}
            />

            {showCartModal && (
                <div className='fixed inset-0 bg-black/40 z-20'> </div>
            )}
        </div>
    );
}

export default PaketlerContent;
