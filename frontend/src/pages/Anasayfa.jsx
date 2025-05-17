import React from 'react'
import Header from '../components/Header'
import Main from '../components/Main'
import PlatformContent from '../components/PlatformContent'
import PaketlerContent from '../components/PaketlerContent'

function Anasayfa() {
  return (
    <>
      <div className='flex flex-col'>
        <div>
          <Header />
        </div>
        <div className='mt-0'>
          <Main />
        </div>
        <div className=' w-full bg-green-700'>
          <div className='container mx-auto py-5 bg-green-700'>
            <div className='flex items-start justify-start'>
              <h1 className='text-base font-sans font-extralight font-stretch-90% text-white'>Bizi Sosyal Medyadan Takip Etmeyi Unutmayın!</h1>
            </div>
          </div>
        </div>
        <div>
          <PlatformContent />
        </div>
    <div>
      <PaketlerContent />
    </div>


      </div>
    </>
  )
}

export default Anasayfa