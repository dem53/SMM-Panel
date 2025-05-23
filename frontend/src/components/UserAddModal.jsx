import React from 'react'
import { useState } from 'react'
import axios from 'axios'

const UserAddModal = ({isOpen, onClose}) => {

    const [formData, setFormData] = useState({
        ad: '',
        soyad: '',
        email: '',
        password: '',
        phone: '',
        isAdmin: false
    });

    const handleChange = (e) => {
        const {name, checked, type, value} = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://localhost:8000/api/user/add`, formData,{
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": 'application/json'
                }
            });
            onClose();
        } catch (error) {
            console.error(err);
            alert('Kullanıcı eklenirken bir hata oluştu: ' + (err.response ? err.response.data.message : err.message));
        }
    }


    if (!isOpen) return null;


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-70">
            <div className="bg-white p-8 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out min-w-96">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Kullanıcı Ekle</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Ad</label>
                        <input
                            type="text"
                            name="ad"
                            value={formData.ad}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Soyad</label>
                        <input
                            type="text"
                            name="soyad"
                            value={formData.soyad}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Şifre</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-medium text-gray-700">Telefon</label>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            maxLength={11}
                            required
                            className="border border-gray-300 p-2 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="mb-4 flex gap-2 items-center">
                        <label className="text-sm block font-medium text-gray-700">Admin</label>
                        <input
                            type="checkbox"
                            name="isAdmin"
                            checked={formData.isAdmin}
                            onChange={handleChange}
                            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />

                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={onClose} className="mr-2 bg-gray-300 p-2 rounded-md hover:bg-gray-400 transition duration-200">İptal</button>
                        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition duration-200">Ekle</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserAddModal