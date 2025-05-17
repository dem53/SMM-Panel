import React from 'react'
import Header from '../components/Header'
import KrediÖdemeContent from '../components/KrediÖdemeContent'

function KrediÖdeme() {
    return (

        <div className='flex flex-col'>
            <div>
                <Header />
            </div>

            <div>
                <KrediÖdemeContent />
            </div>
        </div>

    )
}

export default KrediÖdeme