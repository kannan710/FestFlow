import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { LuCirclePlus, LuArrowLeft } from "react-icons/lu";
import { toast } from 'react-toastify'
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";

const CreateEvent = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    venue: "",
    event_date: "",
    event_deadline: "",
    max_mem: ""
  });

  // Protect route: require admin
  useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/events");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (state) {
      setEventData({
        title: state?.title || "",
        description: state?.description || "",
        venue: state?.location || "",
        event_date: state?.date ? state.date.split("T")[0] : "",
        event_deadline: state?.deadline ? state.deadline.split("T")[0] : "",
        max_mem: state?.max || ""
      });
    } else if (id) {
      axiosInstance.get(API_PATHS.EVENT.GET_SINGLE_EVENT(id))
        .then(res => {
          const e = res.data;
          if (e) {
            setEventData({
              title: e.title || "",
              description: e.description || "",
              venue: e.venue || "",
              event_date: e.event_date ? e.event_date.split("T")[0] : "",
              event_deadline: e.event_deadline ? e.event_deadline.split("T")[0] : "",
              max_mem: e.max_mem || ""
            });
          }
        })
        .catch(err => {
          console.error("Failed to fetch event data", err);
          toast.error("Failed to load event details");
        });
    }
  }, [state, id]);

  const handleChange = (key, value) => setEventData(prev => ({ ...prev, [key]: value }));

  const handleAddEvent = async () => {
    const { title, description, venue, event_date, event_deadline, max_mem } = eventData;

    if (!title || !description || !venue || !event_date || !event_deadline || !max_mem) {
      return toast.error("All fields are required");
    }

    if (Number(max_mem) <= 0) {
      return toast.error("Maximum participants must be at least 1");
    }

    if (new Date(event_deadline) > new Date(event_date)) {
      return toast.error("Registration deadline cannot be after the event date");
    }

    setLoading(true);
    try {
      if (id) {
        await axiosInstance.put(API_PATHS.EVENT.EDIT_EVENT(id), {
          title, description, venue, event_date, event_deadline, max_mem: Number(max_mem)
        });
        toast.success("Event successfully updated");
      } else {
        await axiosInstance.post(API_PATHS.EVENT.CREATE_EVENT, {
          title, description, venue, event_date, event_deadline, max_mem: Number(max_mem)
        });
        toast.success("Event successfully created");
      }
      navigate("/my_events");
    }
    catch(err) {
      console.error("Error saving event:", err);
      toast.error(err.response?.data?.message || "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col justify-between bg-bg-primary">
      <Navbar />
      <div className="w-full flex-1 bg-bg-primary flex justify-center items-center py-8">
        <div className="card w-[800px] max-w-[90vw] px-6 py-6 border border-white/10 bg-[#16203b] rounded-lg">
          <div className="flex gap-2 text-xl items-center text-white font-semibold mb-2">
            <LuCirclePlus className="w-7 h-7 text-sky-400" />
            {id ? "Edit Event" : "Create New Event"}
          </div>

          <h3 className="font-semibold text-sm mt-3 text-white">Event Title</h3>
          <input
            type="text"
            placeholder="e.g. Annual Tech Fest 2026"
            value={eventData.title}
            className="outline-none mt-1 w-full border border-white/50 bg-transparent px-3 py-1.5 text-sm text-white rounded-sm"
            onChange={({ target }) => handleChange("title", target.value)}
          />

          <h3 className="font-semibold text-sm mt-3 text-white">Description</h3>
          <textarea
            placeholder="Provide event details, schedule, requirements..."
            value={eventData.description}
            className="h-24 outline-none mt-1 w-full border border-white/50 bg-transparent px-3 py-1.5 text-sm text-white rounded-sm resize-none"
            onChange={({ target }) => handleChange("description", target.value)}
          />

          <h3 className="font-semibold text-sm mt-3 text-white">Venue</h3>
          <input
            type="text"
            placeholder="e.g. Main Auditorium / Lab 3"
            value={eventData.venue}
            className="outline-none mt-1 w-full border border-white/50 bg-transparent px-3 py-1.5 text-sm text-white rounded-sm"
            onChange={({ target }) => handleChange("venue", target.value)}
          />

          <div className="flex gap-4 w-full mt-1">
            <div className="flex-1">
              <h3 className="font-semibold text-sm mt-3 text-white">Event Date</h3>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={eventData.event_date}
                className="outline-none mt-1 w-full border border-white/50 bg-transparent px-3 py-1.5 text-sm text-white rounded-sm"
                onChange={({ target }) => handleChange("event_date", target.value)}
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm mt-3 text-white">Registration Deadline</h3>
              <input
                type="date"
                value={eventData.event_deadline}
                min={new Date().toISOString().split("T")[0]}
                className="outline-none mt-1 w-full border border-white/50 bg-transparent px-3 py-1.5 text-sm text-white rounded-sm"
                onChange={({ target }) => handleChange("event_deadline", target.value)}
              />
            </div>
          </div>

          <h3 className="font-semibold text-sm mt-3 text-white">Maximum Participants</h3>
          <input
            type="number"
            min="1"
            placeholder="e.g. 100"
            value={eventData.max_mem}
            className="outline-none mt-1 w-full border border-white/50 bg-transparent px-3 py-1.5 text-sm text-white rounded-sm"
            onChange={({ target }) => handleChange("max_mem", target.value)}
          />

          <div className="flex justify-between items-center mt-6">
            <Link to={"/my_events"}>
              <button
                type="button"
                className="cursor-pointer border border-white/50 bg-gray-500/30 hover:bg-gray-500/50 text-white px-4 py-1.5 text-sm font-medium rounded-md flex items-center gap-2 transition-colors"
              >
                <LuArrowLeft className="w-5 h-5" />
                Cancel
              </button>
            </Link>
            <button
              type="button"
              onClick={handleAddEvent}
              disabled={loading}
              className="cursor-pointer border-none bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm px-5 py-1.5 rounded-md flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <LuCirclePlus className="w-5 h-5" />
              {loading ? "Saving..." : (id ? "Update Event" : "Create Event")}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateEvent;
