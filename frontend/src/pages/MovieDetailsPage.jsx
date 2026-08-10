import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Star,
  Clock,
  Calendar,
  Users,
  Clapperboard,
  Play,
  Ticket,
  MapPin,
  ChevronRight,
} from 'lucide-react'
import Button from '../components/Button'
import { getMovieById, getScreeningsForMovie } from '../data/movies'

export default function MovieDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const movie = getMovieById(id)
  const screeningsByDate = getScreeningsForMovie(id)
  const dates = Object.keys(screeningsByDate).sort()

  const [selectedDate, setSelectedDate] = useState(dates[0] || '')

  const currentScreenings = useMemo(
    () => screeningsByDate[selectedDate] || [],
    [screeningsByDate, selectedDate]
  )

  if (!movie) {
    return (
      <div className="md-not-found">
        <h2>Film nije pronađen</h2>
        <p>Ne postoji film sa ID: {id}</p>
        <Button variant="secondary" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          Nazad na početnu
        </Button>
      </div>
    )
  }

  const formatDuration = (mins) => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return `${h}h ${m}min`
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00')
    const options = { weekday: 'short', day: 'numeric', month: 'short' }
    return d.toLocaleDateString('sr-Latn-RS', options)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('sr-RS').format(price) + ' RSD'
  }

  const statusLabel =
    movie.status === 'NOW_SHOWING' ? 'Trenutno u bioskopima' : 'Uskoro'
  const statusClass =
    movie.status === 'NOW_SHOWING' ? 'md-status--active' : 'md-status--soon'

  return (
    <div className="md-page">
      {/* ── Back Button ── */}
      <button className="md-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} />
        <span>Nazad</span>
      </button>

      {/* ── Hero Section (Poster + Info) ── */}
      <section className="md-hero">
        {/* Poster */}
        <div className="md-poster-wrapper">
          <img
            className="md-poster"
            src={movie.poster}
            alt={movie.title}
            onError={(e) => {
              e.target.onerror = null
              e.target.src =
                'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop'
            }}
          />
          <div className="md-poster-glow" />
        </div>

        {/* Info */}
        <div className="md-info">
          <div className="md-info-header">
            <span className={`md-status ${statusClass}`}>{statusLabel}</span>
            <div className="md-rating-badge">
              <Star size={16} />
              <span>{movie.rating}</span>
            </div>
          </div>

          <h1 className="md-title">{movie.title}</h1>

          <div className="md-meta">
            <span className="md-meta-item">
              <Clock size={14} />
              {formatDuration(movie.duration)}
            </span>
            <span className="md-meta-divider">·</span>
            <span className="md-meta-item">
              <Clapperboard size={14} />
              {movie.genre}
            </span>
            <span className="md-meta-divider">·</span>
            <span className="md-meta-item">
              <Calendar size={14} />
              {new Date(movie.releaseDate).toLocaleDateString('sr-Latn-RS', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <p className="md-description">{movie.description}</p>

          {/* Director & Cast */}
          <div className="md-crew">
            <div className="md-crew-item">
              <span className="md-crew-label">Režiser</span>
              <span className="md-crew-value">{movie.director}</span>
            </div>
            <div className="md-crew-item">
              <span className="md-crew-label">Glumci</span>
              <span className="md-crew-value">{movie.cast.join(', ')}</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="md-actions">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                const el = document.getElementById('screenings-section')
                el?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              <Ticket size={18} />
              Kupi Kartu
            </Button>
            <Button variant="secondary" size="lg">
              <Play size={18} />
              Pogledaj Trejler
            </Button>
          </div>
        </div>
      </section>

      {/* ── Screenings Section ── */}
      <section className="md-screenings" id="screenings-section">
        <h2 className="md-section-title">
          <Calendar size={20} />
          Dostupni Termini
        </h2>

        {dates.length === 0 ? (
          <div className="md-no-screenings">
            <p>Trenutno nema dostupnih projekcija za ovaj film.</p>
          </div>
        ) : (
          <>
            {/* Date Selector */}
            <div className="md-date-selector">
              {dates.map((date) => (
                <button
                  key={date}
                  className={`md-date-chip ${selectedDate === date ? 'active' : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  <span className="md-date-chip-day">
                    {formatDate(date).split(' ')[0]}
                  </span>
                  <span className="md-date-chip-date">
                    {formatDate(date).split(' ').slice(1).join(' ')}
                  </span>
                </button>
              ))}
            </div>

            {/* Screening Cards */}
            <div className="md-screening-list">
              {currentScreenings.map((screening) => (
                <div key={screening.id} className="md-screening-card">
                  <div className="md-screening-time">
                    <span className="md-screening-hour">{screening.time}</span>
                  </div>

                  <div className="md-screening-details">
                    <div className="md-screening-hall">
                      <MapPin size={14} />
                      <span>{screening.hall}</span>
                    </div>
                    <div className="md-screening-seats">
                      <Users size={14} />
                      <span>{screening.seatsAvailable} slobodnih mesta</span>
                    </div>
                  </div>

                  <div className="md-screening-price">
                    <span className="md-screening-price-value">
                      {formatPrice(screening.price)}
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      navigate(`/booking/${screening.id}`, {
                        state: { movie, screening },
                      })
                    }
                  >
                    Izaberi
                    <ChevronRight size={14} />
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
