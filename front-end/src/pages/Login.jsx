import React, { useContext, useState } from 'react'
import AuthLayout from '../layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom'
import { IoIosLogIn } from 'react-icons/io'
import { toast } from 'react-toastify'

import { validateEmail } from '../utils/helper'
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";
import { AuthContext } from '../context/AuthContext'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()
  const { updateUser } = useContext(AuthContext)

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return 
    }
    if (!password) {
      setError("Please enter your password")
      return 
    }
    setError("")
    setLoading(true)

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password
      })
      const { token, user } = response.data
      if (token) {
        localStorage.setItem("token", token)
        updateUser(user)
        toast.success(`Welcome back, ${user.fullName || user.userName}!`)
        if (user.role === "admin") {
          navigate("/my_events")
        } else {
          navigate("/events")
        }
      }
    } catch(err) {
      if (err.response && err.response.data && err.response.data.message) 
        setError(err.response.data.message)
      else
        setError("Invalid email or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="w-[100%] h-[100%] py-8 bg-bg-primary flex justify-center items-center">
        <div className="w-[35%] min-w-[360px] h-full border border-gray-600/50 border-t-0 px-16 py-12 flex flex-col items-center justify-center">
          <IoIosLogIn className='text-sky-400 text-[64px]' />
          <h2 className="text-xl text-white font-medium mt-2">Welcome Back</h2>
          <p className="text-sm text-gray-400">Sign in to your account</p>
          <div className="w-full flex flex-col justify-center flex-start gap-2 mt-4">
            <h3 className="text-md text-white">Email</h3>
            <input
              type="text"
              placeholder="example@gmail.com"
              className='outline-none w-full border border-white/50 bg-transparent px-4 py-2 text-sm text-white'
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <div className="w-full flex flex-col justify-center flex-start gap-2 mt-2">
            <h3 className="text-md text-white">Password</h3>
            <input
              type="password"
              placeholder="••••••••"
              className='outline-none w-full border border-white/50 bg-transparent px-4 py-2 text-sm text-white mb-2'
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
          
          <button
            className="cursor-pointer w-full py-2 border-none bg-blue-700 text-white mt-2 font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
          <p className="text-sm text-gray-400 mt-2">
            Don't have an account? <Link to={"/register"} className='text-sm text-blue-300 hover:underline'>Click here</Link>
          </p>
          {error && <p className='text-red-500 text-xs pb-2.5 mt-2'>{error}</p>}
        </div>
      </div>
    </AuthLayout>
  )
}

export default Login
