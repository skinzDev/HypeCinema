/**
 * Shared mock movie data.
 * Later replaced with API calls to Spring Boot backend.
 */

export const moviesData = [
  {
    id: 1,
    title: 'Spider-Man: Brand New Day',
    description:
      'Peter Parker se suočava sa novom pretnjom koja preti da uništi sve što poznaje. U ovom nastavku kultnog serijala, Spider-Man mora da pronađe snagu u sebi kada se suoči sa neprijateljem koji poznaje svaku njegovu slabost.',
    genre: 'Akcija',
    rating: 8.7,
    duration: 148,
    director: 'Jon Watts',
    cast: ['Tom Holland', 'Zendaya', 'Jake Gyllenhaal', 'Marisa Tomei'],
    releaseDate: '2026-07-31',
    status: 'NOW_SHOWING',
    poster: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=600&q=80',
    trailer: '#',
  },
  {
    id: 2,
    title: 'Dune: Part Three',
    description:
      'Epska završnica sage o Paulu Atrejdesu i borbi za kontrolu nad Arakisom. Denis Villeneuve donosi veličanstveni zaključak trilogije sa vizuelno zapanjujućim sekvencama.',
    genre: 'Sci-Fi',
    rating: 9.1,
    duration: 165,
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Florence Pugh', 'Austin Butler'],
    releaseDate: '2026-08-15',
    status: 'NOW_SHOWING',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    trailer: '#',
  },
  {
    id: 3,
    title: 'The Batman: Part II',
    description:
      'Vitez Tame se vraća da se suoči sa novom misterijom u Gotamu. Brusa Vejna progoni serija misterioznih zločina koji ga vode dublje u mračno podzemlje grada.',
    genre: 'Triler',
    rating: 8.4,
    duration: 155,
    director: 'Matt Reeves',
    cast: ['Robert Pattinson', 'Zoë Kravitz', 'Colin Farrell', 'Jeffrey Wright'],
    releaseDate: '2026-09-20',
    status: 'COMING_SOON',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
    trailer: '#',
  },
  {
    id: 4,
    title: 'Oppenheimer',
    description:
      'Priča o čoveku koji je promenio tok istorije kreiranjem atomske bombe. Christopher Nolan prikazuje unutrašnju borbu J. Robert Oppenheimer-a dok predvodi Manhattan projekat.',
    genre: 'Drama',
    rating: 8.9,
    duration: 180,
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Robert Downey Jr.', 'Matt Damon'],
    releaseDate: '2023-07-21',
    status: 'NOW_SHOWING',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=600&q=80',
    trailer: '#',
  },
  {
    id: 5,
    title: 'Deadpool & Wolverine',
    description:
      'Najneozbiljniji timski film Marvel univerzuma. Deadpool i Wolverine udružuju snage u ludom, akcijom nabijenom, i urnebesno smešnom filmu koji ruši sve granice.',
    genre: 'Komedija',
    rating: 8.2,
    duration: 128,
    director: 'Shawn Levy',
    cast: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin', 'Morena Baccarin'],
    releaseDate: '2024-07-26',
    status: 'NOW_SHOWING',
    poster: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
    trailer: '#',
  },
  {
    id: 6,
    title: 'Inside Out 3',
    description:
      'Nova avantura emocija u umu tinejdžerke Rajli. Pixar nastavlja svoju omiljenu franšizu sa novim emocijama i izazovima dok Rajli ulazi u period odrastanja.',
    genre: 'Animacija',
    rating: 8.5,
    duration: 100,
    director: 'Kelsey Mann',
    cast: ['Amy Poehler', 'Maya Hawke', 'Ayo Edebiri', 'Lewis Black'],
    releaseDate: '2026-06-14',
    status: 'NOW_SHOWING',
    poster: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80',
    trailer: '#',
  },
  {
    id: 7,
    title: 'Gladiator III',
    description:
      'Nastavak epske priče iz arene drevnog Rima. Ridley Scott se vraća sa trećim poglavljem koje istražuje nove generacije gladijatora i političke intrige.',
    genre: 'Akcija',
    rating: 7.9,
    duration: 150,
    director: 'Ridley Scott',
    cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington', 'Connie Nielsen'],
    releaseDate: '2026-11-22',
    status: 'COMING_SOON',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    trailer: '#',
  },
  {
    id: 8,
    title: 'Interstellar 2',
    description:
      'Novo putovanje kroz prostor i vreme u potrazi za čovečanstvom. Christopher Nolan se vraća sa nastavkom svog kultnog naučno-fantastičnog remek dela.',
    genre: 'Sci-Fi',
    rating: 9.3,
    duration: 170,
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Timothée Chalamet'],
    releaseDate: '2026-12-20',
    status: 'COMING_SOON',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    trailer: '#',
  },
]

