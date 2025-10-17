import React from 'react'
import UploadButton from './UploadButton'
const Upload = () => {
    return (
        <div className=''>
            <h1 className=" text-center text-2xl md:text-3xl lg:text-4xl mt-10 mb-10 leading-loose tracking-wide font-semibold bg-gradient-to-r from-gray-900 to-gray-400 bg-clip-text text-transparent py-6 md:py-16">
                See the magic. Try now
            </h1>
            <div className=" text-center mb-24">
                <UploadButton />
            </div>
        </div>
    )
}

export default Upload