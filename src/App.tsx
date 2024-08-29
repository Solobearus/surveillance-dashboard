// App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./components/Dashboard";
import CameraStream from "./components/CameraStream";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex flex-col h-screen bg-gray-900 text-white">
          <nav className="bg-gray-800 p-4">
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="text-white hover:text-gray-300">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/camera" className="text-white hover:text-gray-300">
                  Camera Stream
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex-grow overflow-hidden">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/camera" element={<CameraStream />} />
            </Routes>
          </div>
        </div>
      </Router>
      <ToastContainer />
    </QueryClientProvider>
  );
}

export default App;
