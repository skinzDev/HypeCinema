import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import {
  MapPin,
  Calendar,
  Search,
  Star,
  Film,
  Clock,
  ChevronDown,
  Ticket,
  Info,
  Phone,
  Building2,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { cinemasData } from '../data/cinemas'
import { getStoredMovies, getStoredScreenings } from '../data/movies'
import { fetchAllMoviesApi, fetchAllScreeningsApi } from '../services/api'
import Button from '../components/Button'
import Modal from '../components/Modal'

export default function SchedulePage() {
  const navigate = useNavigate()
  const outletContext = useOutletContext() || {}
  const { showToast } = outletContext

  const [movies, setMovies] = useState(() => getStoredMovies())
  const [screenings, setScreenings] = useState(() => getStoredScreenings())

  const loadData = async () => {
    try {
      const [apiMovies, apiScreenings] = await Promise.all([
        fetchAllMoviesApi(),
        fetchAllScreeningsApi(),
      ])
      if (apiMovies && apiMovies.length > 0) setMovies(apiMovies)
      else setMovies(getStoredMovies())

      if (apiScreenings && apiScreenings.length > 0) setScreenings(apiScreenings)
      else setScreenings(getStoredScreenings())
    } catch (err) {
      console.warn('Error loading schedule from backend', err)
      setMovies(getStoredMovies())
      setScreenings(getStoredScreenings())
    }
  }

  useEffect(() => {
    loadData()

    window.addEventListener('hype_cinema_data_changed', loadData)
    return () => {
      window.removeEventListener('hype_cinema_data_changed', loadData)
    }
  }, [])

  // Filter States
  const [selectedCinema, setSelectedCinema] = useState('ALL')
  const [selectedDate, setSelectedDate] = useState('2026-08-11')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal State for Cinema Details
  const [selectedCinemaInfo, setSelectedCinemaInfo] = useState(null)

  // Filter cinemas list based on top dropdown
  const filteredCinemas = useMemo(() => {
    if (selectedCinema === 'ALL') return cinemasData
    return cinemasData.filter((c) => c.id === selectedCinema)
  }, [selectedCinema])

  // Dynamic date options based on available screenings
  const dateOptions = useMemo(() => {
    const datesSet = new Set(screenings.map((s) => s.date).filter(Boolean))
    const sorted = Array.from(datesSet).sort()
    if (sorted.length === 0) {
      return [
        { value: '2026-08-11', label: '11. Avgust' },
        { value: '2026-08-12', label: '12. Avgust' },
        { value: '2026-08-13', label: '13. Avgust' },
        { value: '2026-08-14', label: '14. Avgust' },
      ]
    }
    const days = ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub']
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun',
      'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'
    ]
    return sorted.map((dStr) => {
      const parts = dStr.split('-').map(Number)
      const d = parts.length === 3 ? new Date(parts[0], parts[1] - 1, parts[2]) : new Date(dStr)
      return {
        value: dStr,
        label: `${days[d.getDay()]}, ${d.getDate()}. ${months[d.getMonth()]}`,
      }
    })
  }, [screenings])

  // Get movies and screenings for a specific cinema and selected date
  const getCinemaSchedule = (cinemaId) => {
    // Get screenings matching cinema & date
    const cinemaScreenings = screenings.filter((s) => {
      const matchesCinema = selectedCinema === 'ALL' || s.cinemaId === cinemaId || !s.cinemaId
      const matchesDate = s.date === selectedDate || !selectedDate
      return matchesCinema && matchesDate
    })

    // Group screenings by movieId
    const moviesMap = {}
    cinemaScreenings.forEach((scr) => {
      const movie = movies.find((m) => String(m.id) === String(scr.movieId))
      if (!movie) return

      // Apply search filter if query entered
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase()
        const matchesTitle = movie.title.toLowerCase().includes(query)
        const matchesGenre = movie.genre.toLowerCase().includes(query)
        if (!matchesTitle && !matchesGenre) return
      }

      if (!moviesMap[movie.id]) {
        moviesMap[movie.id] = {
          movie,
          screenings: [],
        }
      }
      moviesMap[movie.id].screenings.push(scr)
    })

    return Object.values(moviesMap)
  }

  return (
    <div className="schedule-page">
      {/* Page Header Banner */}
      <div className="schedule-header">
        <div className="schedule-header-text">
          <h1 className="schedule-header-title">BIOSKOPI & RASPORED PROJEKCIJA</h1>
          <p className="schedule-header-subtitle">
            Odaberite vaš omiljeni bioskop i pogledajte satnicu prikazivanja filmskih hitova
          </p>
        </div>
      </div>

      {/* Top Filter Bar - Replicating Cineplexx aesthetics */}
      <section className="schedule-filter-bar">
        <div className="schedule-filter-group">
          {/* Dropdown 1: Cinema Location */}
          <div className="schedule-dropdown-wrapper">
            <MapPin size={16} className="schedule-filter-icon" />
            <select
              value={selectedCinema}
              onChange={(e) => setSelectedCinema(e.target.value)}
              className="schedule-select"
            >
              <option value="ALL">Svi bioskopi</option>
              {cinemasData.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.city} - {c.name}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="schedule-filter-chevron" />
          </div>

          {/* Dropdown 2: Date Selector */}
          <div className="schedule-dropdown-wrapper">
            <Calendar size={16} className="schedule-filter-icon" />
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="schedule-select"
            >
              {dateOptions.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="schedule-filter-chevron" />
          </div>
        </div>

        {/* Live Search Input */}
        <div className="schedule-search-wrapper">
          <Search size={16} className="schedule-search-icon" />
          <input
            type="text"
            placeholder="Pretraži po nazivu filma..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="schedule-search-input"
          />
        </div>
      </section>

      {/* Main List of Cinema Cards */}
      <section className="schedule-cinemas-section">
        {filteredCinemas.map((cinema) => {
          const scheduleList = getCinemaSchedule(cinema.id)

          return (
            <div key={cinema.id} className="cinema-schedule-card">
              {/* Cinema Card Header */}
              <div className="cinema-card-header">
                <div className="cinema-card-header-left">
                  <div>
                    <h2 className="cinema-card-title">{cinema.name}</h2>
                    <p className="cinema-card-address">{cinema.address}</p>
                  </div>
                </div>

                <div className="cinema-card-header-right">
                  <button
                    className="cinema-info-btn"
                    onClick={() => setSelectedCinemaInfo(cinema)}
                  >
                    <Info size={15} /> Detalji bioskopa
                  </button>
                </div>
              </div>

              {/* Movies Row/Grid showing at this Cinema */}
              <div className="cinema-movies-container">
                {scheduleList.length === 0 ? (
                  <div className="cinema-empty-schedule">
                    <Film size={28} className="empty-icon" />
                    <span>Nema zakazanih projekcija u ovom bioskopu za odabrani datum.</span>
                  </div>
                ) : (
                  <div className="cinema-movies-grid">
                    {scheduleList.map(({ movie, screenings: movieScreenings }) => (
                      <div key={movie.id} className="cinema-movie-item">
                        {/* Movie Poster */}
                        <div
                          className="cinema-movie-poster-wrapper"
                          onClick={() => navigate(`/movies/${movie.id}`)}
                        >
                          <img
                            src={movie.poster}
                            alt={movie.title}
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src =
                                'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80'
                            }}
                          />
                          <span className="cinema-movie-rating">★ {movie.rating}</span>
                        </div>

                        {/* Movie Details */}
                        <div className="cinema-movie-info">
                          <h3
                            className="cinema-movie-title"
                            onClick={() => navigate(`/movies/${movie.id}`)}
                          >
                            {movie.title}
                          </h3>

                          <div className="cinema-movie-meta">
                            <span>{movie.genre}</span>
                            <span>•</span>
                            <span>{movie.duration} min</span>
                          </div>

                          {/* Screening Times Chips */}
                          <div className="cinema-screenings-list">
                            <span className="screenings-list-label">Termini:</span>
                            <div className="screenings-chips">
                              {movieScreenings.map((scr) => (
                                <button
                                  key={scr.id}
                                  className="screening-chip-btn"
                                  onClick={() => navigate(`/screening/${scr.id}/seats`)}
                                  title={`Sala: ${scr.hall} | Cena: ${scr.price} RSD`}
                                >
                                  <Ticket size={12} />
                                  <span className="chip-time">{scr.time}</span>
                                  <span className="chip-hall">
                                    {scr.hall.includes('IMAX')
                                      ? 'IMAX'
                                      : scr.hall.includes('VIP')
                                      ? 'VIP'
                                      : '2D'}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </section>


      {/* Modal with detailed Cinema Information */}
      <Modal
        isOpen={!!selectedCinemaInfo}
        onClose={() => setSelectedCinemaInfo(null)}
        title={selectedCinemaInfo?.name || 'Detalji Bioskopa'}
        maxWidth="600px"
      >
        {selectedCinemaInfo && (
          <div className="cinema-modal-content">
            <div className="cinema-modal-img">
              <img src={selectedCinemaInfo.image} alt={selectedCinemaInfo.name} />
            </div>

            <p className="cinema-modal-desc">{selectedCinemaInfo.description}</p>

            <div className="cinema-modal-info-list">
              <div className="cinema-modal-info-item">
                <MapPin size={16} className="info-icon" />
                <div>
                  <strong>Adresa:</strong>
                  <p>{selectedCinemaInfo.address}</p>
                </div>
              </div>

              <div className="cinema-modal-info-item">
                <Phone size={16} className="info-icon" />
                <div>
                  <strong>Infolinija & Blagajna:</strong>
                  <p>{selectedCinemaInfo.phone}</p>
                </div>
              </div>

              <div className="cinema-modal-info-item">
                <Clock size={16} className="info-icon" />
                <div>
                  <strong>Radno vreme:</strong>
                  <p>{selectedCinemaInfo.workHours}</p>
                </div>
              </div>
            </div>

            <div className="cinema-modal-amenities">
              <h4>
                <Sparkles size={16} /> Pogodnosti & Tehnologije:
              </h4>
              <div className="amenities-tags">
                {selectedCinemaInfo.amenities.map((item, idx) => (
                  <span key={idx} className="amenity-tag">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
              <Button variant="primary" onClick={() => setSelectedCinemaInfo(null)}>
                Zatvori
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
