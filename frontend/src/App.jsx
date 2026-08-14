import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import MovieDetailsPage from './pages/MovieDetailsPage'
import SeatSelectionPage from './pages/SeatSelectionPage'
import CheckoutPage from './pages/CheckoutPage'
import ReservationsPage from './pages/ReservationsPage'
import AdminPage from './pages/AdminPage'
import SchedulePage from './pages/SchedulePage'

export default function App() {
  // Clear old mock test data once for clean baseline
  useEffect(() => {
    const CLEAN_KEY = 'hype_cinema_v3_clean_state'
    if (!localStorage.getItem(CLEAN_KEY)) {
      localStorage.removeItem('hype_cinema_user_bookings')
      localStorage.removeItem('hype_cinema_global_occupied_seats')
      localStorage.setItem(CLEAN_KEY, 'true')
    }
  }, [])

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="cinemas" element={<SchedulePage />} />
            <Route path="movies/:id" element={<MovieDetailsPage />} />
            <Route path="screening/:screeningId/seats" element={<SeatSelectionPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="reservations" element={<ReservationsPage />} />
            <Route path="profile" element={<ReservationsPage />} />
            <Route path="admin" element={<AdminPage />} />
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

