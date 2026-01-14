import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './apps/Auth/pages/Signup';
import OwnerSignup from './apps/Auth/pages/OwnerSignup';
import VerifyEmail from './apps/Auth/pages/VerifyEmail';
import Login from './apps/Auth/pages/Login';
import ForgotPassword from './apps/Auth/pages/ForgotPassword';
import VerifyOTP from './apps/Auth/pages/VerifyOTP';
import UpdatePassword from './apps/Auth/pages/UpdatePassword';
import HomePage from './apps/HomePage/pages/HomePage';
import BusinessProfile from './apps/HomePage/pages/BusinessProfile';
import { useAuth } from './apps/Auth/context/AuthContext';

export default function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen bg-zinc-900 flex items-center justify-center">
        <div className="spinner-large"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/signup" element={<Signup />} />
      <Route path="/signup-owner" element={<OwnerSignup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />
      <Route path="/update-password" element={<UpdatePassword />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={isAuthenticated ? <HomePage /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/business/:placeId"
        element={isAuthenticated ? <BusinessProfile /> : <Navigate to="/login" replace />}
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
