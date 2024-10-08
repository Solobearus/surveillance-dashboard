import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./components/Dashboard";
import CameraStream from "./components/CameraStream";
import { useWebSocket } from "./hooks/useWebSocket";

// This is a workaround for a warning that is caused by recharts library
// unfortunatly they did not update their base code to solve it
// this warning (masked as error) does not affect the code
const originalWarn = console.error;
console.error = (msg, ...args) => {
  if (!msg.includes("Support for defaultProps")) {
    originalWarn(msg, ...args);
  }
};

const queryClient = new QueryClient();

function WebSocketWrapper() {
  useWebSocket();
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WebSocketWrapper />
      <Router>
        <div className="flex flex-col h-screen bg-gray-900 text-white">
          <nav className="bg-gray-800 p-4">
            <ul className="flex space-x-4">
              <li>
                <Link to="/" className="hover:text-gray-300">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/camera" className="hover:text-gray-300">
                  Camera Stream
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/camera" element={<CameraStream />} />
            </Routes>
          </div>
        </div>
      </Router>
      <ToastContainer theme="dark" autoClose={1000} />
    </QueryClientProvider>
  );
}

export default App;
