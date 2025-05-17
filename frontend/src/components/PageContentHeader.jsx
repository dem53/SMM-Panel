import React from 'react'
import ContentHeaderİmg from '../images/pagecontentheader-bg.png'

function PageContentHeader({ tittle, subtittle, size, icon, text }) {

    return (
        <div className='container bg-gradient-to-l from-emerald-400  to-sky-600 rounded-md mt-4 mx-auto'>
            <div className='h-max rounded-md flex items-center justify-between px-6 w-full'>
                <div className='flex items-start justify-center  p-5 flex-col gap-4'>
                    <div className='mt-6 text-2xl flex items-center justify-center gap-1 text-white'>
                        <div className='p-1 rounded-lg px-2 bg-white/50'>
                            {icon}
                        </div>

                        <div className='p-1 rounded-lg bg-white/50'>
                            <h1 className='text-base font-sans font-stretch-75% px-2'>{size} {text}</h1>
                        </div>
                    </div>

                    <div className='my-4 text-2xl md:text-3xl lg:text-4xl font-sans font-stretch-75% text-white'>
                        <h1>{tittle}</h1>
                    </div>

                    <div className='mb-12 font-light text-xs md:text-sm lg:text-base text-white font-stretch-75%'>
                        <h1>{subtittle}</h1>
                    </div>
                </div>


                <div className='hidden lg:block'>
                    <img src={ContentHeaderİmg} className='object-cover' />
                </div>
            </div>
        </div>
    )
}

export default PageContentHeader;