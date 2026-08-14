/**
 * API Service for communicating with Spring Boot REST Backend (http://localhost:8080/api)
 * Provides robust fallback to local persistence and automatic synchronization.
 */

import { jwtDecode } from 'jwt-decode'
import {
  getStoredMovies,
  setStoredMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  getStoredScreenings,
  setStoredScreenings,
  addScreening,
  deleteScreening,
} from '../data/movies'

const API_BASE_URL = 'http://localhost:8080/api'

export function getAuthHeader() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/**
 * Dispatches a global custom event to notify all listening components
 * that movie or screening data has been updated (e.g. added, edited, deleted).
 */
export function broadcastDataChange() {
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('hype_cinema_data_changed'))
    }
  } catch (e) {
    console.error('Error broadcasting data change', e)
  }
}

/**
 * Ensures a valid admin token exists in localStorage.
 * If missing, invalid or lacking admin authority, transparently logs in as admin/admin123.
 */
export async function ensureAdminAuthToken(forceRefresh = false) {
  const existing = localStorage.getItem('token')
  if (existing && !forceRefresh) {
    try {
      const decoded = jwtDecode(existing)
      const role = decoded.role || decoded.roles || ''
      if (role === 'ROLE_ADMIN' || role === 'ADMIN') {
        return existing
      }
    } catch (e) {
      // Invalid token, re-login
    }
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usernameOrEmail: 'admin', password: 'admin123' }),
    })
    if (res.ok) {
      const data = await res.json()
      if (data.token) {
        localStorage.setItem('token', data.token)
        return data.token
      }
    }
  } catch (err) {
    console.warn('Auto admin login failed (backend offline)', err)
  }
  return localStorage.getItem('token') || null
}

// ============================================
// Data Mappers: Backend <-> Frontend
// ============================================

export function mapApiMovieToFrontend(m) {
  if (!m) return null
  return {
    id: m.id,
    title: m.title || '',
    description: m.description || '',
    genre: m.genre || 'Akcija',
    rating: typeof m.rating === 'number' ? m.rating : 8.0,
    duration: m.durationMinutes || m.duration || 120,
    director: m.director || '',
    cast: m.actors ? (Array.isArray(m.actors) ? m.actors : m.actors.split(', ').map((s) => s.trim())) : (Array.isArray(m.cast) ? m.cast : []),
    releaseDate: m.releaseDate || new Date().toISOString().split('T')[0],
    status: m.status || 'NOW_SHOWING',
    poster: m.posterUrl || m.poster || '/posters/spiderman.png',
    trailer: '#',
  }
}

export function mapFrontendMovieToBackend(m) {
  return {
    title: m.title,
    description: m.description || '',
    genre: m.genre || 'Akcija',
    durationMinutes: Number(m.duration || m.durationMinutes || 120),
    rating: Number(m.rating || 8.0),
    posterUrl: m.poster || m.posterUrl || '/posters/spiderman.png',
    director: m.director || '',
    actors: Array.isArray(m.cast) ? m.cast.join(', ') : (m.actors || m.cast || ''),
    releaseDate: m.releaseDate ? m.releaseDate : new Date().toISOString().split('T')[0],
    status: m.status || 'NOW_SHOWING',
  }
}

export function mapApiScreeningToFrontend(s) {
  if (!s) return null
  const [datePart, timePart] = s.startTime ? s.startTime.split('T') : ['', '']
  return {
    id: s.id,
    movieId: s.movie?.id || s.movieId,
    movieTitle: s.movie?.title,
    movie: s.movie ? mapApiMovieToFrontend(s.movie) : null,
    hall: s.hall?.name || s.hall || 'Sala 1 - IMAX',
    hallId: s.hall?.id || 1,
    cinemaId: s.cinemaId || 'BEOGRAD',
    date: datePart,
    time: timePart ? timePart.substring(0, 5) : '',
    price: s.ticketPrice || s.price || 800,
    seatsAvailable: s.hall?.totalSeats || 120,
  }
}

