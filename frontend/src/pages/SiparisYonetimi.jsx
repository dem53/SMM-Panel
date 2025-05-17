import React from 'react'
import Header from '../components/Header'
import SiparisData from '../components/SiparisData'

function SiparisYonetimi() {
  return (
        <div className='flex flex-col '>
            <div>
                <Header />
            </div>

            <div>
                <SiparisData />
            </div>
        </div>
  )
}

export default SiparisYonetimi