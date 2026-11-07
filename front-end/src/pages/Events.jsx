import React, { useEffect, useState, useContext } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import EventCard from '../components/event/EventCard'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'
import Summery from '../components/event/Summery'
import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'
import { IoSearchOutline } from "react-icons/io5"

const Events = () => {
  const [eventData, setEventData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all") // "all" | "upcoming" | "ongoing" | "completed"

  const { user } = useContext(AuthContext)

  useEffect(() => {
    fetchEvents()
  }, [filter])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      let url = API_PATHS.EVENT.GET_ALL_EVENTS
      const params = []
      if (filter !== "all") params.push(`status=${filter}`)
      if (search.trim()) params.push(`search=${encodeURIComponent(search.trim())}`)
      if (params.length > 0) url += `?${params.join("&")}`

      const response = await axiosInstance.get(url)
      setEventData(response.data)
    }
    catch (err) {
      console.error("Failed to fetch all events:", err)
      toast.error("Failed to load events")
    }
    finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchEvents()
  }

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return

    try {
      await axiosInstance.delete(API_PATHS.EVENT.DELETE_EVENT(id))
      toast.success("Event deleted successfully")
      fetchEvents()
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete event")
    }
  }

  const events = eventData?.events || []
  const isAdmin = user?.role === "admin"

  return (
    <div className='overflow-y-auto min-h-screen w-full flex flex-col justify-between bg-bg-primary'>
      <Navbar />

      <div className="flex-1 w-full bg-bg-primary px-32 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-white/10">
          <div>
            <h1 className="text-3xl text-white font-semibold">Campus Events</h1>
            <p className="text-sm text-gray-400 mt-1">
              Explore and register for college hackathons, workshops, fests, and cultural events.
            </p>
          </div>

          {/* Search bar & filter */}
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="outline-none border border-white/30 bg-transparent px-3 py-1.5 pl-8 text-sm text-white placeholder-gray-400 rounded-md focus:border-sky-400 transition-colors"
              />
              <IoSearchOutline className="absolute left-2.5 top-2.5 text-gray-400 w-4 h-4" />
            </div>
            <button
              type="submit"
              className="cursor-pointer px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-md text-sm font-medium transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-3 mt-4">
          {[
            { id: "all", label: "All Events" },
            { id: "upcoming", label: "Upcoming" },
            { id: "ongoing", label: "Ongoing" },
            { id: "completed", label: "Completed" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`cursor-pointer px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                filter === tab.id
                  ? "bg-sky-600 text-white"
                  : "bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-400">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <p className="text-gray-400 text-lg">No events found matching your criteria.</p>
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

export default Events
