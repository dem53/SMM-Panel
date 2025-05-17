import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FavoriteButton = ({ productId, title, onSuccess }) => {

  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    checkFavoriteStatus();
  }, [productId]);

  const checkFavoriteStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const sessionId = localStorage.getItem('sessionId');

      const response = await axios.get(
        `http://localhost:8000/api/favorites/check/${productId}`,
        {
          headers: { Authorization: token ? `Bearer ${token}` : '' },
          params: { sessionId: !token ? sessionId : undefined }
        }
      );
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error('Favori durumu kontrol edilirken hata:', error);
    }
  };

  const toggleFavorite = async () => {

    const token = localStorage.getItem('token');
    const sessionId = localStorage.getItem('sessionId');

    setLoading(true);
    try {

      if (isFavorite) {

        await axios.delete(
          `http://localhost:8000/api/favorites/remove/${productId}`,
          {
            headers: { Authorization: token ? `Bearer ${token}` : '' },
            params: { sessionId: !token ? sessionId : undefined }
          }
        );
      } else {

        await axios.post(
          'http://localhost:8000/api/favorites/add',
          { productId },
          {
            headers: { Authorization: token ? `Bearer ${token}` : '' },
            params: { sessionId: !token ? sessionId : undefined }
          }
        );
      }
      setIsFavorite(!isFavorite);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error.response?.data?.message || 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className='flex items-center cursor-pointer justify-center'>
      <button
        onClick={toggleFavorite}
        disabled={loading}
        className={` gap-2 flex items-center cursor-pointer justify-center transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
      >
        {isFavorite ? (
          <div className='flex items-center cursor-pointer justify-center text-center'>
            <FaHeart className="text-red-500 text-xl" />
          </div>

        ) : (
          <div className='flex items-center cursor-pointer justify-center text-center'>
            <FaRegHeart className="text-black hover:text-red-500 text-xl" />
          </div>
        )}
        {
          isFavorite ? (
            <h1>{onSuccess}</h1>
          ) : (
            <span>{title}</span>
          )
        }
      </button>
    </div>

  );
};

export default FavoriteButton;