/**
 * Hall layout configurations.
 * Each hall has rows and seatsPerRow defining its 2D map.
 */
export const hallsData = {
  'Sala 1 - IMAX': { rows: 12, seatsPerRow: 16, totalSeats: 192, type: 'IMAX' },
  'Sala 2 - Standard': { rows: 10, seatsPerRow: 12, totalSeats: 120, type: 'Standard' },
  'Sala 3 - VIP': { rows: 6, seatsPerRow: 8, totalSeats: 48, type: 'VIP' },
}

export const screeningsData = [
  // BEOGRAD - 11. Avgust
  { id: 1, movieId: 1, cinemaId: 'BEOGRAD', hall: 'Sala 1 - IMAX', date: '2026-08-11', time: '14:00', price: 900, seatsAvailable: 87 },
  { id: 2, movieId: 1, cinemaId: 'BEOGRAD', hall: 'Sala 2 - Standard', date: '2026-08-11', time: '17:00', price: 700, seatsAvailable: 52 },
  { id: 3, movieId: 1, cinemaId: 'BEOGRAD', hall: 'Sala 3 - VIP', date: '2026-08-11', time: '20:00', price: 1200, seatsAvailable: 18 },
  { id: 4, movieId: 2, cinemaId: 'BEOGRAD', hall: 'Sala 1 - IMAX', date: '2026-08-11', time: '15:00', price: 900, seatsAvailable: 65 },
  { id: 5, movieId: 2, cinemaId: 'BEOGRAD', hall: 'Sala 3 - VIP', date: '2026-08-11', time: '19:30', price: 1200, seatsAvailable: 12 },
  { id: 6, movieId: 4, cinemaId: 'BEOGRAD', hall: 'Sala 2 - Standard', date: '2026-08-11', time: '13:00', price: 700, seatsAvailable: 44 },
  { id: 7, movieId: 4, cinemaId: 'BEOGRAD', hall: 'Sala 1 - IMAX', date: '2026-08-11', time: '19:00', price: 900, seatsAvailable: 98 },
  { id: 8, movieId: 5, cinemaId: 'BEOGRAD', hall: 'Sala 2 - Standard', date: '2026-08-11', time: '15:30', price: 700, seatsAvailable: 38 },
  { id: 9, movieId: 6, cinemaId: 'BEOGRAD', hall: 'Sala 2 - Standard', date: '2026-08-11', time: '11:00', price: 600, seatsAvailable: 60 },

  // NOVI SAD - 11. Avgust
  { id: 10, movieId: 1, cinemaId: 'NOVI_SAD', hall: 'Sala 1 - IMAX', date: '2026-08-11', time: '14:30', price: 850, seatsAvailable: 100 },
  { id: 11, movieId: 1, cinemaId: 'NOVI_SAD', hall: 'Sala 2 - Standard', date: '2026-08-11', time: '19:30', price: 700, seatsAvailable: 85 },
  { id: 12, movieId: 2, cinemaId: 'NOVI_SAD', hall: 'Sala 1 - IMAX', date: '2026-08-11', time: '17:00', price: 850, seatsAvailable: 70 },
  { id: 13, movieId: 4, cinemaId: 'NOVI_SAD', hall: 'Sala 2 - Standard', date: '2026-08-11', time: '16:00', price: 700, seatsAvailable: 60 },
  { id: 14, movieId: 5, cinemaId: 'NOVI_SAD', hall: 'Sala 2 - Standard', date: '2026-08-11', time: '21:15', price: 700, seatsAvailable: 75 },
  { id: 15, movieId: 6, cinemaId: 'NOVI_SAD', hall: 'Sala 1 - IMAX', date: '2026-08-11', time: '12:00', price: 600, seatsAvailable: 90 },

  // NIŠ - 11. Avgust
  { id: 16, movieId: 1, cinemaId: 'NIS', hall: 'Sala 1 - IMAX', date: '2026-08-11', time: '15:30', price: 800, seatsAvailable: 110 },
  { id: 17, movieId: 2, cinemaId: 'NIS', hall: 'Sala 1 - IMAX', date: '2026-08-11', time: '18:30', price: 800, seatsAvailable: 95 },
  { id: 18, movieId: 4, cinemaId: 'NIS', hall: 'Sala 2 - Standard', date: '2026-08-11', time: '16:45', price: 700, seatsAvailable: 65 },
  { id: 19, movieId: 5, cinemaId: 'NIS', hall: 'Sala 1 - IMAX', date: '2026-08-11', time: '21:00', price: 800, seatsAvailable: 100 },
  { id: 20, movieId: 6, cinemaId: 'NIS', hall: 'Sala 2 - Standard', date: '2026-08-11', time: '13:15', price: 600, seatsAvailable: 80 },

  // KRAGUJEVAC - 11. Avgust
  { id: 21, movieId: 1, cinemaId: 'KRAGUJEVAC', hall: 'Sala 2 - Standard', date: '2026-08-11', time: '17:15', price: 750, seatsAvailable: 90 },
  { id: 22, movieId: 2, cinemaId: 'KRAGUJEVAC', hall: 'Sala 2 - Standard', date: '2026-08-11', time: '14:45', price: 750, seatsAvailable: 80 },
  { id: 23, movieId: 4, cinemaId: 'KRAGUJEVAC', hall: 'Sala 3 - VIP', date: '2026-08-11', time: '21:30', price: 1100, seatsAvailable: 25 },
  { id: 24, movieId: 5, cinemaId: 'KRAGUJEVAC', hall: 'Sala 3 - VIP', date: '2026-08-11', time: '19:45', price: 1100, seatsAvailable: 30 },
  { id: 25, movieId: 6, cinemaId: 'KRAGUJEVAC', hall: 'Sala 2 - Standard', date: '2026-08-11', time: '12:30', price: 600, seatsAvailable: 60 },

  // ==================== 12. AVGUST ====================
  // BEOGRAD - 12. Avgust
  { id: 26, movieId: 1, cinemaId: 'BEOGRAD', hall: 'Sala 1 - IMAX', date: '2026-08-12', time: '14:00', price: 900, seatsAvailable: 120 },
  { id: 27, movieId: 1, cinemaId: 'BEOGRAD', hall: 'Sala 2 - Standard', date: '2026-08-12', time: '20:30', price: 700, seatsAvailable: 96 },
  { id: 28, movieId: 2, cinemaId: 'BEOGRAD', hall: 'Sala 1 - IMAX', date: '2026-08-12', time: '16:00', price: 900, seatsAvailable: 145 },
  { id: 29, movieId: 4, cinemaId: 'BEOGRAD', hall: 'Sala 2 - Standard', date: '2026-08-12', time: '16:30', price: 700, seatsAvailable: 72 },
  { id: 30, movieId: 5, cinemaId: 'BEOGRAD', hall: 'Sala 1 - IMAX', date: '2026-08-12', time: '20:00', price: 900, seatsAvailable: 110 },
  { id: 31, movieId: 6, cinemaId: 'BEOGRAD', hall: 'Sala 3 - VIP', date: '2026-08-12', time: '12:00', price: 1000, seatsAvailable: 35 },

  // NOVI SAD - 12. Avgust
  { id: 32, movieId: 1, cinemaId: 'NOVI_SAD', hall: 'Sala 2 - Standard', date: '2026-08-12', time: '15:00', price: 700, seatsAvailable: 90 },
  { id: 33, movieId: 2, cinemaId: 'NOVI_SAD', hall: 'Sala 1 - IMAX', date: '2026-08-12', time: '18:30', price: 850, seatsAvailable: 110 },
  { id: 34, movieId: 4, cinemaId: 'NOVI_SAD', hall: 'Sala 2 - Standard', date: '2026-08-12', time: '20:15', price: 700, seatsAvailable: 80 },
  { id: 35, movieId: 5, cinemaId: 'NOVI_SAD', hall: 'Sala 1 - IMAX', date: '2026-08-12', time: '16:45', price: 850, seatsAvailable: 95 },
  { id: 36, movieId: 6, cinemaId: 'NOVI_SAD', hall: 'Sala 2 - Standard', date: '2026-08-12', time: '13:00', price: 600, seatsAvailable: 85 },

  // NIŠ - 12. Avgust
  { id: 37, movieId: 1, cinemaId: 'NIS', hall: 'Sala 1 - IMAX', date: '2026-08-12', time: '17:15', price: 800, seatsAvailable: 85 },
  { id: 38, movieId: 2, cinemaId: 'NIS', hall: 'Sala 2 - Standard', date: '2026-08-12', time: '19:45', price: 700, seatsAvailable: 70 },
  { id: 39, movieId: 4, cinemaId: 'NIS', hall: 'Sala 2 - Standard', date: '2026-08-12', time: '20:00', price: 700, seatsAvailable: 100 },
  { id: 40, movieId: 5, cinemaId: 'NIS', hall: 'Sala 1 - IMAX', date: '2026-08-12', time: '18:00', price: 800, seatsAvailable: 90 },
  { id: 41, movieId: 6, cinemaId: 'NIS', hall: 'Sala 2 - Standard', date: '2026-08-12', time: '14:00', price: 600, seatsAvailable: 90 },

  // KRAGUJEVAC - 12. Avgust
  { id: 42, movieId: 1, cinemaId: 'KRAGUJEVAC', hall: 'Sala 2 - Standard', date: '2026-08-12', time: '16:30', price: 750, seatsAvailable: 95 },
  { id: 43, movieId: 2, cinemaId: 'KRAGUJEVAC', hall: 'Sala 2 - Standard', date: '2026-08-12', time: '18:15', price: 750, seatsAvailable: 85 },
  { id: 44, movieId: 4, cinemaId: 'KRAGUJEVAC', hall: 'Sala 3 - VIP', date: '2026-08-12', time: '21:00', price: 1100, seatsAvailable: 35 },
  { id: 45, movieId: 5, cinemaId: 'KRAGUJEVAC', hall: 'Sala 3 - VIP', date: '2026-08-12', time: '20:15', price: 1100, seatsAvailable: 40 },
  { id: 46, movieId: 6, cinemaId: 'KRAGUJEVAC', hall: 'Sala 3 - VIP', date: '2026-08-12', time: '15:00', price: 1000, seatsAvailable: 25 },

  // ==================== 13. AVGUST ====================
  { id: 47, movieId: 1, cinemaId: 'BEOGRAD', hall: 'Sala 1 - IMAX', date: '2026-08-13', time: '16:00', price: 900, seatsAvailable: 110 },
  { id: 48, movieId: 2, cinemaId: 'BEOGRAD', hall: 'Sala 1 - IMAX', date: '2026-08-13', time: '19:00', price: 900, seatsAvailable: 100 },
  { id: 49, movieId: 4, cinemaId: 'BEOGRAD', hall: 'Sala 2 - Standard', date: '2026-08-13', time: '17:30', price: 700, seatsAvailable: 80 },
  { id: 50, movieId: 5, cinemaId: 'BEOGRAD', hall: 'Sala 2 - Standard', date: '2026-08-13', time: '21:15', price: 700, seatsAvailable: 85 },
  { id: 51, movieId: 1, cinemaId: 'NOVI_SAD', hall: 'Sala 1 - IMAX', date: '2026-08-13', time: '17:00', price: 850, seatsAvailable: 90 },
  { id: 52, movieId: 2, cinemaId: 'NOVI_SAD', hall: 'Sala 2 - Standard', date: '2026-08-13', time: '19:30', price: 700, seatsAvailable: 75 },
  { id: 53, movieId: 1, cinemaId: 'NIS', hall: 'Sala 1 - IMAX', date: '2026-08-13', time: '18:00', price: 800, seatsAvailable: 95 },
  { id: 54, movieId: 2, cinemaId: 'NIS', hall: 'Sala 2 - Standard', date: '2026-08-13', time: '20:30', price: 700, seatsAvailable: 80 },
  { id: 55, movieId: 1, cinemaId: 'KRAGUJEVAC', hall: 'Sala 2 - Standard', date: '2026-08-13', time: '17:30', price: 750, seatsAvailable: 85 },
  { id: 56, movieId: 5, cinemaId: 'KRAGUJEVAC', hall: 'Sala 3 - VIP', date: '2026-08-13', time: '20:00', price: 1100, seatsAvailable: 30 },

  // ==================== 14. AVGUST ====================
  { id: 57, movieId: 1, cinemaId: 'BEOGRAD', hall: 'Sala 1 - IMAX', date: '2026-08-14', time: '17:00', price: 900, seatsAvailable: 100 },
  { id: 58, movieId: 2, cinemaId: 'BEOGRAD', hall: 'Sala 3 - VIP', date: '2026-08-14', time: '20:00', price: 1200, seatsAvailable: 20 },
  { id: 59, movieId: 4, cinemaId: 'BEOGRAD', hall: 'Sala 2 - Standard', date: '2026-08-14', time: '18:00', price: 700, seatsAvailable: 90 },
  { id: 60, movieId: 1, cinemaId: 'NOVI_SAD', hall: 'Sala 1 - IMAX', date: '2026-08-14', time: '18:00', price: 850, seatsAvailable: 95 },
  { id: 61, movieId: 5, cinemaId: 'NOVI_SAD', hall: 'Sala 2 - Standard', date: '2026-08-14', time: '20:30', price: 700, seatsAvailable: 80 },
  { id: 62, movieId: 1, cinemaId: 'NIS', hall: 'Sala 1 - IMAX', date: '2026-08-14', time: '17:30', price: 800, seatsAvailable: 90 },
  { id: 63, movieId: 4, cinemaId: 'NIS', hall: 'Sala 2 - Standard', date: '2026-08-14', time: '20:00', price: 700, seatsAvailable: 85 },
  { id: 64, movieId: 1, cinemaId: 'KRAGUJEVAC', hall: 'Sala 2 - Standard', date: '2026-08-14', time: '18:15', price: 750, seatsAvailable: 80 },
  { id: 65, movieId: 2, cinemaId: 'KRAGUJEVAC', hall: 'Sala 3 - VIP', date: '2026-08-14', time: '20:45', price: 1100, seatsAvailable: 25 },
]




