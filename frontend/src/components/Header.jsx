import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { BiSolidDoorOpen } from "react-icons/bi";
import { FaBarsStaggered } from "react-icons/fa6";
import { useState, useEffect } from 'react';
import WebLogo from '../images/weblogo.png'
import SideBar from './SideBar';
import { FaRegHeart } from "react-icons/fa";
import { CiShop } from "react-icons/ci";
import axios from 'axios'

function Header() {

    const navigate = useNavigate();

    const [authToken, setauthToken] = useState(false);
    const [isAdmin, setisAdmin] = useState(false);

    const [favorites, setFavorites] = useState('');
    const [cart, setCart] = useState('');

    const [showSideBar, setShowSideBar] = useState(false);

    useEffect(() => {
        adminTokenControl();
        favoritesLength();
        cartLength();
    }, []);

    const adminTokenControl = () => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                setauthToken(true);
            }
            const isAdmin = localStorage.getItem('userIsAdmin');

            if (isAdmin === 'true') {
                setisAdmin(true);
            } else {
                setisAdmin(false);
            }
        } catch (error) {
            console.error(error, 'Bilinmeyen hata!');
        }
    }

    const favoritesLength = async () => {

        const token = localStorage.getItem('token');
        const sessionId = localStorage.getItem('sessionId');
        try {
            const response = await axios.get('http://localhost:8000/api/favorites', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },

                params: {
                    sessionId: !token ? sessionId : undefined
                }
            });
            const favoritesData = response.data.data.length;

            if (favoritesData) {
                setFavorites(favoritesData);
            }

        } catch (error) {
            console.error('Veri alınırken hata !!', error);
        }
    }


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

            const cartData = response.data.items.length;
            if (cartData) {
                setCart(cartData);
            }

        } catch (error) {
            console.error('Veri alınırken hata !!', error);
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userIsAdmin');
        navigate('/');
        window.location.reload();
        return;
    }

    const handleClick = () => {
        window.scrollTo(0, 0);
        return;
    }

    return (
        <header className='w-full z-50 absolute bg-black/35 backdrop-blur-sm'>
            <div className='container mx-auto relative py-3.5 flex items-center justify-between px-6'>
                <Link className='cursor-pointer' to={'/'}>
                    <div className='flex items-center justify-center'>
                        <img src={WebLogo} className='w-36 h-auto' />
                    </div>
                </Link>

                <div>
                    <nav className='flex items-center gap-4 justify-center'>

                        <div className='hidden md:flex items-center z-50 font-semibold cursor-pointer font-stretch-90% justify-center gap-4 font-sans text-xs'>

                            {isAdmin && (
                                <div className='flex items-center gap-3 justify-center'>

                                             <Link to={'/yonetim/siparis'} >
                                        <h1>Dashboard</h1>
                                    </Link>
                                    <Link to={'/yonetim/kullanici'} >
                                        <h1>Kullanıcı Yönetimi</h1>
                                    </Link>

                                    <Link to={'/yonetim/urunler'} >
                                        <h1>Ürün Yönetimi</h1>
                                    </Link>

                                    <Link to={'/yonetim/siparis'} >
                                        <h1>Sipariş Yönetimi</h1>
                                    </Link>

                                          <Link to={'/yonetim/siparis'} >
                                        <h1>Ödeme Yönetimi</h1>
                                    </Link>

                                          <Link to={'/yonetim/siparis'} >
                                        <h1>Rapor Yönetimi</h1>
                                    </Link>

                                 

                                    <Link
                                        to={'/favorilerim'}
                                        className="transition-transform hover:scale-110 active:scale-95"
                                        title="Favorilerim"
                                        onClick={handleClick}
                                    >
                                        <div className='relative'>
                                            <div>
                                                <FaRegHeart className="text-white hover:text-emerald-600 transition-colors" size={20} />
                                            </div>
                                            <div className=' bg-red-600 text-white font-sans px-1 rounded-full text-xs absolute z-50 -bottom-3 -right-2'>{favorites}</div>
                                        </div>

                                    </Link>

                                    <Link
                                        to={'/sepetim'}
                                        className="relative transition-transform hover:scale-110 active:scale-95"
                                        title="Sepetim"
                                        onClick={handleClick}
                                    >
                                        <div className='relative'>
                                            <div>
                                                <CiShop className="text-white hover:text-emerald-600 transition-colors" size={20} />
                                            </div>
                                            <div className=' bg-red-600 px-1 font-sans text-white rounded-full text-xs absolute z-50 -bottom-3 -right-2'>{cart}</div>
                                        </div>
                                    </Link>




                                </div>

                            )}

                            {!isAdmin && (
                                <div className='flex items-center gap-4 justify-center'>
                                    <Link to={'/istagram-hizmetler'} >
                                        <h1>Instagram</h1>
                                    </Link>

                                    <Link to={'/tiktok-hizmetler'} >
                                        <h1>Tiktok</h1>
                                    </Link>

                                    <Link to={'/youtube-hizmetler'} >
                                        <h1>YouTube</h1>
                                    </Link>

                                    <Link to={'/diger-hizmetler'} >
                                        <h1>Diğer Hizmetler</h1>
                                    </Link>

                                    <Link to={'/sss'} >
                                        <h1>S.S.S</h1>
                                    </Link>

                                    <Link to={'/hakkimizda'} >
                                        <h1>Hakkımızda</h1>
                                    </Link>

                                    <Link to={'/iletisim'} >
                                        <h1>İletişim</h1>
                                    </Link>

                                    <Link
                                        to={'/favorilerim'}
                                        className="transition-transform hover:scale-110 active:scale-95"
                                        title="Favorilerim"
                                        onClick={handleClick}
                                    >
                                        <div className='relative'>
                                            <div>
                                                <FaRegHeart className="text-white hover:text-emerald-600 transition-colors" size={20} />
                                            </div>
                                            <div className=' bg-red-600 text-white font-sans px-1 rounded-full text-xs absolute z-50 -bottom-3 -right-2'>{favorites}</div>
                                        </div>

                                    </Link>

                                    <Link
                                        to={'/sepetim'}
                                        className="relative transition-transform hover:scale-110 active:scale-95"
                                        title="Sepetim"
                                        onClick={handleClick}
                                    >
                                        <div className='relative'>
                                            <div>
                                                <CiShop className="text-white hover:text-emerald-600 transition-colors" size={20} />
                                            </div>
                                            <div className=' bg-red-600 px-1 font-sans text-white rounded-full text-xs absolute z-50 -bottom-3 -right-2'>{cart}</div>
                                        </div>
                                    </Link>

                                </div>
                            )}


                        </div>


                        {!authToken && (
                            <div className='flex items-center p-1 rounded-md bg-emerald-700 justify-center gap-0'>
                                <button onClick={() => navigate('/giris')} className='py-1 z-50 rounded-lg bg-emerald-700 cursor-pointer hover:bg-emerald-600 ease-in-out duration-500 text-white font-sans px-1 text-sm' type='button'>
                                    Giriş
                                </button>
                                <BiSolidDoorOpen size={18} className='text-slate-200' />

                            </div>
                        )}

                        {authToken && (
                            <button onClick={handleLogout} className='py-1 z-50 rounded-lg bg-red-700 cursor-pointer hover:bg-emerald-600 ease-in-out duration-500 text-white font-sans px-1 text-sm' type='button'>
                                Çıkış Yap
                            </button>
                        )}


                        <div className='right-0 block lg:hidden cursor-pointer'>
                            <FaBarsStaggered onClick={() => setShowSideBar(!showSideBar)} size={18} />
                            {showSideBar && (
                                <div className='flex items-center justify-center'>
                                    <SideBar />
                                </div>

                            )}


                        </div>


                    </nav>
                </div>

            </div>


        </header>


    )
}

export default Header