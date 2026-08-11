/**
 * Helper module for managing user bookings and HypeClub loyalty state.
 * Uses localStorage for persistence across browser sessions.
 */

const STORAGE_KEY = 'hype_cinema_user_bookings'

// Initial mock bookings for demonstration purposes
const INITIAL_MOCK_BOOKINGS = [
  {
    id: 'bk-101',
    ref: 'HC-8K9N2M1P',
    movieId: 1, // Dune: Part Two
    screeningId: 1,
    movieTitle: 'Dune: Part Two',
    poster: '/posters/dune2.png',
    hall: 'Sala 1 - IMAX',
    date: '2026-08-11',
    time: '14:00',
    seats: ['5-7', '5-8'], // E7, E8
    seatLabels: ['E7', 'E8'],
    pricePerTicket: 900,
    baseTotal: 1800,
    pointsRedeemed: 100,
    finalTotal: 1700,
    earnedPoints: 170,
    customerName: 'Marko Marković',
    customerEmail: 'marko@example.com',
    status: 'ACTIVE', // 'ACTIVE', 'COMPLETED', 'CANCELLED'
    createdAt: '2026-08-10T14:22:00.000Z',
  },
  {
    id: 'bk-102',
    ref: 'HC-3F7J9L4Q',
    movieId: 2, // Joker: Folie à Deux
    screeningId: 7,
    movieTitle: 'Joker: Folie à Deux',
    poster: '/posters/joker2.png',
    hall: 'Sala 3 - VIP',
    date: '2026-08-11',
    time: '19:30',
    seats: ['3-4'], // C4
    seatLabels: ['C4'],
    pricePerTicket: 1200,
    baseTotal: 1200,
    pointsRedeemed: 0,
    finalTotal: 1200,
    earnedPoints: 120,
    customerName: 'Marko Marković',
    customerEmail: 'marko@example.com',
    status: 'ACTIVE',
    createdAt: '2026-08-11T09:15:00.000Z',
  },
  {
    id: 'bk-103',
    ref: 'HC-9X2V4B7N',
    movieId: 4, // Inside Out 2
    screeningId: 12,
    movieTitle: 'Inside Out 2',
    poster: '/posters/insideout2.png',
    hall: 'Sala 2 - Standard',
    date: '2026-08-01',
    time: '13:00',
    seats: ['4-5', '4-6', '4-7'], // D5, D6, D7
    seatLabels: ['D5', 'D6', 'D7'],
    pricePerTicket: 700,
    baseTotal: 2100,
    pointsRedeemed: 300,
    finalTotal: 1800,
    earnedPoints: 180,
    customerName: 'Marko Marković',
    customerEmail: 'marko@example.com',
    status: 'COMPLETED',
    createdAt: '2026-07-30T11:00:00.000Z',
  },
  {
    id: 'bk-104',
    ref: 'HC-1M4P8T2Z',
    movieId: 6, // Deadpool & Wolverine
    screeningId: 17,
    movieTitle: 'Deadpool & Wolverine',
    poster: '/posters/deadpool.png',
    hall: 'Sala 2 - Standard',
    date: '2026-07-25',
    time: '11:00',
    seats: ['6-8'], // F8
    seatLabels: ['F8'],
    pricePerTicket: 600,
    baseTotal: 600,
    pointsRedeemed: 0,
    finalTotal: 600,
    earnedPoints: 60,
    customerName: 'Marko Marković',
    customerEmail: 'marko@example.com',
    status: 'CANCELLED',
    createdAt: '2026-07-24T18:30:00.000Z',
    cancelledAt: '2026-07-24T19:00:00.000Z',
  },
]

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
export function calculateLoyaltyStats(user, bookings) {
  const userBookings = bookings.filter(
    (b) => !user?.email || b.customerEmail === user.email || b.customerName?.includes(user.firstName)
  )

  // Total spent on active and completed bookings
  const totalSpent = userBookings
    .filter((b) => b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + (b.finalTotal || 0), 0)

  // Net points earned across valid (active + completed) bookings
  const netEarnedFromBookings = userBookings
    .filter((b) => b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + (b.earnedPoints || 0) - (b.pointsRedeemed || 0), 0)

  // Base starting points (default 250 for demo) + net points from bookings
  const basePoints = user?.loyaltyPoints ?? 250
  const points = Math.max(0, basePoints + netEarnedFromBookings)

  // Dynamic Tier calculation based on accumulated points
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
