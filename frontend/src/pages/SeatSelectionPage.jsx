import { useState, useMemo, useCallback, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Ticket,
  MapPin,
  Clock,
  Calendar,
  Film,
  Star,
  CreditCard,
  Gift,
  Minus,
  Plus,
  Info,
  ChevronRight,
} from 'lucide-react'
import {
  getMovieById,
  getScreeningById,
  getOccupiedSeats,
  hallsData,
} from '../data/movies'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import { fetchOccupiedSeats, fetchScreeningByIdApi, fetchMovieByIdApi } from '../services/api'

/** Row labels: A, B, C... */
const rowLabel = (rowNum) => String.fromCharCode(64 + rowNum)

export default function SeatSelectionPage() {
  const { screeningId } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  const [screening, setScreening] = useState(() => getScreeningById(screeningId))
  const [movie, setMovie] = useState(() => (screening ? getMovieById(screening.movieId) : null))
  const hall = screening ? (hallsData[screening.hall] || hallsData['Sala 1 - IMAX']) : null

  const [occupiedSeats, setOccupiedSeats] = useState(() => (screening ? getOccupiedSeats(screening.id) : []))

  useEffect(() => {
    async function loadScreeningDetails() {
      let scr = getScreeningById(screeningId)
      if (!scr) {
        scr = await fetchScreeningByIdApi(screeningId)
      }
      if (scr) {
        setScreening(scr)
        let mov = getMovieById(scr.movieId)
        if (!mov) {
          mov = await fetchMovieByIdApi(scr.movieId)
        }
        if (mov) setMovie(mov)

        const initialSeats = getOccupiedSeats(scr.id)
        setOccupiedSeats(initialSeats)

        fetchOccupiedSeats(scr.id).then((apiSeats) => {
          if (apiSeats && apiSeats.length > 0) {
            setOccupiedSeats(Array.from(new Set([...initialSeats, ...apiSeats])))
          }
        })
      }
    }

    loadScreeningDetails()
  }, [screeningId])

  const occupiedSet = useMemo(() => new Set(occupiedSeats), [occupiedSeats])

  const [selectedSeats, setSelectedSeats] = useState([])
  const [pointsToRedeem, setPointsToRedeem] = useState(0)
  const [hoveredSeat, setHoveredSeat] = useState(null)

  // Loyalty points
  const userPoints = user?.loyaltyPoints ?? 0
  const userTier = user?.tier ?? 'BRONZE'

  // Price calculations
  const baseTotal = selectedSeats.length * (screening?.price ?? 0)
  const discount = Math.min(pointsToRedeem, baseTotal) // 1 poen = 1 RSD
  const finalTotal = baseTotal - discount
  const earnedPoints = Math.floor(finalTotal / 50)

  // Tier bonus
  const tierBonus =
    userTier === 'GOLD' ? 0.1 : userTier === 'SILVER' ? 0.05 : 0
  const totalEarnedWithBonus = Math.floor(earnedPoints * (1 + tierBonus))

  const toggleSeat = useCallback(
    (seatKey) => {
      if (occupiedSet.has(seatKey)) return
      setSelectedSeats((prev) =>
        prev.includes(seatKey)
          ? prev.filter((s) => s !== seatKey)
          : prev.length < 8
          ? [...prev, seatKey]
          : prev
      )
    },
    [occupiedSet]
  )

  const adjustPoints = (delta) => {
    setPointsToRedeem((prev) => {
      const next = prev + delta
      if (next < 0) return 0
      if (next > userPoints) return userPoints
      if (next > baseTotal) return baseTotal
      return next
    })
  }

  // Not-found state
  if (!screening || !movie || !hall) {
    return (
      <div className="ss-page">
        <button className="md-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> Nazad
        </button>
        <div className="md-not-found">
          <h2>Projekcija nije pronađena</h2>
          <p>Projekcija sa traženim identifikatorom ne postoji.</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Nazad na početnu
          </Button>
        </div>
      </div>
    )
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const parts = dateStr.split('-').map(Number)
    const d = parts.length === 3 ? new Date(parts[0], parts[1] - 1, parts[2]) : new Date(dateStr)
    const days = ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota']
    const months = [
      'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
      'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar',
    ]
    return `${days[d.getDay()]}, ${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}.`
  }

  return (
    <div className="ss-page">
      {/* Back navigation */}
      <button className="md-back" onClick={() => navigate(`/movies/${movie.id}`)}>
        <ArrowLeft size={18} /> Nazad na detalje filma
      </button>

      {/* Page Header with movie context */}
      <div className="ss-header">
        <div className="ss-header-poster">
          <img src={movie.poster} alt={movie.title} />
        </div>
        <div className="ss-header-info">
          <h1 className="ss-header-title">{movie.title}</h1>
          <div className="ss-header-meta">
            <span className="ss-meta-tag">
              <MapPin size={14} /> {screening.hall}
            </span>
            <span className="ss-meta-tag">
              <Calendar size={14} /> {formatDate(screening.date)}
            </span>
            <span className="ss-meta-tag">
              <Clock size={14} /> {screening.time}
            </span>
            <span className="ss-meta-tag">
              <Film size={14} /> {movie.duration} min
            </span>
          </div>
        </div>
      </div>

      {/* Main layout: Seat map + Order summary */}
      <div className="ss-layout">
        {/* LEFT: Cinema Hall Map */}
        <div className="ss-hall-section">
          {/* Screen indicator (Curved Arc matching screenshot) */}
          <div className="ss-screen-wrapper">
            <svg viewBox="0 0 500 40" className="ss-screen-arc-svg">
              <path d="M 10 35 Q 250 5 490 35" fill="none" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="3" />
            </svg>
            <span className="ss-screen-text">PLATNO</span>
          </div>

          {/* Seat grid (Rows ordered H down to A, matching screenshot) */}
          <div className="ss-seat-grid" style={{ '--cols': hall.seatsPerRow }}>
            {Array.from({ length: hall.rows }, (_, rowIdx) => {
              const rowNum = hall.rows - rowIdx // Top row is H/highest, bottom row is A/1
              const isWheelchairRow = rowNum === 1
              const isLoveRow = rowNum === Math.floor(hall.rows / 2)

              return (
                <div key={rowNum} className="ss-seat-row">
                  <span className="ss-row-label">{rowLabel(rowNum)}</span>
                  <div className="ss-seats-in-row">
                    {Array.from({ length: hall.seatsPerRow }, (_, seatIdx) => {
                      const seatNum = seatIdx + 1
                      const seatKey = `${rowNum}-${seatNum}`
                      const isOccupied = occupiedSet.has(seatKey)
                      const isSelected = selectedSeats.includes(seatKey)
                      const isHovered = hoveredSeat === seatKey

                      let seatClass = 'ss-seat'
                      if (isOccupied) seatClass += ' ss-seat--occupied'
                      else if (isSelected) seatClass += ' ss-seat--selected'
                      else seatClass += ' ss-seat--available'
                      if (isLoveRow) seatClass += ' ss-seat--love'
                      if (isWheelchairRow && seatNum <= 2) seatClass += ' ss-seat--accessible'
                      if (isHovered && !isOccupied) seatClass += ' ss-seat--hovered'

                      return (
                        <button
                          key={seatKey}
                          className={seatClass}
                          onClick={() => toggleSeat(seatKey)}
                          onMouseEnter={() => setHoveredSeat(seatKey)}
                          onMouseLeave={() => setHoveredSeat(null)}
                          disabled={isOccupied}
                          title={
                            isOccupied
                              ? `${rowLabel(rowNum)}${seatNum} — Zauzeto`
                              : `${rowLabel(rowNum)}${seatNum}`
                          }
                          aria-label={`Sedište ${rowLabel(rowNum)}${seatNum}`}
                        >
                          {isSelected ? (
                            <span className="ss-selected-dot" />
                          ) : isWheelchairRow && seatNum <= 2 ? (
                            '♿'
                          ) : (
                            seatNum
                          )}
                        </button>
                      )
                    })}
                  </div>
                  <span className="ss-row-label">{rowLabel(rowNum)}</span>
                </div>
              )
            })}
          </div>

          {/* Legend (Cineplexx Style Bar matching user screenshot) */}
          <div className="ss-legend">
            <div className="ss-legend-item">
              <span className="ss-legend-box ss-legend-box--occupied" />
              <span>ZAUZETO</span>
            </div>
            <div className="ss-legend-item">
              <span className="ss-legend-box ss-legend-box--selected">
                <span className="ss-selected-dot-small" />
              </span>
              <span>IZABRANO</span>
            </div>
            <div className="ss-legend-item">
              <span className="ss-legend-box ss-legend-box--standard" />
              <span>STANDARD</span>
            </div>
            <div className="ss-legend-item">
              <span className="ss-legend-box ss-legend-box--love">❤️</span>
              <span>LJUBAVNO SEDIŠTE</span>
            </div>
            <div className="ss-legend-item">
              <span className="ss-legend-box ss-legend-box--accessible">♿</span>
              <span>SEDIŠTE ZA OSOBE SA INVALIDITETOM</span>
            </div>
          </div>

          {selectedSeats.length >= 8 && (
            <div className="ss-max-notice">
              <Info size={14} /> Maksimalan broj sedišta po rezervaciji je 8.
            </div>
          )}
        </div>

        {/* RIGHT: Order Summary Panel */}
        <aside className="ss-summary">
          <div className="ss-summary-card">
            <h3 className="ss-summary-heading">
              <Ticket size={18} /> Pregled porudžbine
            </h3>

            {/* Selected seats display */}
            <div className="ss-summary-section">
              <span className="ss-summary-label">Izabrana sedišta</span>
              {selectedSeats.length === 0 ? (
                <p className="ss-summary-empty">
                  Kliknite na sedišta u sali da biste ih izabrali.
                </p>
              ) : (
                <div className="ss-selected-seats">
                  {selectedSeats
                    .sort((a, b) => {
                      const [ar, as] = a.split('-').map(Number)
                      const [br, bs] = b.split('-').map(Number)
                      return ar !== br ? ar - br : as - bs
                    })
                    .map((seat) => {
                      const [r, s] = seat.split('-').map(Number)
                      return (
                        <span
                          key={seat}
                          className="ss-seat-badge"
                          onClick={() => toggleSeat(seat)}
                          title="Kliknite za uklanjanje"
                        >
                          {rowLabel(r)}{s}
                          <span className="ss-seat-badge-x">×</span>
                        </span>
                      )
                    })}
                </div>
              )}
            </div>

            {/* Price breakdown */}
            <div className="ss-summary-section ss-price-breakdown">
              <div className="ss-price-row">
                <span>
                  {selectedSeats.length} × {screening.price} RSD
                </span>
                <span className="ss-price-value">{baseTotal.toLocaleString('sr-RS')} RSD</span>
              </div>

              {/* Loyalty Points Redemption */}
              {isAuthenticated() && userPoints > 0 && selectedSeats.length > 0 && (
                <div className="ss-loyalty-section">
                  <div className="ss-loyalty-header">
                    <Gift size={15} />
                    <span>HypeClub poeni</span>
                    <span className="ss-loyalty-balance">
                      {userPoints.toLocaleString('sr-RS')} dostupno
                    </span>
                  </div>
                  <div className="ss-loyalty-controls">
                    <button
                      className="ss-loyalty-btn"
                      onClick={() => adjustPoints(-50)}
                      disabled={pointsToRedeem <= 0}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="ss-loyalty-amount">
                      {pointsToRedeem.toLocaleString('sr-RS')} poena
                    </span>
                    <button
                      className="ss-loyalty-btn"
                      onClick={() => adjustPoints(50)}
                      disabled={pointsToRedeem >= userPoints || pointsToRedeem >= baseTotal}
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  {pointsToRedeem > 0 && (
                    <div className="ss-price-row ss-price-row--discount">
                      <span>Popust (poeni)</span>
                      <span className="ss-price-value ss-price-discount">
                        -{discount.toLocaleString('sr-RS')} RSD
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Final total */}
              <div className="ss-price-row ss-price-row--total">
                <span>Ukupno za plaćanje</span>
                <span className="ss-price-total">
                  {finalTotal.toLocaleString('sr-RS')} RSD
                </span>
              </div>

              {/* Earned points preview */}
              {isAuthenticated() && selectedSeats.length > 0 && (
                <div className="ss-earned-preview">
                  <Star size={13} />
                  <span>
                    Zarađujete <strong>{totalEarnedWithBonus}</strong> poena za ovu kupovinu
                    {tierBonus > 0 && (
                      <span className="ss-tier-bonus">
                        {' '}
                        (+{Math.round(tierBonus * 100)}% {userTier} bonus)
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Continue button */}
            <Button
              variant="primary"
              size="lg"
              fullWidth
              disabled={selectedSeats.length === 0}
              onClick={() => {
                // Navigate to billing/payment page (to be implemented in next phase)
                navigate(`/checkout`, {
                  state: {
                    screeningId: screening.id,
                    movieId: movie.id,
                    selectedSeats,
                    pointsToRedeem,
                    finalTotal,
                  },
                })
              }}
            >
              <CreditCard size={18} />
              Nastavi na plaćanje
              <ChevronRight size={16} />
            </Button>

            {!isAuthenticated() && selectedSeats.length > 0 && (
              <p className="ss-auth-notice">
                <Info size={13} />
                Prijavite se da biste koristili HypeClub poene i sačuvali rezervaciju.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
