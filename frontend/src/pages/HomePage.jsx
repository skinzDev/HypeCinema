import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MapPin,
  CalendarDays,
  SlidersHorizontal,
  Star,
  Clock,
  Play,
} from 'lucide-react'
import Button from '../components/Button'

/* ── Hero carousel data ── */
const heroSlides = [
  {
    id: 1,
    title: 'Spider-Man:\nBrand New Day',
    subtitle: 'Ekskluzivno u bioskopima · Jul 31, 2026',
    badge: 'Premijera',
    image: '/posters/spiderman.png',
    genre: 'Akcija / Avantura',
  },
  {
    id: 2,
    title: 'Dune:\nPart Three',
    subtitle: 'Novo poglavlje epske sage · Avg 2026',
    badge: 'Uskoro',
    image: '/posters/dune.png',
    genre: 'Sci-Fi / Drama',
  },
  {
    id: 3,
    title: 'The Batman:\nPart II',
    subtitle: 'Povratak Viteza Tame · Sep 2026',
    badge: 'Uskoro',
    image: '/posters/batman.png',
    genre: 'Triler / Akcija',
  },
]

/* ── Movie cards data ── */
const moviesData = [
  {
    id: 1,
    title: 'Spider-Man: Brand New Day',
    genre: 'Akcija',
    rating: 8.7,
    duration: 148,
    poster: '/posters/spiderman.png',
  },
  {
    id: 2,
    title: 'Dune: Part Three',
    genre: 'Sci-Fi',
    rating: 9.1,
    duration: 165,
    poster: '/posters/dune.png',
  },
  {
    id: 3,
    title: 'The Batman: Part II',
    genre: 'Triler',
    rating: 8.4,
    duration: 155,
    poster: '/posters/batman.png',
  },
  {
    id: 4,
    title: 'Oppenheimer',
    genre: 'Drama',
    rating: 8.9,
    duration: 180,
    poster: '/posters/oppenheimer.png',
  },
  {
    id: 5,
    title: 'Deadpool & Wolverine',
    genre: 'Komedija',
    rating: 8.2,
    duration: 128,
    poster: '/posters/gladiator.png',
  },
  {
    id: 6,
    title: 'Inside Out 3',
    genre: 'Animacija',
    rating: 8.5,
    duration: 100,
    poster: '/posters/insideout.png',
  },
  {
    id: 7,
    title: 'Gladiator III',
    genre: 'Akcija',
    rating: 7.9,
    duration: 150,
    poster: '/posters/gladiator.png',
  },
  {
    id: 8,
    title: 'Interstellar 2',
    genre: 'Sci-Fi',
    rating: 9.3,
    duration: 170,
    poster: '/posters/interstellar.png',
  },
]

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeFilter, setActiveFilter] = useState('all')
  const navigate = useNavigate()

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    )
  }, [])

  /* Auto-advance carousel */
  useEffect(() => {
    const timer = setInterval(nextSlide, 6000)
    return () => clearInterval(timer)
  }, [nextSlide])

  /* Filter movies */
  const filteredMovies =
    activeFilter === 'all'
      ? moviesData
      : moviesData.filter(
          (m) => m.genre.toLowerCase() === activeFilter.toLowerCase()
        )

  const genres = ['all', ...new Set(moviesData.map((m) => m.genre))]

  const formatDuration = (mins) => {
    const h = Math.floor(mins / 60)
    const m = mins % 60
    return `${h}h ${m}min`
  }

  return (
    <>
      {/* ── Hero Carousel ── */}
      <section className="hero-carousel" id="hero-carousel">
        {heroSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`hero-slide ${idx === currentSlide ? 'active' : ''}`}
          >
            <img
              className="hero-slide-image"
              src={slide.image}
              alt={slide.title}
              loading={idx === 0 ? 'eager' : 'lazy'}
              onError={(e) => {
                e.target.onerror = null
                e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop'
              }}
            />
            <div className="hero-slide-overlay" />
            <div className="hero-slide-content">
              <span className="hero-badge">{slide.badge}</span>
              <h1 className="hero-title">
                {slide.title.split('\n').map((line, i) => (
                  <span key={i}>
                    {line}
                    {i === 0 && <br />}
                  </span>
                ))}
              </h1>
              <p className="hero-subtitle">{slide.subtitle}</p>
              <div className="hero-actions">
                <Button variant="primary" onClick={() => navigate(`/movies/${slide.id}`)}>
                  <Play size={16} />
                  Kupi Kartu
                </Button>
                <Button variant="secondary" onClick={() => navigate(`/movies/${slide.id}`)}>
                  Detaljnije
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Floating carousel controls in bottom-right corner */}
        <div className="hero-controls">
          <button
            className="hero-arrow"
            onClick={prevSlide}
            aria-label="Prethodni film"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="hero-dots">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                className={`hero-dot ${idx === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Slajd ${idx + 1}`}
              />
            ))}
          </div>
          <button
            className="hero-arrow"
            onClick={nextSlide}
            aria-label="Sledeći film"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* ── Filter Bar ── */}
      <div className="filter-bar" id="filter-bar">
        {/* Bioskop Lokacija Dropdown */}
        <div className="filter-dropdown-wrapper">
          <MapPin size={16} className="filter-icon" />
          <select className="filter-select" defaultValue="beograd">
            <option value="beograd">Bioskop Beograd (Galerija)</option>
            <option value="novisad">Bioskop Novi Sad (Promenada)</option>
            <option value="nis">Bioskop Niš (Delta Planet)</option>
            <option value="kragujevac">Bioskop Kragujevac (Big)</option>
          </select>
          <ChevronDown className="filter-chevron" size={14} />
        </div>

        {/* Datum Dropdown */}
        <div className="filter-dropdown-wrapper">
          <CalendarDays size={16} className="filter-icon" />
          <select className="filter-select" defaultValue="today">
            <option value="today">Danas (Danas)</option>
            <option value="tomorrow">Sutra</option>
            <option value="weekend">Ovaj vikend</option>
            <option value="nextweek">Sledeća nedelja</option>
          </select>
          <ChevronDown className="filter-chevron" size={14} />
        </div>

        {/* Žanr Single Dropdown Box */}
        <div className="filter-dropdown-wrapper active">
          <SlidersHorizontal size={16} className="filter-icon" />
          <select
            className="filter-select"
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
          >
            <option value="all">Svi žanrovi</option>
            {genres
              .filter((g) => g !== 'all')
              .map((genre) => (
                <option key={genre} value={genre}>
                  Žanr: {genre}
                </option>
              ))}
          </select>
          <ChevronDown className="filter-chevron" size={14} />
        </div>
      </div>

      {/* ── Movie Grid ── */}
      <section id="movies-grid">
        <h2 className="movies-section-title">
          {activeFilter === 'all' ? 'Trenutno u bioskopima' : `Žanr: ${activeFilter}`}
        </h2>
        <div className="movies-grid">
          {filteredMovies.map((movie) => (
            <article
              key={movie.id}
              className="movie-card"
              onClick={() => navigate(`/movies/${movie.id}`)}
            >
              <img
                className="movie-card-image"
                src={movie.poster}
                alt={movie.title}
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop'
                }}
              />

              {/* Hover overlay info */}
              <div className="movie-card-overlay" />
              <div className="movie-card-info">
                <h3 className="movie-card-title">{movie.title}</h3>
                <div className="movie-card-meta">
                  <span className="movie-card-rating">
                    <Star size={12} />
                    {movie.rating}
                  </span>
                  <span className="movie-card-duration">
                    <Clock size={11} />
                    {formatDuration(movie.duration)}
                  </span>
                  <span className="movie-card-genre">{movie.genre}</span>
                </div>
              </div>

              {/* Bottom persistent title */}
              <div className="movie-card-bottom">
                <p className="movie-card-bottom-title">{movie.title}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
