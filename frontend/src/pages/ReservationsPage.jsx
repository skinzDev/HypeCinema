import { useState, useEffect, useRef, useMemo } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import QRCode from 'qrcode'
import {
  User,
  Ticket,
  CreditCard,
  History,
  Heart,
  LogOut,
  Pencil,
  ChevronDown,
  ChevronUp,
  Star,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  XCircle,
  AlertTriangle,
  Download,
  Copy,
  Check,
  Award,
  Sparkles,
  Zap,
  Building2,
  Save,
  X,
  Phone,
  Mail,
  Home,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  getStoredBookings,
  cancelBooking,
  calculateLoyaltyStats,
} from '../data/bookings'
import { fetchMyBookingsApi, cancelBookingApi } from '../services/api'
import { getWatchlist, toggleWatchlist } from '../data/watchlist'
import { moviesData } from '../data/movies'
import Button from '../components/Button'
import Modal from '../components/Modal'
import InputField from '../components/InputField'

export default function ReservationsPage() {
  const { user, updateUserProfile, logout, isAuthenticated } = useAuth()
  const { handleOpenAuth, showToast } = useOutletContext() || {}
  const navigate = useNavigate()

  const [bookings, setBookings] = useState([])
  const [watchlistIds, setWatchlistIds] = useState([])
  const [activeTab, setActiveTab] = useState('ACCOUNT') // 'ACCOUNT', 'TICKETS', 'LOYALTY', 'HISTORY', 'WATCHLIST'

  // Expandable user profile state
  const [isProfileExpanded, setIsProfileExpanded] = useState(false)
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    city: user?.city || '',
    address: user?.address || '',
    birthDate: user?.birthDate || '',
    phone: user?.phone || '',
  })

  // Sync profile form when user changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        city: user.city || '',
        address: user.address || '',
        birthDate: user.birthDate || '',
        phone: user.phone || '',
      })
    }
  }, [user])

  // Favorite cinemas state
  const [favoriteCinemas, setFavoriteCinemas] = useState([
    {
      id: 1,
      name: 'HYPECINEMA GALERIJA 4D',
      address: 'Galerija Shopping Center, Bulevar Vudroa Vilsona 12, Beograd',
      image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=600&q=80',
      isFav: true,
    },
    {
      id: 2,
      name: 'HYPECINEMA PLAZA KRAGUJEVAC',
      address: 'Bulevar Kraljice Marije 56, RS-34000 Kragujevac',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
      isFav: true,
    },
    {
      id: 3,
      name: 'HYPECINEMA PROMENADA NOVI SAD',
      address: 'Bulevar oslobođenja 119, RS-21000 Novi Sad',
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
      isFav: true,
    },
  ])

  // Modal states
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [cancelModalOpen, setCancelModalOpen] = useState(false)
  const [ticketToCancel, setTicketToCancel] = useState(null)

  const modalQrCanvasRef = useRef(null)
  const [copiedRef, setCopiedRef] = useState(false)

  // Load data on mount (fetches from backend API or local storage fallback)
  useEffect(() => {
    async function loadData() {
      try {
        const apiBookings = await fetchMyBookingsApi()
        if (apiBookings && Array.isArray(apiBookings)) {
          const mapped = apiBookings.map((dto) => ({
            id: dto.id,
            ref: dto.bookingReference,
            customerEmail: user?.email || dto.username,
            username: dto.username,
            customerName: user?.firstName ? `${user.firstName} ${user.lastName}` : dto.username,
            movieTitle: dto.movieTitle,
            poster: dto.posterUrl,
            hall: dto.hallName,
            date: dto.startTime ? dto.startTime.split('T')[0] : '',
            time: dto.startTime ? dto.startTime.split('T')[1]?.substring(0, 5) : '',
            seats: dto.seats ? dto.seats.map((s) => `${s.rowNum}-${s.seatNum}`) : [],
            seatLabels: dto.seats
              ? dto.seats.map((s) => `${String.fromCharCode(64 + s.rowNum)}${s.seatNum}`)
              : [],
            finalTotal: dto.totalPrice,
            earnedPoints: dto.pointsEarned,
            pointsRedeemed: dto.pointsRedeemed,
            status: dto.status === 'CONFIRMED' ? 'ACTIVE' : dto.status,
            createdAt: dto.createdAt,
          }))
          setBookings(mapped)
        } else {
          setBookings(getStoredBookings())
        }
      } catch (err) {
        setBookings(getStoredBookings())
      }
      setWatchlistIds(getWatchlist(user?.email || user?.username))
    }
    loadData()
  }, [user])

  // Filter bookings belonging strictly to active user
  const userBookings = useMemo(() => {
    if (!user) return []
    return bookings.filter(
      (b) =>
        (user.email && b.customerEmail === user.email) ||
        (user.username && (b.customerEmail === user.username || b.username === user.username))
    )
  }, [user, bookings])

  // Loyalty calculations
  const stats = useMemo(() => {
    return calculateLoyaltyStats(user, userBookings)
  }, [user, userBookings])

  // Active tickets (only ACTIVE status for scanning)
  const activeTickets = useMemo(() => {
    return userBookings.filter((b) => b.status === 'ACTIVE')
  }, [userBookings])

  // Completed past transactions (for watched history table)
  const completedTransactions = useMemo(() => {
    return userBookings.filter((b) => b.status === 'COMPLETED')
  }, [userBookings])

  // Movies in watchlist
  const watchlistMovies = useMemo(() => {
    return moviesData.filter((m) => watchlistIds.includes(m.id))
  }, [watchlistIds])


  // QR canvas renderer
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

  const handleConfirmCancel = async () => {
    if (!ticketToCancel) return
    try {
      await cancelBookingApi(ticketToCancel.id)
    } catch (e) {
      console.warn('Backend ticket cancel API call failed', e)
    }
    const updated = cancelBooking(ticketToCancel.id)
    setBookings(updated)
    setCancelModalOpen(false)
    setTicketToCancel(null)
    if (showToast) {
      showToast(`Rezervacija ${ticketToCancel.ref} je uspešno otkazana.`, 'success')
    }
  }

  const handleRemoveFromWatchlist = (e, movieId) => {
    e.stopPropagation()
    const updated = toggleWatchlist(movieId, user?.email || user?.username)
    setWatchlistIds(updated)
    if (showToast) {
      showToast('Film je uklonjen iz liste želja', 'info')
    }
  }


  const handleCopyRef = (ref) => {
    navigator.clipboard.writeText(ref)
    setCopiedRef(true)
    setTimeout(() => setCopiedRef(false), 2000)
  }

  const handleProfileFormChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value })
  }

  const handleSaveProfile = (e) => {
    e.preventDefault()
    if (updateUserProfile) {
      updateUserProfile(profileForm)
    }
    setIsEditingProfile(false)
    setIsProfileExpanded(true)
    if (showToast) {
      showToast('Profilni podaci su uspešno sačuvani!', 'success')
    }
  }

  const toggleFavCinema = (id) => {
    setFavoriteCinemas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFav: !c.isFav } : c))
    )
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    const parts = dateStr.split('-').map(Number)
    const d = parts.length === 3 ? new Date(parts[0], parts[1] - 1, parts[2]) : new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    const days = ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota']
    const months = [
      'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
      'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar',
    ]
    return `${days[d.getDay()]}, ${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}.`
  }

  const formatTransactionTime = (createdAtStr) => {
    if (!createdAtStr) return '11.08.2026. u 14:22'
    const d = new Date(createdAtStr)
    if (isNaN(d.getTime())) return '11.08.2026. u 14:22'
    const day = String(d.getDate()).padStart(2, '0')
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const year = d.getFullYear()
    const hours = String(d.getHours()).padStart(2, '0')
    const minutes = String(d.getMinutes()).padStart(2, '0')
    return `${day}.${month}.${year}. u ${hours}:${minutes}`
  }

  const getTierIcon = (tier) => {
    switch (tier) {
      case 'GOLD': return '🥇'
      case 'SILVER': return '🥈'
      default: return '🥉'
    }
  }

  if (!user) {
    return (
      <div className="cine-profile-page">
        <div className="admin-access-card" style={{ margin: '60px auto', maxWidth: '480px', textAlign: 'center' }}>
          <User size={56} className="admin-access-icon" style={{ color: 'var(--color-accent-primary)' }} />
          <h2 style={{ marginTop: '16px', fontSize: '1.5rem', fontWeight: '600' }}>Potrebna je Prijava na Nalog</h2>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: '8px', marginBottom: '24px', lineHeight: '1.5' }}>
            Za pristup vašem profilu, pregled kupljenih ulaznica, HypeClub poena i liste želja morate biti prijavljeni na nalog.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Button variant="primary" size="lg" onClick={() => handleOpenAuth && handleOpenAuth('login')}>
              Prijavi se
            </Button>
            <Button variant="secondary" size="lg" onClick={() => handleOpenAuth && handleOpenAuth('register')}>
              Kreiraj nalog
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="cine-profile-page">
      <div className="cine-profile-container">

        {/* Left Navigation Sidebar */}
        <aside className="cine-profile-sidebar">
          <nav className="cine-profile-menu">
            <button
              className={`cine-profile-menu-item ${activeTab === 'ACCOUNT' ? 'active' : ''}`}
              onClick={() => setActiveTab('ACCOUNT')}
            >
              <User className="cine-menu-icon" />
              <span>Moj nalog</span>
            </button>

            <button
              className={`cine-profile-menu-item ${activeTab === 'TICKETS' ? 'active' : ''}`}
              onClick={() => setActiveTab('TICKETS')}
            >
              <Ticket className="cine-menu-icon" />
              <span>Moje ulaznice</span>
            </button>

            <button
              className={`cine-profile-menu-item ${activeTab === 'LOYALTY' ? 'active' : ''}`}
              onClick={() => setActiveTab('LOYALTY')}
            >
              <CreditCard className="cine-menu-icon" />
              <span>Moja Bonus kartica</span>
            </button>

            <button
              className={`cine-profile-menu-item ${activeTab === 'HISTORY' ? 'active' : ''}`}
              onClick={() => setActiveTab('HISTORY')}
            >
              <History className="cine-menu-icon" />
              <span>Moja istorija</span>
            </button>

            <button
              className={`cine-profile-menu-item ${activeTab === 'WATCHLIST' ? 'active' : ''}`}
              onClick={() => setActiveTab('WATCHLIST')}
            >
              <Heart className="cine-menu-icon" />
              <span>Moja lista za gledanje</span>
            </button>

            <button
              className="cine-profile-menu-item cine-menu-logout"
              onClick={() => {
                logout()
                if (showToast) showToast('Odjavili ste se sa profila.', 'info')
                navigate('/')
              }}
            >
              <LogOut className="cine-menu-icon" />
              <span>Odjavi se</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="cine-profile-main">
          {/* TAB 1: MOJ NALOG */}
          {activeTab === 'ACCOUNT' && (
            <div className="cine-account-view">
              <h1 className="cine-page-header-title">MOJ NALOG</h1>

              {/* User Profile Card */}
              <div className="cine-user-card">
                <div className="cine-user-card-header">
                  <div className="cine-user-card-info">
                    <h2 className="cine-user-name">
                      {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Andrija Milovanovic'}
                    </h2>
                    <p className="cine-user-email">
                      {user?.email || 'aandrijq@gmail.com'}
                    </p>
                  </div>

                  <div className="cine-user-card-actions">
                    <button
                      className="cine-card-btn cine-btn-edit"
                      onClick={() => {
                        setIsEditingProfile(!isEditingProfile)
                        setIsProfileExpanded(true)
                      }}
                      title="Izmeni podatke profila"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      className={`cine-card-btn cine-btn-expand ${isProfileExpanded ? 'expanded' : ''}`}
                      onClick={() => setIsProfileExpanded(!isProfileExpanded)}
                      title={isProfileExpanded ? 'Sakrij detalje' : 'Prikaži detalje profila'}
                    >
                      <ChevronDown size={20} />
                    </button>
                  </div>
                </div>

                {/* Collapsible Details Content */}
                {isProfileExpanded && (
                  <div className="cine-user-details-body">
                    {isEditingProfile ? (
                      /* Edit Profile Form */
                      <form onSubmit={handleSaveProfile} className="cine-edit-profile-form">
                        <div className="cine-form-row">
                          <InputField
                            label="Ime"
                            name="firstName"
                            value={profileForm.firstName}
                            onChange={handleProfileFormChange}
                            required
                          />
                          <InputField
                            label="Prezime"
                            name="lastName"
                            value={profileForm.lastName}
                            onChange={handleProfileFormChange}
                            required
                          />
                        </div>

                        <div className="cine-form-row">
                          <InputField
                            label="Email adresa"
                            name="email"
                            type="email"
                            value={profileForm.email}
                            onChange={handleProfileFormChange}
                            required
                          />
                          <InputField
                            label="Telefon"
                            name="phone"
                            value={profileForm.phone}
                            onChange={handleProfileFormChange}
                            required
                          />
                        </div>

                        <div className="cine-form-row">
                          <InputField
                            label="Grad / Mesto stanovanja"
                            name="city"
                            value={profileForm.city}
                            onChange={handleProfileFormChange}
                            required
                          />
                          <InputField
                            label="Adresa"
                            name="address"
                            value={profileForm.address}
                            onChange={handleProfileFormChange}
                            required
                          />
                        </div>

                        <div className="cine-form-row">
                          <InputField
                            label="Datum rođenja"
                            name="birthDate"
                            type="text"
                            placeholder="15.05.1998"
                            value={profileForm.birthDate}
                            onChange={handleProfileFormChange}
                            required
                          />
                        </div>

                        <div className="cine-form-actions">
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setIsEditingProfile(false)}
                          >
                            <X size={16} /> Odustani
                          </Button>
                          <Button type="submit" variant="primary">
                            <Save size={16} /> Sačuvaj izmene
                          </Button>
                        </div>
                      </form>
                    ) : (
                      /* Read-only User Details Display */
                      <div className="cine-details-grid">
                        <div className="cine-detail-item">
                          <span className="cine-detail-label">Grad / Mesto stanovanja:</span>
                          <span className="cine-detail-value">{user?.city || 'Beograd'}</span>
                        </div>

                        <div className="cine-detail-item">
                          <span className="cine-detail-label">Adresa:</span>
                          <span className="cine-detail-value">{user?.address || 'Bulevar Mihajla Pupina 10'}</span>
                        </div>

                        <div className="cine-detail-item">
                          <span className="cine-detail-label">Datum rođenja:</span>
                          <span className="cine-detail-value">{user?.birthDate || '15.05.1998'}</span>
                        </div>

                        <div className="cine-detail-item">
                          <span className="cine-detail-label">Telefon:</span>
                          <span className="cine-detail-value">{user?.phone || '+381 64 123 4567'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Section: MOJI OMILJENI BIOSKOPI */}
              <div className="cine-fav-section">
                <h3 className="cine-fav-section-title">MOJI OMILJENI BIOSKOPI</h3>

                <div className="cine-cinema-cards-grid">
                  {favoriteCinemas.map((cinema) => (
                    <div key={cinema.id} className="cine-cinema-card">
                      <button
                        className={`cine-cinema-fav-btn ${cinema.isFav ? 'active' : ''}`}
                        onClick={() => toggleFavCinema(cinema.id)}
                        title="Omiljeni bioskop"
                      >
                        <Star size={18} fill={cinema.isFav ? '#e11d48' : 'none'} />
                      </button>

                      <div className="cine-cinema-img-wrapper">
                        <img src={cinema.image} alt={cinema.name} />
                      </div>

                      <div className="cine-cinema-details">
                        <h4 className="cine-cinema-name">{cinema.name}</h4>
                        <p className="cine-cinema-address">{cinema.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MOJE ULAZNICE */}
          {activeTab === 'TICKETS' && (
            <div className="cine-tab-view">
              <h1 className="cine-page-header-title">MOJE ULAZNICE</h1>

              {activeTickets.length === 0 ? (
                <div className="res-empty-state">
                  <div className="res-empty-icon">
                    <Ticket size={36} />
                  </div>
                  <h3>Nemate aktivnih ulaznica</h3>
                  <p>
                    Ovde se prikazuju važeće karte spremne za skeniranje na ulazu u bioskop.
                  </p>
                  <Button variant="primary" onClick={() => navigate('/')}>
                    Pogledaj repertoar
                  </Button>
                </div>
              ) : (
                <div className="res-tickets-grid">
                  {activeTickets.map((ticket) => {
                    const seatDisplay = ticket.seatLabels || ticket.seats
                    return (
                      <div key={ticket.id} className="res-ticket-card">
                        <div className="res-ticket-poster">
                          <img src={ticket.poster} alt={ticket.movieTitle} />
                        </div>

                        <div className="res-ticket-main">
                          <div className="res-ticket-header">
                            <h3 className="res-ticket-title">{ticket.movieTitle}</h3>
                            <span className="res-status-tag res-status-tag--active">
                              Spremno za ulaz
                            </span>
                          </div>

                          <div className="res-ticket-meta">
                            <span className="res-meta-item">
                              <Calendar size={14} /> {formatDate(ticket.date)}
                            </span>
                            <span className="res-meta-item">
                              <Clock size={14} /> {ticket.time}
                            </span>
                            <span className="res-meta-item">
                              <MapPin size={14} /> {ticket.hall}
                            </span>
                          </div>

                          <div className="res-ticket-seats-row">
                            <span className="res-seats-label">Izabrana sedišta:</span>
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
                              <span>Plaćeni iznos:</span>
                              <strong className="res-price-num">
                                {ticket.finalTotal.toLocaleString('sr-RS')} RSD
                              </strong>
                            </div>
                            <span className="res-ticket-ref">KOD: {ticket.ref}</span>
                          </div>
                        </div>

                        <div className="res-ticket-actions">
                          <Button
                            variant="primary"
                            size="md"
                            onClick={() => handleOpenQrModal(ticket)}
                          >
                            <QrCode size={16} /> QR Kod za ulaz
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenCancelModal(ticket)}
                          >
                            <XCircle size={15} /> Otkaži kartu
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MOJA BONUS KARTICA */}
          {activeTab === 'LOYALTY' && (
            <div className="cine-tab-view">
              <h1 className="cine-page-header-title">MOJA BONUS KARTICA</h1>

              <div className="res-loyalty-card">
                <div className="res-loyalty-main">
                  <div className={`res-tier-badge res-tier-badge--${stats.tier.toLowerCase()}`}>
                    <span className="res-tier-emoji">{getTierIcon(stats.tier)}</span>
                    <div className="res-tier-info">
                      <span className="res-tier-label">HypeClub Rang</span>
                      <span className="res-tier-name">{stats.tier} MEMBER</span>
                    </div>
                  </div>

                  <div className="res-points-overview">
                    <div className="res-points-box">
                      <span className="res-points-num">{stats.points.toLocaleString('sr-RS')}</span>
                      <span className="res-points-sub">
                        <Star size={13} /> Sakupljeni poeni
                      </span>
                    </div>

                    <div className="res-points-box">
                      <span className="res-points-num">{stats.totalSpent.toLocaleString('sr-RS')} RSD</span>
                      <span className="res-points-sub">Ukupna potrošnja</span>
                    </div>

                    <div className="res-points-box">
                      <span className="res-points-num">{stats.activeTicketsCount}</span>
                      <span className="res-points-sub">Aktivne karte</span>
                    </div>
                  </div>
                </div>

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

                <div className="res-tier-benefits">
                  <div className={`res-benefit-item ${stats.tier === 'BRONZE' ? 'res-benefit-item--current' : ''}`}>
                    <Sparkles size={14} />
                    <span><strong>BRONZE:</strong> 10 poena na svakih 100 RSD potrošnje</span>
                  </div>
                  <div className={`res-benefit-item ${stats.tier === 'SILVER' ? 'res-benefit-item--current' : ''}`}>
                    <Zap size={14} />
                    <span><strong>SILVER:</strong> +5% bonus poena & popusti na osveženja u bifeu</span>
                  </div>
                  <div className={`res-benefit-item ${stats.tier === 'GOLD' ? 'res-benefit-item--current' : ''}`}>
                    <Award size={14} />
                    <span><strong>GOLD:</strong> +10% bonus poena, VIP brzi ulaz & besplatne kokice</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MOJA ISTORIJA */}
          {activeTab === 'HISTORY' && (
            <div className="cine-tab-view">
              <h1 className="cine-page-header-title">MOJA ISTORIJA KUPOVINA</h1>

              {completedTransactions.length === 0 ? (
                <div className="res-empty-state">
                  <div className="res-empty-icon">
                    <History size={36} />
                  </div>
                  <h3>Nema odgledanih projekcija u istoriji</h3>
                  <p>Nakon što odgledate kupljenu projekciju, ovde će se prikazati detalji transakcije.</p>
                </div>
              ) : (
                <div className="history-table-wrapper">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>1. Datum i vreme transakcije</th>
                        <th>2. Bioskop</th>
                        <th>3. Film</th>
                        <th>4. Broj ulaznica</th>
                        <th>5. Cena</th>
                        <th>6. Loyalty bodovi</th>
                        <th>7. Datum projekcije</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedTransactions.map((item) => (
                        <tr key={item.id}>
                          <td className="history-col-time">
                            {formatTransactionTime(item.createdAt)}
                          </td>
                          <td className="history-col-cinema">
                            <Building2 size={14} className="inline-icon" />
                            {item.cinemaLocation || 'Hype Galerija - Beograd'}
                          </td>
                          <td className="history-col-movie">
                            <strong>{item.movieTitle}</strong>
                          </td>
                          <td className="history-col-tickets">
                            {(item.seatLabels || item.seats || []).length} ulaznice
                          </td>
                          <td className="history-col-price">
                            {item.finalTotal.toLocaleString('sr-RS')} RSD
                          </td>
                          <td className="history-col-points">
                            +{item.earnedPoints || Math.floor(item.finalTotal / 10)} poena
                          </td>
                          <td className="history-col-screening">
                            {item.date} u {item.time}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: MOJA LISTA ZA GLEDANJE */}
          {activeTab === 'WATCHLIST' && (
            <div className="cine-tab-view">
              <h1 className="cine-page-header-title">MOJA LISTA ZA GLEDANJE</h1>

              {watchlistMovies.length === 0 ? (
                <div className="res-empty-state">
                  <div className="res-empty-icon">
                    <Heart size={36} />
                  </div>
                  <h3>Vaša lista za gledanje je prazna</h3>
                  <p>
                    Označite filmove ikonicom srca (💖) na detaljima filma da biste ih sačuvali na ovoj listi.
                  </p>
                  <Button variant="primary" onClick={() => navigate('/')}>
                    Istraži filmove
                  </Button>
                </div>
              ) : (
                <div className="watchlist-grid">
                  {watchlistMovies.map((movie) => (
                    <div
                      key={movie.id}
                      className="watchlist-card"
                      onClick={() => navigate(`/movies/${movie.id}`)}
                    >
                      <div className="watchlist-poster">
                        <img src={movie.poster} alt={movie.title} />
                        <button
                          className="watchlist-remove-btn"
                          onClick={(e) => handleRemoveFromWatchlist(e, movie.id)}
                          title="Ukloni iz liste želja"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                      <div className="watchlist-info">
                        <h3 className="watchlist-title">{movie.title}</h3>
                        <p className="watchlist-meta">
                          {movie.genre} · {movie.duration}m · ★ {movie.rating}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* QR Ticket Detail Modal */}
      <Modal
        isOpen={qrModalOpen}
        onClose={() => {
          setQrModalOpen(false)
          setSelectedTicket(null)
        }}
        title="Digitalna Bioskopska Karta za Ulaz"
        maxWidth="480px"
      >
        {selectedTicket && (
          <div className="res-modal-ticket">
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

            <div className="co-ticket-divider">
              <div className="co-ticket-notch co-ticket-notch--left" />
              <div className="co-ticket-dash" />
              <div className="co-ticket-notch co-ticket-notch--right" />
            </div>

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
              </div>

              <div className="co-ticket-qr">
                <canvas ref={modalQrCanvasRef} />
                <span className="co-ticket-qr-hint">Skenirajte ovaj QR kod na ulazu</span>
              </div>
            </div>

            <div className="res-modal-actions">
              <Button variant="secondary" size="md" onClick={() => window.print()}>
                <Download size={16} /> Sačuvaj / Štampaj
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
