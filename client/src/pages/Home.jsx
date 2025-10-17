import React from 'react'
import Header from '../components/Header'
import Steps from '../components/Steps'
import Bgslider from '../components/Bgslider'
import Testimonials from '../components/Testimonials'
import Upload from '../components/Upload'

const Home = () => {
  return (
    <div>
    <Header></Header>
    <Steps></Steps>
    <Bgslider></Bgslider>
    <Testimonials></Testimonials>
    <Upload></Upload>
    
    </div>
  )
}

export default Home