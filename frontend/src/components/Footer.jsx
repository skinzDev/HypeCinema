import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="cine-footer">
      <div className="cine-footer-inner">
        {/* Navigation Columns */}
        <div className="cine-footer-columns">
          {/* Column 1: NAVIGACIJA */}
          <div className="cine-footer-col">
            <h4 className="cine-footer-title">NAVIGACIJA</h4>
            <ul className="cine-footer-list">
              <li><Link to="/">Repertoar filmova</Link></li>
              <li><Link to="/schedule">Raspored projekcija</Link></li>
              <li><Link to="/profile">Moj Profil & Ulaznice</Link></li>
              <li><Link to="/admin">Admin Panel</Link></li>
            </ul>
          </div>

          {/* Column 2: MOJ NALOG */}
          <div className="cine-footer-col">
            <h4 className="cine-footer-title">MOJ NALOG</h4>
            <ul className="cine-footer-list">
              <li><Link to="/profile">Aktivne ulaznice</Link></li>
              <li><Link to="/profile">HypeClub Lojalnost</Link></li>
              <li><Link to="/profile">Lista za gledanje</Link></li>
              <li><Link to="/profile">Istorija kupovina</Link></li>
            </ul>
          </div>

          {/* Column 3: FILMOVI */}
          <div className="cine-footer-col">
            <h4 className="cine-footer-title">FILMOVI</h4>
            <ul className="cine-footer-list">
              <li><Link to="/">Trenutno na programu</Link></li>
              <li><Link to="/">Uskoro u bioskopu</Link></li>
              <li><Link to="/">Najpopularniji naslovi</Link></li>
            </ul>
          </div>

          {/* Column 4: HYPECLUB LOJALNOST */}
          <div className="cine-footer-col">
            <h4 className="cine-footer-title">HYPECLUB LOJALNOST</h4>
            <ul className="cine-footer-list">
              <li><Link to="/profile">Bronze Member (10p / 100 RSD)</Link></li>
              <li><Link to="/profile">Silver Member (+5% bonus)</Link></li>
              <li><Link to="/profile">Gold Member (VIP pogodnosti)</Link></li>
            </ul>
          </div>

          {/* Column 5: PODRŠKA */}
          <div className="cine-footer-col">
            <h4 className="cine-footer-title">PODRŠKA</h4>
            <ul className="cine-footer-list">
              <li><span className="cine-footer-info-text">podrska@hypecinema.rs</span></li>
              <li><span className="cine-footer-info-text">Radno vreme: 10:00 - 23:00h</span></li>
              <li><span className="cine-footer-info-text">Beograd, Srbija</span></li>
            </ul>
          </div>
        </div>

        {/* Payment Methods Bar */}
        <div className="cine-footer-payments">
          <div className="cine-payment-badge cine-payment-visa-secure">
            <span className="visa-text">VISA</span>
            <span className="secure-text">SECURE</span>
          </div>

          <div className="cine-payment-badge cine-payment-mc-idcheck">
            <div className="mc-circles">
              <span className="mc-circle mc-red"></span>
              <span className="mc-circle mc-yellow"></span>
            </div>
            <span className="idcheck-text">ID Check</span>
          </div>

          <div className="cine-payment-badge cine-payment-maestro">
            <div className="mc-circles">
              <span className="mc-circle mc-red"></span>
              <span className="mc-circle mc-blue"></span>
            </div>
            <span className="card-label">maestro</span>
          </div>

          <div className="cine-payment-badge cine-payment-mastercard">
            <div className="mc-circles">
              <span className="mc-circle mc-red"></span>
              <span className="mc-circle mc-yellow"></span>
            </div>
            <span className="card-label">mastercard</span>
          </div>

          <div className="cine-payment-badge cine-payment-visa">
            <span className="visa-brand">VISA</span>
          </div>

          <div className="cine-payment-badge cine-payment-dinacard">
            <span className="dina-text">DinaCard</span>
          </div>

          <div className="cine-payment-badge cine-payment-ssl">
            <span className="ssl-lock">🔒</span>
            <span className="ssl-text">256-BIT SSL BEZBEDNA KUPOVINA</span>
          </div>
        </div>
      </div>

      {/* Full-width Dark Bottom Legal Bar */}
      <div className="cine-footer-bottom">
        <div className="cine-footer-bottom-inner">
          <div className="cine-footer-copyright">
            © {new Date().getFullYear()} HypeCinema. Sva prava zadržana.
          </div>
          <div className="cine-footer-links">
            <Link to="/">Repertoar</Link>
            <span className="cine-link-sep">|</span>
            <Link to="/schedule">Raspored</Link>
            <span className="cine-link-sep">|</span>
            <Link to="/profile">Moj Profil</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
