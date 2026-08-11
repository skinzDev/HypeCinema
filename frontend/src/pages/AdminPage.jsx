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
import Button from '../components/Button'
import Modal from '../components/Modal'
import InputField from '../components/InputField'

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
    status: 'NOW_SHOWING',
    poster: '/posters/spiderman.png',
  })

  const [screeningModalOpen, setScreeningModalOpen] = useState(false)
  const [screeningForm, setScreeningForm] = useState({
    movieId: 1,
    hall: 'Sala 1 - IMAX',
    date: '2026-08-15',
    time: '18:00',
    price: 800,
  })

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null) // { type: 'MOVIE'|'SCREENING', item: ... }

  // Load data on mount
  useEffect(() => {
    setMovies(getStoredMovies())
    setScreenings(getStoredScreenings())
    setBookings(getStoredBookings())
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
      status: 'NOW_SHOWING',
      poster: '/posters/spiderman.png',
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
      status: movie.status || 'NOW_SHOWING',
      poster: movie.poster || '/posters/spiderman.png',
    })
    setMovieModalOpen(true)
  }

  const handleSaveMovie = (e) => {
    e.preventDefault()
    if (!movieForm.title.trim()) return

    if (editingMovie) {
      const updated = updateMovie(editingMovie.id, movieForm)
      setMovies(updated)
      if (showToast) showToast(`Film "${movieForm.title}" je uspešno izmenjen.`, 'success')
    } else {
      const updated = addMovie(movieForm)
      setMovies(updated)
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
      hall: 'Sala 1 - IMAX',
      date: new Date().toISOString().split('T')[0],
      time: '18:00',
      price: 800,
    })
    setScreeningModalOpen(true)
  }

  const handleSaveScreening = (e) => {
    e.preventDefault()
    const updated = addScreening({
      movieId: Number(screeningForm.movieId),
      hall: screeningForm.hall,
      date: screeningForm.date,
      time: screeningForm.time,
      price: Number(screeningForm.price),
    })
    setScreenings(updated)
    setScreeningModalOpen(false)
    if (showToast) showToast('Nova projekcija je uspešno zakazana!', 'success')
  }

  const handlePromptDeleteScreening = (screening) => {
    setDeleteTarget({ type: 'SCREENING', item: screening })
    setDeleteConfirmOpen(true)
  }

  // --- Confirm Delete ---
  const handleConfirmDelete = () => {
    if (!deleteTarget) return

    if (deleteTarget.type === 'MOVIE') {
      const updated = deleteMovie(deleteTarget.item.id)
      setMovies(updated)
      if (showToast) showToast(`Film "${deleteTarget.item.title}" je obrisan.`, 'info')
    } else if (deleteTarget.type === 'SCREENING') {
      const updated = deleteScreening(deleteTarget.item.id)
      setScreenings(updated)
      if (showToast) showToast('Projekcija je uklonjena.', 'info')
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

  // Non-admin Access Banner
  if (!isAdmin()) {
    return (
      <div className="admin-page">
        <div className="admin-access-card">
          <Shield size={48} className="admin-access-icon" />
          <h2>Potreban Administrator Pristup</h2>
          <p>
            Stranica za upravljanje bioskopom (CRUD nad filmovima, zakazivanje projekcija i uvid u rezervacije) je rezervisana za administratore.
          </p>
          <div className="admin-access-actions">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                loginAsAdmin()
                if (showToast) showToast('Prijavljeni ste kao Administrator!', 'success')
              }}
            >
              <UserCheck size={18} /> Prijavi se kao Admin (Demo)
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
          <div className="admin-badge">
            <Shield size={14} /> ADMINISTRATOR PANEL
          </div>
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

      {/* KPI Cards */}
      <div className="admin-kpis">
        <div className="admin-kpi-card">
          <div className="admin-kpi-icon">
            <Film size={22} />
          </div>
          <div className="admin-kpi-data">
            <span className="admin-kpi-value">{kpis.totalMovies}</span>
            <span className="admin-kpi-label">Filmova u ponudi</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-icon">
            <Calendar size={22} />
          </div>
          <div className="admin-kpi-data">
            <span className="admin-kpi-value">{kpis.totalScreenings}</span>
            <span className="admin-kpi-label">Zakazanih projekcija</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-icon">
            <Ticket size={22} />
          </div>
          <div className="admin-kpi-data">
            <span className="admin-kpi-value">{kpis.totalBookings}</span>
            <span className="admin-kpi-label">Ukupno rezervacija</span>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-icon">
            <DollarSign size={22} />
          </div>
          <div className="admin-kpi-data">
            <span className="admin-kpi-value">
              {kpis.totalRevenue.toLocaleString('sr-RS')} RSD
            </span>
            <span className="admin-kpi-label">Ukupni prihod</span>
          </div>
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
            <div className="input-field-wrapper">
              <label className="input-label">Žanr</label>
              <select
                className="input-field"
                value={movieForm.genre}
                onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
              >
                <option value="Akcija">Akcija</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Triler">Triler</option>
                <option value="Drama">Drama</option>
                <option value="Komedija">Komedija</option>
                <option value="Animacija">Animacija</option>
                <option value="Horor">Horor</option>
              </select>
            </div>

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

            <div className="input-field-wrapper">
              <label className="input-label">Status</label>
              <select
                className="input-field"
                value={movieForm.status}
                onChange={(e) => setMovieForm({ ...movieForm, status: e.target.value })}
              >
                <option value="NOW_SHOWING">NA REPERTOARU</option>
                <option value="COMING_SOON">USKORO</option>
              </select>
            </div>
          </div>

          <InputField
            label="Poster Slika (URL)"
            value={movieForm.poster}
            onChange={(e) => setMovieForm({ ...movieForm, poster: e.target.value })}
            required
          />

          <div className="input-field-wrapper">
            <label className="input-label">Opis Filma</label>
            <textarea
              className="input-field admin-textarea"
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
          <div className="input-field-wrapper">
            <label className="input-label">Izaberite Film</label>
            <select
              className="input-field"
              value={screeningForm.movieId}
              onChange={(e) => setScreeningForm({ ...screeningForm, movieId: e.target.value })}
            >
              {movies.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} ({m.genre})
                </option>
              ))}
            </select>
          </div>

          <div className="input-field-wrapper">
            <label className="input-label">Sala Bioskopa</label>
            <select
              className="input-field"
              value={screeningForm.hall}
              onChange={(e) => setScreeningForm({ ...screeningForm, hall: e.target.value })}
            >
              {Object.keys(hallsData).map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
            </select>
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
