import mongoose from "mongoose"

const EventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    venue: { type: String, required: true },
    event_date: { type: Date, required: true, default: Date.now },
    event_deadline: { type: Date, required: true, default: Date.now },
    max_mem: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }]
}, {
    timestamps: true
})

const EventModel = mongoose.model("Event", EventSchema)

export default EventModel