/**
 * Generates deterministic occupied seats for a screening.
 * Uses screeningId as a seed so same seats are "taken" on every render.
 * Later replaced by real-time backend data.
 */
export function getOccupiedSeats(screeningId) {
  const screenings = getStoredScreenings()
  const screening = screenings.find((s) => s.id === Number(screeningId))
  if (!screening) return []

  const hall = hallsData[screening.hall]
  if (!hall) return []

  const totalSeats = hall.totalSeats
  const occupiedCount = totalSeats - (screening.seatsAvailable ?? totalSeats)
  const occupied = []

  // Deterministic pseudo-random based on screeningId
  let seed = screeningId * 2654435761
  const pseudoRandom = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }

  const allSeats = []
  for (let r = 1; r <= hall.rows; r++) {
    for (let s = 1; s <= hall.seatsPerRow; s++) {
      allSeats.push(`${r}-${s}`)
    }
  }

  // Shuffle and pick first N occupied
  for (let i = allSeats.length - 1; i > 0; i--) {
    const j = Math.floor(pseudoRandom() * (i + 1))
    ;[allSeats[i], allSeats[j]] = [allSeats[j], allSeats[i]]
  }

  for (let i = 0; i < Math.min(occupiedCount, allSeats.length); i++) {
    occupied.push(allSeats[i])
  }

  return occupied
}

