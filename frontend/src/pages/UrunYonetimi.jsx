import React from 'react'
import Header from '../components/Header'
import UrunYonetimiContent from '../components/UrunYonetimiContent'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


function UrunYonetimi() {

  const navigate = useNavigate();
  const [authToken, setauthToken] = useState(false);
  const [isAdmin, setisAdmin] = useState(false);

  useEffect(() => {
    adminTokenControl();
  }, []);

  const adminTokenControl = () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        setauthToken(true);
      }
      const isAdmin = localStorage.getItem('userIsAdmin');
      if (isAdmin === 'true') {
        setisAdmin(true);
        navigate('/yonetim/urunler');
      } else {
        setisAdmin(false);
        navigate('/');
        return;
      }
    } catch (error) {
      console.error(error, 'Bilinmeyen hata!');
    }
  }

  return (
    <>
    <div className='flex flex-col'>
      <div>
      <Header />
      </div>
      <div className='mt-20'>
      <UrunYonetimiContent />
      </div>
    </div>


    </>
  )
}

export default UrunYonetimi