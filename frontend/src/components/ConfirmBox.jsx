import React from 'react';

const ConfirmBox = ({ isOpen, onClose, onConfirm, message }) => {

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-50">
            <div className="bg-white p-6 rounded  flex  flex-col items-center  justify-center shadow-md">
                <h2 className="text-lg font-semibold font-sans border-b pb-2 mb-4">{message}</h2>
                <div className="flex gap-4 cursor-pointer justify-end">
                    <button onClick={onConfirm} className="bg-red-500 cursor-pointer px-2 text-sm py-1 font-stretch-75% rounded text-white">Evet</button>
                    <button onClick={onClose} className="bg-gray-300 px-2 cursor-pointer text-sm font-stretch-75% py-1 rounded mr-2">Vazgeç</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmBox;