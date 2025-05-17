import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { FaLock, FaPhone, FaUser, FaUserPlus } from 'react-icons/fa6';

function Register() {

  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [authToken, setauthToken] = useState('');

  useEffect(() => {
    tokenControl();
  }, [])

  const tokenControl = () => {
    const token = localStorage.getItem('token');
    if (token) {
      setauthToken(token);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`http://localhost:8000/api/register`, {
        ad,
        soyad,
        email,
        password,
        phone
      });
      console.log("Response", response);
      setSuccess('Kayıt Başarılı. Aramıza hoşgeldiniz!!');
      setAd('');
      setSoyad('');
      setPassword('');
      setEmail('');
      setPhone('');
    } catch (error) {
      setError(err);
    } finally {
      setError(false);
    }
  }

  return (
    <div className='container mx-auto'>
      <div className='flex items-center justify-center bg-emerald-200 rounded-lg min-w-80  shadow-2xl p-5'>
        <form onSubmit={handleSubmit} className='flex flex-col  w-full items-center cursor-pointer justify-center p-5 gap-4'>


          <div className='mb-4 w-full text-center pb-2 relative border-b border-gray-400'>
            <div className='flex items-center gap-2 justify-center'>
              <FaUserPlus size={25} className=' left-3 top-2' />
              <h1 className='text-3xl  font-bold'>Üye Ol</h1>
            </div>

          </div>

          <div className='flex flex-col items-start relative w-full justify-center'>

            <FaUser className='absolute left-3' />
            <input
              type='text'
              name='ad'
              value={ad}
              onChange={(e) => setAd(e.target.value)}
              placeholder='Adınız'
              className='w-full border rounded-sm bg-gray-200 text-center text-sm pl-1 p-2'
              required
            />

          </div>

          <div className='flex flex-col items-start relative w-full justify-center'>
            <FaUser className='absolute left-3' />
            <input
              type='text'
              name='soyad'
              value={soyad}
              onChange={(e) => setSoyad(e.target.value)}
              placeholder='Soyadınız'
              className='w-full border rounded-sm p-2  bg-gray-200 text-sm text-center pl-1'
              required
            />

          </div>

          <div className='flex flex-col relative items-start w-full justify-center'>
            <FaPhone className='absolute left-3' />
            <input
              type='text'
              name='phone'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder='Telefon Numarası'
              className='w-full border rounded-sm p-2 text-sm  bg-gray-200 text-center pl-1'
              required
              maxLength={11}
            />

          </div>

          <div className='flex flex-col items-start relative w-full justify-center'>
            <FaPhone className='absolute left-3' />
            <input
              type='email'
              name='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='E-Posta Adresi'
              className='w-full border rounded-sm p-2 text-sm  bg-gray-200 text-center pl-1'
              required
            />

          </div>

          <div className='flex flex-col items-start relative w-full justify-center'>
            <FaLock className='absolute  left-3' />
            <input
              type='password'
              name='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Sifre'
              className='w-full border rounded-sm p-2 text-sm  bg-gray-200 text-center pl-1'
              required
            />

          </div>



          <button type='submit ' className='p-1 py-2 px-2 bg-emerald-500 relative mt-4 flex items-center justify-center rounded-md text-white w-3/4 text-xs'>
            <FaUserPlus size={15} className='absolute  left-3 top-2' />
            <h1>Üyeliğimi Tamamla</h1>
          </button>

        </form>

      </div>

    </div>
  )
}

export default Register