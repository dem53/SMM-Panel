import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ConfirmBox from '../components/ConfirmBox'
import UrunUpdateModal from './UrunUpdateModal';

function UrunData() {

  const [productData, setProductData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [updatedProduct, setUpdatedProduct]= useState(null);
  const [isUpdateModal, setIsUpdateModal] = useState(false);

  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isConfirmModal, setIsConfirmModal] = useState(false);

  useEffect(() => {
    fetchProductData();
  }, []);

  const fetchProductData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/products`, {
        headers: {
          "Content-Type": 'application/json',
          'Accept': 'application/json'
        }
      });
      if (response.data.products) {
        const data = response.data.products;
        const sortedDatedata = data.sort((a,b) => new Date (b.createdDate) - new Date (a.createdDate))
        setProductData(sortedDatedata);
      }
    } catch (error) {
      setError('Ürün verileri yüklenirken hata');
      console.error('Veri alınırken hata', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteProductFunc = async (id) => {
    if (!id) {
      console.error('Böyle bir ID ait kullanıcı bulunamadı!!');
      return;
    }
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8000/api/product/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Ürün başarıyla silindi!');
      fetchProductData();
    } catch (error) {
      setError('Ürün silinirken hata', error);
      console.error('Ürün silinirken hata ', error);
    }
  };

  
  const formatSellingStatus = (selling) => {
    return selling ? (
      <span className="text-white bg-emerald-500 font-sans p-1 text-xs rounded-md font-medium">Evet</span>
    ) : (
      <span className="text-white bg-red-500 font-sans p-1 text-xs rounded-md font-medium">Hayır</span>
    );
  };

  const formatDiscountStatus = (fakeDiscount) => {
    return fakeDiscount ? (
      <span className="text-white bg-emerald-500 font-sans p-1 text-xs rounded-md font-medium">Evet</span>
    ) : (
      <span className="text-white bg-red-500 font-sans p-1 text-xs rounded-md font-medium">Hayır</span>
    );
  };

  const formatDateToTurkish = (createdDate) => {
    const date = new Date(createdDate);
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTurkishLira = (price) => {
    return price.toLocaleString('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    })
  }

  return (
    <div className='flex container mx-auto items-center justify-center'>
      <div className='w-full overflow-x-auto'>
        {loading ? (
          <div className='text-center'>
            <h2>Yükleniyor...</h2>
          </div>
        ) : error ? (
          <div className='text-center'>
            <h2>{error}</h2>
          </div>
        ) : productData.length > 0 ? (
          <table className="w-full table-auto border-collapse border bg-gray-300 border-gray-300">
            <thead>
              <tr className="bg-gray-700 text-xs font-sans text-white">
                <th className="border border-gray-300 p-2">UUID</th>
                <th className="border border-gray-300 p-2">Logo</th>
                <th className="border border-gray-300 p-2">Adet</th>
                <th className="border border-gray-300 p-2">Platform</th>
                <th className="border border-gray-300 p-2">Kategori</th>
                <th className="border border-gray-300 p-2">Adı</th>
                <th className="border border-gray-300 p-2">Açıklama</th>
                <th className="border border-gray-300 p-2">Etiket</th>
                <th className="border border-gray-300 p-2">Stok</th>
                <th className="border border-gray-300 p-2">Satış Aktif</th>
                <th className="border border-gray-300 p-2">Fake İndirim</th>
                <th className="border border-gray-300 p-2">Satış Fiyatı</th>
                <th className="border border-gray-300 p-2">Oluşturma Tarihi</th>
                <th className="border border-gray-300 p-2">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {productData.map((products) => (
                <tr className={`text-xs ${formatSellingStatus(products.selling === 'true' ? 'bg-sky-200' : products.selling === 'false' ? 'bg-red-200' : 'bg-gray-200')} text-center  bg-gray-200`} key={products._id}>
                  <td className="border border-gray-300 p-2">{(products._id).slice(3, 15)}</td>
                  <td className="border w-12 border-gray-300 p-2">
                    <img src={`http://localhost:8000${products.imageUrl}`}
                      alt={products.name}
                      className='object-cover rounded-lg'
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder.jpg';
                      }}
                    />
                  </td>
                  <td className="border border-gray-300 p-2">{products.size}</td>
                  <td className="border border-gray-300 p-2">{products.platform}</td>
                  <td className="border border-gray-300 p-2">{products.category}</td>
                  <td className="border border-gray-300 p-2">{products.name}</td>
                  <td className="border border-gray-300 p-2">{products.description}</td>
                  <td className="border border-gray-300 p-2">{products.tags}</td>
                  <td className="border border-gray-300 p-2">{products.stock}</td>
                  <td className="border border-gray-300 text-xs p-2">{formatSellingStatus(products.selling)}</td>
                  <td className="border border-gray-300 text-xs p-2">{formatDiscountStatus(products.fakeDiscount)}</td>
                  <td className="border border-gray-300 text-xs p-2">{(formatTurkishLira(products.price))}</td>
                  <td className="border border-gray-300 p-2">{formatDateToTurkish(products.createdDate)}</td>

                  <td className='border border-gray-300 p-3 flex flex-row items-center justify-center gap-2'>
                    <button type='button'
                      onClick={() => {
                        setUpdatedProduct(products); 
                        setIsUpdateModal(true); 
                      }}
                      className='bg-blue-500 cursor-pointer px-2 text-xs rounded-md p-1 text-white'>
                      Güncelle
                    </button>
                    <button type='button'
                      onClick={() => { 
                        setDeleteUserId(products._id); 
                        setIsConfirmModal(true); 
                      }}
                      className='bg-red-500 cursor-pointer px-2 text-xs rounded-md p-1 text-white'>
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className='text-center'>
            <h2>Gösterilecek Ürün Verisi Bulunamadı.</h2>
          </div>
        )}
      </div>

      {/* Update Modal */}
      <UrunUpdateModal 
        isOpen={isUpdateModal}
        onClose={() => setIsUpdateModal(false)}
        data={updatedProduct}
        id={updatedProduct ? updatedProduct._id : null}
      />

      {/* Confirm Delete Modal */}
      <ConfirmBox
        isOpen={isConfirmModal}
        onClose={() => setIsConfirmModal(false)}
        message='Ürünü silmek istediğinizden emin misiniz?'
        onConfirm={() => {
          if (deleteUserId) {
            deleteProductFunc(deleteUserId);
          }
        }}
      />
    </div>
  );
}

export default UrunData;
