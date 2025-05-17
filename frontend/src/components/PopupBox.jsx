import React from 'react'

const PopupBox = ({tittle, onClose}) => {
  return (
        <div className='fixed inset-0 bg-black/30 flex items-center z-50 justify-center'>
            <div className='flex items-center justify-center p-5'>
                <div className='flex items-center p-10 bg-white rounded-lg justify-center gap-4'>
                    <div className='flex items-center justify-center'>
                        <h1>{tittle}</h1>
                    </div>

                    <div>
                        <button className='p-2 text-black border rounded-md ' type='button' onClick={onClose}>Kapat</button>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default PopupBox