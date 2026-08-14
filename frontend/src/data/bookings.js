/**
 * Helper module for managing user bookings and HypeClub loyalty state.
 * Uses localStorage for persistence across browser sessions.
 */

const STORAGE_KEY = 'hype_cinema_user_bookings'

// Initial mock bookings — empty by default for real user integration
const INITIAL_MOCK_BOOKINGS = []

/**
 * Get all stored bookings from localStorage, defaulting to initial mock bookings.
 */
export function getStoredBookings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_BOOKINGS))
      return INITIAL_MOCK_BOOKINGS
    }
    return JSON.parse(raw)
  } catch (err) {
    console.error('Failed to load stored bookings', err)
    return INITIAL_MOCK_BOOKINGS
  }
}

/**
 * Save a new booking to localStorage.
 */
import { addGlobalOccupiedSeats, createBookingApi } from '../services/api'

/**
 * Save a new booking to localStorage and global shared occupied seats.
 */
export function addBooking(bookingData) {
  const current = getStoredBookings()
  const newBooking = {
    id: 'bk-' + Date.now(),
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    ...bookingData,
  }
  const updated = [newBooking, ...current]
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('Failed to save booking', err)
  }

  // Register seat keys in global occupied store for this screeningId
  if (bookingData.screeningId && Array.isArray(bookingData.seats)) {
    addGlobalOccupiedSeats(bookingData.screeningId, bookingData.seats)
  }

  // Also trigger backend REST API call asynchronously if user token exists
  if (bookingData.screeningId && Array.isArray(bookingData.seats)) {
    const formattedSeats = bookingData.seats.map((seatKey) => {
      const [r, s] = seatKey.split('-').map(Number)
      return { rowNum: r, seatNum: s }
    })
    createBookingApi({
      screeningId: bookingData.screeningId,
      seats: formattedSeats,
      pointsToRedeem: bookingData.pointsRedeemed || 0,
    }).catch(() => {})
  }

  return newBooking
}

/**
 * Cancel an existing booking by ID if status is ACTIVE.
 */
export function cancelBooking(bookingId) {
  const current = getStoredBookings()
  const updated = current.map((b) => {
    if (b.id === bookingId) {
      return {
        ...b,
        status: 'CANCELLED',
        cancelledAt: new Date().toISOString(),
      }
    }
    return b
  })
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.error('Failed to cancel booking', err)
  }
  return updated
}

/**
 * Calculate user loyalty stats dynamically from bookings and base points.
 * Points are awarded immediately upon purchasing/booking a ticket.
 */
export function calculateLoyaltyStats(user, bookings = []) {
  const userBookings = (user?.email || user?.username)
    ? bookings.filter(
        (b) =>
          (user.email && (b.customerEmail === user.email || b.username === user.email)) ||
          (user.username && (b.customerEmail === user.username || b.username === user.username))
      )
    : []

  // Total spent on active and completed bookings
  const totalSpent = userBookings
    .filter((b) => b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + (b.finalTotal || 0), 0)

  // Current balance from user profile (source of truth)
  const points = Math.max(0, user?.loyaltyPoints ?? 0)

  // Dynamic Tier calculation based on accumulated points:
  // BRONZE: 0 - 499 poena
  // SILVER: 500 - 1499 poena
  // GOLD: 1500+ poena
  const tier = points >= 1500 ? 'GOLD' : points >= 500 ? 'SILVER' : 'BRONZE'

  const activeTicketsCount = userBookings.filter((b) => b.status === 'ACTIVE').length
  const totalCompletedCount = userBookings.filter((b) => b.status === 'COMPLETED').length

  let nextTier = 'SILVER'
  let nextTierThreshold = 500
  let currentTierThreshold = 0

  if (tier === 'SILVER') {
    nextTier = 'GOLD'
    nextTierThreshold = 1500
    currentTierThreshold = 500
  } else if (tier === 'GOLD') {
    nextTier = 'MAX'
    nextTierThreshold = 1500
    currentTierThreshold = 1500
  }

  const progressPercent =
    tier === 'GOLD'
      ? 100
      : Math.min(
          100,
          Math.max(
            0,
            Math.round(
              ((points - currentTierThreshold) / (nextTierThreshold - currentTierThreshold)) * 100
            )
          )
        )

  return {
    tier,
    points,
    totalSpent,
    activeTicketsCount,
    totalCompletedCount,
    nextTier,
    nextTierThreshold,
    progressPercent,
  }
}

