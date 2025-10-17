import React from 'react'
import { assets } from '../assets/assets'
const UploadButton = () => {
  return (
    <div>
              <input type="file" id="upload" hidden />
              <label
                htmlFor="upload"
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full cursor-pointer bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:scale-105 transition-all duration-700"
              >
                <img width={20} src={assets.upload_btn_icon} alt="Upload icon" />
                <p className="text-white text-sm">Upload your image</p>
              </label>
    </div>
    
  )
}

export default UploadButton