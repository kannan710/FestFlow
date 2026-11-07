import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const getJwtSecret = () => process.env.JWT_SECRET || "secret_key"

export const authMiddleware = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1]

    if(!token)
        return res.status(401).json({message: "No token provided"})
    
    try {
        const decoded = jwt.verify(token, getJwtSecret())
        const user = await User.findById(decoded.id).select("-password")
        if(!user)
            return res.status(401).json({message: "User not found"})
        req.user = user
        next()
    }
    catch(err) {
        res.status(401).json({message: "Token expired or invalid"})
    }
}

export const optionalAuthMiddleware = async (req, res, next) => {
    let token = req.headers.authorization?.split(" ")[1]

    if(!token) {
        return next()
    }
    
    try {
        const decoded = jwt.verify(token, getJwtSecret())
        const user = await User.findById(decoded.id).select("-password")
        if(user) {
            req.user = user
        }
    }
    catch(err) {
        // Token invalid, proceed as guest
    }
    next()
}

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!req.user || !roles.includes(req.user.role)) 
            return res.status(403).json({
                message: "Access denied"
            })
        next();
    }
}
