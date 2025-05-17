import React from 'react';
import '../css/main.css';
import { FaCircleCheck } from "react-icons/fa6";
import { BsRocketTakeoffFill } from "react-icons/bs";
import Bannerİmg from '../images/banner-img.webp';


function Main() {


    return (

        <div className='w-full main-bg'>
            <div className='flex items-center container  flex-nowrap mx-auto justify-center gap-6'>

                <div className='w-full h-[40rem] relative mt-12 m-10 lg:m-5 md:w-full xl:w-3/4 z-20 flex flex-col items-center lg:items-start justify-center gap-4'>
                    <div className='p-10 ml-0 lg:ml-8 mt-14 md:mt-10 xl:mt-8 bg-white/35 backdrop-blur-md cursor-pointer border border-hidden rounded-lg w-full lg:w-4/5 xl:w-3/5 flex flex-col items-start justify-center gap-4 px-4 drop-shadow-lg shadow-fuchsia-900 shadow-lg'>
                        <div className='px-4 p-2 w-full flex items-center justify-start gap-3 rounded-lg py-3 bg-fuchsia-800'>
                            <BsRocketTakeoffFill size={20} className='text-white animate-pulse shadow-lg' />
                            <h1 className='text-bas font-stretch-75% animate-pulse text-white'>Hızlı Sipariş Oluştur</h1>
                        </div>


                        <div className='w-full border border-gray-500 rounded-lg p-2 flex items-center justify-start gap-2 py-2 px-3 bg-gray-200 text-sm font-sans'>
                            <div>
                                <FaCircleCheck size={20} className='text-emerald-700' />
                            </div>
                            <select className='text-sm p-1 font-semibold'>
                                <option value="">Platform Seç</option>
                                <option value={'instagram'}>Instagram</option>
                                <option value={'tiktok'}>TikTok</option>
                            </select>
                        </div>


                        <div className='w-full border flex border-gray-500 items-center justify-start gap-2 rounded-lg p-2 py-2 px-3 bg-gray-200 text-sm font-sans'>
                            <div>
                                <FaCircleCheck size={20} className='text-emerald-700' />
                            </div>
                            <select className='text-sm p-1 font-semibold'>
                                <option value="">Kategori Seç</option>
                                <option value={'instagram'}>Beğeni</option>
                                <option value={'tiktok'}>İzlenme</option>
                            </select>
                        </div>

                        <div className='w-full border flex border-gray-500 items-center justify-start gap-2 rounded-lg p-1 py-2 px-3 bg-gray-200 text-sm font-sans'>
                            <div>
                                <FaCircleCheck size={20} className='text-emerald-700' />
                            </div>
                            <select className='text-sm p-1 font-semibold'>
                                <option value="">Paket Seç</option>
                                <option value={'instagram'}>Instagram</option>
                                <option value={'tiktok'}>TikTok</option>
                            </select>
                        </div>

                        <div className='w-full flex justify-end mt-2'>
                            <button className='w-full lg:w-auto rounded-lg p-1 px-4 py-2 cursor-pointer font-sans font-stretch-75% bg-orange-500 text-white text-sm' type='button'>SEÇİM YAP</button>
                        </div>
                    </div>


                    <div className='w-full h-full absolute -z-10 -bottom-12 pb-0 xl:w-1/2 lg:hidden flex justify-center gap-4'>
                        <div className='-z-10'>
                            <img className='animate-move ' src={Bannerİmg} alt='Banner' />
                        </div>
                    </div>

                </div>

                <div className='w-full h-full pt-16 pb-0 hidden xl:w-1/2 lg:block justify-start items-start gap-4'>
                    <div className='-z-50 h-full w-full'>
                        <img className='animate-move object-cover' src={Bannerİmg} alt='Banner' />
                    </div>
                </div>


            </div>






        </div>


    );
}

export default Main;
