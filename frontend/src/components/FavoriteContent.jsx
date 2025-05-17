import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa';

const Favorilerim = () => {

    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const token = localStorage.getItem('token');
            const sessionId = localStorage.getItem('sessionId');
            const response = await axios.get('http://localhost:8000/api/favorites', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": 'application/json',
                },
                params: { sessionId: !token ? sessionId : undefined }
            });
            setFavorites(response.data.data);
            console.log("DATA", response);
        } catch (error) {
            console.error('Favoriler yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            const sessionId = localStorage.getItem('sessionId');
            await axios.delete(
                `http://localhost:8000/api/favorites/remove/${productId}`,
                {
                    headers: { Authorization: token ? `Bearer ${token}` : '' },
                    params: { sessionId: !token ? sessionId : undefined }
                }
            );
            setFavorites(favorites.filter(fav => fav.product._id !== productId));
            console.log('Ürün favorilerden kaldırıldı');
        } catch (error) {
            console.error('Ürün kaldırılırken bir hata oluştu');
        }
    };


    const getTurkishFormat = (price) => {
        return price.toLocaleString('tr-TR', {
            style: 'currency',
            currency: 'TRY'
        });
    };

    if (loading) {
        return (
            <div className='flex flex-col min-h-screen'>
                <div className="flex-grow container mx-auto px-4 ">
                    <div className='flex flex-row items-center montserrat gap-2 mb-4'>
                        <div className='text-gray-400'>
                            <Link to='/'>
                                Anasayfa
                            </Link>
                        </div>
                        <div>
                            <h1 className='text-gray-400'>/</h1>
                        </div>
                        <div className='py-4'>
                            <h1 className='text-lg font-semibold text-gray-800'>Favorilerim</h1>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold montserrat border-b-2 pb-3 mb-6">Favorilerim</h1>
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 mt-4">

            <h1 className="text-2xl font-bold montserrat border-b-2 pb-3 mb-6">Favori Paketlerim</h1>

            {favorites.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Henüz favoriniz bulunmuyor.</p>
                    <Link
                        to="/tum_urunler"
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Ürünleri Keşfet
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {favorites.map((favorite) => (
                        <div
                            key={favorite._id}
                            className="border border-gray-300 bg-red-50 rounded-lg pt-4 relative p-2 w-auto overflow-hidden shadow-xl"
                        >
                            <div className='w-full flex items-center justify-between'>
                                <Link to={`/urun/${favorite.product._id}`}>
                                    <div className='absolute top-2 right-2 '>
                                        <FaHeart size={25} className="text-red-500 text-xl" />
                                    </div>
                                    <img
                                        src={`http://localhost:8000${favorite.product.imageUrl}`}
                                        alt={favorite.product.name}
                                        className="h-12 w-12 ml-4 object-cover"
                                    />

                                </Link>
                            </div>
                            <div className="p-4">
                                <h2 className="text-sm montserrat font-semibold mb-2">
                                    {favorite.product.platform} {favorite.product.size} {favorite.product.category}
                                </h2>
        
                                <div className="flex justify-between items-center">
                                    <span className="text-lg montserrat font-bold">
                                        {getTurkishFormat(favorite.product.price)}
                                    </span>
                                    <button
                                        onClick={() => {removeFavorite(favorite.product._id); window.location.reload();}}
                                        className="text-red-500 flex items-center cursor-pointer justify-center gap-1 hover:text-red-700"
                                    >
                                        <h1 className='text-sm raleway'>Çıkar</h1>
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorilerim;