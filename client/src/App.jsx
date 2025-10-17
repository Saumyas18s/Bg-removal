import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Result from './pages/Result'
import BuyCredit from './pages/BuyCredit'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { SignInButton } from '@clerk/clerk-react'
const App = () => {
  return (
    <div className='min-h-screen bg-slate-50 '>
      <Navbar></Navbar>
       {/* <SignInButton></SignInButton>
        */}
      <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/result' element={<Result></Result>}></Route>
        <Route path='/buy' element={<BuyCredit></BuyCredit>}></Route>
      </Routes>
      
      <Footer></Footer>
    </div>
  )
}

export default App