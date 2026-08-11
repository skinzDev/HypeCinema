import { useState, useEffect, useRef, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import QRCode from 'qrcode'
import {
  ArrowLeft,
  CreditCard,
  Ticket,
  MapPin,
  Clock,
  Calendar,
  Film,
  Star,
  CheckCircle2,
  ChevronRight,
  User,
  Mail,
  Phone,
  Shield,
  Loader2,
  Download,
  Copy,
  Check,
  Zap,
} from 'lucide-react'
import { getMovieById, getScreeningById } from '../data/movies'
import { useAuth } from '../context/AuthContext'
import Button from '../components/Button'
import InputField from '../components/InputField'

/** Row labels: A, B, C... */
const rowLabel = (rowNum) => String.fromCharCode(64 + rowNum)

/** Format a seat key like "3-5" into "C5" */
const formatSeat = (seatKey) => {
  const [r, s] = seatKey.split('-').map(Number)
  return `${rowLabel(r)}${s}`
}

/** Generate a unique booking reference */
const generateBookingRef = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let ref = 'HC-'
  for (let i = 0; i < 8; i++) {
    ref += chars[Math.floor(Math.random() * chars.length)]
  }
  return ref
}

/** Checkout steps */
const STEPS = {
  REVIEW: 'review',
  PAYMENT: 'payment',
  CONFIRMATION: 'confirmation',
}

