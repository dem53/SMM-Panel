import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PopupBox from './PopupBox';

const UrunUpdateModal = ({ isOpen, onClose, id, data }) => {

    if (!isOpen) return null;

    const [popUp, setPopup] = useState(false);
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        size: '',
        platform: '',
        category: '',
        tags: '',
        stock: '',
        props1: '',
        props2: '',
        props3: '',
        props4: '',
        props5: '',
        props6: '',
        price: '',
        selling: null,
        fakeDiscount: null,
        imageUrl: '',
    });

    useEffect(() => {
        if (data) {
            setProductData({
                name: data.name,
                description: data.description,
                size: data.size,
                platform: data.platform,
                category: data.category,
                tags: data.tags,
                stock: data.stock,
                props1: data.props1,
                props2: data.props2,
                props3: data.props3,
                props4: data.props4,
                props5: data.props5,
                props6: data.props6,
                price: data.price,
                selling: data.selling,
                fakeDiscount: data.fakeDiscount,
                imageUrl: data.imageUrl || null
            });
        };
    }, [data]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProductData(prevData => ({
                ...prevData,
                imageUrl: file
            }));
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProductData({
            ...productData,
            [name]: type === 'checkbox' ? checked : value
        })
    };

    const handlePopup = () => {
        setPopup(true);
    }

    const handleSubmit = async (e) => {
        
        e.preventDefault();
        try {

            const formData = new FormData();

            Object.keys(productData).forEach(key => {
                if (key === 'imageUrl' && productData[key] instanceof File) {
                    formData.append('image', productData[key]);
                } else {
                    formData.append(key, productData[key]);
                }
            });

            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `http://localhost:8000/api/product/update/${id}`,
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data.success) {
                handlePopup();
                setTimeout(() => {
                    onClose();
                }, 2000);
            }

        } catch (error) {
            console.error("Error updating product:", error);
            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert('Ürün güncellenirken bir hata oluştu');
            }
        }
    };

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center'>
            <div className='bg-white rounded-md flex items-center justify-center z-10'>
                <form className='flex flex-col shadow-xl shadow-black flex-1 border-gray-500 border rounded-md p-5' onSubmit={handleSubmit}>

                    <div className='flex items-center justify-center gap-4'>

                        <div>
                            <div className='flex flex-col mb-4'>
                                <label className='block text-xs'>Ürün Adı</label>
                                <input
                                    type='text'
                                    id='name'
                                    name='name'
                                    value={productData.name}
                                    onChange={handleChange}
                                    className='w-48 p-1 rounded-md border'
                                    placeholder='Ürün adı'
                                    required
                                />
                            </div>

                            <div className='flex flex-col mb-4'>
                                <label className='block text-xs'>Ürün Açıklaması</label>
                                <input
                                    type='text'
                                    id='description'
                                    name='description'
                                    value={productData.description}
                                    onChange={handleChange}
                                    className='w-48 p-1 rounded-md border'
                                    placeholder='Ürün açıklaması'
                                    required
                                />
                            </div>

                            <div className="flex flex-col mb-4">
                                <label className="block text-xs font-medium mb-1">Platform *</label>
                                <select
                                    name="platform"
                                    id='platform'
                                    value={productData.platform}
                                    onChange={handleChange}
                                    className="w-48 p-1 border rounded"
                                    required
                                >
                                    <option value="">Seçiniz</option>
                                    <option value="Instagram">Instagram</option>
                                    <option value="Twitter">Twitter</option>
                                    <option value="Youtube">Youtube</option>
                                    <option value="Tiktok">Tiktok</option>
                                    <option value="Facebook">Facebook</option>
                                    <option value="Telegram">Telegram</option>
                                    <option value="Spotify">Spotify</option>
                                    <option value="SoundCloud">SoundCloud</option>
                                    <option value="Twitch">Twitch</option>
                                    <option value="Discord">Discord</option>
                                    <option value="Threads">Threads</option>
                                    <option value="Linkedin">Linkedin</option>
                                    <option value="Google Hizmetleri">Google Hizmetleri</option>
                                    <option value="Pinterest">Pinterest</option>
                                </select>
                            </div>

                            <div className="flex flex-col mb-4">
                                <label className="block text-xs font-medium mb-1">Kategori *</label>
                                <select
                                    name="category"
                                    id='category'
                                    value={productData.category}
                                    onChange={handleChange}
                                    className="w-48 p-1 border rounded"
                                    required
                                >
                                    <option value="">Seçiniz</option>
                                    <option value="Takipçi">Takipçi</option>
                                    <option value="Beğeni">Beğeni</option>
                                    <option value="İzlenme">İzlenme</option>
                                    <option value="Yorum">Yorum</option>
                                    <option value="Paylaşım">Paylaşım</option>
                                    <option value="Kombo Paket">Kombo Paket</option>
                                </select>
                            </div>

                            <div className="flex flex-col mb-4">
                                <label className="block text-xs font-medium mb-1">Adet *</label>
                                <select
                                    name="size"
                                    id='size'
                                    value={productData.size}
                                    onChange={handleChange}
                                    className="w-48 p-1 border rounded"
                                    required
                                >
                                    <option value="">Seçiniz</option>
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                    <option value="250">250</option>
                                    <option value="500">500</option>
                                    <option value="1000">1000</option>
                                    <option value="2500">2500</option>
                                    <option value="5000">5000</option>
                                    <option value="7500">7500</option>
                                    <option value="10000">10000</option>
                                    <option value="15000">15000</option>
                                    <option value="20000">20000</option>
                                    <option value="30000">30000</option>
                                    <option value="50000">50000</option>
                                    <option value="75000">75000</option>
                                    v
                                    <option value="100000">100000</option>
                                    <option value="250000">250000</option>
                                    <option value="500000">500000</option>
                                    <option value="1000000">1000000</option>
                                </select>
                            </div>

                            <div className="flex flex-col mb-4">
                                <label className="block text-xs font-medium mb-1">Etiket *</label>
                                <select
                                    name="tags"
                                    id='tags'
                                    value={productData.tags}
                                    onChange={handleChange}
                                    className="w-48 p-1 border rounded"
                                    required
                                >
                                    <option value="">Seçiniz</option>
                                    <option value="Etiket Yok">Etiket Yok</option>
                                    <option value="Güven Paket">Güven Paketi</option>
                                    <option value="İşletme Paket">İşletme Paketi</option>
                                    <option value="Popüler Paket">Popüler Paket</option>
                                    <option value="Vip Paket">VİP Paket</option>
                                    <option value="İndirimli Paket">İndirimli Paket</option>
                                    <option value="Kampanya">Kampanya</option>
                                    <option value="Çok Satan">Çok Satan</option>
                                </select>
                            </div>

                            <div className='flex items-center justify-center gap-4'>
                                <div className='flex flex-col mb-4'>
                                    <label className='block text-xs'>Stok</label>
                                    <input
                                        type='text'
                                        id='stock'
                                        name='stock'
                                        value={productData.stock}
                                        onChange={handleChange}
                                        className='w-24 p-1 rounded-md border'
                                        placeholder='Ürün stok'
                                        required
                                    />
                                </div>

                                <div className='flex flex-col mb-4'>
                                    <label className='block text-xs'>Fiyat</label>
                                    <input
                                        type='text'
                                        id='price'
                                        name='price'
                                        value={productData.price}
                                        onChange={handleChange}
                                        className='w-24 p-1 rounded-md border'
                                        placeholder='Fiyatı'
                                        required
                                    />
                                </div>

                            </div>


                        </div>

                        <div>

                            <div className='flex flex-col gap-5 mb-4'>
                                <label className='block text-xs'>Özellikler</label>
                                {[...Array(6).keys()].map(i => (
                                    <input
                                        key={i}
                                        type='text'
                                        id={`props${i + 1}`}
                                        name={`props${i + 1}`}
                                        value={productData[`props${i + 1}`]}
                                        onChange={handleChange}
                                        className='w-60 p-1 rounded-md border'
                                        placeholder={`Özellik ${i + 1}`}
                                    />
                                ))}
                            </div>

                            <div className='flex items-center w-full justify-start gap-4'>

                                <div className="mb-4 flex flex-col gap-1 items-start justify-start">
                                    <label className="block text-xs font-medium mb-1">Satışta mı ?</label>
                                    <input
                                        type="checkbox"
                                        name="selling"
                                        id='selling'
                                        checked={productData.selling}
                                        onChange={handleChange}
                                        className="p-1 border rounded"
                                    />
                                </div>

                                <div className="mb-4 flex flex-col gap-1 items-start justify-start">
                                    <label className="block text-xs font-medium mb-1">Sahte İndirim ?</label>
                                    <input
                                        type="checkbox"
                                        name="fakeDiscount"
                                        id='fakeDiscount'
                                        checked={productData.fakeDiscount}
                                        onChange={handleChange}
                                        className="p-1 border rounded"
                                    />
                                </div>
                            </div>



                            <div className='flex flex-col gap-1 mb-4'>
                                <label className='block text-xs font-medium mb-1'>Ürün Görseli</label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    className="w-16 p-1 border rounded"
                                    accept="image/*"
                                />
                            </div>
                            <div className='flex items-center justify-center gap-2'>
                                <button type='submit' className='w-16 bg-emerald-500 cursor-pointer text-xs text-center text-white rounded-md p-2 px-3'>
                                    Güncelle
                                </button>

                                <button type='button' onClick={onClose} className='w-16 bg-red-500 cursor-pointer text-xs text-center text-white rounded-md p-2 px-3'>
                                    Kapat
                                </button>
                            </div>

                            {popUp && (
                                <PopupBox
                                    tittle={'Ürün Başarıyla güncellendi.'}
                                    onClose={() => setPopup(false)} />
                            )}

                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UrunUpdateModal;
