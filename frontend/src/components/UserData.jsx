import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import UserAddModal from '../components/UserAddModal';
import UserUpdateModal from './UserUpdateModal';
import ConfirmBox from '../components/ConfirmBox';

function UserData() {
    const navigate = useNavigate();

    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [isUserAddModalOpen, setIsUserAddModalOpen] = useState(false);
    const [isUserUpdateModal, setIsUserUpdateModal] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);
    const [deleteUser, setDeleteUser] = useState(null);



    useEffect(() => {
        adminCheckControl();
        userDataFunction();
    }, []);

    const adminCheckControl = () => {

        const token = localStorage.getItem('token');
        const adminToken = localStorage.getItem('userIsAdmin');

        if (!token) {
            navigate('/');
            return;
        }
        if (adminToken !== 'true') {
            navigate('/');
            return;
        }
        navigate('/yonetim/kullanici');
    };


    const userDataFunction = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:8000/api/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const userDatas = response.data.users;
            setUserData(userDatas);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError('Kullanıcı verileri alınırken hata!');
            console.error('Kullanıcı alınırken hata!', error);
        }
    };

    const deleteUserFunc = async (id) => {
        if (!id) {
            console.error('Böyle bir ID ait kullanıcı bulunamadı !');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:8000/api/user/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUserData(userData.filter(user => user._id !== id));
            alert('Kullanıcı başarıyla silindi.')
        } catch (error) {
            setError(err.response ? err.response.data.message : 'Kullanıcı silinirken bir hata oluştu');
            console.error(err);
        } finally {
            setDeleteUser(null);
        }
    }

    const formatAdminStatus = (isAdmin) => {
        return isAdmin ? (
            <div className="flex items-center justify-center">
                <h1 className="p-1 rounded-md bg-emerald-500 text-white text-sm text-center font-stretch-75% font-sans">Evet</h1>
            </div>
        ) : (
            <div className="flex items-center justify-center">
                <h1 className="p-1 rounded-md bg-red-500 text-white text-sm text-center font-stretch-75% font-sans">Hayır</h1>
            </div>
        );
    };

    return (
        <div className="container mx-auto p-5">
            <div className="flex items-start gap-2 flex-col  mt-14 w-full justify-center p-5 border rounded-lg shadow-2xl border-gray-400">
                <div className="mt-4">
                    <button
                        className="bg-green-700 text-white px-2 py-1 text-sm rounded hover:bg-green-600 my-3 flex items-center"
                        onClick={() => setIsUserAddModalOpen(true)}
                    >
                        Kullanıcı Ekle
                    </button>
                </div>
                <div className="w-full text-center">
                    {loading ? (
                        <h1>Yükleniyor...</h1>
                    ) : error ? (
                        <div className="text-center flex items-center justify-center">
                            <h1>{error}</h1>
                        </div>
                    ) : userData && userData.length > 0 ? (
                        <table className="min-w-full text-xs table-auto">
                            <thead>
                                <tr className="bg-gray-800 text-xs text-white">
                                    <th className="px-4 py-2 border">ID</th>
                                    <th className="px-4 py-2 border">Ad</th>
                                    <th className="px-4 py-2 border">Soyad</th>
                                    <th className="px-4 py-2 border">E-Mail</th>
                                    <th className="px-4 py-2 border">Telefon</th>
                                    <th className="px-4 py-2 border">Admin</th>
                                    <th className="px-4 py-2 border">İşlem</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userData.map((user) => (
                                    <tr key={user._id} className="bg-white border-b">
                                        <td className="px-4 py-2">{user._id.slice(5,15)}</td>
                                        <td className="px-4 py-2">{user.ad}</td>
                                        <td className="px-4 py-2">{user.soyad}</td>
                                        <td className="px-4 py-2">{user.email}</td>
                                        <td className="px-4 py-2">{user.phone}</td>
                                        <td className="px-4 py-2">{formatAdminStatus(user.isAdmin)}</td>
                                        <td className="px-4 py-2 flex items-center justify-center gap-2">
                                            <button onClick={() => {
                                                setSelectedUser(user)
                                                setIsUserUpdateModal(true)
                                            }} type="button" className="p-1 px-2 cursor-pointer bg-blue-600 text-xs rounded-md text-white text-center">
                                                Güncelle
                                            </button>

                                            <button onClick={() => {
                                                setDeleteUser(user._id)
                                                setConfirmOpen(true)
                                            }} type="button" className="p-1 px-2 bg-red-500 cursor-pointer text-xs rounded-md text-white text-center">
                                                Sil
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="text-center">
                            <h1>Kullanıcı verisi bulunamadı.</h1>
                        </div>
                    )}
                </div>

                <UserAddModal
                    isOpen={isUserAddModalOpen}
                    onClose={() => setIsUserAddModalOpen(false)}
                />

                <UserUpdateModal
                    isOpen={isUserUpdateModal}
                    onClose={() => setIsUserUpdateModal(false)}
                    id={selectedUser ? selectedUser._id : null}
                    userData={selectedUser} />

                <ConfirmBox
                    isOpen={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    message='Kullanıcıyı silmek istediğinizden emin misiniz ?'
                    onConfirm={() => {
                        if (deleteUser) {
                            deleteUserFunc(deleteUser);
                        }
                    }} />
            </div>
        </div>
    );
}

export default UserData;