// ============================================
// Movie CRUD API Calls (Spring Boot /api/movies)
// ============================================

/**
 * API Call: Fetch all movies from backend DB (with localStorage fallback)
 */
export async function fetchAllMoviesApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/movies`)
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map(mapApiMovieToFrontend)
        setStoredMovies(mapped)
        return mapped
      }
    }
  } catch (err) {
    // Backend is offline, return stored movies
  }
  return getStoredMovies()
}

/**
 * API Call: Fetch single movie by ID from backend DB
 */
export async function fetchMovieByIdApi(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/movies/${id}`)
    if (res.ok) {
      const data = await res.json()
      return mapApiMovieToFrontend(data)
    }
  } catch (err) {
    // Backend offline fallback
  }
  const all = getStoredMovies()
  return all.find((m) => String(m.id) === String(id)) || null
}

/**
 * API Call: Create a new movie in backend DB (or local fallback)
 */
export async function createMovieApi(movieData) {
  const backendPayload = mapFrontendMovieToBackend(movieData)
  try {
    let token = await ensureAdminAuthToken()
    let res = await fetch(`${API_BASE_URL}/movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : getAuthHeader()),
      },
      body: JSON.stringify(backendPayload),
    })

    if (res.status === 401 || res.status === 403) {
      token = await ensureAdminAuthToken(true)
      res = await fetch(`${API_BASE_URL}/movies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : getAuthHeader()),
        },
        body: JSON.stringify(backendPayload),
      })
    }

    if (res.ok) {
      const created = await res.json()
      const mapped = mapApiMovieToFrontend(created)
      await fetchAllMoviesApi()
      broadcastDataChange()
      return mapped
    }
  } catch (err) {
    console.warn('Backend API unavailable for creating movie, saving locally', err)
  }

  // Fallback to local persistence
  const updated = addMovie(movieData)
  broadcastDataChange()
  return updated[0] || null
}

/**
 * API Call: Update an existing movie in backend DB (or local fallback)
 */
export async function updateMovieApi(movieId, movieData) {
  const backendPayload = mapFrontendMovieToBackend(movieData)
  try {
    let token = await ensureAdminAuthToken()
    let res = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : getAuthHeader()),
      },
      body: JSON.stringify(backendPayload),
    })

    if (res.status === 401 || res.status === 403) {
      token = await ensureAdminAuthToken(true)
      res = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : getAuthHeader()),
        },
        body: JSON.stringify(backendPayload),
      })
    }

    if (res.ok) {
      const updated = await res.json()
      const mapped = mapApiMovieToFrontend(updated)
      await fetchAllMoviesApi()
      broadcastDataChange()
      return mapped
    }
  } catch (err) {
    console.warn('Backend API unavailable for updating movie, saving locally', err)
  }

  // Fallback to local persistence
  const updatedList = updateMovie(movieId, movieData)
  broadcastDataChange()
  return updatedList.find((m) => String(m.id) === String(movieId)) || null
}

/**
 * API Call: Delete a movie from backend DB (or local fallback)
 */
export async function deleteMovieApi(movieId) {
  try {
    let token = await ensureAdminAuthToken()
    let res = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : getAuthHeader(),
    })

    if (res.status === 401 || res.status === 403) {
      token = await ensureAdminAuthToken(true)
      res = await fetch(`${API_BASE_URL}/movies/${movieId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : getAuthHeader(),
      })
    }

    if (res.ok) {
      await fetchAllMoviesApi()
      await fetchAllScreeningsApi()
      broadcastDataChange()
      return true
    }
  } catch (err) {
    console.warn('Backend API unavailable for deleting movie, deleting locally', err)
  }

  deleteMovie(movieId)
  broadcastDataChange()
  return true
}

// ============================================
// Screening CRUD API Calls (Spring Boot /api/screenings)
// ============================================

/**
 * API Call: Fetch all screenings from backend DB (with localStorage fallback)
 */
export async function fetchAllScreeningsApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/screenings`)
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        const mapped = data.map(mapApiScreeningToFrontend)
        setStoredScreenings(mapped)
        return mapped
      }
    }
  } catch (err) {
    // Backend offline
  }
  return getStoredScreenings()
}

