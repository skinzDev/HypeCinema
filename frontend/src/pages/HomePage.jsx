import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Clock,
  Film,
  Calendar,
  MapPin,
  ChevronDown,
  Ticket,
} from 'lucide-react'
import { moviesData } from '../data/movies'
import Button from '../components/Button'

export default function HomePage() {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedCinema, setSelectedCinema] = useState('ALL')
  const [selectedDate, setSelectedDate] = useState('TODAY')
  const [imgErrors, setImgErrors] = useState({})

  const heroMovies = moviesData.slice(0, 3)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroMovies.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroMovies.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroMovies.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroMovies.length) % heroMovies.length)
  }

  const handleImgError = (id) => {
    setImgErrors((prev) => ({ ...prev, [id]: true }))
  }

  const cinemaLocations = [
    { value: 'ALL', label: 'Sve lokacije bioskopa' },
    { value: 'BEOGRAD', label: 'Beograd - Hype Galerija' },
    { value: 'NOVI_SAD', label: 'Novi Sad - Hype Promenada' },
    { value: 'NIS', label: 'Niš - Hype Delta' },
    { value: 'KRAGUJEVAC', label: 'Kragujevac - Hype Plaza' },
  ]

  const dateOptions = [
    { value: 'TODAY', label: 'Danas (11. Avgust)' },
    { value: 'TOMORROW', label: 'Sutra (12. Avgust)' },
    { value: 'DAY3', label: 'Sreda (13. Avgust)' },
    { value: 'DAY4', label: 'Četvrtak (14. Avgust)' },
  ]

  return (
    <div className="home-page">
      {/* Hero Carousel */}
      <section className="hero-carousel">
        {heroMovies.map((movie, index) => (
          <div
            key={movie.id}
            className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          >
            {!imgErrors[`hero-${movie.id}`] ? (
              <img
                src={movie.poster}
                alt={movie.title}
                className="hero-slide-image"
                onError={() => handleImgError(`hero-${movie.id}`)}
              />
            ) : (
              <div className="hero-slide-placeholder">
                <Film size={64} className="placeholder-icon" />
              </div>
            )}
            <div className="hero-slide-overlay" />
            <div className="hero-slide-content">
              <span className="hero-badge">NAJPOPULARNIJE</span>
              <h1 className="hero-title">{movie.title}</h1>
              <p className="hero-subtitle">Ekskluzivno u bioskopima · Jul 31, 2026</p>
              <div className="hero-actions">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate(`/movies/${movie.id}`)}
                >
                  <Ticket size={18} /> Kupi kartu
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => navigate(`/movies/${movie.id}`)}
                >
                  Detalji filma
                </Button>
              </div>
            </div>
          </div>
        ))}

        <div className="hero-controls">
          <button className="hero-arrow" onClick={prevSlide} aria-label="Prethodni film">
            <ChevronLeft size={20} />
          </button>
          <div className="hero-dots">
            {heroMovies.map((_, idx) => (
              <span
                key={idx}
                className={`hero-dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
              />
            ))}
          </div>
          <button className="hero-arrow" onClick={nextSlide} aria-label="Sledeći film">
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* Filter Bar - Exactly 2 Dropdowns: Cinema & Date */}
      <section className="filter-bar">
        {/* Dropdown 1: Odabir Bioskopa (Grad) */}
        <div className={`filter-dropdown-wrapper ${selectedCinema !== 'ALL' ? 'active' : ''}`}>
          <MapPin size={16} className="filter-icon" />
          <select
            value={selectedCinema}
            onChange={(e) => setSelectedCinema(e.target.value)}
            className="filter-select"
          >
            {cinemaLocations.map((loc) => (
              <option key={loc.value} value={loc.value}>
                {loc.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="filter-chevron" />
        </div>

        {/* Dropdown 2: Odabir Datuma */}
        <div className="filter-dropdown-wrapper">
          <Calendar size={16} className="filter-icon" />
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="filter-select"
          >
            {dateOptions.map((date) => (
              <option key={date.value} value={date.value}>
                {date.label}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="filter-chevron" />
        </div>
      </section>

      {/* Movies Grid */}
      <section className="movies-grid-section">
        <div className="movies-section-header">
          <h2 className="movies-section-title">U BIOSKOPU</h2>
        </div>

        <div className="movies-grid">
          {moviesData.map((movie) => (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() => navigate(`/movies/${movie.id}`)}
            >
              <div className="movie-card-poster-container">
                {!imgErrors[movie.id] ? (
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    className="movie-card-image"
                    onError={() => handleImgError(movie.id)}
                  />
                ) : (
                  <div className="movie-card-placeholder">
                    <Film size={36} className="placeholder-icon" />
                    <span className="placeholder-title">{movie.title}</span>
                  </div>
                )}
              </div>

              <div className="movie-card-details">
                <h3 className="movie-card-title">{movie.title}</h3>
                <p className="movie-card-subtitle">
                  {movie.genre} · {movie.duration}m · ★ {movie.rating}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
