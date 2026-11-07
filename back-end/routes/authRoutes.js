import express from 'express'
import { getUser, registerUser } from '../controllers/authControllers.js'
import { loginUser } from '../controllers/authControllers.js'
import {authMiddleware} from '../middlewares/authMiddleware.js'


const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/getUser", authMiddleware, getUser)

export default router