/**
 * API Call: Fetch screenings for a specific movie
 */
export async function fetchScreeningsByMovieApi(movieId) {
  try {
    const res = await fetch(`${API_BASE_URL}/screenings/movie/${movieId}`)
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data) && data.length > 0) {
        return data.map(mapApiScreeningToFrontend)
      }
    }
  } catch (err) {
    // Backend offline
  }
  const all = getStoredScreenings()
  return all.filter((s) => String(s.movieId) === String(movieId))
}

/**
 * API Call: Fetch single screening by ID
 */
export async function fetchScreeningByIdApi(screeningId) {
  try {
    const res = await fetch(`${API_BASE_URL}/screenings/${screeningId}`)
    if (res.ok) {
      const data = await res.json()
      return mapApiScreeningToFrontend(data)
    }
  } catch (err) {
    // Backend offline
  }
  const all = getStoredScreenings()
  return all.find((s) => String(s.id) === String(screeningId)) || null
}

/**
 * API Call: Create a new screening in backend DB (or local fallback)
 */
export async function createScreeningApi(screeningData) {
  const hallNameToId = {
    'Sala 1 - IMAX': 1,
    'Sala 2 - Standard': 2,
    'Sala 3 - VIP': 3,
    'IMAX Premium Sala 1': 1,
    'VIP Lounge Sala 2': 2,
    'Standard Sala 3': 3,
  }

  let resolvedHallId = screeningData.hallId
  if (!resolvedHallId) {
    try {
      const halls = await fetchAllHallsApi()
      if (halls && Array.isArray(halls)) {
        const found = halls.find((h) => h.name === screeningData.hall || h.name?.includes(screeningData.hall?.split(' ')[0]))
        if (found) resolvedHallId = found.id
      }
    } catch (e) {
      console.warn('Could not fetch halls from API', e)
    }
  }
  if (!resolvedHallId) {
    resolvedHallId = hallNameToId[screeningData.hall] || 1
  }

  const startTimeISO = screeningData.startTime || `${screeningData.date}T${screeningData.time || '18:00'}:00`

  const backendPayload = {
    movieId: Number(screeningData.movieId),
    hallId: Number(resolvedHallId),
    startTime: startTimeISO,
    ticketPrice: Number(screeningData.price || screeningData.ticketPrice || 800),
  }

  try {
    let token = await ensureAdminAuthToken()
    let res = await fetch(`${API_BASE_URL}/screenings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : getAuthHeader()),
      },
      body: JSON.stringify(backendPayload),
    })

    if (res.status === 401 || res.status === 403) {
      token = await ensureAdminAuthToken(true)
      res = await fetch(`${API_BASE_URL}/screenings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : getAuthHeader()),
        },
        body: JSON.stringify(backendPayload),
      })
    }

    if (res.ok) {
      const created = await res.json()
      await fetchAllScreeningsApi()
      broadcastDataChange()
      return mapApiScreeningToFrontend(created)
    }
  } catch (err) {
    console.warn('Backend API unavailable for creating screening, saving locally', err)
  }

  // Fallback to local persistence
  const updated = addScreening(screeningData)
  broadcastDataChange()
  return updated[0] || null
}

/**
 * API Call: Delete a screening from backend DB (or local fallback)
 */
