import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUser } from 'react-icons/fa6';

function Login() {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:8000/api/login`, {
        email,
        password
      });

      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userName', user.ad);
      localStorage.setItem('userSurname', user.soyad);
      localStorage.setItem('userIsAdmin', user.isAdmin);
      navigate('/');
      console.log("DATA VERi", response.data);
      console.log("USER", user);
    } catch (error) {
      setError(error, 'Bir hata oluştu');
      setLoading(false);
    }
  }


  return (
    <div className='container mx-auto'>
      <div className='flex items-center justify-center bg-sky-200 rounded-lg min-w-80  shadow-2xl p-5'>
        <form onSubmit={handleSubmit} className='flex flex-col  w-full items-center cursor-pointer justify-center p-5 gap-4'>


      
        <div className='mb-4 w-full text-center pb-2 border-b border-gray-400'>
            <h1 className='text-3xl  font-bold'>Giriş Yap</h1>
          </div>


          <div className='flex items-center relative justify-center w-full flex-col gap-1'>
            <FaUser className='absolute left-3' />
            <input
              type='email'
              name='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='E-Posta Adresi'
              className='border rounded-md text-sm font-stretch-75% font-sans bg-gray-200 w-full p-2 text-center'
            />
          </div>

          <div className='flex items-center justify-center relative w-full flex-col gap-1'>

            <FaLock className='absolute left-3' />

            <input
              type='password'
              name='password'
              value={password}
              id='password'
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Şifre'
              className='border text-sm font-stretch-75% font-sans rounded-md p-2 w-full bg-gray-200 text-center'
            />
          </div>
          <div className='flex items-center flex-col mt-4 justify-center w-full gap-4'>
            <button type='submit' className='p-1 text-sm rounded-md cursor-pointer bg-emerald-500 w-full hover:bg-emerald-600 duration-300 text-white text-center px-4'>
              Giriş Yap
            </button>

            <button type='button' className='p-1 text-sm rounded-md bg-slate-200 cursor-pointer hover:bg-gray-700 hover:text-white duration-300 w-full text-gray-800 text-center px-4'>
              Şifremi Unuttum
            </button>

          </div>

        </form>
      </div>
    </div>
  )
}

export default Login