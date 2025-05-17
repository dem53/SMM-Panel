import React from 'react'
import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';

function YonetimPage() {

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
            if (isAdmin === 'true'){
                setisAdmin(true);
                navigate('/yonetim');
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
    <div>Yonetim</div>
  )
}

export default YonetimPage