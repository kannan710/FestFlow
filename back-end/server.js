import dotenv from "dotenv"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, ".env") })
dotenv.config()

import express from 'express'
import cors from 'cors'
import connectDb from "./db.js"

import authRoutes from './routes/authRoutes.js'
import eventRoutes from './routes/eventRoutes.js'

const app = express()

app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

app.use(express.json())

connectDb()

app.use("/api/auth", authRoutes)
app.use("/api/admin", eventRoutes)
app.use("/api/events", eventRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
