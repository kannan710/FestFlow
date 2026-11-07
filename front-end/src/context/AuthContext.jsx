import React, { useState, useEffect, createContext } from 'react'
import axiosInstance from '../utils/axiosInstance'
import { API_PATHS } from '../utils/apiPaths'

export const AuthContext = createContext()

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const updateUser = (userData) => {
        setUser(userData)
    }

    const clearUser = () => {
        setUser(null)
        localStorage.removeItem("token")
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            axiosInstance.get(API_PATHS.AUTH.GET_USER)
                .then(res => {
                    if (res.data) setUser(res.data)
                })
                .catch(() => {
                    clearUser()
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            setLoading(false)
        }
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                updateUser,
                clearUser
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
