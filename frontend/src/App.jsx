import { Routes, Route } from "react-router-dom";
import Login from "./Login";
import EmployerDashboard from "./EmployerDashboard";
import HRDashboard from "./HRDashboard";
import ProtectedRoute from "./ProtectedRoute";
import Interview from "./Interview";

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
