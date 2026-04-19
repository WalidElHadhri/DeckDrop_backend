import { NavLink, useNavigate } from 'react-router-dom'
import { FEATURED_CATEGORIES } from '../lib/content'

function SiteHeader({
  t,
  language,
  onToggleLanguage,
  searchTerm,
  setSearchTerm,
  wishlistCount,
  cartCount,
  isAdmin,
  auth,
  onCategorySelect,
}) {
  const navigate = useNavigate()

  function handleCategorySelect(category) {
    onCategorySelect(category)
    navigate('/shop')
  }

  return (
    <header className="site-header">
      <div className="header-main">
        <NavLink to="/" className="brand">
          <img src="/logo.jpg" alt="AR DeckDrop logo" className="brand-logo" />
          <div>
            <strong>AR - DECKDROP</strong>
            <span>TCG • Accessories • Figures • Merch</span>
          </div>
        </NavLink>

        <div className="search-wrap">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchPlaceholder}
          />
        </div>

        <div className="header-actions">
          <button className="ghost" type="button" onClick={onToggleLanguage}>
            {language === 'en' ? 'DE' : 'EN'}
          </button>
          {isAdmin && (
            <NavLink to="/admin" className="ghost nav-chip">⚙️ Admin</NavLink>
          )}
          <NavLink to="/wishlist" className="ghost nav-chip">♡ {t.wishlist} ({wishlistCount})</NavLink>
          <NavLink to="/account" className="ghost nav-chip">👤 {auth?.lastName ? auth.lastName : t.account}</NavLink>
          <NavLink to="/cart" className="ghost nav-chip">🛒 {t.cart} ({cartCount})</NavLink>
        </div>
      </div>

      <nav className="header-nav">
        <NavLink to="/">{t.home}</NavLink>
        <NavLink to="/shop">{t.shop}</NavLink>
        <NavLink to="/blog">{t.blog}</NavLink>
        <NavLink to="/about">{t.about}</NavLink>
        <NavLink to="/contact">{t.contact}</NavLink>
        <NavLink to="/checkout">{t.checkout}</NavLink>
      </nav>
    </header>
  )
}

export default SiteHeader
