import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'
const Footer = () => {
    return (
        <div className=' flex items-center justify-between gap-4 px-4 py-3 lg:px-44 mb-3'>
            <Link to='/'> <img className='w-32 sm:w-44' src={assets.logo} alt="" /></Link>
            <p className='flex-1 border-1 pl-4 text-sm max-sm:hidden text-gray-500'>| All rights reserved. Copyright @bg removal</p>
           
            <div className='flex gap-1'>
                <img className=''src={assets.facebook_icon } alt="" />
                <img src={assets.google_plus_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
            </div>
        </div>
    )
}

export default Footer