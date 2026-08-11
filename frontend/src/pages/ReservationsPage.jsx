import { useState, useEffect, useRef, useMemo } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import QRCode from 'qrcode'
import {
  Ticket,
  Award,
  Star,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  XCircle,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  Sparkles,
  Info,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  getStoredBookings,
  cancelBooking,
  calculateLoyaltyStats,
} from '../data/bookings'
import Button from '../components/Button'
import Modal from '../components/Modal'

export default function ReservationsPage() {
  const { user, isAuthenticated } = useAuth()
  const { handleOpenAuth, showToast } = useOutletContext() || {}
  const navigate = useNavigate()

  const [bookings, setBookings] = useState([])
  const [activeTab, setActiveTab] = useState('ACTIVE') // 'ACTIVE', 'COMPLETED', 'CANCELLED'

  // Modal states
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [ticketToCancel, setTicketToCancel] = useState(null)

  const modalQrCanvasRef = useRef(null)
  const [copiedRef, setCopiedRef] = useState(false)

  // Load bookings on mount
  useEffect(() => {
    const data = getStoredBookings()
    setBookings(data)
  }, [])

  // Loyalty calculations
  const stats = useMemo(() => {
    return calculateLoyaltyStats(user, bookings)
  }, [user, bookings])

  // Filtered bookings per tab
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (activeTab === 'ACTIVE') return b.status === 'ACTIVE'
      if (activeTab === 'COMPLETED') return b.status === 'COMPLETED'
      if (activeTab === 'CANCELLED') return b.status === 'CANCELLED'
      return true
    })
  }, [bookings, activeTab])

  // Render QR Code in modal when selectedTicket changes
  useEffect(() => {
    if (qrModalOpen && selectedTicket && modalQrCanvasRef.current) {
      const qrData = JSON.stringify({
        ref: selectedTicket.ref,
        movie: selectedTicket.movieTitle,
        date: selectedTicket.date,
        time: selectedTicket.time,
        hall: selectedTicket.hall,
        seats: selectedTicket.seatLabels || selectedTicket.seats,
        total: selectedTicket.finalTotal,
      })
      QRCode.toCanvas(modalQrCanvasRef.current, qrData, {
        width: 220,
        margin: 2,
        color: {
          dark: '#e4e4e7',
          light: '#09090b',
        },
        errorCorrectionLevel: 'M',
      })
    }
  }, [qrModalOpen, selectedTicket])

  const handleOpenQrModal = (ticket) => {
    setSelectedTicket(ticket)
    setQrModalOpen(true)
  }

  const handleOpenCancelModal = (ticket) => {
    setTicketToCancel(ticket)
    setCancelModalOpen(true)
  }

  const handleConfirmCancel = () => {
    if (!ticketToCancel) return
    const updated = cancelBooking(ticketToCancel.id)
    setBookings(updated)
    setCancelModalOpen(false)
    setTicketToCancel(null)
    if (showToast) {
      showToast(`Rezervacija ${ticketToCancel.ref} je uspešno otkazana.`, 'success')
    }
  }

  const handleCopyRef = (ref) => {
    navigator.clipboard.writeText(ref)
    setCopiedRef(true)
    setTimeout(() => setCopiedRef(false), 2000)
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    const days = ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota']
    const months = [
      'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
      'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar',
    ]
    return `${days[d.getDay()]}, ${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}.`
  }

  // Tier badge graphics
  const getTierIcon = (tier) => {
    switch (tier) {
      case 'GOLD':
        return '🥇'
      case 'SILVER':
        return '🥈'
      default:
        return '🥉'
    }
  }

  return (
    <div className="res-page">
      {/* Page Header */}
      <div className="res-header">
        <div>
          <h1 className="res-title">Moje Karte & HypeClub</h1>
          <p className="res-subtitle">
            Upravljajte kupljenim ulaznicama i uvidite vaše HypeClub poene i beneficije ranga.
          </p>
        </div>

        {!isAuthenticated() && (
          <div className="res-auth-banner">
            <Info size={16} />
            <span>Prijavite se da biste videli vaš lični profil i sakupljene poene.</span>
            <Button variant="secondary" size="sm" onClick={() => handleOpenAuth('login')}>
              Prijavi se
            </Button>
          </div>
        )}
      </div>

      {/* User Loyalty Dashboard Card */}
      <div className="res-loyalty-card">
        <div className="res-loyalty-main">
          {/* Rank Badge */}
          <div className={`res-tier-badge res-tier-badge--${stats.tier.toLowerCase()}`}>
            <span className="res-tier-emoji">{getTierIcon(stats.tier)}</span>
            <div className="res-tier-info">
              <span className="res-tier-label">HypeClub Rang</span>
              <span className="res-tier-name">{stats.tier} MEMBER</span>
            </div>
          </div>

          {/* Points Overview */}
          <div className="res-points-overview">
            <div className="res-points-box">
              <span className="res-points-num">{stats.points.toLocaleString('sr-RS')}</span>
              <span className="res-points-sub">
                <Star size={13} /> Trenutni poeni
              </span>
            </div>

            <div className="res-points-box">
              <span className="res-points-num">{stats.totalSpent.toLocaleString('sr-RS')} RSD</span>
              <span className="res-points-sub">Ukupno potrošeno</span>
            </div>

            <div className="res-points-box">
              <span className="res-points-num">{stats.activeTicketsCount}</span>
              <span className="res-points-sub">Aktivne ulaznice</span>
            </div>
          </div>
        </div>

        {/* Tier Progress Bar */}
        {stats.tier !== 'GOLD' && (
          <div className="res-tier-progress-wrapper">
            <div className="res-tier-progress-header">
              <span>Napredak do <strong>{stats.nextTier}</strong> ranga</span>
              <span>
                {stats.points} / {stats.nextTierThreshold} poena ({stats.progressPercent}%)
              </span>
            </div>
            <div className="res-tier-progress-track">
              <div
                className="res-tier-progress-fill"
                style={{ width: `${stats.progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Tier Privileges Summary */}
        <div className="res-tier-benefits">
          <div className={`res-benefit-item ${stats.tier === 'BRONZE' ? 'res-benefit-item--current' : ''}`}>
            <Sparkles size={14} />
            <span><strong>BRONZE:</strong> 10 poena na svakih 100 RSD</span>
          </div>
          <div className={`res-benefit-item ${stats.tier === 'SILVER' ? 'res-benefit-item--current' : ''}`}>
            <Zap size={14} />
            <span><strong>SILVER:</strong> +5% bonus poena & popust u bifeu</span>
          </div>
          <div className={`res-benefit-item ${stats.tier === 'GOLD' ? 'res-benefit-item--current' : ''}`}>
            <Award size={14} />
            <span><strong>GOLD:</strong> +10% bonus poena, VIP ulaz & besplatne kokice</span>
          </div>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="res-tickets-section">
        {/* Navigation Tabs */}
        <div className="res-tabs">
          <button
            className={`res-tab ${activeTab === 'ACTIVE' ? 'res-tab--active' : ''}`}
            onClick={() => setActiveTab('ACTIVE')}
          >
            <Ticket size={16} />
            <span>Aktivne karte</span>
            <span className="res-tab-count">
              {bookings.filter((b) => b.status === 'ACTIVE').length}
            </span>
          </button>

          <button
            className={`res-tab ${activeTab === 'COMPLETED' ? 'res-tab--active' : ''}`}
            onClick={() => setActiveTab('COMPLETED')}
          >
            <CheckCircle2 size={16} />
            <span>Istorija kupljenih</span>
            <span className="res-tab-count">
              {bookings.filter((b) => b.status === 'COMPLETED').length}
            </span>
          </button>

          <button
            className={`res-tab ${activeTab === 'CANCELLED' ? 'res-tab--active' : ''}`}
            onClick={() => setActiveTab('CANCELLED')}
          >
            <XCircle size={16} />
            <span>Otkazane karte</span>
            <span className="res-tab-count">
              {bookings.filter((b) => b.status === 'CANCELLED').length}
            </span>
          </button>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="res-empty-state">
            <div className="res-empty-icon">
              <Ticket size={32} />
            </div>
            <h3>Nema karata u ovoj kategoriji</h3>
            <p>
              {activeTab === 'ACTIVE'
                ? 'Nemate trenutno aktivnih rezervacija. Izaberite film sa repertoara i rezervišite svoje mesto.'
                : activeTab === 'COMPLETED'
                ? 'Nema arhiviranih kupljenih karata.'
                : 'Nemate otkazanih rezervacija.'}
            </p>
            <Button variant="primary" onClick={() => navigate('/')}>
              Pogledaj repertoar
            </Button>
          </div>
        ) : (
          <div className="res-tickets-grid">
            {filteredBookings.map((ticket) => {
              const seatDisplay = ticket.seatLabels || ticket.seats
              return (
                <div key={ticket.id} className="res-ticket-card">
                  {/* Poster Thumbnail */}
                  <div className="res-ticket-poster">
                    <img src={ticket.poster} alt={ticket.movieTitle} />
                  </div>

                  {/* Ticket Content */}
                  <div className="res-ticket-main">
                    <div className="res-ticket-header">
                      <h3 className="res-ticket-title">{ticket.movieTitle}</h3>
                      <span className={`res-status-tag res-status-tag--${ticket.status.toLowerCase()}`}>
                        {ticket.status === 'ACTIVE' && 'Aktivna'}
                        {ticket.status === 'COMPLETED' && 'Iskorišćena'}
                        {ticket.status === 'CANCELLED' && 'Otkazana'}
                      </span>
                    </div>

                    <div className="res-ticket-meta">
                      <span className="res-meta-item">
                        <Calendar size={13} /> {formatDate(ticket.date)}
                      </span>
                      <span className="res-meta-item">
                        <Clock size={13} /> {ticket.time}
                      </span>
                      <span className="res-meta-item">
                        <MapPin size={13} /> {ticket.hall}
                      </span>
                    </div>

                    <div className="res-ticket-seats-row">
                      <span className="res-seats-label">Sedišta:</span>
                      <div className="res-seats-badges">
                        {seatDisplay.map((s) => (
                          <span key={s} className="res-seat-chip">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="res-ticket-footer">
                      <div className="res-ticket-price">
                        <span>Plaćeno:</span>
                        <strong className="res-price-num">
                          {ticket.finalTotal.toLocaleString('sr-RS')} RSD
                        </strong>
                      </div>

                      <span className="res-ticket-ref">Ref: {ticket.ref}</span>
                    </div>
                  </div>

                  {/* Actions column */}
                  <div className="res-ticket-actions">
                    {ticket.status === 'ACTIVE' && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenQrModal(ticket)}
                        >
                          <QrCode size={15} /> QR Kod
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleOpenCancelModal(ticket)}
                        >
                          <XCircle size={15} /> Otkaži
                        </Button>
                      </>
                    )}

                    {ticket.status === 'COMPLETED' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleOpenQrModal(ticket)}
                      >
                        <QrCode size={15} /> Pregled karte
                      </Button>
                    )}

                    {ticket.status === 'CANCELLED' && (
                      <span className="res-cancelled-note">Otkazano</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* QR Ticket Detail Modal */}
      <Modal
        isOpen={qrModalOpen}
        onClose={() => {
          setQrModalOpen(false)
          setSelectedTicket(null)
        }}
        title="Digitalna Bioskopska Karta"
        maxWidth="500px"
      >
        {selectedTicket && (
          <div className="res-modal-ticket">
            {/* Header info */}
            <div className="res-modal-ticket-header">
              <span className="res-modal-logo">HypeCinema</span>
              <div className="res-modal-ref">
                <span>{selectedTicket.ref}</span>
                <button
                  className="co-ticket-copy"
                  onClick={() => handleCopyRef(selectedTicket.ref)}
                  title="Kopiraj referencu"
                >
                  {copiedRef ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Perforated divider */}
            <div className="co-ticket-divider">
              <div className="co-ticket-notch co-ticket-notch--left" />
              <div className="co-ticket-dash" />
              <div className="co-ticket-notch co-ticket-notch--right" />
            </div>

            {/* Body */}
            <div className="res-modal-ticket-body">
              <div className="res-modal-info-grid">
                <div className="co-ticket-field">
                  <span className="co-ticket-field-label">Film</span>
                  <span className="co-ticket-field-value co-ticket-field-value--movie">
                    {selectedTicket.movieTitle}
                  </span>
                </div>
                <div className="co-ticket-field">
                  <span className="co-ticket-field-label">Datum & Vreme</span>
                  <span className="co-ticket-field-value">
                    {formatDate(selectedTicket.date)} u {selectedTicket.time}
                  </span>
                </div>
                <div className="co-ticket-field">
                  <span className="co-ticket-field-label">Sala</span>
                  <span className="co-ticket-field-value">{selectedTicket.hall}</span>
                </div>
                <div className="co-ticket-field">
                  <span className="co-ticket-field-label">Izabrana sedišta</span>
                  <span className="co-ticket-field-value co-ticket-field-value--mono">
                    {(selectedTicket.seatLabels || selectedTicket.seats).join(', ')}
                  </span>
                </div>
                <div className="co-ticket-field">
                  <span className="co-ticket-field-label">Kupac</span>
                  <span className="co-ticket-field-value">{selectedTicket.customerName}</span>
                </div>
                <div className="co-ticket-field">
                  <span className="co-ticket-field-label">Plaćeni iznos</span>
                  <span className="co-ticket-field-value co-ticket-field-value--mono">
                    {selectedTicket.finalTotal.toLocaleString('sr-RS')} RSD
                  </span>
                </div>
              </div>

              <div className="co-ticket-qr">
                <canvas ref={modalQrCanvasRef} />
                <span className="co-ticket-qr-hint">Skenirajte na ulazu</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="res-modal-actions">
              <Button variant="secondary" size="md" onClick={() => window.print()}>
                <Download size={16} /> Sačuj / Štampaj
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  setQrModalOpen(false)
                  setSelectedTicket(null)
                }}
              >
                Zatvori
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Cancellation Confirmation Modal */}
      <Modal
        isOpen={cancelModalOpen}
        onClose={() => {
          setCancelModalOpen(false)
          setTicketToCancel(null)
        }}
        title="Otkazivanje Rezervacije"
        maxWidth="450px"
      >
        {ticketToCancel && (
          <div className="res-cancel-modal-content">
            <div className="res-cancel-warning">
              <AlertTriangle size={32} />
              <p>
                Da li ste sigurni da želite da otkažete rezervaciju{' '}
                <strong>{ticketToCancel.ref}</strong> za film{' '}
                <strong>"{ticketToCancel.movieTitle}"</strong>?
              </p>
            </div>

            <div className="res-cancel-details">
              <div className="res-cancel-row">
                <span>Termin:</span>
                <strong>{formatDate(ticketToCancel.date)} u {ticketToCancel.time}</strong>
              </div>
              <div className="res-cancel-row">
                <span>Sedišta:</span>
                <strong>{(ticketToCancel.seatLabels || ticketToCancel.seats).join(', ')}</strong>
              </div>
              <div className="res-cancel-row">
                <span>Povraćaj sredstava:</span>
                <strong className="text-green-500">
                  {ticketToCancel.finalTotal.toLocaleString('sr-RS')} RSD
                </strong>
              </div>
            </div>

            <div className="res-cancel-actions">
              <Button
                variant="secondary"
                onClick={() => {
                  setCancelModalOpen(false)
                  setTicketToCancel(null)
                }}
              >
                Odustani
              </Button>
              <Button variant="danger" onClick={handleConfirmCancel}>
                Potvrdi otkazivanje
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
