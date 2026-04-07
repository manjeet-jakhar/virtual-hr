import { Routes, Route } from "react-router-dom";
import Login from "./Login.jsx";
import EmployerDashboard from "./EmployerDashboard.jsx";
import HRDashboard from "./HRDashboard.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Interview from "./Interview.jsx";

function App() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<Login />} />
      <Route path="/interview" element={<Interview />} />

      {/* Employer Dashboard */}
      <Route
        path="/employer-dashboard"
        element={
          <ProtectedRoute roleRequired="employer">
            <EmployerDashboard />
          </ProtectedRoute>
        }
      />

      {/* HR Dashboard */}
      <Route
        path="/hr-dashboard"
        element={
          <ProtectedRoute roleRequired="hr">
            <HRDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
