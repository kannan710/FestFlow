import express from 'express'
import {
    createEvent,
    getEvent,
    getMyEvents,
    getAllEvents,
    editEvent,
    deleteEvent,
    registerForEvent,
    cancelRegistration,
    getEventParticipants
} from '../controllers/eventControllers.js'
import { authMiddleware, optionalAuthMiddleware, authorizeRoles } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post("/create", authMiddleware, authorizeRoles("admin"), createEvent)
router.get("/events", authMiddleware, getMyEvents)
router.get("/all-events", optionalAuthMiddleware, getAllEvents)
router.get("/event/:id", optionalAuthMiddleware, getEvent)
router.put("/edit/:id", authMiddleware, editEvent)
router.delete("/delete/:id", authMiddleware, deleteEvent)
router.post("/event/:id/register", authMiddleware, registerForEvent)
router.post("/event/:id/cancel-registration", authMiddleware, cancelRegistration)
router.get("/event/:id/participants", authMiddleware, getEventParticipants)

export default router
