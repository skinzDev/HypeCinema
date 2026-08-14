/**
 * Watchlist / Wishlist management using localStorage (per-user isolated).
 */
function getStorageKey(userEmailOrName) {
  if (!userEmailOrName) {
    try {
      const stored = localStorage.getItem('user_profile')
      if (stored) {
        const u = JSON.parse(stored)
        userEmailOrName = u.email || u.username
      }
    } catch (e) {}
  }
  return userEmailOrName ? `hype_cinema_watchlist_${userEmailOrName}` : 'hype_cinema_watchlist_guest'
}

export function getWatchlist(userEmailOrName = null) {
  try {
    const key = getStorageKey(userEmailOrName)
    const raw = localStorage.getItem(key)
    if (!raw) return []
    return JSON.parse(raw)
  } catch (err) {
    return []
  }
}

export function toggleWatchlist(movieId, userEmailOrName = null) {
  const key = getStorageKey(userEmailOrName)
  const current = getWatchlist(userEmailOrName)
  const idNum = Number(movieId)
  let updated
  if (current.includes(idNum)) {
    updated = current.filter((id) => id !== idNum)
  } else {
    updated = [...current, idNum]
  }
  localStorage.setItem(key, JSON.stringify(updated))
  return updated
}

export function isInWatchlist(movieId, userEmailOrName = null) {
  const current = getWatchlist(userEmailOrName)
  return current.includes(Number(movieId))
}

