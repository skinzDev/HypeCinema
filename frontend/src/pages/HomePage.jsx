import { useState, useEffect, useMemo } from 'react'
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
import { getStoredMovies, getStoredScreenings } from '../data/movies'
import { fetchAllMoviesApi, fetchAllScreeningsApi } from '../services/api'
import Button from '../components/Button'

export default function HomePage() {
  const navigate = useNavigate()
  const [movies, setMovies] = useState([])
  const [screenings, setScreenings] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [selectedCinema, setSelectedCinema] = useState('ALL')
  const [selectedDate, setSelectedDate] = useState('ALL')
  const [imgErrors, setImgErrors] = useState({})

  useEffect(() => {
    const loadData = async () => {
      try {
        const [apiMovies, apiScreenings] = await Promise.all([
          fetchAllMoviesApi(),
          fetchAllScreeningsApi(),
        ])

        if (apiMovies && apiMovies.length > 0) {
          setMovies(apiMovies)
        } else {
          setMovies(getStoredMovies())
        }

        if (apiScreenings && apiScreenings.length > 0) {
          setScreenings(apiScreenings)
        } else {
          setScreenings(getStoredScreenings())
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        setMovies(getStoredMovies())
        setScreenings(getStoredScreenings())
      }
    }

    loadData()

    window.addEventListener('hype_cinema_data_changed', loadData)
    return () => {
      window.removeEventListener('hype_cinema_data_changed', loadData)
    }
  }, [])

  const heroMovies = useMemo(() => movies.slice(0, 3), [movies])

  useEffect(() => {
    if (heroMovies.length === 0) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroMovies.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroMovies.length])

  const nextSlide = () => {
    if (heroMovies.length === 0) return
    setCurrentSlide((prev) => (prev + 1) % heroMovies.length)
  }

  const prevSlide = () => {
    if (heroMovies.length === 0) return
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
    { value: 'ALL', label: 'Svi datumi projekcija' },
    { value: '2026-08-11', label: 'Danas (11. Avgust)' },
    { value: '2026-08-12', label: 'Sutra (12. Avgust)' },
    { value: '2026-08-13', label: 'Sreda (13. Avgust)' },
    { value: '2026-08-14', label: 'Četvrtak (14. Avgust)' },
  ]

  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      if (selectedCinema === 'ALL' && selectedDate === 'ALL') {
        return true
      }
      return screenings.some((s) => {
        if (String(s.movieId) !== String(movie.id)) return false
        const matchCinema = selectedCinema === 'ALL' || s.cinemaId === selectedCinema
        const matchDate = selectedDate === 'ALL' || s.date === selectedDate
        return matchCinema && matchDate
      })
    })
  }, [movies, screenings, selectedCinema, selectedDate])

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

        {filteredMovies.length === 0 ? (
          <div className="movies-empty-state">
            <Film size={40} className="empty-icon" />
            <h3>Nema projekcija za izabrane filtere</h3>
            <p>Pokušajte sa drugom lokacijom bioskopa ili promenite datum projekcije.</p>
            <Button
              variant="secondary"
              size="md"
              onClick={() => {
                setSelectedCinema('ALL')
                setSelectedDate('ALL')
              }}
            >
              Prikaži sve filmove
            </Button>
          </div>
        ) : (
          <div className="movies-grid">
            {filteredMovies.map((movie) => (
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
        )}
      </section>
    </div>
  )
}
