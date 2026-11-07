import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const getJwtSecret = () => process.env.JWT_SECRET || "secret_key"

const generateToken = (id) => {
    return jwt.sign({ id }, getJwtSecret(), { expiresIn: "7d" })
}

export const registerUser = async (req, res) => {
    const { fullName, userName, email, password, collegeId, phoneNo, role } = req.body

    if (!fullName || !userName || !email || !password || !role)
        return res.status(400).json({ message: "All fields are required" })

    try {
        const existingEmail = await User.findOne({ email: email.toLowerCase().trim() })
        if (existingEmail)
            return res.status(400).json({ message: "Email already in use" })

        const existingUserName = await User.findOne({ userName: userName.trim() })
        if (existingUserName)
            return res.status(400).json({ message: "Username already in use" })

        const newUser = await User.create({
            fullName: fullName.trim(),
            userName: userName.trim(),
            email: email.toLowerCase().trim(),
            password,
            collegeId: collegeId || null,
            phoneNo: phoneNo || null,
            role
        })

        const userObj = newUser.toObject()
        delete userObj.password

        return res.status(201).json({
            message: "User has been created successfully",
            user: userObj,
            token: generateToken(newUser._id)
        })
    }
    catch (err) {
        res.status(500).json({ message: "Error registering user", error: err.message })
    }
}

export const loginUser = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) 
        return res.status(400).json({ message: "All fields are required" })

    try {
        const user = await User.findOne({ email: email.toLowerCase().trim() })

        if (!user) 
            return res.status(404).json({ message: "User not found" })

        const isMatch = await user.comparePassword(password)
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" })

        const userObj = user.toObject()
        delete userObj.password

        return res.status(200).json({
            userId: user._id,
            user: userObj,
            token: generateToken(user._id)
        })
    } catch (err) {
        console.error("Login error:", err)
        return res.status(500).json({ message: "Error logging in", error: err.message })
    }
}

export const getUser = async (req, res) => {
    try {
        res.status(200).json(req.user)
    }
    catch (err) {
        res.status(500).json({ message: "Internal server error", error: err.message })
    }
}
