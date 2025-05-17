import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaUsers, FaBox, FaChartLine, FaCog, FaSignOutAlt, FaInstagram, FaTiktok, FaYoutube, FaQuestionCircle, FaInfoCircle, FaEnvelope } from 'react-icons/fa'

function SideBar({ isAdmin }) {

    const location = useLocation();

    const adminMenuItems = [
        {
            path: '/yonetim/kullanici',
            name: 'Kullanıcı Yönetimi',
            icon: <FaUsers className="text-xl" />
        },
        {
            path: '/yonetim/urunler',
            name: 'Ürün Yönetimi',
            icon: <FaBox className="text-xl" />
        },
        {
            path: '/yonetim/istatistikler',
            name: 'İstatistikler',
            icon: <FaChartLine className="text-xl" />
        },
        {
            path: '/yonetim/ayarlar',
            name: 'Ayarlar',
            icon: <FaCog className="text-xl" />
        }
    ];

    const userMenuItems = [
        {
            path: '/istagram-hizmetler',
            name: 'Instagram',
            icon: <FaInstagram className="text-xl" />
        },
        {
            path: '/tiktok-hizmetler',
            name: 'Tiktok',
            icon: <FaTiktok className="text-xl" />
        },
        {
            path: '/youtube-hizmetler',
            name: 'YouTube',
            icon: <FaYoutube className="text-xl" />
        },
        {
            path: '/diger-hizmetler',
            name: 'Diğer Hizmetler',
            icon: <FaBox className="text-xl" />
        },
        {
            path: '/sss',
            name: 'S.S.S',
            icon: <FaQuestionCircle className="text-xl" />
        },
        {
            path: '/hakkimizda',
            name: 'Hakkımızda',
            icon: <FaInfoCircle className="text-xl" />
        },
        {
            path: '/iletisim',
            name: 'İletişim',
            icon: <FaEnvelope className="text-xl" />
        }
    ];

    const menuItems = isAdmin ? adminMenuItems : userMenuItems;

    return (
        <div className='fixed top-16 rounded-tl-2xl mt-0.5 right-0 h-screen w-72 bg-white shadow-lg border-l border-gray-200 z-50'>
 
            <nav className='h-full flex flex-col'>
                <div className='flex-1 px-4 py-6'>
                    <div className='space-y-2'>
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                                    location.pathname === item.path
                                        ? 'bg-emerald-50 text-emerald-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                {item.icon}
                                <span className='font-medium'>{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <div className='p-4 border-t border-gray-200'>
                    <button className='flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200'>
                        <FaSignOutAlt className="text-xl" />
                        <span className='font-medium'>Çıkış Yap</span>
                    </button>
                </div>
            </nav>
        </div>
    )
}

export default SideBar