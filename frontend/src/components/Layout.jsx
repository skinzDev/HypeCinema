import { useState } from 'react'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  Film,
  Ticket,
  CalendarDays,
  Search,
  User,
  LayoutGrid,
  LogOut,
  Shield,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'

const navItems = [
  { to: '/', icon: LayoutGrid, label: 'Početna' },
  { to: '/movies', icon: Film, label: 'Filmovi' },
  { to: '/tickets', icon: Ticket, label: 'Moje Karte' },
  { to: '/schedule', icon: CalendarDays, label: 'Raspored' },
  { to: '/search', icon: Search, label: 'Pretraga' },
]

export default function Layout() {
  const location = useLocation()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)

  const getInitials = () => {
    if (!user) return '?'
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`
    }
    return user.username?.[0]?.toUpperCase() || '?'
  }

  return (
    <div className="app-layout">
      {/* Vertical Sidebar Navigation */}
      <aside className="sidebar">
        <NavLink to="/" className="sidebar-logo">
          H
        </NavLink>

        <nav className="sidebar-nav">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              data-tooltip={label}
              className={`sidebar-nav-item ${
                location.pathname === to ? 'active' : ''
              }`}
            >
              <Icon />
            </NavLink>
          ))}

          {/* Admin link (only for admin users) */}
          {isAuthenticated() && isAdmin() && (
            <NavLink
              to="/admin"
              data-tooltip="Admin Panel"
              className={`sidebar-nav-item ${
                location.pathname.startsWith('/admin') ? 'active' : ''
              }`}
            >
              <Shield />
            </NavLink>
          )}
        </nav>

        <div className="sidebar-bottom">
          {isAuthenticated() ? (
            <>
              <button
                className="sidebar-nav-item"
                data-tooltip="Odjavi se"
                onClick={logout}
              >
                <LogOut />
              </button>
              <NavLink to="/profile" data-tooltip={user?.username}>
                <div className="sidebar-avatar">{getInitials()}</div>
              </NavLink>
            </>
          ) : (
            <button
              className="sidebar-nav-item"
              data-tooltip="Prijavi se"
              onClick={() => setShowAuthModal(true)}
            >
              <User />
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  )
}
