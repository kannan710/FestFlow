import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RxFramerLogo, RxAvatar } from "react-icons/rx";
import { IoMdHome, IoIosLogOut, IoIosLogIn } from "react-icons/io";
import { FaCalendar, FaBookmark } from "react-icons/fa";
import { FaUserPlus } from "react-icons/fa6";
import { LuCirclePlus } from "react-icons/lu";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, clearUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    clearUser();
    navigate("/");
  };

  return (
    <div className="w-[100%] flex justify-between px-32 py-8 bg-bg-primary">
      <div className="flex items-center gap-6">
        <Link to={"/"} className="flex items-center text-white font-semibold text-xl leading-2">
          <RxFramerLogo size={50} />
          FestFlow
        </Link>

        <Link to={"/"} className="flex text-gray-400/50 font-medium text-sm hover:text-white transition-colors">
          <IoMdHome className="w-6 h-6" />
          Home
        </Link>

        <Link
          to={"/events"}
          className="flex text-gray-400/50 font-medium text-sm hover:text-white transition-colors"
        >
          <FaCalendar className="w-6 h-6" />
          Events
        </Link>
        {user && (
          <>
            <Link
              to={"/my_events"}
              className="flex text-gray-400/50 font-medium text-sm hover:text-white transition-colors"
            >
              <FaBookmark className="w-6 h-6" />
              {user.role === "admin" ? "My Events" : "Registered Events"}
            </Link>
            {user.role === "admin" && (
              <Link
                to={"/admin/create"}
                className="flex text-gray-400/50 font-medium text-sm hover:text-white transition-colors"
              >
                <LuCirclePlus className="w-6 h-6" />
                Create Event
              </Link>
            )}
          </>
        )}
      </div>
      {user ? (
        <div className="flex items-center gap-6">
          <div className="flex text-gray-400/50 font-medium text-sm items-center gap-1">
            <RxAvatar className="w-6 h-6" />
            <span>{user.fullName || user.userName}</span>
            <span className="text-xs bg-gray-700/50 text-gray-300 px-1.5 py-0.5 rounded ml-1 uppercase">{user.role}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex text-gray-400/50 font-medium text-sm hover:text-white transition-colors cursor-pointer"
          >
            <IoIosLogOut className="w-6 h-6" />
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-6">
          <Link
            to={"/login"}
            className="flex text-gray-400/50 font-medium text-sm hover:text-white transition-colors"
          >
            <IoIosLogIn className="w-6 h-6" />
            Login
          </Link>

          <Link
            to={"/register"}
            className="flex text-gray-400/50 font-medium text-sm hover:text-white transition-colors"
          >
            <FaUserPlus className="w-6 h-6" />
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navbar;
