import React from 'react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmBox from './ConfirmBox';
import { FaCheck, FaClock } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import { MdOutlineDownloading } from "react-icons/md";

function SiparisData() {
  const navigate = useNavigate();

  const authToken = () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const isAdmin = localStorage.getItem('userIsAdmin');
      if (isAdmin === 'true') {
        return;
      } else {
        navigate('/');
        return;
      }
    } catch (error) {
      console.error('Token alınırken hata', error);
    }
  };

  useEffect(() => {
    authToken();
    orderDataFunc();
  }, []);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  const orderDataFunc = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8000/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = response.data.orders;
      const DateDatas = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setOrderData(DateDatas);
      console.log("DATA RES", response.data.orders);
    } catch (error) {
      setError('Sipariş verileri alınırken hata');
      console.error('Sipariş verileri alınırken hata', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFunc = async (orderId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.delete(`http://localhost:8000/api/orders/delete/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        orderDataFunc();
        setShowModal(false);
      }
    } catch (error) {
      console.error('Sipariş silinirken hata', error);
    }
  };


  const handleUpdateFunc = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.patch(`http://localhost:8000/api/orders/update/${selectedOrderId}`, selectedOrder, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        orderDataFunc();
        setShowModal2(false);
      }
    } catch (error) {
      console.error('Sipariş güncellenirken hata', error);
    }
  };


  const getformatTurkishLira = (price) => {
    return price.toLocaleString('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    })
  }


  return (
    <div className="container mx-auto mt-20 p-2">
      {loading ? (
        <div className="text-center text-xl">Yükleniyor...</div>
      ) : error ? (
        <div className="text-center text-xl text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto border-gray-400 shadow-xl">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-800 text-xs text-white">
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">Müşteri Ad Soyad</th>
                <th className="px-4 py-2 text-left">Telefon Numarası</th>
                <th className="px-4 py-2 text-left">Sipariş ID</th>
                <th className="px-4 py-2 text-left">Sipariş</th>
                <th className="px-4 py-2 text-left">Sipariş Durumu</th>
                <th className="px-4 py-2 text-left">Toplam Tutar</th>
                <th className="px-4 py-2 text-left">Sipariş Tarihi</th>
                <th className="px-4 py-2 text-left">Detaylar</th>
              </tr>
            </thead>
            <tbody>
              {orderData && orderData.length > 0 ? (
                orderData.map((order, index) => (
                  <tr key={order.id} className={`border-b font-sans text-sm hover:opacity-85 ${order.status === 'pending' ? 'bg-yellow-50' : order.status === 'success' ? 'bg-emerald-200' : order.status === 'red' ? 'bg-red-200' : order.status === 'loading' ? 'bg-sky-200' : 'bg-gray-100'}`}>
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">
                      {order.name} {order.surname}
                    </td>
                    <td className="px-4 py-2">{order.phone}</td>
                    <td className="px-4 py-2">{order._id.slice(5, 15)}</td>
                    <td className="px-8 pt-3">
                      {Array.isArray(order.items) && order.items.length > 0 ? (
                        order.items.map((item, index) => (
                          <div key={index} className={` space-y-4 flex flex-row min-w-96 justify-between`}>

                            <div className="flex items-center gap-3">
                              <img
                                src={`http://localhost:8000${item.product.imageUrl}`}
                                alt={item.product.name}
                                className="w-4 h-4 object-cover rounded-md shadow-lg border"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = '/placeholder.jpg';
                                }}
                              />
                              <div className="flex flex-col">
                                <strong className="text-xs font-semibold text-gray-700">{item.product.platform}</strong>
                                <span className="text-xs w-36 text-gray-500">{item.product.size} {item.product.category}</span>
                              </div>
                            </div>


                            <div className="flex items-end flex-col">
                              <span className="text-xs font-medium text-gray-600">Sipariş Link:</span>
                              <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-end text-blue-500 hover:underline"
                              >
                                {item.link}
                              </a>
                            </div>

                          </div>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">Sipariş bulunamadı</span>
                      )}
                    </td>

                    <td className="px-4 py-2">
                      {order.status === 'pending' ?
                        <div className=''><FaClock className='text-sky-600' size={20} /></div> :
                        order.status === 'success' ?
                          <div className=''><FaCheck className='text-emerald-800 shadow-xl shadow-amber-50' size={20} /></div> :
                          order.status === 'red' ?
                            <div className=''><MdCancel className='text-red-500' size={25} /></div> :
                            order.status === 'loading' ?
                              <div className=''><MdOutlineDownloading className='text-emerald-600' size={25} /></div> : 'Biinmiyor'
                      }</td>
                    <td className="px-4 py-2"><h1 className=' bg-emerald-500   text-center py-0.5 px-0.5 rounded-md text-white font-semibold'>{getformatTurkishLira(order.totalAmount)}</h1></td>
                    <td className="px-4 py-2">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</td>
                    <td className="px-4 py-2 w-36">
                      <button
                        onClick={() => { setSelectedOrder(order); setSelectedOrderId(order._id); setShowModal2(true); }}
                        className="bg-blue-500 text-white px-2 cursor-pointer text-xs py-1 rounded-md hover:bg-blue-700"
                      >
                        Güncelle
                      </button>

                      <button
                        onClick={() => { setSelectedOrderId(order._id); setShowModal(true); }}
                        className="bg-red-500 text-white cursor-pointer px-2 text-xs py-1 rounded-md hover:bg-red-700 ml-2"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center font-sans font-stretch-75% py-6">Veri bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>



          {showModal && selectedOrderId && (
            <ConfirmBox
              message="Siparişi silmek istediğinize emin misiniz?"
              onConfirm={() => handleDeleteFunc(selectedOrderId)}
              isOpen={() => setShowModal(true)}
              onClose={() => setShowModal(false)}
            />
          )}

          {showModal2 && selectedOrder && (
            <div className="fixed inset-0 bg-black/50  flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-md shadow-lg max-w-lg w-full">
                <h2 className="text-2xl raleway border-b-2 w-full pb-4 mb-6">Sipariş Güncelle</h2>
                <form className='px-0' onSubmit={handleUpdateFunc}>
                  <div className="mb-4">
                    <label className="block mb-2">Ad Soyad</label>
                    <input
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={`${selectedOrder.name} ${selectedOrder.surname}`}
                      onChange={(e) => setSelectedOrder({ ...selectedOrder, name: e.target.value.split(' ')[0], surname: e.target.value.split(' ')[1] })}
                    />
                  </div>

                  <div className='flex flex-row items-center gap-4 justify-center w-full'>
                    <div className="mb-4 w-full">
                      <label className="block mb-2">E-Mail Adresi</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={selectedOrder.email}
                        onChange={(e) => setSelectedOrder({ ...selectedOrder, email: e.target.value })}
                      />
                    </div>

                    <div className="mb-4 w-full">
                      <label className="block mb-2">Sipariş Tutarı</label>
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={selectedOrder.totalAmount}
                        onChange={(e) => setSelectedOrder({ ...selectedOrder, totalAmount: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2">Sipariş Durumu</label>
                    <select
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={selectedOrder.status}
                      onChange={(e) => setSelectedOrder({ ...selectedOrder, status: e.target.value })}
                    >
                      <option value="pending">Beklemede</option>
                      <option value="success">Onaylandı</option>
                      <option value="loading">Yükleniyor</option>
                      <option value="red">Reddedildi</option>
                      <option value="iade">İade Edildi</option>
                    </select>
                  </div>
                  <div className="py-3 px-4 flex flex-row items-center justify-start gap-4">
                    <button type="submit" className="bg-emerald-600 cursor-pointer text-sm font-sans text-white py-1 px-3 rounded-md">Güncelle</button>
                    <button type="button" onClick={() => setShowModal2(false)} className="bg-gray-400 cursor-pointer text-sm font-sans text-white py-1 px-3 rounded-md">İptal</button>
                  </div>
                </form>
              </div>
            </div>
          )}


        </div>
      )}
    </div>
  );
}

export default SiparisData;
