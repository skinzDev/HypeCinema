/**
 * Shared mock movie data.
 * Later replaced with API calls to Spring Boot backend.
 */

export const moviesData = [
  {
    id: 1,
    title: 'Spider-Man: Brand New Day',
    description:
      'Peter Parker se suočava sa novom pretnjom koja preti da uništi sve što poznaje. U ovom nastavku kultnog serijala, Spider-Man mora da pronađe snagu u sebi kada se suoči sa neprijateljem koji poznaje svaku njegovu slabost. Akcija, emocije i spektakularne scene čine ovaj film nezaboravnim bioskopskim iskustvom.',
    genre: 'Akcija',
    rating: 8.7,
    duration: 148,
    director: 'Jon Watts',
    cast: ['Tom Holland', 'Zendaya', 'Jake Gyllenhaal', 'Marisa Tomei'],
    releaseDate: '2026-07-31',
    status: 'NOW_SHOWING',
    poster: '/posters/spiderman.png',
    trailer: '#',
  },
  {
    id: 2,
    title: 'Dune: Part Three',
    description:
      'Epska završnica sage o Paulu Atrejdesu i borbi za kontrolu nad Arakisom. Denis Villeneuve donosi veličanstveni zaključak trilogije sa vizuelno zapanjujućim sekvencama i dubokom pričom o sudbini, moći i žrtvi. Treći deo obećava da će prevazići sve prethodne filmove.',
    genre: 'Sci-Fi',
    rating: 9.1,
    duration: 165,
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Florence Pugh', 'Austin Butler'],
    releaseDate: '2026-08-15',
    status: 'NOW_SHOWING',
    poster: '/posters/dune.png',
    trailer: '#',
  },
  {
    id: 3,
    title: 'The Batman: Part II',
    description:
      'Vitez Tame se vraća da se suoči sa novom misterijom u Gotamu. Brusa Vejna progoni serija misterioznih zločina koji ga vode dublje u mračno podzemlje grada. Matt Reeves nastavlja svoju viziju najrealnijeg Betmena ikada sa izuzetnom atmosferom i napetim trilerom.',
    genre: 'Triler',
    rating: 8.4,
    duration: 155,
    director: 'Matt Reeves',
    cast: ['Robert Pattinson', 'Zoë Kravitz', 'Colin Farrell', 'Jeffrey Wright'],
    releaseDate: '2026-09-20',
    status: 'COMING_SOON',
    poster: '/posters/batman.png',
    trailer: '#',
  },
  {
    id: 4,
    title: 'Oppenheimer',
    description:
      'Priča o čoveku koji je promenio tok istorije kreiranjem atomske bombe. Christopher Nolan masterfully prikazuje unutrašnju borbu J. Robert Oppenheimer-a dok predvodi Manhattan projekat, suočen sa moralnim dilemama koje će definisati budućnost čovečanstva.',
    genre: 'Drama',
    rating: 8.9,
    duration: 180,
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Robert Downey Jr.', 'Matt Damon'],
    releaseDate: '2023-07-21',
    status: 'NOW_SHOWING',
    poster: '/posters/oppenheimer.png',
    trailer: '#',
  },
  {
    id: 5,
    title: 'Deadpool & Wolverine',
    description:
      'Najneozbiljniji timski film Marvel univerzuma. Deadpool i Wolverine udružuju snage u ludom, akcijom nabijenom, i urnebesno smešnom filmu koji ruši sve granice. Očekujte neočekivano - sa puno četvrte dimenzije, pop-kulture i nezaboravnih borbi.',
    genre: 'Komedija',
    rating: 8.2,
    duration: 128,
    director: 'Shawn Levy',
    cast: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin', 'Morena Baccarin'],
    releaseDate: '2024-07-26',
    status: 'NOW_SHOWING',
    poster: '/posters/spiderman.png',
    trailer: '#',
  },
  {
    id: 6,
    title: 'Inside Out 3',
    description:
      'Nova avantura emocija u umu tinejdžerke Rajli. Pixar nastavlja svoju omiljenu franšizu sa novim emocijama i izazovima dok Rajli ulazi u period odrastanja. Topla, smešna i dirljiva priča koja će oduševiti i decu i odrasle.',
    genre: 'Animacija',
    rating: 8.5,
    duration: 100,
    director: 'Kelsey Mann',
    cast: ['Amy Poehler', 'Maya Hawke', 'Ayo Edebiri', 'Lewis Black'],
    releaseDate: '2026-06-14',
    status: 'NOW_SHOWING',
    poster: '/posters/insideout.png',
    trailer: '#',
  },
  {
    id: 7,
    title: 'Gladiator III',
    description:
      'Nastavak epske priče iz arene drevnog Rima. Ridley Scott se vraća sa trećim poglavljem koje istražuje nove generacije gladijatora i političke intrige Rimskog carstva. Spektakularne borbe, zadivljujući setovi i priča o časti i osveti.',
    genre: 'Akcija',
    rating: 7.9,
    duration: 150,
    director: 'Ridley Scott',
    cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington', 'Connie Nielsen'],
    releaseDate: '2026-11-22',
    status: 'COMING_SOON',
    poster: '/posters/gladiator.png',
    trailer: '#',
  },
  {
    id: 8,
    title: 'Interstellar 2',
    description:
      'Novo putovanje kroz prostor i vreme u potrazi za čovečanstvom. Christopher Nolan se vraća sa nastavkom svog kultnog naučno-fantastičnog remek dela. Nova misija, novi svetovi i nova pitanja o suštini postojanja čekaju hrabre istraživače.',
    genre: 'Sci-Fi',
    rating: 9.3,
    duration: 170,
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Timothée Chalamet'],
    releaseDate: '2026-12-20',
    status: 'COMING_SOON',
    poster: '/posters/interstellar.png',
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
  { id: 1, movieId: 1, hall: 'Sala 1 - IMAX', date: '2026-08-11', time: '14:00', price: 900, seatsAvailable: 87 },
  { id: 2, movieId: 1, hall: 'Sala 2 - Standard', date: '2026-08-11', time: '17:00', price: 700, seatsAvailable: 52 },
  { id: 3, movieId: 1, hall: 'Sala 3 - VIP', date: '2026-08-11', time: '20:00', price: 1200, seatsAvailable: 18 },
  { id: 4, movieId: 1, hall: 'Sala 1 - IMAX', date: '2026-08-12', time: '14:00', price: 900, seatsAvailable: 120 },
  { id: 5, movieId: 1, hall: 'Sala 2 - Standard', date: '2026-08-12', time: '20:30', price: 700, seatsAvailable: 96 },

  { id: 6, movieId: 2, hall: 'Sala 1 - IMAX', date: '2026-08-11', time: '15:00', price: 900, seatsAvailable: 65 },
  { id: 7, movieId: 2, hall: 'Sala 3 - VIP', date: '2026-08-11', time: '19:30', price: 1200, seatsAvailable: 12 },
  { id: 8, movieId: 2, hall: 'Sala 1 - IMAX', date: '2026-08-12', time: '16:00', price: 900, seatsAvailable: 145 },
  { id: 9, movieId: 2, hall: 'Sala 2 - Standard', date: '2026-08-12', time: '21:00', price: 700, seatsAvailable: 80 },

  { id: 10, movieId: 3, hall: 'Sala 1 - IMAX', date: '2026-09-20', time: '18:00', price: 900, seatsAvailable: 150 },
  { id: 11, movieId: 3, hall: 'Sala 3 - VIP', date: '2026-09-20', time: '21:00', price: 1200, seatsAvailable: 40 },

  { id: 12, movieId: 4, hall: 'Sala 2 - Standard', date: '2026-08-11', time: '13:00', price: 700, seatsAvailable: 44 },
  { id: 13, movieId: 4, hall: 'Sala 1 - IMAX', date: '2026-08-11', time: '19:00', price: 900, seatsAvailable: 98 },
  { id: 14, movieId: 4, hall: 'Sala 2 - Standard', date: '2026-08-12', time: '16:30', price: 700, seatsAvailable: 72 },

  { id: 15, movieId: 5, hall: 'Sala 2 - Standard', date: '2026-08-11', time: '15:30', price: 700, seatsAvailable: 38 },
  { id: 16, movieId: 5, hall: 'Sala 1 - IMAX', date: '2026-08-12', time: '20:00', price: 900, seatsAvailable: 110 },

  { id: 17, movieId: 6, hall: 'Sala 2 - Standard', date: '2026-08-11', time: '11:00', price: 600, seatsAvailable: 60 },
  { id: 18, movieId: 6, hall: 'Sala 2 - Standard', date: '2026-08-11', time: '14:30', price: 600, seatsAvailable: 45 },
  { id: 19, movieId: 6, hall: 'Sala 3 - VIP', date: '2026-08-12', time: '12:00', price: 1000, seatsAvailable: 35 },

  { id: 20, movieId: 7, hall: 'Sala 1 - IMAX', date: '2026-11-22', time: '19:00', price: 1000, seatsAvailable: 150 },
  { id: 21, movieId: 8, hall: 'Sala 1 - IMAX', date: '2026-12-20', time: '18:00', price: 1000, seatsAvailable: 150 },
]

/**
 * Generates deterministic occupied seats for a screening.
 * Uses screeningId as a seed so same seats are "taken" on every render.
 * Later replaced by real-time backend data.
 */
export function getOccupiedSeats(screeningId) {
  const screening = screeningsData.find((s) => s.id === Number(screeningId))
  if (!screening) return []

  const hall = hallsData[screening.hall]
  if (!hall) return []

  const totalSeats = hall.totalSeats
  const occupiedCount = totalSeats - screening.seatsAvailable
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

export function getMovieById(id) {
  return moviesData.find((m) => m.id === Number(id))
}

export function getScreeningById(id) {
  return screeningsData.find((s) => s.id === Number(id))
}

export function getScreeningsForMovie(movieId) {
  const movieScreenings = screeningsData.filter((s) => s.movieId === Number(movieId))
  const grouped = {}
  movieScreenings.forEach((s) => {
    if (!grouped[s.date]) grouped[s.date] = []
    grouped[s.date].push(s)
  })
  return grouped
}

/**
 * Mock bookings data — simulates past user reservations.
 * Later replaced with API calls to Spring Boot backend.
 */
export const mockBookingsData = [
  {
    id: 1,
    ref: 'HC-4KM7WNXP',
    movieId: 1,
    screeningId: 1,
    seats: ['3-7', '3-8', '3-9'],
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    totalPrice: 2700,
    pointsEarned: 270,
    pointsRedeemed: 0,
    discountAmount: 0,
    customerName: 'Marko Marković',
    customerEmail: 'marko@example.com',
    createdAt: '2026-08-09T14:30:00',
  },
  {
    id: 2,
    ref: 'HC-9BT3RQLA',
    movieId: 2,
    screeningId: 6,
    seats: ['5-4', '5-5'],
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    totalPrice: 1600,
    pointsEarned: 160,
    pointsRedeemed: 200,
    discountAmount: 200,
    customerName: 'Marko Marković',
    customerEmail: 'marko@example.com',
    createdAt: '2026-08-10T11:15:00',
  },
  {
    id: 3,
    ref: 'HC-2FX8JCVD',
    movieId: 4,
    screeningId: 13,
    seats: ['7-10', '7-11', '7-12', '7-13'],
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    totalPrice: 3600,
    pointsEarned: 360,
    pointsRedeemed: 0,
    discountAmount: 0,
    customerName: 'Marko Marković',
    customerEmail: 'marko@example.com',
    createdAt: '2026-08-11T09:45:00',
  },
  {
    id: 4,
    ref: 'HC-7HN5YQMZ',
    movieId: 6,
    screeningId: 17,
    seats: ['2-5', '2-6'],
    status: 'CANCELLED',
    paymentStatus: 'REFUNDED',
    totalPrice: 1200,
    pointsEarned: 0,
    pointsRedeemed: 0,
    discountAmount: 0,
    customerName: 'Marko Marković',
    customerEmail: 'marko@example.com',
    createdAt: '2026-08-08T16:20:00',
  },
  {
    id: 5,
    ref: 'HC-3DP6KWST',
    movieId: 5,
    screeningId: 15,
    seats: ['4-3'],
    status: 'CONFIRMED',
    paymentStatus: 'PAID',
    totalPrice: 700,
    pointsEarned: 70,
    pointsRedeemed: 0,
    discountAmount: 0,
    customerName: 'Marko Marković',
    customerEmail: 'marko@example.com',
    createdAt: '2026-08-11T12:00:00',
  },
]

export function getUserBookings() {
  return mockBookingsData.map((booking) => ({
    ...booking,
    movie: getMovieById(booking.movieId),
    screening: getScreeningById(booking.screeningId),
  }))
}

