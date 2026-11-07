import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HomeCard from '../components/home/HomeCard'
import { FeaCard } from '../components/home/FeaCard'
import { useUserAuth } from '../hook/useUserAuth'

const Home = () => {
  useUserAuth()
  return (
    <div className='flex flex-col w-full min-h-screen justify-between bg-bg-primary'>
      <Navbar />
      <div className="pr-20 pl-32 py-8 bg-bg-primary">
        <HomeCard />
      </div>
      <div className="w-full flex justify-center items-center bg-bg-primary gap-4 py-8">
        <FeaCard 
          title="Easy Registration"
          des="Register for events with just a few clicks. No more paperwork or long queues."
        />
        <FeaCard 
          title="Secure & Reliable"
          des="Your data is safe with us. Role-based access ensures proper security for all users."
        />
        <FeaCard 
          title="Real-time Updates"
          des="Get instant insights about event changes, schedules, deadlines and more"
        />
      </div>
      <Footer />
    </div>
  )
}

export default Home
