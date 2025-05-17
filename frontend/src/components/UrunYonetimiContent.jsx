import React from 'react'
import UrunAddModal from './UrunAddModal'
import UrunData from './UrunData'
import { useState } from 'react'
import PopupBox from './PopupBox'

function UrunYonetimiContent() {

    const [showModalEkle, setShowModalEkle] = useState(false);

    const handleClick = () => {
        setShowModalEkle(!showModalEkle);
    }

    const handleClose = () => {
        setShowModalEkle(false)
    }

    return (
        <div className='flex container mx-auto flex-col items-start mt-6 justify-center '>
            <div>
                <button type='button' onClick={handleClick} className='p-2 cursor-pointer w-32 rounded-lg z-50 text-xs bg-emerald-500  text-white'>
                    Ürün Ekle
                </button>
            </div>

            <div className='flex items-center w-full justify-center'>
                <div className='mt-6 w-full shadow-xl'>
                    <UrunData />
                </div>

                <div>

                    {showModalEkle && (
                        <div className='fixed inset-0 bg-black/30 flex items-center justify-center'>
                            <UrunAddModal
                                onClose={handleClose}
                                onAdd={<PopupBox tittle={'Ürün başarıyla eklendi'} />} />
                        </div>
                    )}
                </div>

            </div>
        </div>

    )
}

export default UrunYonetimiContent