import React from 'react'
import Header from '../components/Header'
import PageContentHeader from '../components/PageContentHeader'
import { FaInstagram } from 'react-icons/fa6'
import { useState, useEffect } from 'react';
import axios from 'axios';

function InstagramHizmetler() {


    const [instaHizmetlerData, setİnstaHizmetlerData] = useState([]);


    useEffect(() => {
        instagramPaketlerData();
    }, [])

const instagramPaketlerData = async () => {
    
    try {
        const response = await axios.get(`http://localhost:8000/api/products`, {
            'Content-Type': 'application/json'
        });

        if (response.data) {
            setİnstaHizmetlerData(response.data.products);
        }

        const data = response.data.products

        console.log("DATAAAAAA", data);

        const instaPaketdata = data.filter((product) => 
            product.platform.includes('Instagram')
        );

        const instaKategoriData = instaPaketdata.filter((product) => 
            product.category && product.category.includes('Takipçi') || product.category.includes('Beğeni')
        );

        console.log("INSTA PAKET", instaKategoriData);

        const uniqueCategory = new Set(instaKategoriData.map(product => product.category));

        const instaCategoryCount = uniqueCategory.size;

        console.log("INSTA KATEGORİ", instaCategoryCount);
        

    } catch (error) {
        console.error('Ürünler alınırken hata', error);
        throw new Error('Ürünler getirilirken hata', error);
    }
};


    return (
        <div className='flex flex-col gap-4'>
            <div>
                <Header />
            </div>

            <div className='mt-10'>
                <PageContentHeader
                    icon={<FaInstagram />}
                    tittle={'Instagram Hizmetleri'}
                    subtittle={"Instagram'da ihtiyaçlarınıza uygun paketlerle etkileşimi artırmaya ve hesabınızı geliştirmeye hazır mısınız?"}
                />
            </div>
        </div>
    )
}

export default InstagramHizmetler