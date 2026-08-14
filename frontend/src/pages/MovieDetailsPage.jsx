import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate, useOutletContext } from 'react-router-dom'
import {
  ArrowLeft,
  Star,
  Clock,
  Calendar,
  Film,
  Ticket,
  MapPin,
  Play,
  Users,
  Heart,
} from 'lucide-react'
import { getMovieById, getScreeningsForMovie } from '../data/movies'
import { fetchMovieByIdApi, fetchAllMoviesApi, fetchAllScreeningsApi } from '../services/api'
import { isInWatchlist, toggleWatchlist } from '../data/watchlist'
import Button from '../components/Button'

import { useAuth } from '../context/AuthContext'

export default function MovieDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const outletContext = useOutletContext() || {}
  const { handleOpenAuth, showToast } = outletContext

  const [movie, setMovie] = useState(() => getMovieById(id))
  const [groupedScreenings, setGroupedScreenings] = useState(() => getScreeningsForMovie(id))

  const loadMovieAndScreenings = async () => {
    try {
      let currentMovie = await fetchMovieByIdApi(id)
      if (!currentMovie) {
        const allMovies = await fetchAllMoviesApi()
        if (allMovies) {
          currentMovie = allMovies.find((m) => String(m.id) === String(id))
        }
      }

      if (currentMovie) {
        setMovie(currentMovie)
      } else {
        setMovie(getMovieById(id))
      }

      const allScreenings = await fetchAllScreeningsApi()
      if (allScreenings && Array.isArray(allScreenings)) {
        const movieScreenings = allScreenings.filter((s) => String(s.movieId) === String(id))
        const grouped = {}
        movieScreenings.forEach((s) => {
          if (!grouped[s.date]) grouped[s.date] = []
          grouped[s.date].push(s)
        })
        setGroupedScreenings(grouped)
      } else {
        setGroupedScreenings(getScreeningsForMovie(id))
      }
    } catch (err) {
      console.warn('Error loading movie details from API', err)
      setMovie(getMovieById(id))
      setGroupedScreenings(getScreeningsForMovie(id))
    }
  }

  useEffect(() => {
    loadMovieAndScreenings()

    window.addEventListener('hype_cinema_data_changed', loadMovieAndScreenings)
    return () => {
      window.removeEventListener('hype_cinema_data_changed', loadMovieAndScreenings)
    }
  }, [id])

  const dates = Object.keys(groupedScreenings)
  const [selectedDate, setSelectedDate] = useState(() => dates[0] || '')
  const activeDate = selectedDate || dates[0] || ''

  const userIdent = user?.email || user?.username
  const [inWatchlist, setInWatchlist] = useState(() => isInWatchlist(id, userIdent))

  useEffect(() => {
    setInWatchlist(isInWatchlist(id, user?.email || user?.username))
  }, [id, user])

  const handleToggleWatchlist = () => {
    if (!user) {
      if (showToast) showToast('Prijavite se na nalog da biste dodali film u listu želja.', 'info')
      if (handleOpenAuth) handleOpenAuth('login')
      return
    }

    const updated = toggleWatchlist(id, userIdent)
    const isSaved = updated.includes(Number(id))
    setInWatchlist(isSaved)
    if (showToast) {
      showToast(
        isSaved ? 'Dodato u vašu listu želja' : 'Uklonjeno iz liste želja',
        'info'
      )
    }
  }

  if (!movie) {
    return (
      <div className="md-page">
        <button className="md-back" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Nazad na repertoar
        </button>
        <div className="md-not-found">
          <h2>Film nije pronađen</h2>
          <p>Film sa traženim identifikatorom ne postoji u našoj bazi.</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Vrati se na početnu
          </Button>
        </div>
      </div>
    )
  }

  const currentScreenings = groupedScreenings[activeDate] || []

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return { dayName: '', dateFormatted: '' }
    const parts = dateStr.split('-').map(Number)
    const d = parts.length === 3 ? new Date(parts[0], parts[1] - 1, parts[2]) : new Date(dateStr)
    const days = ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub']
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun',
      'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec'
    ]
    return {
      dayName: days[d.getDay()],
      dateFormatted: `${d.getDate()}. ${months[d.getMonth()]}`,
    }
  }

  return (
    <div className="md-page">
      <button className="md-back" onClick={() => navigate('/')}>
        <ArrowLeft size={18} /> Nazad na repertoar
      </button>

      {/* Hero Movie Header */}
      <div className="md-hero">
        <div className="md-poster-wrapper">
          <img src={movie.poster} alt={movie.title} className="md-poster" />
          <div className="md-poster-glow" />
        </div>

        <div className="md-info">
          <div className="md-info-header">
            <span
              className={`md-status ${
                movie.status === 'NOW_SHOWING' ? 'md-status--active' : 'md-status--soon'
              }`}
            >
              {movie.status === 'NOW_SHOWING' ? 'Trenutno u bioskopima' : 'Uskoro'}
            </span>
            <span className="md-rating-badge">
              <Star size={14} /> {movie.rating} / 10
            </span>
          </div>

          <h1 className="md-title">{movie.title}</h1>

          <div className="md-meta">
            <span className="md-meta-item">
              <Film size={15} /> {movie.genre}
            </span>
            <span className="md-meta-divider">•</span>
            <span className="md-meta-item">
              <Clock size={15} /> {movie.duration} minuta
            </span>
            <span className="md-meta-divider">•</span>
            <span className="md-meta-item">
              <Calendar size={15} /> {movie.releaseDate}
            </span>
          </div>

          <p className="md-description">{movie.description}</p>

          <div className="md-crew">
            <div className="md-crew-item">
              <span className="md-crew-label">Režija:</span>
              <span className="md-crew-value">{movie.director}</span>
            </div>
            <div className="md-crew-item">
              <span className="md-crew-label">Uloge:</span>
              <span className="md-crew-value">
                {Array.isArray(movie.cast) ? movie.cast.join(', ') : (movie.cast || 'Nije navedeno')}
              </span>
            </div>
          </div>

          <div className="md-actions">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                const el = document.getElementById('screenings-section')
                if (el) el.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <Ticket size={18} /> Pogledaj projekcije
            </Button>
            <Button
              variant={inWatchlist ? "primary" : "secondary"}
              size="lg"
              onClick={handleToggleWatchlist}
            >
              <Heart size={18} fill={inWatchlist ? "currentColor" : "none"} />
              {inWatchlist ? "U listi želja" : "Dodaj u listu želja"}
            </Button>
            {movie.trailer && (
              <Button
                variant="secondary"
                size="lg"
                onClick={() => window.open(movie.trailer, '_blank')}
              >
                <Play size={16} /> Trejler
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Screenings Section */}
      <section id="screenings-section" className="md-screenings">
        <h2 className="md-section-title">
          <Calendar size={22} /> Dostupne projekcije i karte
        </h2>

        {dates.length === 0 ? (
          <div className="md-no-screenings">
            <p>Trenutno nema zakazanih projekcija za ovaj film.</p>
          </div>
        ) : (
          <>
            {/* Date Selector */}
            <div className="md-date-selector">
              {dates.map((dateStr) => {
                const { dayName, dateFormatted } = formatDateLabel(dateStr)
                return (
                  <button
                    key={dateStr}
                    className={`md-date-chip ${activeDate === dateStr ? 'active' : ''}`}
                    onClick={() => setSelectedDate(dateStr)}
                  >

                    <span className="md-date-chip-day">{dayName}</span>
                    <span className="md-date-chip-date">{dateFormatted}</span>
                  </button>
                )
              })}
            </div>

            {/* Screening List */}
            <div className="md-screening-list">
              {currentScreenings.map((screening) => (
                <div key={screening.id} className="md-screening-card">
                  <div className="md-screening-time">
                    <span className="md-screening-hour">{screening.time}</span>
                  </div>

                  <div className="md-screening-details">
                    <div className="md-screening-hall">
                      <MapPin size={14} /> {screening.hall}
                    </div>
                    <div className="md-screening-seats">
                      <Users size={14} /> {screening.seatsAvailable} slobodnih mesta
                    </div>
                  </div>

                  <div className="md-screening-price">
                    <span className="md-screening-price-value">{screening.price} RSD</span>
                  </div>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => navigate(`/screening/${screening.id}/seats`)}
                  >
                    Izaberi mesto
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
