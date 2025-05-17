import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MdCleaningServices } from "react-icons/md";

function SepetimContent({ isCartOpen, setIsCartOpen, onAddToCart, onRemoveFromCart, onClearCart, cartItems }) {

    if (isCartOpen) return null;

    const cartRef = useRef(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cartRef.current && !cartRef.current.contains(event.target)) {
                setIsCartOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setIsCartOpen]);

    const formatTurkishLira = (price) => {
        return price.toLocaleString('tr-TR', {
            style: 'currency',
            currency: 'TRY',
        });
    };

    const calculateTotalPrice = () => {
        return Array.isArray(cartItems)
            ? cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0)
            : 0;
    };

    const handleClick = () => {
        window.scrollTo(0, 0);
    }

    if (loading) {
        return (
            <div className="fixed top-0 right-0 bg-white shadow-lg w-80 h-full z-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className='container mx-auto '>
            <div className='flex items-center justify-center'>


                <div
                    ref={cartRef}
                    className={` bg-slate-100 shadow-xl shadow-black w-full lg:w-2/3 xl:w-1/2 h-full z-50 p-4 duration-300 transition-transform}`}
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-medium border-b w-full pb-2 raleway mt-4 font-semibold">
                        
                        </h2>
                    </div>

                    {Array.isArray(cartItems) && cartItems.length === 0 ? (
                        <div className="text-center text-gray-500 my-10">
                            <p>Sepetinizde hiç ürün bulunmamaktadır.</p>
                            <Link to={'/'} >
                                <button type='button' className='rounded-lg border p-1 px-2 border-hidden mt-4 bg-blue-500 text-white font-sans font-stretch-75% text-sm'>
                                    Ürünleri Keşfet
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-300px)]">
                                {Array.isArray(cartItems) && cartItems.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between  pb-3">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={`http://localhost:8000${item.product.imageUrl}`}
                                                alt={item.product.name}
                                                className="w-10 h-10 object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/placeholder.jpg';
                                                }}
                                            />
                                            <div>
                                                <h3 className="font-semibold text-xs raleway">{item.product.platform} {item.product.size} {item.product.category}</h3>
                                                <p className="text-xs my-0.5 text-gray-500 font-semibold">Link: {item.link}</p>

                                                <p className="text-xs text-gray-600 montserrat mt-1">
                                                    {formatTurkishLira(item.product.price)} x {item.quantity}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex cursor-pointer flex-row py-1 rounded-md justify-evenly items-center gap-2 shadow-sm border border-gray-400">
                                            <button
                                                onClick={() => {
                                                    onAddToCart(item.product).finally(() => setLoading(false));
                                                    window.location.reload();
                                                }}
                                                className="text-green-500 transition-colors hidden cursor-pointer duration-300 ease-in-out px-2 rounded-full text-xs font-semibold"
                                            >
                                                +
                                            </button>
                                            <span className="text-xs montserrat hidden font-bold text-gray-700">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => {
                                                    onRemoveFromCart(item.product._id).finally(() => setLoading(false));
                                                    window.location.reload();
                                                }}
                                                className="text-red-500 p-1 transition-colors cursor-pointer  duration-300 ease-in-out  text-xs font-semibold"
                                            >
                                                <MdCleaningServices />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12 bg-slate-100 shadow-2xl rounded-md p-4 ">
                                <div className="flex flex-col gap-4">
                                  

                                    <div className="flex justify-between items-center">
                                        <h3 className="text-xl font-semibold">Genel Toplam:</h3>
                                        <p className="text-xl font-extrabold">
                                            {formatTurkishLira(calculateTotalPrice())}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setLoading(true);
                                            onClearCart().finally(() => setLoading(false));
                                            window.location.reload();
                                        }}
                                        className="bg-white text-black border border-gray-500 w-full px-5 py-3 raleway hover:bg-gray-100 cursor-pointer rounded-sm transition duration-300 ease-in-out"
                                    >
                                        Sepeti Temizle
                                    </button>

                                    <button
                                        onClick={() => navigate('/odeme', { state: { cartItems } }, handleClick())}
                                        className="bg-emerald-600 border-black hover:bg-emerald-500 w-full text-white px-5 py-3 raleway cursor-pointer rounded-sm transition duration-300 ease-in-out"
                                    >
                                        Alışverişi Tamamla
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SepetimContent;