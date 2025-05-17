import React from 'react'
import UserData from '../components/UserData'
import Header from '../components/Header'

function KullanıcıYonetimi() {
  return (
        <div className='flex flex-col'>
            <div>
                <Header />
                <UserData />
            </div>
        </div>
  )
}

export default KullanıcıYonetimi