
import React, { useState } from 'react';

const LinkModal = ({ isOpen, onClose, onSubmit, product }) => {

    const [inputLink, setInputLink] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(inputLink);
        setInputLink('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="bg-sky-100 p-6 rounded-lg shadow-xl flex mx-6 flex-col items-center z-50 w-[40rem]">
                <div className='w-full flex items-center mb-6 justify-center flex-col'>
                    <div>
                        <h2 className="text-xl font-extrabold font-sans font-stretch-75% mb-4">Sipariş Linkini Giriniz</h2>
                    </div>
                    <div>
                        <p className="text-xs text-center font-semibold my-2">Lütfen verdiğiniz sipariş ile ilgili gönderi veya profil bilgilerinizi doğru girdiğinizden emin olunuz.</p>
                        <p className='text-xs  text-center font-semibold my-2'>Ayrıca gizli profillere gönderim sağlanmamaktadır. Lütfen profiliniz gizlideyse, gizliden çıkartın.</p>
                    </div>

                </div>


                <form className='w-full' onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={inputLink}
                        onChange={(e) => setInputLink(e.target.value)}
                        placeholder="Sipariş linkinizi giriniz."
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                        required
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 text-sm cursor-pointer rounded hover:bg-gray-400"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm bg-emerald-500 cursor-pointer text-white rounded hover:bg-emerald-600"
                        >
                            Sepete Ekle
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LinkModal;