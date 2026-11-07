import React from 'react'
import { FaCalendar, FaRegEdit } from 'react-icons/fa'
import { FaLocationDot } from 'react-icons/fa6'
import { MdPerson, MdDeleteOutline } from "react-icons/md"
import { Link } from 'react-router-dom'
import moment from 'moment'

const EventCard = ({
  title,
  date,
  location,
  registerations,
  max,
  id,
  description,
  deadline,
  canManage,
  onDelete
}) => {
  const now = new Date();
  const eventDate = new Date(date);
  const eventDeadline = new Date(deadline);

  let status = "Upcoming";
  let statusBadgeClass = "text-white bg-purple-500";

  if (eventDeadline < now) {
    status = "Completed";
    statusBadgeClass = "text-white bg-gray-600";
  } else if (eventDate <= now && eventDeadline >= now) {
    status = "Ongoing";
    statusBadgeClass = "text-white bg-emerald-600";
  } else {
    status = "Upcoming";
    statusBadgeClass = "text-purple-900 bg-purple-300";
  }

  return (
    <div className="px-4 pt-6 h-[330px] border border-gray-600/50 border-t-0 flex flex-col justify-between pb-4">
      <div>
        <div className="w-full flex justify-between items-start gap-2">
          <h2 className="text-white text-xl font-medium line-clamp-1" title={title}>{title}</h2>
          <div className={`${statusBadgeClass} text-xs font-semibold px-2 py-0.5 rounded-md shrink-0`}>
            {status}
          </div>
        </div>
        <h4 className="mt-6 text-gray-400/50 font-medium text-sm flex items-center">
          <FaCalendar className='w-4 h-4 inline mr-2 shrink-0' />
          {moment(date).format('MMMM Do YYYY')}
        </h4>
        <h4 className="mt-2 text-gray-400/50 font-medium text-sm flex items-center">
          <FaLocationDot className='w-4 h-4 inline mr-2 shrink-0' />
          <span className="truncate">{location}</span>
        </h4>
        <div className="w-full pt-4 flex justify-around">
          <div className="flex flex-col justify-center items-center">
            <h4 className="text-sky-600 text-lg font-bold">{registerations ?? 0}</h4>
            <h4 className="text-gray-400/50 text-xs">Registered</h4>
          </div>
          <div className="flex flex-col justify-center items-center">
            <h4 className="text-green-500 text-lg font-bold">{max}</h4>
            <h4 className="text-gray-400/50 text-xs">Max Capacity</h4>
          </div>
        </div>
      </div>

      <div className="flex gap-2 items-center mt-4">
        <Link
          to={`/event/${id}`}
          className='border border-sky-600 text-sky-600 text-center py-1 rounded-md flex-1 hover:text-white hover:bg-sky-600 hover:border-sky-600 ease-in duration-150 text-sm font-medium'
        >
          View
        </Link>
        {canManage && (
          <>
            <Link
              to={`/admin/create/${id}`}
              state={{ title, date, location, registerations, max, description, deadline }}
              title="Edit Event"
            >
              <FaRegEdit className='text-2xl text-gray-300 hover:text-white cursor-pointer transition-colors' />
            </Link>
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(id)}
                title="Delete Event"
                className="cursor-pointer"
              >
                <MdDeleteOutline className='text-2xl text-red-400 hover:text-red-300 transition-colors' />
              </button>
            )}
          </>
        )}
        <Link to={`/event/${id}`} title="View Event & Participants">
          <MdPerson className='text-2xl text-gray-300 hover:text-white cursor-pointer transition-colors' />
        </Link>
      </div>
    </div>
  )
}

export default EventCard
