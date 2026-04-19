import { NavLink } from 'react-router-dom'

function SiteFooter({ t }) {
  return (
    <footer className="site-footer">
      <div>
        <h3>{t.customerService}</h3>
        <NavLink to="/shipping">{t.shipping}</NavLink>
        <NavLink to="/returns">{t.returns}</NavLink>
        <NavLink to="/contact">{t.contact}</NavLink>
        <a href="#">FAQ</a>
      </div>
      <div>
        <h3>{t.legal}</h3>
        <NavLink to="/terms">{t.terms}</NavLink>
        <NavLink to="/privacy">{t.privacy}</NavLink>
        <NavLink to="/impressum">{t.impressum}</NavLink>
      </div>
      <div>
        <h3>Social</h3>
        <a href="#">Instagram</a>
        <a href="#">TikTok</a>
        <a href="#">YouTube</a>
        <a href="#">Facebook</a>
      </div>
      <div>
        <h3>Payments</h3>
        <p>PayPal • Klarna • Visa • MasterCard • Bank Transfer</p>
        <small>© AR - DECKDROP — {t.rights}</small>
      </div>
    </footer>
  )
}

export default SiteFooter
