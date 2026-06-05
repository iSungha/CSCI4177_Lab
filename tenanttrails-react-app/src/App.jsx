import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ReviewsProvider } from "./context/ReviewsContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ApartmentDetail from "./pages/ApartmentDetail";
import Profile from "./pages/Profile";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <ReviewsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/apartment/:id"
              element={
                <ProtectedRoute>
                  <ApartmentDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Landing />} />
          </Routes>
        </BrowserRouter>
      </ReviewsProvider>
    </AuthProvider>
  );
}

export default App;