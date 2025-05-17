import React from 'react'
import { Link } from 'react-router-dom';
import { FaInstagram, FaTiktok, FaFacebook, FaYoutube, FaTelegram, FaSpotify, FaSoundcloud, FaTwitch, FaGoogle } from "react-icons/fa";
import { RiTwitterXFill } from "react-icons/ri";


function PlatformContent() {

    const platforms = [
        {
            icon: <FaInstagram className='text-white' size={30} />,
            title: 'Instagram',
            subtitle: 'Hizmetleri',
            link: '/instagram-paketler',
            background: 'bg-fuchsia-700',
        },


        {
            icon: <FaTiktok className='text-white' size={30} />,
            title: 'Tiktok',
            subtitle: 'Hizmetleri',
            link: '/tiktok-paketler',
            background: 'bg-black',
        },


        {
            icon: <FaYoutube className='text-white' size={30} />,
            title: 'YouTube',
            subtitle: 'Hizmetleri',
            link: '/youtube-paketler',
            background: 'bg-red-600',
        },


        {
            icon: <FaFacebook className='text-white' size={30} />,
            title: 'Facebook',
            subtitle: 'Hizmetleri',
            link: '/facebook-paketler',
            background: 'bg-blue-600',
        },

        {
            icon: <RiTwitterXFill className='text-white' size={30} />,
            title: 'X (Twitter)',
            subtitle: 'Hizmetleri',
            link: '/x-paketler',
            background: 'bg-gray-800',
        },

        {
            icon: <FaTelegram className='text-white' size={30} />,
            title: 'Telegram',
            subtitle: 'Hizmetleri',
            link: '/telegram-paketler',
            background: 'bg-blue-500',
        },

        {
            icon: <FaSpotify className='text-white' size={30} />,
            title: 'Spotify',
            subtitle: 'Hizmetleri',
            link: '/spotify-paketler',
            background: 'bg-emerald-600',
        },

        {
            icon: <FaSoundcloud className='text-white' size={30} />,
            title: 'Soundcloud',
            subtitle: 'Hizmetleri',
            link: '/soundcloud-paketler',
            background: 'bg-orange-600',
        },

        {
            icon: <FaGoogle className='text-white' size={30} />,
            title: 'Google',
            subtitle: 'Hizmetleri',
            link: '/google-paketler',
            background: 'bg-blue-300',
        },

        {
            icon: <FaTwitch className='text-white' size={30} />,
            title: 'Twitch',
            subtitle: 'Hizmetleri',
            link: '/twitch-paketler',
            background: 'bg-fuchsia-600',
        }


    ];
    return (

        <div className='w-full bg-cyan-100'>
            <div className='container mx-auto py-12 bg-cyan-100 p-10'>
                <div className='flex items-center flex-wrap justify-center'>
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-8 lg:grid-cols-4 xl:grid-cols-5'>
                        {platforms.map((platform, index) => (
                            <div
                                className={`border border-hidden drop-shadow-2xl flex flex-col shadow-2xl items-center justify-center gap-2 rounded-md ${platform.background} p-5`}
                                key={index}
                            >
                                <div>
                                    {platform.icon}
                                </div>


                                <div className='flex flex-col items-center text-white text-sm font-light justify-center'>
                                    <span>{platform.title}</span>
                                    <span>{platform.subtitle}</span>
                                </div>

                                <Link to={platform.link}>
                                    <h1 className='border rounded-sm  bg-gray-200 py-2 bg-opacity-35 text-xs font-light text-center border-gray-500 w-32'>
                                        Paketleri İncele
                                    </h1>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlatformContent