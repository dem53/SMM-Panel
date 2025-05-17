import React from 'react'
import Header from '../components/Header';
import FavoriteContent from '../components/FavoriteContent'
import PageContentHeader from '../components/PageContentHeader'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart } from 'react-icons/fa6';

function Favoriler() {

  const [favorites, setFavorites] = useState('');

  useEffect(() => {
    favoritesLength();
  }, []);

  const favoritesLength = async () => {

    const token = localStorage.getItem('token');
    const sessionId = localStorage.getItem('sessionId');
    try {
      const response = await axios.get('http://localhost:8000/api/favorites', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },

        params: {
          sessionId: !token ? sessionId : undefined
        }
      });
      const favoritesData = response.data.data.length;
      console.log("DATA ÖR", favoritesData);
      if (favoritesData) {
        setFavorites(favoritesData);
      }

    } catch (error) {
      console.error('Veri alınırken hata !!', error);
    }
  }

  return (
    <div className='flex flex-col gap-4'>

      <div>
        <Header />
      </div>

      <div className='mt-10'>
        <PageContentHeader
          tittle={'Favorilerim'}
          subtittle={'Favorilerinize eklediğiniz ürünleri inceleyin ve satın alma adımını tamamlayın.'}
          size={favorites}
          icon={<FaHeart />}
          text={'favori'}
        />
      </div>

      <div>
        <FavoriteContent />
      </div>

    </div>
  )
}

export default Favoriler