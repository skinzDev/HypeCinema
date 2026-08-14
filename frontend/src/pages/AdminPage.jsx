import { useState, useEffect, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import {
  Shield,
  Film,
  Calendar,
  Ticket,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  AlertTriangle,
  UserCheck,
  Zap,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  getStoredMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  getStoredScreenings,
  addScreening,
  deleteScreening,
  hallsData,
} from '../data/movies'
import { getStoredBookings } from '../data/bookings'
import {
  fetchAllBookingsApi,
  fetchAllMoviesApi,
  createMovieApi,
  updateMovieApi,
  deleteMovieApi,
  fetchAllScreeningsApi,
  createScreeningApi,
  deleteScreeningApi,
} from '../services/api'
import Button from '../components/Button'
import Modal from '../components/Modal'
import InputField from '../components/InputField'
import SelectField from '../components/SelectField'

export default function AdminPage() {
  const { user, isAdmin, loginAsAdmin } = useAuth()
  const { showToast } = useOutletContext() || {}

  const [movies, setMovies] = useState([])
  const [screenings, setScreenings] = useState([])
  const [bookings, setBookings] = useState([])

  const [activeTab, setActiveTab] = useState('MOVIES') // 'MOVIES', 'SCREENINGS', 'BOOKINGS'
  const [searchQuery, setSearchQuery] = useState('')

  // Modals state
  const [movieModalOpen, setMovieModalOpen] = useState(false)
  const [editingMovie, setEditingMovie] = useState(null)
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    genre: 'Akcija',
    duration: 120,
    director: '',
    cast: '',
    rating: 8.0,
    releaseDate: new Date().toISOString().split('T')[0],
    status: 'NOW_SHOWING',
    poster: '',
  })

  const [screeningModalOpen, setScreeningModalOpen] = useState(false)
  const [screeningForm, setScreeningForm] = useState({
    movieId: 1,
    cinemaId: 'BEOGRAD',
    hall: 'Sala 1 - IMAX',
    date: '2026-08-15',
    time: '18:00',
    price: 800,
  })

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null) // { type: 'MOVIE'|'SCREENING', item: ... }

  // Load data on mount and on broadcast
  const loadAllAdminData = async () => {
    try {
      const [apiMovies, apiScreenings, apiBookings] = await Promise.all([
        fetchAllMoviesApi(),
        fetchAllScreeningsApi(),
        fetchAllBookingsApi(),
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

      if (apiBookings && Array.isArray(apiBookings)) {
        const mapped = apiBookings.map((dto) => ({
          id: dto.id,
          ref: dto.bookingReference,
          customerEmail: dto.username,
          customerName: dto.username,
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
          redeemedPoints: dto.pointsRedeemed,
          discountAmount: dto.discountAmount,
          createdAt: dto.createdAt,
          status: dto.status,
        }))
        setBookings(mapped)
      } else {
        setBookings(getStoredBookings())
      }
    } catch (err) {
      console.error('Error loading admin data:', err)
      setMovies(getStoredMovies())
      setScreenings(getStoredScreenings())
      setBookings(getStoredBookings())
    }
  }

  useEffect(() => {
    loadAllAdminData()

    window.addEventListener('hype_cinema_data_changed', loadAllAdminData)
    return () => {
      window.removeEventListener('hype_cinema_data_changed', loadAllAdminData)
    }
  }, [])


  // Calculated KPI stats
  const kpis = useMemo(() => {
    const totalMovies = movies.length
    const totalScreenings = screenings.length
    const totalBookings = bookings.length
    const totalRevenue = bookings
      .filter((b) => b.status !== 'CANCELLED')
      .reduce((sum, b) => sum + (b.finalTotal || 0), 0)

    return { totalMovies, totalScreenings, totalBookings, totalRevenue }
  }, [movies, screenings, bookings])

  // --- Movie Handlers ---
  const handleOpenAddMovie = () => {
    setEditingMovie(null)
    setMovieForm({
      title: '',
      description: '',
      genre: 'Akcija',
      duration: 120,
      director: '',
      cast: '',
      rating: 8.0,
      releaseDate: new Date().toISOString().split('T')[0],
      status: 'NOW_SHOWING',
      poster: '',
    })
    setMovieModalOpen(true)
  }

  const handleOpenEditMovie = (movie) => {
    setEditingMovie(movie)
    setMovieForm({
      title: movie.title || '',
      description: movie.description || '',
      genre: movie.genre || 'Akcija',
      duration: movie.duration || 120,
      director: movie.director || '',
      cast: Array.isArray(movie.cast) ? movie.cast.join(', ') : (movie.cast || ''),
      rating: movie.rating || 8.0,
      releaseDate: movie.releaseDate || new Date().toISOString().split('T')[0],
      status: movie.status || 'NOW_SHOWING',
      poster: movie.poster || '',
    })
    setMovieModalOpen(true)
  }

  const handleSaveMovie = async (e) => {
    e.preventDefault()
    if (!movieForm.title.trim()) return

    const payload = {
      ...movieForm,
      duration: Number(movieForm.duration) || 120,
      rating: Number(movieForm.rating) || 8.0,
      poster: movieForm.poster || '/posters/spiderman.png',
      releaseDate: movieForm.releaseDate || new Date().toISOString().split('T')[0],
    }

    if (editingMovie) {
      await updateMovieApi(editingMovie.id, payload)
      setMovies(getStoredMovies())
      if (showToast) showToast(`Film "${movieForm.title}" je uspešno ažuriran!`, 'success')
    } else {
      await createMovieApi(payload)
      setMovies(getStoredMovies())
      if (showToast) showToast(`Novi film "${movieForm.title}" je uspešno dodat!`, 'success')
    }
    setMovieModalOpen(false)
  }

  const handlePromptDeleteMovie = (movie) => {
    setDeleteTarget({ type: 'MOVIE', item: movie })
    setDeleteConfirmOpen(true)
  }

  // --- Screening Handlers ---
  const handleOpenAddScreening = () => {
    setScreeningForm({
      movieId: movies[0]?.id || 1,
      cinemaId: 'BEOGRAD',
      hall: 'Sala 1 - IMAX',
      date: new Date().toISOString().split('T')[0],
      time: '18:00',
      price: 800,
    })
    setScreeningModalOpen(true)
  }

  const handleSaveScreening = async (e) => {
    e.preventDefault()

    await createScreeningApi(screeningForm)
    setScreenings(getStoredScreenings())
    if (showToast) showToast('Nova projekcija je uspešno zakazana!', 'success')
    setScreeningModalOpen(false)
  }

  const handlePromptDeleteScreening = (screening) => {
    setDeleteTarget({ type: 'SCREENING', item: screening })
    setDeleteConfirmOpen(true)
  }

  // --- Confirm Delete ---
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return

    if (deleteTarget.type === 'MOVIE') {
      await deleteMovieApi(deleteTarget.item.id)
      setMovies(getStoredMovies())
      if (showToast) showToast(`Film "${deleteTarget.item.title}" je obrisan.`, 'info')
    } else if (deleteTarget.type === 'SCREENING') {
      await deleteScreeningApi(deleteTarget.item.id)
      setScreenings(getStoredScreenings())
      if (showToast) showToast('Projekcija je obrisana.', 'info')
    }
    setDeleteConfirmOpen(false)
    setDeleteTarget(null)
  }


  // Filtered list helpers
  const filteredMovies = useMemo(() => {
    return movies.filter((m) =>
      m.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genre?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [movies, searchQuery])

  const filteredBookings = useMemo(() => {
    return bookings.filter(
      (b) =>
        b.ref?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.movieTitle?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [bookings, searchQuery])

  // Non-admin Access Protection
  if (!isAdmin()) {
    return (
      <div className="admin-page">
        <div className="admin-access-card">
          <Shield size={48} className="admin-access-icon" style={{ color: '#ef4444' }} />
          <h2>Pristup Odbijen</h2>
          <p>
            Stranica za upravljanje bioskopom (CRUD nad filmovima, zakazivanje projekcija i uvid u rezervacije) je rezervisana isključivo za ulogovane administratore.
          </p>
          <div className="admin-access-actions">
            <Button
              variant="primary"
              size="lg"
              onClick={() => window.location.href = '/'}
            >
              Vrati se na početnu stranicu
            </Button>
          </div>
        </div>
      </div>
    )
  }


  return (
    <div className="admin-page">
      {/* Header & Title */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Upravljanje Bioskopom</h1>
          <p className="admin-subtitle">
            Katalog filmova, zakazivanje projekcija, sale i globalni pregled rezervacija.
          </p>
        </div>

        <div className="admin-user-info">
          <span className="admin-user-name">{user?.firstName || user?.username}</span>
          <span className="admin-role-tag">ROLE_ADMIN</span>
        </div>
      </div>

      {/* Tabs & Search Navigation */}
      <div className="admin-nav-bar">
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === 'MOVIES' ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab('MOVIES')}
          >
            <Film size={16} /> Upravljanje filmovima
          </button>

          <button
            className={`admin-tab ${activeTab === 'SCREENINGS' ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab('SCREENINGS')}
          >
            <Calendar size={16} /> Projekcije & Sale
          </button>

          <button
            className={`admin-tab ${activeTab === 'BOOKINGS' ? 'admin-tab--active' : ''}`}
            onClick={() => setActiveTab('BOOKINGS')}
          >
            <Ticket size={16} /> Pregled Rezervacija
          </button>
        </div>

        <div className="admin-search-wrapper">
          <Search size={16} className="admin-search-icon" />
          <input
            type="text"
            placeholder="Pretraži..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="admin-search-input"
          />
        </div>
      </div>

      {/* --- TAB 1: MOVIES MANAGEMENT --- */}
      {activeTab === 'MOVIES' && (
        <div className="admin-section">
          <div className="admin-section-header">
            <h3>Katalog Filmova ({filteredMovies.length})</h3>
            <Button variant="primary" onClick={handleOpenAddMovie}>
              <Plus size={16} /> Dodaj Novi Film
            </Button>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Poster</th>
                  <th>Naslov</th>
                  <th>Žanr</th>
                  <th>Trajanje</th>
                  <th>Režiser</th>
                  <th>Status</th>
                  <th>Akcije</th>
                </tr>
              </thead>
              <tbody>
                {filteredMovies.map((movie) => (
                  <tr key={movie.id}>
                    <td>
                      <img src={movie.poster} alt={movie.title} className="admin-table-poster" />
                    </td>
                    <td>
                      <strong>{movie.title}</strong>
                    </td>
                    <td>{movie.genre}</td>
                    <td>{movie.duration} min</td>
                    <td>{movie.director || 'N/A'}</td>
                    <td>
                      <span
                        className={`admin-status-badge admin-status-badge--${movie.status?.toLowerCase()}`}
                      >
                        {movie.status === 'NOW_SHOWING' ? 'NA REPERTOARU' : 'USKORO'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions-cell">
                        <button
                          className="admin-btn-icon"
                          onClick={() => handleOpenEditMovie(movie)}
                          title="Izmeni film"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="admin-btn-icon admin-btn-icon--danger"
                          onClick={() => handlePromptDeleteMovie(movie)}
                          title="Obriši film"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 2: SCREENINGS & HALLS --- */}
      {activeTab === 'SCREENINGS' && (
        <div className="admin-section">
          <div className="admin-section-header">
            <h3>Zakazane Projekcije ({screenings.length})</h3>
            <Button variant="primary" onClick={handleOpenAddScreening}>
              <Plus size={16} /> Zakaži Novu Projekciju
            </Button>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Film</th>
                  <th>Bioskop</th>
                  <th>Sala</th>
                  <th>Datum</th>
                  <th>Vreme</th>
                  <th>Cena Karte</th>
                  <th>Slobodna mesta</th>
                  <th>Akcija</th>
                </tr>
              </thead>
              <tbody>
                {screenings.map((s) => {
                  const m = movies.find((mov) => mov.id === s.movieId)
                  return (
                    <tr key={s.id}>
                      <td>#{s.id}</td>
                      <td>
                        <strong>{m ? m.title : `Film ID: ${s.movieId}`}</strong>
                      </td>
                      <td>{s.cinemaId || 'BEOGRAD'}</td>
                      <td>{s.hall}</td>
                      <td>{s.date}</td>
                      <td>{s.time}</td>
                      <td>
                        <strong>{s.price} RSD</strong>
                      </td>
                      <td>{s.seatsAvailable} slobodno</td>
                      <td>
                        <button
                          className="admin-btn-icon admin-btn-icon--danger"
                          onClick={() => handlePromptDeleteScreening(s)}
                          title="Otkaži projekciju"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 3: BOOKINGS VIEW --- */}
      {activeTab === 'BOOKINGS' && (
        <div className="admin-section">
          <div className="admin-section-header">
            <h3>Sve Rezervacije Bioskopa ({filteredBookings.length})</h3>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Ref Kod</th>
                  <th>Kupac</th>
                  <th>Email</th>
                  <th>Film</th>
                  <th>Sala & Termin</th>
                  <th>Sedišta</th>
                  <th>Iznos</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <code className="admin-ref-code">{b.ref}</code>
                    </td>
                    <td>{b.customerName}</td>
                    <td>{b.customerEmail}</td>
                    <td>
                      <strong>{b.movieTitle}</strong>
                    </td>
                    <td>
                      {b.hall} ({b.date} u {b.time})
                    </td>
                    <td>
                      <span className="admin-seats-list">
                        {(b.seatLabels || b.seats).join(', ')}
                      </span>
                    </td>
                    <td>
                      <strong>{b.finalTotal?.toLocaleString('sr-RS')} RSD</strong>
                    </td>
                    <td>
                      <span
                        className={`admin-status-badge admin-status-badge--${b.status?.toLowerCase()}`}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- MOVIE FORM MODAL --- */}
      <Modal
        isOpen={movieModalOpen}
        onClose={() => setMovieModalOpen(false)}
        title={editingMovie ? 'Izmena Filma' : 'Dodaj Novi Film'}
        maxWidth="550px"
      >
        <form onSubmit={handleSaveMovie} className="admin-form">
          <InputField
            label="Naslov Filma"
            placeholder="Npr. Avatar 3"
            value={movieForm.title}
            onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
            required
          />

          <div className="admin-form-row">
            <SelectField
              label="Žanr"
              value={movieForm.genre}
              onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
              options={[
                { value: 'Akcija', label: 'Akcija' },
                { value: 'Sci-Fi', label: 'Sci-Fi' },
                { value: 'Triler', label: 'Triler' },
                { value: 'Drama', label: 'Drama' },
                { value: 'Komedija', label: 'Komedija' },
                { value: 'Animacija', label: 'Animacija' },
                { value: 'Horor', label: 'Horor' },
              ]}
              required
            />

            <InputField
              label="Trajanje (minuti)"
              type="number"
              value={movieForm.duration}
              onChange={(e) => setMovieForm({ ...movieForm, duration: Number(e.target.value) })}
              required
            />
          </div>

          <div className="admin-form-row">
            <InputField
              label="Režiser"
              placeholder="Npr. James Cameron"
              value={movieForm.director}
              onChange={(e) => setMovieForm({ ...movieForm, director: e.target.value })}
            />

            <SelectField
              label="Status Filma"
              value={movieForm.status}
              onChange={(e) => setMovieForm({ ...movieForm, status: e.target.value })}
              options={[
                { value: 'NOW_SHOWING', label: 'NA REPERTOARU (Now Showing)' },
                { value: 'COMING_SOON', label: 'USKORO (Coming Soon)' },
              ]}
              required
            />
          </div>

          <InputField
            label="Poster Slika (URL)"
            placeholder="https://example.com/poster.jpg"
            value={movieForm.poster}
            onChange={(e) => setMovieForm({ ...movieForm, poster: e.target.value })}
          />

          <div className="admin-form-row">
            <InputField
              label="Glumci (odvojeni zarezom)"
              placeholder="Npr. Tom Holland, Zendaya"
              value={movieForm.cast}
              onChange={(e) => setMovieForm({ ...movieForm, cast: e.target.value })}
            />

            <InputField
              label="Ocena (1-10)"
              type="number"
              step="0.1"
              value={movieForm.rating}
              onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })}
            />
          </div>

          <InputField
            label="Datum premijere"
            type="date"
            value={movieForm.releaseDate}
            onChange={(e) => setMovieForm({ ...movieForm, releaseDate: e.target.value })}
          />

          <div className="select-field">
            <label className="input-field-label">Opis Filma</label>
            <textarea
              className="select-field-input admin-textarea"
              style={{ minHeight: '100px', cursor: 'text', resize: 'vertical' }}
              rows={4}
              placeholder="Unesite kratak opis i sinopsis..."
              value={movieForm.description}
              onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
            />
          </div>

          <div className="admin-form-actions">
            <Button variant="secondary" onClick={() => setMovieModalOpen(false)}>
              Odustani
            </Button>
            <Button type="submit" variant="primary">
              {editingMovie ? 'Sačuvaj izmene' : 'Kreiraj film'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* --- SCREENING FORM MODAL --- */}
      <Modal
        isOpen={screeningModalOpen}
        onClose={() => setScreeningModalOpen(false)}
        title="Zakaži Novu Projekciju"
        maxWidth="500px"
      >
        <form onSubmit={handleSaveScreening} className="admin-form">
          <SelectField
            label="Izaberite Film"
            value={screeningForm.movieId}
            onChange={(e) => setScreeningForm({ ...screeningForm, movieId: e.target.value })}
            options={movies.map((m) => ({
              value: m.id,
              label: `${m.title} (${m.genre})`,
            }))}
            required
          />

          <div className="admin-form-row">
            <SelectField
              label="Bioskop (Grad)"
              value={screeningForm.cinemaId || 'BEOGRAD'}
              onChange={(e) => setScreeningForm({ ...screeningForm, cinemaId: e.target.value })}
              options={[
                { value: 'BEOGRAD', label: 'Beograd - Galerija' },
                { value: 'NOVI_SAD', label: 'Novi Sad - Promenada' },
                { value: 'NIS', label: 'Niš - Delta' },
                { value: 'KRAGUJEVAC', label: 'Kragujevac - Plaza' },
              ]}
              required
            />

            <SelectField
              label="Sala Bioskopa"
              value={screeningForm.hall}
              onChange={(e) => setScreeningForm({ ...screeningForm, hall: e.target.value })}
              options={Object.keys(hallsData).map((h) => ({
                value: h,
                label: h,
              }))}
              required
            />
          </div>

          <div className="admin-form-row">
            <InputField
              label="Datum projekcije"
              type="date"
              value={screeningForm.date}
              onChange={(e) => setScreeningForm({ ...screeningForm, date: e.target.value })}
              required
            />

            <InputField
              label="Vreme"
              type="time"
              value={screeningForm.time}
              onChange={(e) => setScreeningForm({ ...screeningForm, time: e.target.value })}
              required
            />
          </div>

          <InputField
            label="Cena Ulaznice (RSD)"
            type="number"
            value={screeningForm.price}
            onChange={(e) => setScreeningForm({ ...screeningForm, price: e.target.value })}
            required
          />

          <div className="admin-form-actions">
            <Button variant="secondary" onClick={() => setScreeningModalOpen(false)}>
              Odustani
            </Button>
            <Button type="submit" variant="primary">
              Zakaži termin
            </Button>
          </div>
        </form>
      </Modal>

      {/* --- DELETE CONFIRM MODAL --- */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title="Potvrda Brisanja"
        maxWidth="420px"
      >
        {deleteTarget && (
          <div className="admin-delete-content">
            <AlertTriangle size={36} className="admin-delete-icon" />
            <p>
              Da li ste sigurni da želite da uklonite{' '}
              {deleteTarget.type === 'MOVIE'
                ? `film "${deleteTarget.item.title}"`
                : `projekciju #${deleteTarget.item.id}`}?
            </p>
            <div className="admin-form-actions">
              <Button variant="secondary" onClick={() => setDeleteConfirmOpen(false)}>
                Odustani
              </Button>
              <Button variant="danger" onClick={handleConfirmDelete}>
                Potvrdi brisanje
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
