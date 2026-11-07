import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const AuthLayout = ({children}) => {
  return (
    <div className="w-[100%] h-screen flex flex-col">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}

export default AuthLayout