/**
 * Watchlist / Wishlist management using localStorage.
 */
const WATCHLIST_KEY = 'hype_cinema_watchlist'

export function getWatchlist() {
  try {
    const raw = localStorage.getItem(WATCHLIST_KEY)
    return raw ? JSON.parse(raw) : [1, 2] // Default 2 movies in demo watchlist
  } catch (err) {
    return [1, 2]
  }
}

export function toggleWatchlist(movieId) {
  const current = getWatchlist()
  const idNum = Number(movieId)
  let updated
  if (current.includes(idNum)) {
    updated = current.filter((id) => id !== idNum)
  } else {
    updated = [...current, idNum]
  }
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated))
  return updated
}

export function isInWatchlist(movieId) {
  const current = getWatchlist()
  return current.includes(Number(movieId))
}
