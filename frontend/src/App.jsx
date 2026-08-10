import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import MovieDetailsPage from './pages/MovieDetailsPage'
import './index.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="movies/:id" element={<MovieDetailsPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
