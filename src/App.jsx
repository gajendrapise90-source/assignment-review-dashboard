import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";

function App() {
  const { currentUser } = useAuth();

  const home = currentUser
    ? currentUser.role === "admin" ? "/admin" : "/student"
    : "/login";

  return (
    <Routes>
      <Route
        path="/login"
        element={currentUser ? <Navigate to={home} replace /> : <Login />}
      />

      <Route path="/" element={<Navigate to={home} replace />} />

      <Route
        path="/admin"
        element={
          currentUser?.role === "admin"
            ? <AdminDashboard />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/student"
        element={
          currentUser?.role === "student"
            ? <StudentDashboard />
            : <Navigate to="/login" replace />
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;