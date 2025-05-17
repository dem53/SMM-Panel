import React from 'react'
import WebLogo from '../images/weblogo.png'
import { FaArrowLeft, FaStar } from 'react-icons/fa6'
import { Link, useNavigate } from 'react-router-dom'
import Login from '../components/Login'
import { useState, useEffect } from 'react';
import Register from '../components/Register'


function GirisContent() {

    useEffect(() => {
        authTokenControl();
    }, []);

    const authTokenControl = () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/giris');
                return;
            }
            if (token) {
                navigate('/');
                return;
            }
        } catch (error) {
            console.error('auth token kontrol hatası', error);
        }
    }

    const [showModalLogin, setShowModalLogin] = useState(true);
    const [showModalRegister, setShowModalRegister] = useState(false);

    const navigate = useNavigate();

    return (
        <div className='w-full h-screen'>
            <div className='flex items-center justify-center h-full w-full'>
                <div className='w-full lg:w-1/2 bg-blue-100/50 h-full flex flex-col gap-8'>

                    <div className='flex items-center justify-around mt-16 gap-8'>
                        <div className='w-36'>
                            <Link to={'/'}>
                                <img src={WebLogo} />
                            </Link>

                        </div>

                        <div className='flex items-center justify-center gap-2'>
                            <FaArrowLeft />
                            <Link to={'/'} >
                                <h1 className='font-sans font-stretch-75%'>Siteye Geri Dön</h1>
                            </Link>
                        </div>
                    </div>

                    {showModalLogin && (
                        <div className='flex flex-col items-center justify-center mt-4 gap-3'>
                            <div className='mt-10 flex items-center justify-center gap-2'>
                                <h1 className='font-stretch-90% font-semibold tracking-wide font-sans text-2xl'>Hesabınla Giriş Yap</h1>
                                <FaStar className='text-yellow-500' size={20} />
                            </div>

                            <div>
                                <h2 className='font-stretch-90% font-extralight font-sans text-base'>Hesabına hemen giriş yap ve avantajlardan faydalan.</h2>
                            </div>

                            <div className='mt-12'>
                                <Login />
                            </div>


                        </div>
                    )}

                    {showModalRegister && (
                        <div className='flex flex-col items-center justify-center mt-4 gap-3'>
                            <div className='mt-10 flex items-center justify-center gap-2'>
                                <h1 className='font-stretch-90% font-semibold font-sans text-2xl'>Üyelik Bilgilerini Tamamla</h1>
                                <FaStar className='text-yellow-500' size={20} />
                            </div>

                            <div>
                                <h2 className='font-stretch-90% font-extralight font-sans text-base'>Bilgileri doldurarak üyeliğini tamamla.</h2>
                            </div>

                            <div className='mt-12'>
                                <Register />
                            </div>


                        </div>
                    )}

                    {showModalRegister && (
                        <div className='flex items-center justify-center gap-2'>
                            <h2>SosyalBoost Hesabınız var mı ?</h2>
                            <button onClick={() => {
                                setShowModalRegister(false);
                                setShowModalLogin(true)
                            }} className='bg-blue-500 text-sm p-1 cursor-pointer rounded-lg text-white font-sans font-stretch-75%' type='button'>Giriş Yap</button>
                        </div>
                    )}

                    {showModalLogin && (
                        <div className='flex items-center justify-center gap-2'>
                            <h2>SosyalBoost Hesabınız Yok mu ?</h2>
                            <button onClick={() => {
                                setShowModalLogin(false);
                                setShowModalRegister(true)
                            }} className='bg-emerald-500 cursor-pointer text-sm p-1 rounded-lg text-white font-sans font-stretch-75%' type='button'>+ Üye Ol</button>
                        </div>
                    )}


                </div>

                <div className='hidden w-full lg:flex items-end justify-center login-right md:w-1/2 h-full'>
                    <div className='flex flex-col items-center rounded-xl mb-6 p-5  w-full bg-white/30 justify-center gap-6'>
                        <div className='w-48'>
                            <Link to={'/'}>
                                <img src={WebLogo} />
                            </Link>

                        </div>

                        <div>
                            <h1 className='text-3xl font-sans font-stretch-75% font-extrabold text-black'>Fenomen Olma Vakti !</h1>
                        </div>

                        <div>
                            <h1 className='text-2xl font-sans font-stretch-75% font-light text-black'>Tek bir gönderi, binlerce kalbe dokunabilir.</h1>
                        </div>

                        <div>
                            <h1 className='text-base font-sans font-stretch-75% font-extrabold text-black'>Kendini Şımart.</h1>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default GirisContent