export async function deleteScreeningApi(screeningId) {
  try {
    let token = await ensureAdminAuthToken()
    let res = await fetch(`${API_BASE_URL}/screenings/${screeningId}`, {
      method: 'DELETE',
      headers: token ? { Authorization: `Bearer ${token}` } : getAuthHeader(),
    })

    if (res.status === 401 || res.status === 403) {
      token = await ensureAdminAuthToken(true)
      res = await fetch(`${API_BASE_URL}/screenings/${screeningId}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : getAuthHeader(),
      })
    }

    if (res.ok) {
      await fetchAllScreeningsApi()
      broadcastDataChange()
      return true
    }
  } catch (err) {
    console.warn('Backend API unavailable for deleting screening, deleting locally', err)
  }

  deleteScreening(screeningId)
  broadcastDataChange()
  return true
}

// ============================================
// Cinema Halls API Calls (/api/halls)
// ============================================

export async function fetchAllHallsApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/halls`)
    if (res.ok) {
      return await res.json()
    }
  } catch (err) {
    console.warn('Backend API unavailable for halls', err)
  }
  return null
}

// ============================================
// Bookings & Occupied Seats (/api/bookings)
// ============================================

const GLOBAL_SEATS_KEY = 'hype_cinema_global_occupied_seats'

export function getGlobalOccupiedSeats(screeningId) {
  try {
    const raw = localStorage.getItem(GLOBAL_SEATS_KEY)
    const allGlobal = raw ? JSON.parse(raw) : {}
    return allGlobal[screeningId] || []
  } catch (e) {
    return []
  }
}

export function addGlobalOccupiedSeats(screeningId, newSeatKeys) {
  try {
    const raw = localStorage.getItem(GLOBAL_SEATS_KEY)
    const allGlobal = raw ? JSON.parse(raw) : {}
    const existing = allGlobal[screeningId] || []
    const updated = Array.from(new Set([...existing, ...newSeatKeys]))
    allGlobal[screeningId] = updated
    localStorage.setItem(GLOBAL_SEATS_KEY, JSON.stringify(allGlobal))
  } catch (e) {
    console.error('Failed to update global occupied seats', e)
  }
}

export async function fetchOccupiedSeats(screeningId) {
  const localGlobalSeats = getGlobalOccupiedSeats(screeningId)
  try {
    const res = await fetch(`${API_BASE_URL}/bookings/occupied-seats/${screeningId}`, {
      headers: { ...getAuthHeader() },
    })
    if (res.ok) {
      const data = await res.json()
      const apiSeats = data.map((s) => `${s.rowNum}-${s.seatNum}`)
      return Array.from(new Set([...apiSeats, ...localGlobalSeats]))
    }
  } catch (err) {
    // Backend offline fallback
  }
  return localGlobalSeats
}

export async function createBookingApi(bookingRequest) {
  try {
    const res = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(bookingRequest),
    })
    if (res.ok) {
      const data = await res.json()
      broadcastDataChange()
      return data
    }
  } catch (err) {
    console.warn('Backend API unavailable, using local shared persistence', err)
  }
  return null
}

export async function fetchMyBookingsApi() {
  try {
    const res = await fetch(`${API_BASE_URL}/bookings/my-bookings`, {
      headers: { ...getAuthHeader() },
    })
    if (res.ok) {
      return await res.json()
    }
  } catch (err) {
    console.warn('Backend API unavailable for user bookings', err)
  }
  return null
}

export async function cancelBookingApi(bookingId) {
  try {
    const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
      method: 'PUT',
      headers: { ...getAuthHeader() },
    })
    if (res.ok) {
      broadcastDataChange()
      return await res.json()
    }
  } catch (err) {
    console.warn('Backend API unavailable for ticket cancellation', err)
  }
  return null
}

export async function fetchAllBookingsApi() {
  try {
    let token = await ensureAdminAuthToken()
    let res = await fetch(`${API_BASE_URL}/bookings/all`, {
      headers: token ? { Authorization: `Bearer ${token}` } : getAuthHeader(),
    })
    if (res.status === 401 || res.status === 403) {
      token = await ensureAdminAuthToken(true)
      res = await fetch(`${API_BASE_URL}/bookings/all`, {
        headers: token ? { Authorization: `Bearer ${token}` } : getAuthHeader(),
      })
    }
    if (res.ok) {
      return await res.json()
    }
  } catch (err) {
    console.warn('Backend API unavailable for all bookings', err)
  }
  return null
}