const MOVIES_STORAGE_KEY = 'hype_cinema_movies'
const SCREENINGS_STORAGE_KEY = 'hype_cinema_screenings'

/**
 * Get all stored movies (with fallback to default mock array)
 */
export function getStoredMovies() {
  try {
    const raw = localStorage.getItem(MOVIES_STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(MOVIES_STORAGE_KEY, JSON.stringify(moviesData))
      return moviesData
    }
    return JSON.parse(raw)
  } catch (err) {
    return moviesData
  }
}

export function addMovie(data) {
  const movies = getStoredMovies()
  const newId = movies.length > 0 ? Math.max(...movies.map((m) => m.id)) + 1 : 1
  const newMovie = {
    id: newId,
    rating: 8.0,
    status: 'NOW_SHOWING',
    poster: '/posters/spiderman.png',
    trailer: '#',
    cast: [],
    ...data,
  }
  const updated = [newMovie, ...movies]
  localStorage.setItem(MOVIES_STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export function updateMovie(id, data) {
  const movies = getStoredMovies()
  const updated = movies.map((m) => (m.id === Number(id) ? { ...m, ...data } : m))
  localStorage.setItem(MOVIES_STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export function deleteMovie(id) {
  const movies = getStoredMovies()
  const updated = movies.filter((m) => m.id !== Number(id))
  localStorage.setItem(MOVIES_STORAGE_KEY, JSON.stringify(updated))
  return updated
}

/**
 * Get all stored screenings
 */
export function getStoredScreenings() {
  try {
    const raw = localStorage.getItem(SCREENINGS_STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(SCREENINGS_STORAGE_KEY, JSON.stringify(screeningsData))
      return screeningsData
    }
    const parsed = JSON.parse(raw)
    // If cached screenings in localStorage are old or lack multi-cinema mappings, refresh from screeningsData
    if (!Array.isArray(parsed) || parsed.length < 30 || !parsed.some((s) => s.cinemaId && s.cinemaId !== 'BEOGRAD')) {
      localStorage.setItem(SCREENINGS_STORAGE_KEY, JSON.stringify(screeningsData))
      return screeningsData
    }
    return parsed
  } catch (err) {
    return screeningsData
  }
}


export function addScreening(data) {
  const screenings = getStoredScreenings()
  const newId = screenings.length > 0 ? Math.max(...screenings.map((s) => s.id)) + 1 : 1
  const hall = hallsData[data.hall]
  const totalSeats = hall ? hall.totalSeats : 120
  const newScreening = {
    id: newId,
    seatsAvailable: totalSeats,
    price: 800,
    ...data,
  }
  const updated = [newScreening, ...screenings]
  localStorage.setItem(SCREENINGS_STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export function deleteScreening(id) {
  const screenings = getStoredScreenings()
  const updated = screenings.filter((s) => s.id !== Number(id))
  localStorage.setItem(SCREENINGS_STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export function getMovieById(id) {
  const movies = getStoredMovies()
  return movies.find((m) => m.id === Number(id))
}

export function getScreeningById(id) {
  const screenings = getStoredScreenings()
  return screenings.find((s) => s.id === Number(id))
}

export function getScreeningsForMovie(movieId) {
  const screenings = getStoredScreenings()
  const movieScreenings = screenings.filter((s) => s.movieId === Number(movieId))
  const grouped = {}
  movieScreenings.forEach((s) => {
    if (!grouped[s.date]) grouped[s.date] = []
    grouped[s.date].push(s)
  })
  return grouped
}

