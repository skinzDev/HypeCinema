import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { Film, Ticket, CalendarDays, User, LogOut, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AuthModal from './AuthModal'
import Footer from './Footer'
import Toast from './Toast'

export default function Layout() {
  const { user, login, logout, isAuthenticated, isAdmin } = useAuth()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [toast, setToast] = useState({ isVisible: false, message: '', type: 'info' })

  const showToast = (message, type = 'info') => {
    setToast({ isVisible: true, message, type })
  }

  const handleOpenAuth = (mode = 'login') => {
    setAuthMode(mode)
    setIsAuthModalOpen(true)
  }

  const handleAuthSuccess = (token) => {
    login(token)
    showToast(
      authMode === 'login' ? 'Uspešno ste se prijavili!' : 'Nalog je uspešno kreiran!',
      'success'
    )
  }

  const handleLogout = () => {
    logout()
    showToast('Odjavili ste se sa profila.', 'info')
  }

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <NavLink to="/" className="sidebar-logo" title="HypeCinema Home">
          H
        </NavLink>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            data-tooltip="Repertoar"
          >
            <Film />
          </NavLink>

          <NavLink
            to="/schedule"
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
            data-tooltip="Raspored"
          >
            <CalendarDays />
          </NavLink>

          {isAdmin() && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `sidebar-nav-item ${isActive ? 'active' : ''}`
              }
              data-tooltip="Admin Panel"
            >
              <Shield />
            </NavLink>
          )}
        </nav>


        <div className="sidebar-bottom">
          {isAuthenticated() ? (
            <>
              <NavLink
                to="/profile"
                className="sidebar-avatar"
                title={`${user?.firstName || user?.username} (${user?.loyaltyPoints || 0} poena)`}
                data-tooltip="Moj Profil"
              >
                {user?.firstName ? user.firstName[0].toUpperCase() : 'U'}
              </NavLink>
              <button
                className="sidebar-nav-item"
                onClick={handleLogout}
                data-tooltip="Odjava"
              >
                <LogOut />
              </button>
            </>
          ) : (
            <button
              className="sidebar-nav-item"
              onClick={() => handleOpenAuth('login')}
              data-tooltip="Prijava"
            >
              <User />
            </button>
          )}
        </div>
      </aside>

      {/* Main Page Area */}
      <main className="main-content">
        <div className="main-content-body">
          <Outlet context={{ handleOpenAuth, showToast }} />
        </div>
        <Footer />
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
      />

      {/* Global Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast((t) => ({ ...t, isVisible: false }))}
      />
    </div>
  )
}
