import Event from '../models/Event.js'

export const createEvent = async (req, res) => {
    const userId = req.user._id || req.user.id
    const { title, description, venue, event_date, event_deadline, max_mem } = req.body

    if (!title || !description || !venue || !event_date || !event_deadline || !max_mem)
        return res.status(400).json({ message: "All fields are required" })

    if (Number(max_mem) <= 0)
        return res.status(400).json({ message: "Maximum participants must be greater than 0" })

    try {
        const event = new Event({
            title: title.trim(),
            description: description.trim(),
            venue: venue.trim(),
            event_date,
            event_deadline,
            max_mem: Number(max_mem),
            userId,
            participants: []
        })

        await event.save()
        res.status(201).json({ message: "Event successfully created", event })
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message })
    }
}

export const getAllEvents = async (req, res) => {
    try {
        const { search, status } = req.query
        let query = {}

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { venue: { $regex: search, $options: "i" } }
            ]
        }

        const now = new Date()
        if (status === "upcoming") {
            query.event_date = { $gt: now }
        } else if (status === "ongoing") {
            query.event_date = { $lte: now }
            query.event_deadline = { $gte: now }
        } else if (status === "completed") {
            query.event_deadline = { $lt: now }
        }

        const events = await Event.find(query)
            .populate("userId", "fullName userName email role")
            .populate("participants", "fullName userName email collegeId phoneNo")
            .sort({ event_date: 1 })

        // College-wide stats
        const totalEvents = await Event.countDocuments()
        const upcomingEvents = await Event.countDocuments({ event_date: { $gt: now } })
        const ongoingEvents = await Event.countDocuments({
            event_date: { $lte: now },
            event_deadline: { $gte: now }
        })
        const completedEvents = await Event.countDocuments({ event_deadline: { $lt: now } })

        res.status(200).json({
            events,
            stats: { totalEvents, upcomingEvents, ongoingEvents, completedEvents }
        })
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message })
    }
}

export const getMyEvents = async (req, res) => {
    const userId = req.user._id || req.user.id
    const userRole = req.user.role

    try {
        const now = new Date()
        let query = {}

        if (userRole === "admin") {
            query = { userId }
        } else {
            query = { participants: userId }
        }

        const events = await Event.find(query)
            .populate("userId", "fullName userName email role")
            .populate("participants", "fullName userName email collegeId phoneNo")
            .sort({ event_date: 1 })

        // Stats for current user's scope
        const totalEvents = await Event.countDocuments(query)
        const upcomingEvents = await Event.countDocuments({
            ...query,
            event_date: { $gt: now }
        })
        const ongoingEvents = await Event.countDocuments({
            ...query,
            event_date: { $lte: now },
            event_deadline: { $gte: now }
        })
        const completedEvents = await Event.countDocuments({
            ...query,
            event_deadline: { $lt: now }
        })

        res.status(200).json({
            events,
            stats: { totalEvents, upcomingEvents, ongoingEvents, completedEvents },
            role: userRole
        })
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message })
    }
}

export const getEvent = async (req, res) => {
    const eventId = req.params.id

    try {
        const event = await Event.findById(eventId)
            .populate("userId", "fullName userName email role")
            .populate("participants", "fullName userName email collegeId phoneNo")

        if (!event) {
            return res.status(404).json({ message: "Event not found" })
        }

        res.status(200).json(event)
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message })
    }
}

export const editEvent = async (req, res) => {
    const eventId = req.params.id
    const userId = req.user._id || req.user.id
    const { title, description, venue, event_date, event_deadline, max_mem } = req.body

    if (!title || !description || !venue || !event_date || !event_deadline || !max_mem)
        return res.status(400).json({ message: "All fields are required" })

    try {
        const event = await Event.findById(eventId)
        if (!event)
            return res.status(404).json({ message: "Event not found" })

        // Permission: event creator or admin
        if (event.userId.toString() !== userId.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not authorized to edit this event" })
        }

        event.title = title.trim()
        event.description = description.trim()
        event.venue = venue.trim()
        event.event_date = event_date
        event.event_deadline = event_deadline
        event.max_mem = Number(max_mem)

        const updatedEvent = await event.save()
        res.status(200).json({ message: "Event updated successfully", event: updatedEvent })
    }
    catch (err) {
        res.status(500).json({ message: "Failed to update event", error: err.message })
    }
}

export const deleteEvent = async (req, res) => {
    const eventId = req.params.id
    const userId = req.user._id || req.user.id

    try {
        const event = await Event.findById(eventId)
        if (!event)
            return res.status(404).json({ message: "Event not found" })

        if (event.userId.toString() !== userId.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "You are not authorized to delete this event" })
        }

        await Event.findByIdAndDelete(eventId)
        res.status(200).json({ message: "Event deleted successfully" })
    } catch (err) {
        res.status(500).json({ message: "Failed to delete event", error: err.message })
    }
}

export const registerForEvent = async (req, res) => {
    const eventId = req.params.id
    const userId = req.user._id || req.user.id

    try {
        const event = await Event.findById(eventId)
        if (!event)
            return res.status(404).json({ message: "Event not found" })

        const now = new Date()
        if (new Date(event.event_deadline) < now) {
            return res.status(400).json({ message: "Registration deadline has passed" })
        }

        const isRegistered = event.participants.some(p => p.toString() === userId.toString())
        if (isRegistered) {
            return res.status(400).json({ message: "You are already registered for this event" })
        }

        if (event.participants.length >= event.max_mem) {
            return res.status(400).json({ message: "Event has reached maximum capacity" })
        }

        event.participants.push(userId)
        await event.save()

        const updatedEvent = await Event.findById(eventId)
            .populate("userId", "fullName userName email role")
            .populate("participants", "fullName userName email collegeId phoneNo")

        res.status(200).json({ message: "Successfully registered for the event", event: updatedEvent })
    } catch (err) {
        res.status(500).json({ message: "Error registering for event", error: err.message })
    }
}

export const cancelRegistration = async (req, res) => {
    const eventId = req.params.id
    const userId = req.user._id || req.user.id

    try {
        const event = await Event.findById(eventId)
        if (!event)
            return res.status(404).json({ message: "Event not found" })

        const isRegistered = event.participants.some(p => p.toString() === userId.toString())
        if (!isRegistered) {
            return res.status(400).json({ message: "You are not registered for this event" })
        }

        event.participants = event.participants.filter(p => p.toString() !== userId.toString())
        await event.save()

        const updatedEvent = await Event.findById(eventId)
            .populate("userId", "fullName userName email role")
            .populate("participants", "fullName userName email collegeId phoneNo")

        res.status(200).json({ message: "Registration canceled successfully", event: updatedEvent })
    } catch (err) {
        res.status(500).json({ message: "Error canceling registration", error: err.message })
    }
}

export const getEventParticipants = async (req, res) => {
    const eventId = req.params.id
    try {
        const event = await Event.findById(eventId)
            .populate("participants", "fullName userName email collegeId phoneNo role")

        if (!event)
            return res.status(404).json({ message: "Event not found" })

        res.status(200).json({ participants: event.participants, title: event.title })
    } catch (err) {
        res.status(500).json({ message: "Error fetching participants", error: err.message })
    }
}
