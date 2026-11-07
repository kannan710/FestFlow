import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import CreateEvent from "./pages/CreateEvent";
import MyEvents from "./pages/MyEvents";
import EventDetail from "./pages/EventSingle";
import AuthProvider from "./context/AuthContext";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event" element={<Events />} />
          <Route path="/admin/create" element={<CreateEvent />} />
          <Route path="/admin/create/:id" element={<CreateEvent />} />
          <Route path="/my_events" element={<MyEvents />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <ToastContainer
        toastStyle={{
          backgroundColor: "#111B34",
          padding: "16px 24px",
          fontSize: "14px",
          color: "white",
          textAlign: "center"
        }}
        position="top-center"
        hideProgressBar={true}
        closeButton={false}
        autoClose={2000}
        transition={Slide}
      />
    </AuthProvider>
  );
};

export default App;