export default function CheckoutPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const qrCanvasRef = useRef(null)

  // Get data from navigation state (passed from SeatSelectionPage)
  const orderData = location.state
  const screening = orderData ? getScreeningById(orderData.screeningId) : null
  const movie = screening ? getMovieById(screening.movieId) : null

  const [step, setStep] = useState(STEPS.REVIEW)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [bookingRef, setBookingRef] = useState('')
  const [copied, setCopied] = useState(false)

  // Customer form
  const [customerForm, setCustomerForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
  })
  const [formErrors, setFormErrors] = useState({})

  // Mock card form
  const [cardForm, setCardForm] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  })

  // Price calculations (from order state)
  const selectedSeats = orderData?.selectedSeats || []
  const pointsToRedeem = orderData?.pointsToRedeem || 0
  const pricePerTicket = screening?.price || 0
  const baseTotal = selectedSeats.length * pricePerTicket
  const discount = Math.min(pointsToRedeem, baseTotal)
  const finalTotal = orderData?.finalTotal ?? (baseTotal - discount)

  // Earned points
  const userTier = user?.tier ?? 'BRONZE'
  const tierBonus = userTier === 'GOLD' ? 0.1 : userTier === 'SILVER' ? 0.05 : 0
  const earnedPoints = Math.floor(finalTotal / 100) * 10
  const totalEarnedWithBonus = Math.floor(earnedPoints * (1 + tierBonus))

  // Sorted seats for display
  const sortedSeats = useMemo(
    () =>
      [...selectedSeats].sort((a, b) => {
        const [ar, as_] = a.split('-').map(Number)
        const [br, bs] = b.split('-').map(Number)
        return ar !== br ? ar - br : as_ - bs
      }),
    [selectedSeats]
  )

  // Generate QR code on confirmation
  useEffect(() => {
    if (step === STEPS.CONFIRMATION && qrCanvasRef.current && bookingRef) {
      const qrData = JSON.stringify({
        ref: bookingRef,
        movie: movie?.title,
        date: screening?.date,
        time: screening?.time,
        hall: screening?.hall,
        seats: sortedSeats.map(formatSeat),
        total: finalTotal,
      })
      QRCode.toCanvas(qrCanvasRef.current, qrData, {
        width: 180,
        margin: 2,
        color: {
          dark: '#e4e4e7',
          light: '#09090b',
        },
        errorCorrectionLevel: 'M',
      })
    }
  }, [step, bookingRef, movie, screening, sortedSeats, finalTotal])

  // Guard: no order data
  if (!orderData || !screening || !movie) {
    return (
      <div className="co-page">
        <button className="md-back" onClick={() => navigate('/')}>
          <ArrowLeft size={18} /> Nazad na početnu
        </button>
        <div className="md-not-found">
          <h2>Nema podataka o porudžbini</h2>
          <p>Izgleda da niste izabrali sedišta. Molimo vas da ponovite proces.</p>
          <Button variant="primary" onClick={() => navigate('/')}>
            Nazad na repertoar
          </Button>
        </div>
      </div>
    )
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    const days = ['Ned', 'Pon', 'Uto', 'Sre', 'Čet', 'Pet', 'Sub']
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun',
      'Jul', 'Avg', 'Sep', 'Okt', 'Nov', 'Dec',
    ]
    return `${days[d.getDay()]}, ${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}.`
  }

  const formatDateLong = (dateStr) => {
    const d = new Date(dateStr)
    const days = ['Nedelja', 'Ponedeljak', 'Utorak', 'Sreda', 'Četvrtak', 'Petak', 'Subota']
    const months = [
      'Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun',
      'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar',
    ]
    return `${days[d.getDay()]}, ${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}.`
  }

  // Card number formatting: XXXX XXXX XXXX XXXX
  const handleCardNumber = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16)
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ')
    setCardForm((prev) => ({ ...prev, number: formatted }))
  }

  // Expiry formatting: MM/YY
  const handleExpiry = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4)
    if (raw.length >= 3) {
      raw = raw.slice(0, 2) + '/' + raw.slice(2)
    }
    setCardForm((prev) => ({ ...prev, expiry: raw }))
  }

  // CVC: max 3 digits
  const handleCvc = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 3)
    setCardForm((prev) => ({ ...prev, cvc: raw }))
  }

  const updateCustomer = (field, value) => {
    setCustomerForm((prev) => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateCustomerForm = () => {
    const errors = {}
    if (!customerForm.firstName.trim()) errors.firstName = 'Obavezno polje'
    if (!customerForm.lastName.trim()) errors.lastName = 'Obavezno polje'
    if (!customerForm.email.trim()) {
      errors.email = 'Obavezno polje'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerForm.email)) {
      errors.email = 'Unesite validnu email adresu'
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleProceedToPayment = () => {
    if (validateCustomerForm()) {
      setStep(STEPS.PAYMENT)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2200))

    const ref = generateBookingRef()
    setBookingRef(ref)
    setIsProcessing(false)
    setStep(STEPS.CONFIRMATION)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCopyRef = () => {
    navigator.clipboard.writeText(bookingRef)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Step indicator ──
  const renderStepIndicator = () => (
    <div className="co-steps">
      {[
        { key: STEPS.REVIEW, label: 'Pregled', num: 1 },
        { key: STEPS.PAYMENT, label: 'Plaćanje', num: 2 },
        { key: STEPS.CONFIRMATION, label: 'Potvrda', num: 3 },
      ].map(({ key, label, num }, idx) => {
        const isActive = step === key
        const isPast =
          (key === STEPS.REVIEW && step !== STEPS.REVIEW) ||
          (key === STEPS.PAYMENT && step === STEPS.CONFIRMATION)
        return (
          <div key={key} className="co-step-wrapper">
            {idx > 0 && (
              <div className={`co-step-line ${isPast ? 'co-step-line--done' : ''}`} />
            )}
            <div
              className={`co-step ${isActive ? 'co-step--active' : ''} ${
                isPast ? 'co-step--done' : ''
              }`}
            >
              {isPast ? <CheckCircle2 size={16} /> : <span>{num}</span>}
            </div>
            <span
              className={`co-step-label ${isActive ? 'co-step-label--active' : ''} ${
                isPast ? 'co-step-label--done' : ''
              }`}
            >
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )

  // ── Order summary sidebar ──
  const renderOrderSummary = () => (
    <aside className="co-order-summary">
      <div className="co-summary-card">
        <h3 className="co-summary-title">
          <Ticket size={18} /> Vaša porudžbina
        </h3>

        {/* Movie info */}
        <div className="co-movie-row">
          <div className="co-movie-poster">
            <img src={movie.poster} alt={movie.title} />
          </div>
          <div className="co-movie-info">
            <span className="co-movie-name">{movie.title}</span>
            <span className="co-movie-detail">
              <Calendar size={12} /> {formatDate(screening.date)}
            </span>
            <span className="co-movie-detail">
              <Clock size={12} /> {screening.time} · {movie.duration} min
            </span>
            <span className="co-movie-detail">
              <MapPin size={12} /> {screening.hall}
            </span>
          </div>
        </div>

        {/* Seats */}
        <div className="co-summary-section">
          <span className="co-summary-label">Sedišta ({selectedSeats.length})</span>
          <div className="co-seats-list">
            {sortedSeats.map((seat) => (
              <span key={seat} className="co-seat-chip">
                {formatSeat(seat)}
              </span>
            ))}
          </div>
        </div>

        {/* Price breakdown */}
        <div className="co-summary-section co-price-lines">
          <div className="co-price-line">
            <span>{selectedSeats.length} × {pricePerTicket.toLocaleString('sr-RS')} RSD</span>
            <span>{baseTotal.toLocaleString('sr-RS')} RSD</span>
          </div>
          {discount > 0 && (
            <div className="co-price-line co-price-line--discount">
              <span>Popust (HypeClub poeni)</span>
              <span>-{discount.toLocaleString('sr-RS')} RSD</span>
            </div>
          )}
          <div className="co-price-line co-price-line--total">
            <span>Ukupno</span>
            <span className="co-price-total-value">
              {finalTotal.toLocaleString('sr-RS')} RSD
            </span>
          </div>
        </div>

        {/* Earned points */}
        {isAuthenticated() && (
          <div className="co-points-earn">
            <Star size={13} />
            <span>
              +{totalEarnedWithBonus} poena
              {tierBonus > 0 && (
                <span className="co-tier-tag">
                  {' '}({userTier} +{Math.round(tierBonus * 100)}%)
                </span>
              )}
            </span>
          </div>
        )}
      </div>
    </aside>
  )

  // ── STEP 1: Review ──
  const renderReviewStep = () => (
    <div className="co-step-content">
      <h2 className="co-section-heading">Podaci o kupcu</h2>
      <p className="co-section-sub">
        Unesite vaše podatke za prijem digitalne karte na email.
      </p>

      <div className="co-form">
        <div className="co-form-row">
          <InputField
            label="Ime"
            name="firstName"
            value={customerForm.firstName}
            onChange={(e) => updateCustomer('firstName', e.target.value)}
            placeholder="Vaše ime"
            icon={User}
            error={formErrors.firstName}
            required
          />
          <InputField
            label="Prezime"
            name="lastName"
            value={customerForm.lastName}
            onChange={(e) => updateCustomer('lastName', e.target.value)}
            placeholder="Vaše prezime"
            icon={User}
            error={formErrors.lastName}
            required
          />
        </div>
        <InputField
          label="Email adresa"
          name="email"
          type="email"
          value={customerForm.email}
          onChange={(e) => updateCustomer('email', e.target.value)}
          placeholder="email@example.com"
          icon={Mail}
          error={formErrors.email}
          required
        />
        <InputField
          label="Broj telefona (opciono)"
          name="phone"
          type="tel"
          value={customerForm.phone}
          onChange={(e) => updateCustomer('phone', e.target.value)}
          placeholder="+381 6X XXX XXXX"
          icon={Phone}
        />
      </div>

      <div className="co-step-actions">
        <Button
          variant="secondary"
          size="lg"
          onClick={() => navigate(`/screening/${screening.id}/seats`)}
        >
          <ArrowLeft size={16} /> Nazad na izbor sedišta
        </Button>
        <Button variant="primary" size="lg" onClick={handleProceedToPayment}>
          Nastavi na plaćanje <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  )

  // ── STEP 2: Payment ──
  const renderPaymentStep = () => (
    <div className="co-step-content">
      <h2 className="co-section-heading">Način plaćanja</h2>
      <p className="co-section-sub">Izaberite željeni način plaćanja karte.</p>

      {/* Payment method selector */}
      <div className="co-payment-methods">
        <button
          className={`co-payment-option ${paymentMethod === 'card' ? 'co-payment-option--active' : ''}`}
          onClick={() => setPaymentMethod('card')}
        >
          <CreditCard size={22} />
          <div className="co-payment-option-info">
            <span className="co-payment-option-title">Kartica</span>
            <span className="co-payment-option-desc">Visa, Mastercard, Maestro</span>
          </div>
          <div className="co-payment-radio">
            <div className="co-payment-radio-inner" />
          </div>
        </button>

        <button
          className={`co-payment-option ${paymentMethod === 'test' ? 'co-payment-option--active' : ''}`}
          onClick={() => setPaymentMethod('test')}
        >
          <Zap size={22} />
          <div className="co-payment-option-info">
            <span className="co-payment-option-title">Test plaćanje</span>
            <span className="co-payment-option-desc">Instant simulacija (demo)</span>
          </div>
          <div className="co-payment-radio">
            <div className="co-payment-radio-inner" />
          </div>
        </button>
      </div>

      {/* Card form (shown only for 'card' method) */}
      {paymentMethod === 'card' && (
        <div className="co-card-form">
          <div className="co-card-form-header">
            <Shield size={15} />
            <span>Sigurna transakcija — SSL enkripcija</span>
          </div>
          <div className="co-card-input-group">
            <label className="co-card-label">Broj kartice</label>
            <div className="co-card-input-wrapper">
              <CreditCard size={16} className="co-card-input-icon" />
              <input
                type="text"
                className="co-card-input"
                placeholder="4242 4242 4242 4242"
                value={cardForm.number}
                onChange={handleCardNumber}
                maxLength={19}
              />
            </div>
          </div>
          <div className="co-card-row">
            <div className="co-card-input-group">
              <label className="co-card-label">Rok važenja</label>
              <input
                type="text"
                className="co-card-input"
                placeholder="MM/YY"
                value={cardForm.expiry}
                onChange={handleExpiry}
                maxLength={5}
              />
            </div>
            <div className="co-card-input-group">
              <label className="co-card-label">CVC</label>
              <input
                type="text"
                className="co-card-input"
                placeholder="123"
                value={cardForm.cvc}
                onChange={handleCvc}
                maxLength={3}
              />
            </div>
          </div>
          <div className="co-card-input-group">
            <label className="co-card-label">Ime na kartici</label>
            <input
              type="text"
              className="co-card-input"
              placeholder="MARKO MARKOVIC"
              value={cardForm.name}
              onChange={(e) =>
                setCardForm((prev) => ({ ...prev, name: e.target.value.toUpperCase() }))
              }
            />
          </div>
        </div>
      )}

      {/* Test payment notice */}
      {paymentMethod === 'test' && (
        <div className="co-test-notice">
          <Zap size={16} />
          <div>
            <strong>Test režim plaćanja</strong>
            <p>
              Transakcija će biti simulirana bez stvarnog zaduženja. Ovo je demo
              funkcionalnost za potrebe testiranja aplikacije.
            </p>
          </div>
        </div>
      )}

      <div className="co-step-actions">
        <Button variant="secondary" size="lg" onClick={() => setStep(STEPS.REVIEW)}>
          <ArrowLeft size={16} /> Nazad
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 size={18} className="co-spinner" /> Obrada plaćanja...
            </>
          ) : (
            <>
              <Shield size={16} />
              Plati {finalTotal.toLocaleString('sr-RS')} RSD
            </>
          )}
        </Button>
      </div>
    </div>
  )

  // ── STEP 3: Confirmation ──
  const renderConfirmationStep = () => (
    <div className="co-step-content co-confirmation">
      {/* Success header */}
      <div className="co-confirm-header">
        <div className="co-confirm-check">
          <CheckCircle2 size={40} />
        </div>
        <h2 className="co-confirm-title">Rezervacija uspešna!</h2>
        <p className="co-confirm-sub">
          Digitalna karta je poslata na <strong>{customerForm.email}</strong>
        </p>
      </div>

      {/* Digital Ticket */}
      <div className="co-ticket">
        <div className="co-ticket-top">
          <div className="co-ticket-brand">
            <span className="co-ticket-logo">H</span>
            <span className="co-ticket-brand-name">HypeCinema</span>
          </div>
          <span className="co-ticket-ref-label">Referenca</span>
          <div className="co-ticket-ref">
            <span>{bookingRef}</span>
            <button
              className="co-ticket-copy"
              onClick={handleCopyRef}
              title="Kopiraj referencu"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        <div className="co-ticket-divider">
          <div className="co-ticket-notch co-ticket-notch--left" />
          <div className="co-ticket-dash" />
          <div className="co-ticket-notch co-ticket-notch--right" />
        </div>

        <div className="co-ticket-body">
          <div className="co-ticket-info-grid">
            <div className="co-ticket-field">
              <span className="co-ticket-field-label">Film</span>
              <span className="co-ticket-field-value co-ticket-field-value--movie">
                {movie.title}
              </span>
            </div>
            <div className="co-ticket-field">
              <span className="co-ticket-field-label">Datum</span>
              <span className="co-ticket-field-value">
                {formatDateLong(screening.date)}
              </span>
            </div>
            <div className="co-ticket-field">
              <span className="co-ticket-field-label">Vreme</span>
              <span className="co-ticket-field-value co-ticket-field-value--mono">
                {screening.time}
              </span>
            </div>
            <div className="co-ticket-field">
              <span className="co-ticket-field-label">Sala</span>
              <span className="co-ticket-field-value">{screening.hall}</span>
            </div>
            <div className="co-ticket-field">
              <span className="co-ticket-field-label">Sedišta</span>
              <span className="co-ticket-field-value co-ticket-field-value--mono">
                {sortedSeats.map(formatSeat).join(', ')}
              </span>
            </div>
            <div className="co-ticket-field">
              <span className="co-ticket-field-label">Kupac</span>
              <span className="co-ticket-field-value">
                {customerForm.firstName} {customerForm.lastName}
              </span>
            </div>
          </div>

          <div className="co-ticket-qr">
            <canvas ref={qrCanvasRef} />
            <span className="co-ticket-qr-hint">Skenirajte za ulaz</span>
          </div>
        </div>

        <div className="co-ticket-footer">
          <div className="co-ticket-total">
            <span>Plaćeno</span>
            <span className="co-ticket-total-value">
              {finalTotal.toLocaleString('sr-RS')} RSD
            </span>
          </div>
          {isAuthenticated() && totalEarnedWithBonus > 0 && (
            <div className="co-ticket-points">
              <Star size={13} />
              <span>+{totalEarnedWithBonus} HypeClub poena zarađeno</span>
            </div>
          )}
        </div>
      </div>

      {/* Post-confirmation actions */}
      <div className="co-confirm-actions">
        <Button variant="primary" size="lg" onClick={() => navigate('/')}>
          <Film size={16} /> Nazad na repertoar
        </Button>
        <Button variant="secondary" size="lg" onClick={() => window.print()}>
          <Download size={16} /> Sačuvaj kartu
        </Button>
      </div>
    </div>
  )

  return (
    <div className="co-page">
      {/* Back link (hidden on confirmation) */}
      {step !== STEPS.CONFIRMATION && (
        <button
          className="md-back"
          onClick={() =>
            step === STEPS.REVIEW
              ? navigate(`/screening/${screening.id}/seats`)
              : setStep(STEPS.REVIEW)
          }
        >
          <ArrowLeft size={18} />{' '}
          {step === STEPS.REVIEW ? 'Nazad na izbor sedišta' : 'Nazad na pregled'}
        </button>
      )}

      {/* Step indicator */}
      {renderStepIndicator()}

      {/* Main layout */}
      <div className={`co-layout ${step === STEPS.CONFIRMATION ? 'co-layout--centered' : ''}`}>
        {/* Step content */}
        {step === STEPS.REVIEW && renderReviewStep()}
        {step === STEPS.PAYMENT && renderPaymentStep()}
        {step === STEPS.CONFIRMATION && renderConfirmationStep()}

        {/* Order summary sidebar (hidden on confirmation) */}
        {step !== STEPS.CONFIRMATION && renderOrderSummary()}
      </div>
    </div>
  )
}
