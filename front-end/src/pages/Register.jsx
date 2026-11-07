import React, { useState } from "react";
import AuthLayout from "../layouts/AuthLayout";

import { FaUserPlus } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

import { validateEmail } from "../utils/helper";
import { API_PATHS } from "../utils/apiPaths";
import axiosInstance from "../utils/axiosInstance";

const Register = () => {
  const [user, setUser] = useState({
    userName: "",
    email: "",
    fullName: "",
    collegeId: "",
    phoneNo: "",
    role: "student",
    password: "",
  })
  const [conPass, setConPass] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleRegister = async () => {
    const { userName, email, fullName, password } = user

    if (!userName.trim())
      return setError("Enter your username")
    if (!validateEmail(email))
      return setError("Enter a valid email address")
    if (!fullName.trim())
      return setError("Enter your full name")
    if (!password)
      return setError("Enter your password")
    if (password.length < 6)
      return setError("Password must be at least 6 characters")
    if (conPass !== password)
      return setError("Passwords do not match")

    setError("")
    setLoading(true)

    // Register API
    try {
      await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        ...user,
        userName: user.userName.trim(),
        email: user.email.toLowerCase().trim(),
        fullName: user.fullName.trim()
      })
      toast.success("Account created successfully! Please sign in.")
      navigate("/login")
    }
    catch(err) {
      console.error("Register error:", err)
      if (err.response && err.response.data && err.response.data.message)
        setError(err.response.data.message)
      else
        setError("Something went wrong during registration")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="w-[100%] h-[100%] bg-bg-primary flex justify-center items-center py-6">
        <div className="w-[38%] min-w-[380px] h-full border border-gray-600/50 border-t-0 px-12 py-8 flex flex-col items-center justify-center">
          <FaUserPlus className="text-sky-400 text-[56px]"/>
          <h2 className="text-xl text-white font-medium mt-2">Create Account</h2>
          <p className="text-xs text-gray-400">Join our event management portal</p>
          <div className="flex gap-4 mt-2 w-full justify-between">
            <div className="w-full">
              <h3 className="text-sm text-white">Username</h3>
              <input
                type="text"
                value={user.userName}
                onChange={e => setUser({ ...user, userName: e.target.value })}
                className="outline-none w-full border border-white/50 bg-transparent px-3 py-1.5 text-sm text-white mt-1"
              />
            </div>
            <div className="w-full">
              <h3 className="text-sm text-white">Email</h3>
              <input
                type="email"
                value={user.email}
                onChange={e => setUser({ ...user, email: e.target.value })}
                className="outline-none w-full border border-white/50 bg-transparent px-3 py-1.5 text-sm text-white mt-1"
              />
            </div>
          </div>
          <div className="w-full flex flex-col gap-1 mt-2">
            <h3 className="text-sm text-white">Full name</h3>
            <input
              type="text"
              value={user.fullName}
              onChange={e => setUser({ ...user, fullName: e.target.value })}
              className='outline-none w-full border border-white/50 bg-transparent px-3 py-1.5 text-sm text-white'
            />
          </div>
          <div className="flex gap-4 mt-2 w-full justify-between">
            <div className="w-full">
              <h3 className="text-sm text-white">College ID</h3>
              <input
                type="text"
                value={user.collegeId}
                onChange={e => setUser({ ...user, collegeId: e.target.value })}
                className="outline-none w-full border border-white/50 bg-transparent px-3 py-1.5 text-sm text-white mt-1"
              />
            </div>
            <div className="w-full">
              <h3 className="text-sm text-white">Phone No</h3>
              <input
                type="text"
                value={user.phoneNo}
                onChange={e => setUser({ ...user, phoneNo: e.target.value })}
                className="outline-none w-full border border-white/50 bg-transparent px-3 py-1.5 text-sm text-white mt-1"
              />
            </div>
          </div>
          <div className="w-full flex flex-col gap-1 mt-2">
            <h3 className="text-sm text-white">Role</h3>
            <select
              name="role"
              value={user.role}
              onChange={e => setUser({ ...user, role: e.target.value })}
              className="outline-none w-full border border-white/50 bg-transparent px-3 py-1.5 text-sm text-white cursor-pointer"
            >
              <option value="student" className="bg-[#111B34] text-white">Student</option>
              <option value="admin" className="bg-[#111B34] text-white">Admin</option>
            </select>
          </div>
          <div className="flex gap-4 mt-2 w-full justify-between">
            <div className="w-full">
              <h3 className="text-sm text-white">Password</h3>
              <input
                type="password"
                value={user.password}
                onChange={e => setUser({ ...user, password: e.target.value })}
                className="outline-none w-full border border-white/50 bg-transparent px-3 py-1.5 text-sm text-white mt-1"
              />
            </div>
            <div className="w-full">
              <h3 className="text-sm text-white">Confirm password</h3>
              <input
                type="password"
                value={conPass}
                onChange={e => setConPass(e.target.value)}
                className="outline-none w-full border border-white/50 bg-transparent px-3 py-1.5 text-sm text-white mt-1"
              />
            </div>
          </div>
          <button
            className="cursor-pointer w-full py-2 border-none bg-blue-700 text-white mt-4 font-semibold hover:bg-blue-600 transition-colors disabled:opacity-50"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
          <p className="text-sm text-gray-400 mt-2">
            Already have an account? <Link to={"/login"} className='text-sm text-blue-300 hover:underline'>Click here</Link>
          </p>
          {error && <p className='text-red-500 text-xs pb-2.5 mt-2'>{error}</p>}
        </div>
      </div>
    </AuthLayout>
  );
};

export default Register;
