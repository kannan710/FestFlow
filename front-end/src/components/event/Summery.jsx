import React from 'react'

const Summery = ({ total, upComing, onGoing, completed }) => {
  return (
    <div className="bg-bg-primary px-32 pb-6 pt-12">
      <h2 className="text-2xl text-white font-normal">Summary</h2>
      <div className="flex justify-between mt-6">
        <div className="flex justify-center items-center flex-col">
          <h4 className='text-3xl text-white font-medium'>{total || 0}</h4>
          <p className="text-md font-thin text-white">Total Events</p>
        </div>
        <div className="flex justify-center items-center flex-col">
          <h4 className='text-3xl text-white font-medium'>{upComing || 0}</h4>
          <p className="text-md font-thin text-white">Upcoming Events</p>
        </div>
        <div className="flex justify-center items-center flex-col">
          <h4 className='text-3xl text-white font-medium'>{onGoing || 0}</h4>
          <p className="text-md font-thin text-white">Ongoing Events</p>
        </div>
        <div className="flex justify-center items-center flex-col">
          <h4 className='text-3xl text-white font-medium'>{completed || 0}</h4>
          <p className="text-md font-thin text-white">Completed Events</p>
        </div>
      </div>
    </div>
  )
}

export default Summery
