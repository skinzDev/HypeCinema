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
 * Mock screening data for movies.
 * Each screening includes hall info, date/time, and ticket price.
 */
export const screeningsData = [
  // Spider-Man screenings
  { id: 1, movieId: 1, hall: 'Sala 1 - IMAX', date: '2026-08-11', time: '14:00', price: 900, seatsAvailable: 87 },
  { id: 2, movieId: 1, hall: 'Sala 2 - Standard', date: '2026-08-11', time: '17:00', price: 700, seatsAvailable: 52 },
  { id: 3, movieId: 1, hall: 'Sala 3 - VIP', date: '2026-08-11', time: '20:00', price: 1200, seatsAvailable: 18 },
  { id: 4, movieId: 1, hall: 'Sala 1 - IMAX', date: '2026-08-12', time: '14:00', price: 900, seatsAvailable: 120 },
  { id: 5, movieId: 1, hall: 'Sala 2 - Standard', date: '2026-08-12', time: '20:30', price: 700, seatsAvailable: 96 },

  // Dune screenings
  { id: 6, movieId: 2, hall: 'Sala 1 - IMAX', date: '2026-08-11', time: '15:00', price: 900, seatsAvailable: 65 },
  { id: 7, movieId: 2, hall: 'Sala 3 - VIP', date: '2026-08-11', time: '19:30', price: 1200, seatsAvailable: 12 },
  { id: 8, movieId: 2, hall: 'Sala 1 - IMAX', date: '2026-08-12', time: '16:00', price: 900, seatsAvailable: 145 },
  { id: 9, movieId: 2, hall: 'Sala 2 - Standard', date: '2026-08-12', time: '21:00', price: 700, seatsAvailable: 80 },

  // Batman screenings
  { id: 10, movieId: 3, hall: 'Sala 1 - IMAX', date: '2026-09-20', time: '18:00', price: 900, seatsAvailable: 150 },
  { id: 11, movieId: 3, hall: 'Sala 3 - VIP', date: '2026-09-20', time: '21:00', price: 1200, seatsAvailable: 40 },

  // Oppenheimer screenings
  { id: 12, movieId: 4, hall: 'Sala 2 - Standard', date: '2026-08-11', time: '13:00', price: 700, seatsAvailable: 44 },
  { id: 13, movieId: 4, hall: 'Sala 1 - IMAX', date: '2026-08-11', time: '19:00', price: 900, seatsAvailable: 98 },
  { id: 14, movieId: 4, hall: 'Sala 2 - Standard', date: '2026-08-12', time: '16:30', price: 700, seatsAvailable: 72 },

  // Deadpool screenings
  { id: 15, movieId: 5, hall: 'Sala 2 - Standard', date: '2026-08-11', time: '15:30', price: 700, seatsAvailable: 38 },
  { id: 16, movieId: 5, hall: 'Sala 1 - IMAX', date: '2026-08-12', time: '20:00', price: 900, seatsAvailable: 110 },

  // Inside Out 3 screenings
  { id: 17, movieId: 6, hall: 'Sala 2 - Standard', date: '2026-08-11', time: '11:00', price: 600, seatsAvailable: 60 },
  { id: 18, movieId: 6, hall: 'Sala 2 - Standard', date: '2026-08-11', time: '14:30', price: 600, seatsAvailable: 45 },
  { id: 19, movieId: 6, hall: 'Sala 3 - VIP', date: '2026-08-12', time: '12:00', price: 1000, seatsAvailable: 35 },

  // Gladiator III & Interstellar 2 (Coming Soon - pre-sale)
  { id: 20, movieId: 7, hall: 'Sala 1 - IMAX', date: '2026-11-22', time: '19:00', price: 1000, seatsAvailable: 150 },
  { id: 21, movieId: 8, hall: 'Sala 1 - IMAX', date: '2026-12-20', time: '18:00', price: 1000, seatsAvailable: 150 },
]

/**
 * Get a movie by its ID
 */
export function getMovieById(id) {
  return moviesData.find((m) => m.id === Number(id))
}

/**
 * Get screenings for a movie, grouped by date
 */
export function getScreeningsForMovie(movieId) {
  const movieScreenings = screeningsData.filter((s) => s.movieId === Number(movieId))

  // Group by date
  const grouped = {}
  movieScreenings.forEach((s) => {
    if (!grouped[s.date]) grouped[s.date] = []
    grouped[s.date].push(s)
  })

  return grouped
}
