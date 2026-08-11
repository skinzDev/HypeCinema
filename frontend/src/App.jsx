import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import MovieDetailsPage from './pages/MovieDetailsPage'
import SeatSelectionPage from './pages/SeatSelectionPage'
import CheckoutPage from './pages/CheckoutPage'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="movies/:id" element={<MovieDetailsPage />} />
            <Route path="screening/:screeningId/seats" element={<SeatSelectionPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
