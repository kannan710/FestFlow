import { FiCalendar, FiMapPin, FiClock, FiUsers, FiArrowLeft, FiUser, FiEdit2, FiTrash2, FiX, FiCheckCircle } from "react-icons/fi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useEffect, useState, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useParams, useNavigate, Link } from "react-router-dom";
import moment from "moment";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function EventDetail() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.EVENT.GET_SINGLE_EVENT(id));
      setEvent(response.data);
    } catch (err) {
      console.error("Something went wrong", err.message);
      toast.error("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      toast.info("Please sign in to register for this event");
      navigate("/login");
      return;
    }

    setActionLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.EVENT.REGISTER_EVENT(id));
      toast.success("Successfully registered for this event!");
      if (response.data?.event) {
        setEvent(response.data.event);
      } else {
        fetchEvent();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to register for event");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!window.confirm("Are you sure you want to cancel your registration?")) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.EVENT.CANCEL_REGISTRATION(id));
      toast.success("Registration canceled");
      if (response.data?.event) {
        setEvent(response.data.event);
      } else {
        fetchEvent();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel registration");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
      return;
    }

    try {
      await axiosInstance.delete(API_PATHS.EVENT.DELETE_EVENT(id));
      toast.success("Event deleted successfully");
      navigate("/my_events");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete event");
    }
  };

  const registered = event?.participants?.length || 0;
  const total = event?.max_mem || 0;
  const available = Math.max(0, total - registered);
  const progressPercent = total > 0 ? Math.min(100, (registered / total) * 100) : 0;

  const now = new Date();
  const eventDate = event?.event_date ? new Date(event.event_date) : null;
  const eventDeadline = event?.event_deadline ? new Date(event.event_deadline) : null;

  let statusText = "Upcoming";
  let statusBg = "bg-violet-600";

  if (eventDeadline && eventDeadline < now) {
    statusText = "Completed";
    statusBg = "bg-gray-600";
  } else if (eventDate && eventDate <= now && eventDeadline && eventDeadline >= now) {
    statusText = "Ongoing";
    statusBg = "bg-emerald-600";
  }

  const isDeadlinePassed = eventDeadline && eventDeadline < now;
  const isCapacityFull = registered >= total;

  const isUserRegistered = user && event?.participants?.some(
    p => (typeof p === "object" ? p._id === user._id : p === user._id)
  );

  const canManage = user && (
    user.role === "admin" ||
    (event?.userId && (event.userId._id === user._id || event.userId === user._id))
  );

  return (
    <div className="bg-bg-primary min-h-screen px-32 flex flex-col justify-between">
      <Navbar />

      {loading ? (
        <div className="flex-1 flex justify-center items-center text-gray-400 py-20">
          Loading event details...
        </div>
      ) : !event ? (
        <div className="flex-1 flex flex-col justify-center items-center text-gray-400 py-20">
          <p className="text-xl">Event not found.</p>
          <button
            onClick={() => navigate("/events")}
            className="mt-4 px-4 py-2 border border-white/20 text-white rounded-md text-sm hover:bg-white/5 transition-colors"
          >
            Back to Events
          </button>
        </div>
      ) : (
        <div className="flex-1 max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 py-8">

          {/* Left: Main Card */}
          <div>
            <div className="bg-[#232938] border border-white/10 rounded-xl p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-white mb-1">{event.title}</h1>
                  <p className="text-sm text-gray-400 whitespace-pre-line">{event.description}</p>
                </div>
                <span className={`${statusBg} text-white text-sm font-medium px-4 py-1.5 rounded-md shrink-0`}>
                  {statusText}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                {/* Event Date */}
                <div>
                  <p className="flex items-center gap-2 font-medium text-sm text-white mb-1">
                    <FiCalendar className="text-gray-400 w-4 h-4" />
                    Event Date
                  </p>
                  <p className="text-sm text-gray-400">
                    {moment(event.event_date).format('MMMM Do YYYY')}
                  </p>
                </div>

                {/* Venue */}
                <div>
                  <p className="flex items-center gap-2 font-medium text-sm text-white mb-1">
                    <FiMapPin className="text-gray-400 w-4 h-4" />
                    Venue
                  </p>
                  <p className="text-sm text-gray-400">{event.venue}</p>
                </div>

                {/* Registration Deadline */}
                <div>
                  <p className="flex items-center gap-2 font-medium text-sm text-white mb-1">
                    <FiClock className="text-gray-400 w-4 h-4" />
                    Registration Deadline
                  </p>
                  <p className="text-sm text-gray-400">
                    {moment(event.event_deadline).format('MMMM Do YYYY')}
                  </p>
                </div>

                {/* Participants */}
                <div>
                  <p className="flex items-center gap-2 font-medium text-sm text-white mb-1">
                    <FiUsers className="text-gray-400 w-4 h-4" />
                    Participants
                  </p>
                  <p className="text-sm text-gray-400">{registered}/{total} registered</p>
                  <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-violet-600 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="cursor-pointer mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-md border border-white/20 text-sm text-gray-400 hover:bg-white/5 transition-colors"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back to Events
            </button>
          </div>

          {/* Right: Sidebar */}
          <div className="bg-[#232938] border border-white/10 rounded-xl p-5 flex flex-col gap-5 h-fit">

            {/* Organizer */}
            <div className="pb-5 border-b border-white/10">
              <p className="font-semibold text-sm text-white mb-3">Event Organizer</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-gray-400">
                  <FiUser className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {event.userId?.fullName || event.userId?.userName || "Campus Admin"}
                  </p>
                  <p className="text-xs text-gray-400 uppercase">
                    {event.userId?.role || "Admin"}
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="pb-5 border-b border-white/10">
              <p className="font-semibold text-sm text-white mb-3">Event Statistics</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#1a1f2e] rounded-lg p-3 text-center">
                  <p className="text-xl font-semibold text-cyan-400">{registered}</p>
                  <p className="text-xs text-gray-400 mt-1">Registered</p>
                </div>
                <div className="bg-[#1a1f2e] rounded-lg p-3 text-center">
                  <p className="text-xl font-semibold text-green-400">{available}</p>
                  <p className="text-xs text-gray-400 mt-1">Available</p>
                </div>
              </div>
            </div>

            {/* Attendee Action: Register / Cancel */}
            <div className="pb-5 border-b border-white/10">
              <p className="font-semibold text-sm text-white mb-3">Participation</p>
              {!user ? (
                <button
                  onClick={() => navigate("/login")}
                  className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                >
                  Sign In to Register
                </button>
              ) : isUserRegistered ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-center gap-2 py-2 px-3 bg-emerald-500/20 text-emerald-400 rounded-md text-xs font-medium">
                    <FiCheckCircle className="w-4 h-4" /> You are registered!
                  </div>
                  <button
                    onClick={handleCancelRegistration}
                    disabled={actionLoading}
                    className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-red-500/50 text-red-400 hover:bg-red-500/10 text-xs font-medium transition-colors disabled:opacity-50"
                  >
                    Cancel Registration
                  </button>
                </div>
              ) : isDeadlinePassed ? (
                <div className="py-2.5 px-3 bg-white/5 text-gray-400 rounded-md text-xs text-center font-medium">
                  Registration Closed
                </div>
              ) : isCapacityFull ? (
                <div className="py-2.5 px-3 bg-white/5 text-gray-400 rounded-md text-xs text-center font-medium">
                  Event Full (Max Capacity)
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={actionLoading}
                  className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {actionLoading ? "Registering..." : "Register for Event"}
                </button>
              )}
            </div>

            {/* Admin Actions */}
            {canManage && (
              <div>
                <p className="font-semibold text-sm text-white mb-3">Admin Actions</p>
                <div className="flex flex-col gap-2.5">
                  <Link
                    to={`/admin/create/${event._id}`}
                    state={{
                      title: event.title,
                      date: event.event_date,
                      location: event.venue,
                      registerations: registered,
                      max: event.max_mem,
                      description: event.description,
                      deadline: event.event_deadline
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border-2 border-cyan-400 text-cyan-400 text-sm font-medium hover:bg-cyan-400/10 transition-colors"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit Event
                  </Link>

                  <button
                    onClick={() => setShowParticipantsModal(true)}
                    className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border-2 border-cyan-400 text-cyan-400 text-sm font-medium hover:bg-cyan-400/10 transition-colors"
                  >
                    <FiUsers className="w-4 h-4" />
                    View Participants ({registered})
                  </button>

                  <button
                    onClick={handleDeleteEvent}
                    className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-red-500/50 text-red-400 hover:bg-red-500/10 text-xs font-medium transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Delete Event
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Participants Modal */}
      {showParticipantsModal && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4">
          <div className="bg-[#232938] border border-white/10 rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div>
                <h2 className="text-xl font-bold text-white">Registered Participants</h2>
                <p className="text-xs text-gray-400 mt-1">{event?.title}</p>
              </div>
              <button
                onClick={() => setShowParticipantsModal(false)}
                className="cursor-pointer text-gray-400 hover:text-white transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 mt-4">
              {event?.participants?.length === 0 ? (
                <p className="text-gray-400 text-center py-10">No students registered yet.</p>
              ) : (
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="text-xs uppercase bg-[#1a1f2e] text-gray-400">
                    <tr>
                      <th className="px-4 py-2.5">Name</th>
                      <th className="px-4 py-2.5">Username</th>
                      <th className="px-4 py-2.5">Email</th>
                      <th className="px-4 py-2.5">College ID</th>
                      <th className="px-4 py-2.5">Phone</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {event?.participants?.map((participant, index) => (
                      <tr key={participant._id || index} className="hover:bg-white/5">
                        <td className="px-4 py-2.5 text-white font-medium">
                          {participant.fullName || "—"}
                        </td>
                        <td className="px-4 py-2.5">{participant.userName || "—"}</td>
                        <td className="px-4 py-2.5">{participant.email || "—"}</td>
                        <td className="px-4 py-2.5">{participant.collegeId || "—"}</td>
                        <td className="px-4 py-2.5">{participant.phoneNo || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end mt-4">
              <button
                onClick={() => setShowParticipantsModal(false)}
                className="cursor-pointer px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-md text-xs font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
