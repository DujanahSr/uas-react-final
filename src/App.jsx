import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Login & Register
import Login from "./pages/Login";
import Register from "./pages/Register";

// User Pages
import Home from "./pages/user/Home";
import SearchResults from "./pages/user/SearchResults";
import FlightDetail from "./pages/user/FlightDetail";
import BookingSuccess from "./pages/user/BookingSuccess";
import MyBookings from "./pages/user/MyBookings";
import Profile from "./pages/user/Profile";
import Help from "./pages/user/Help";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminFlights from "./pages/admin/AdminFlights";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";

// Layouts
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

// Providers
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";

import "./index.css";

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="p-8 text-center bg-white rounded-lg shadow-lg">
            <h1 className="mb-4 text-2xl font-bold text-red-600">
              Terjadi Error
            </h1>
            <p className="mb-4 text-gray-700">
              {this.state.error?.message || "Unknown error"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Reload Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Protected Route User Wrapper
const ProtectedUserLayout = () => {
  try {
    const { user } = useAuth();
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return <UserLayout />;
  } catch (error) {
    console.error("Error in ProtectedUserLayout:", error);
    return <Navigate to="/login" replace />;
  }
};

// Protected Route Admin Wrapper
const ProtectedAdminLayout = () => {
  try {
    const { admin } = useAuth();
    if (!admin) {
      return <Navigate to="/login" replace />;
    }
    return <AdminLayout />;
  } catch (error) {
    console.error("Error in ProtectedAdminLayout:", error);
    return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <DataProvider>
            <Router>
              <Routes>
                {/* Auth Routes - HARUS DI ATAS, prioritas tertinggi */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected User Routes */}
                <Route element={<ProtectedUserLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/flight/:id" element={<FlightDetail />} />
                  <Route path="/booking-success" element={<BookingSuccess />} />
                  <Route path="/my-bookings" element={<MyBookings />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/help" element={<Help />} />
                </Route>

                {/* ADMIN ROUTES */}
                <Route path="/admin" element={<ProtectedAdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="flights" element={<AdminFlights />} />
                  <Route path="bookings" element={<AdminBookings />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* Catch all - redirect to login untuk semua route yang tidak dikenal */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </Router>
          </DataProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
