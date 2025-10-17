import React from 'react'
import { assets } from '../assets/assets'
import UploadButton from './UploadButton'

const Header = () => {
  return (
    <div className="flex items-center justify-between max-sm:flex-col-reverse gap-y-10 gap-x-8 px-4 mt-10 sm:mt-20 lg:px-44">
      
      {/* -------- Left Side ---------------- */}
      <div className=" w-full lg:w-1/2">
        <h1 className="text-4xl xl:text-5xl 2xl:text-6xl font-bold text-neutral-700 leading-tight">
          Remove the <br className="max-md:hidden" />
          <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
            background
          </span>{' '}
          from <br className="max-md:hidden" /> images for free.
        </h1>

        <p className="my-6 text-[15px] text-gray-500">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. <br className="max-sm:hidden" />
          Incidunt dignissimos temporibus ipsam fuga.
        </p>
        <UploadButton></UploadButton>
        </div>

      {/* -------- Right Side ---------------- */}
      <div className="w-full lg:w-1/2 max-w-md lg:max-w-none">
        <img src={assets.header_img} alt="Header" className="w-full h-auto" />
      </div>
    </div>
  )
}

export default Header
