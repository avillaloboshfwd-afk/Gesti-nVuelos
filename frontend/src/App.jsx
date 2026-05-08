import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PrivateRoute, AdminRoute, ClientRoute } from './components/ProtectedRoutes';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Flights from './pages/Flights';
import FlightDetail from './pages/FlightDetail';
import BookFlight from './pages/BookFlight';
import MyBookings from './pages/MyBookings';
import AdminFlights from './pages/AdminFlights';
import FlightForm from './pages/FlightForm';
import AdminBookings from './pages/AdminBookings';
import AdminUsers from './pages/AdminUsers';
import Profile from './pages/Profile';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas con layout */}
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="/flights" element={<Flights />} />
            <Route path="/flights/:id" element={<FlightDetail />} />
            <Route path="/profile" element={<Profile />} />

            {/* Solo clientes */}
            <Route path="/flights/:id/book" element={<ClientRoute><BookFlight /></ClientRoute>} />
            <Route path="/my-bookings" element={<ClientRoute><MyBookings /></ClientRoute>} />

            {/* Solo admin */}
            <Route path="/admin/flights" element={<AdminRoute><AdminFlights /></AdminRoute>} />
            <Route path="/admin/flights/new" element={<AdminRoute><FlightForm /></AdminRoute>} />
            <Route path="/admin/flights/edit/:id" element={<AdminRoute><FlightForm /></AdminRoute>} />
            <Route path="/admin/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
          </Route>

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/flights" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
