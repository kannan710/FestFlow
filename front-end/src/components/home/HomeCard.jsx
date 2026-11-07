import React, { useContext } from 'react'
import { RxFramerLogo } from "react-icons/rx";
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomeCard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="w-full flex">
      <div className="flex-2 flex flex-col justify-between">
        <div>
          <h2 className="font-bold text-2xl text-white">Welcome to FestFlow Events</h2>
          <h4 className="text-md text-gray-400/50 mt-2">
            Your one-stop portal for our college events. Discover events, register seamlessly, and stay connected with your campus community.
          </h4>
        </div>
        <div className="flex">
          <button
            onClick={() => navigate(user ? "/my_events" : "/login")}
            className="cursor-pointer px-8 py-2 bg-white rounded-md hover:bg-gray-400/50 hover:text-white ease-in duration-150 font-medium text-gray-900"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/events")}
            className="cursor-pointer px-8 py-2 bg-white rounded-md ml-4 hover:bg-gray-400/50 hover:text-white ease-in duration-150 font-medium text-gray-900"
          >
            Events
          </button>
        </div>
      </div>
      <RxFramerLogo className='flex-1 w-full h-[200px] text-white' />
    </div>
  )
}

export default HomeCard
