import React, { useEffect, useState, useContext } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { LuCirclePlus } from 'react-icons/lu'
import { FaCalendar } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import EventCard from '../components/event/EventCard'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import Summery from '../components/event/Summery'
import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'

const MyEvents = () => {
  const [eventData, setEventData] = useState(null)
  const [loading, setLoading] = useState(false)
  const { user, loading: authLoading } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login")
      return
    }
    if (user) {
      fetchEvents()
    }
  }, [user, authLoading])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(API_PATHS.EVENT.GET_EVENTS)
      setEventData(response.data)
    }
    catch (err) {
      console.error("Failed to fetch events:", err)
      toast.error("Failed to load your events")
    }
    finally {
      setLoading(false)
    }
  }

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event? This cannot be undone.")) {
      return
    }

    try {
      await axiosInstance.delete(API_PATHS.EVENT.DELETE_EVENT(id))
      toast.success("Event deleted successfully")
      fetchEvents()
    } catch (err) {
      console.error("Error deleting event:", err)
      toast.error(err.response?.data?.message || "Failed to delete event")
    }
  }

  const isAdmin = user?.role === "admin"
  const events = eventData?.events || []

  return (
    <div className='overflow-y-auto min-h-screen w-full flex flex-col justify-between bg-bg-primary'>
      <Navbar />
      <div className="flex-1 w-full bg-bg-primary px-32 py-6">
        <div className="flex justify-between items-center pb-4 border-b border-white/10">
          <div>
            <h1 className="text-3xl text-white font-semibold">
              {isAdmin ? "My Created Events" : "My Registered Events"}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {isAdmin
                ? "Manage and track all the events you've published."
                : "All the events you have signed up to participate in."}
            </p>
          </div>
          {isAdmin ? (
            <Link
              to={"/admin/create"}
              className="border-none bg-sky-500 hover:bg-sky-600 transition-colors text-white font-medium text-sm px-4 py-2 rounded-md flex items-center gap-2"
            >
              <LuCirclePlus className="w-5 h-5" />
              Create new event
            </Link>
          ) : (
            <Link
              to={"/events"}
              className="border-none bg-sky-500 hover:bg-sky-600 transition-colors text-white font-medium text-sm px-4 py-2 rounded-md flex items-center gap-2"
            >
              <FaCalendar className="w-4 h-4" />
              Browse College Events
            </Link>
          )}
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <p className="text-gray-400 text-lg">
              {isAdmin
                ? "You haven't created any events yet."
                : "You haven't registered for any events yet."}
            </p>
            {isAdmin ? (
              <Link
                to="/admin/create"
                className="mt-4 px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-md text-sm font-medium transition-colors"
              >
                Create your first event
              </Link>
            ) : (
              <Link
                to="/events"
                className="mt-4 px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-md text-sm font-medium transition-colors"
              >
                Browse & Register for Events
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {events.map((event) => (
              <EventCard
                key={event._id}
                id={event._id}
                title={event.title}
                date={event.event_date}
                location={event.venue}
                registerations={event.participants ? event.participants.length : 0}
                max={event.max_mem}
                description={event.description}
                deadline={event.event_deadline}
                canManage={isAdmin && (event.userId?._id === user?._id || event.userId === user?._id || !event.userId)}
                onDelete={handleDeleteEvent}
              />
            ))}
          </div>
        )}
      </div>

      <Summery
        total={eventData?.stats?.totalEvents}
        upComing={eventData?.stats?.upcomingEvents}
        onGoing={eventData?.stats?.ongoingEvents}
        completed={eventData?.stats?.completedEvents}
      />
      <Footer />
    </div>
  )
}

export default MyEvents
