export { default } from './AppRoutes.jsx'
/*

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

const TOKEN_KEY = 'deckdrop_token'
const EMAIL_KEY = 'deckdrop_email'
const ROLE_KEY = 'deckdrop_role'

function getStoredAuth() {
  return {
    token: localStorage.getItem(TOKEN_KEY) ?? '',
    email: localStorage.getItem(EMAIL_KEY) ?? '',
    role: localStorage.getItem(ROLE_KEY) ?? '',
  }
}

async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message = data?.message ?? `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return data
}

const FEATURED_CATEGORIES = [
  'Pokémon TCG',
  'Yu-Gi-Oh! TCG',
  'One Piece TCG',
  'TCG Accessories',
  'Figures',
  'Merchandise',
]

const content = {
  en: {
    home: 'Home',
    shop: 'Shop',
    blog: 'Blog',
    about: 'About',
    contact: 'Contact',
    categories: 'Categories',
    searchPlaceholder: 'Search products, sets, accessories...',
    wishlist: 'Wishlist',
    account: 'Account',
    cart: 'Cart',
    heroTitle: 'Premium TCG Store for Collectors & Players',
    heroText:
      'Discover sealed products, accessories, figures, and preorders in a colorful premium shopping experience.',
    shopNow: 'Shop now',
    viewPreorders: 'View preorders',
    featuredCategories: 'Featured categories',
    hotProducts: 'Hot products',
    newArrivals: 'New arrivals',
    preorders: 'Preorders',
    recommended: 'Recommended for you',
    stock: 'Stock',
    releaseDate: 'Release date',
    preorderNow: 'Preorder now',
    addWishlist: 'Add to wishlist',
    addCart: 'Add to cart',
    noProducts: 'No products available yet.',
    newsletterTitle: 'Get restock and preorder updates',
    newsletterText: 'Subscribe to receive product drops, release alerts, and best deals.',
    subscribe: 'Subscribe',
    socialTitle: 'Instagram / Social feed',
    socialSub: 'Latest drops, unboxings, and release previews.',
    accountAccess: 'Account access',
    register: 'Register',
    login: 'Login',
    email: 'Email',
    password: 'Password',
    logout: 'Logout',
    loggedAs: 'Logged in as',
    role: 'Role',
    quickAdmin: 'Admin quick product creation',
    name: 'Name',
    description: 'Description',
    price: 'Price',
    currency: 'Currency',
    quantity: 'Stock quantity',
    preorder: 'Preorder',
    createProduct: 'Create product',
    customerService: 'Customer service',
    legal: 'Legal',
    shipping: 'Shipping & Delivery',
    returns: 'Returns & Refund',
    terms: 'Terms & Conditions',
    privacy: 'Privacy Policy',
    impressum: 'Impressum',
    rights: 'All rights reserved.',
    remove: 'Remove',
  },
  de: {
    home: 'Startseite',
    shop: 'Shop',
    blog: 'Blog',
    about: 'Über uns',
    contact: 'Kontakt',
    categories: 'Kategorien',
    searchPlaceholder: 'Produkte, Sets, Zubehör suchen...',
    wishlist: 'Wunschliste',
    account: 'Konto',
    cart: 'Warenkorb',
    heroTitle: 'Premium TCG Shop für Sammler & Spieler',
    heroText:
      'Entdecke versiegelte Produkte, Zubehör, Figuren und Vorbestellungen in einem farbenfrohen Premium-Shop.',
    shopNow: 'Jetzt shoppen',
    viewPreorders: 'Vorbestellungen ansehen',
    featuredCategories: 'Top-Kategorien',
    hotProducts: 'Beliebte Produkte',
    newArrivals: 'Neu eingetroffen',
    preorders: 'Vorbestellungen',
    recommended: 'Empfohlen für dich',
    stock: 'Bestand',
    releaseDate: 'Erscheinungsdatum',
    preorderNow: 'Jetzt vorbestellen',
    addWishlist: 'Zur Wunschliste',
    addCart: 'In den Warenkorb',
    noProducts: 'Noch keine Produkte verfügbar.',
    newsletterTitle: 'Updates zu Restocks & Vorbestellungen',
    newsletterText: 'Erhalte Infos zu Drops, Release-Daten und besten Angeboten.',
    subscribe: 'Abonnieren',
    socialTitle: 'Instagram / Social Feed',
    socialSub: 'Neueste Drops, Unboxings und Release-Previews.',
    accountAccess: 'Konto-Zugang',
    register: 'Registrieren',
    login: 'Anmelden',
    email: 'E-Mail',
    password: 'Passwort',
    logout: 'Abmelden',
    loggedAs: 'Angemeldet als',
    role: 'Rolle',
    quickAdmin: 'Admin Schnell-Erstellung Produkt',
    name: 'Name',
    description: 'Beschreibung',
    price: 'Preis',
    currency: 'Währung',
    quantity: 'Lagerbestand',
    preorder: 'Vorbestellung',
    createProduct: 'Produkt erstellen',
    customerService: 'Kundenservice',
    legal: 'Rechtliches',
    shipping: 'Versand & Lieferung',
    returns: 'Rückgabe & Erstattung',
    terms: 'AGB',
    privacy: 'Datenschutz',
    impressum: 'Impressum',
    rights: 'Alle Rechte vorbehalten.',
    remove: 'Entfernen',
  },
}

function formatPrice(value, currency = 'EUR', language = 'en') {
  const locale = language === 'de' ? 'de-DE' : 'en-US'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0))
}

function App() {
  const [language, setLanguage] = useState('en')
  const [auth, setAuth] = useState(getStoredAuth)
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [wishlist, setWishlist] = useState([])
  const [cart, setCart] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loadingProducts, setLoadingProducts] = useState(false)

  const [registerForm, setRegisterForm] = useState({ email: '', password: '' })
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'EUR',
    preorder: false,
    releaseDate: '',
    stockQuantity: '',
  })

  const isAuthenticated = Boolean(auth.token)
  const isAdmin = auth.role === 'ADMIN'
  const t = content[language]

  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) {
      return products
    }
    return products.filter((item) => {
      const haystack = `${item.name ?? ''} ${item.description ?? ''}`.toLowerCase()
      return haystack.includes(q)
    })
  }, [products, searchTerm])

  const hotProducts = useMemo(() => filteredProducts.slice(0, 4), [filteredProducts])

  const newArrivals = useMemo(
    () => [...filteredProducts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4),
    [filteredProducts],
  )

  const preorderProducts = useMemo(
    () => filteredProducts.filter((item) => item.preorder).slice(0, 4),
    [filteredProducts],
  )

  const recommendedProducts = useMemo(
    () => filteredProducts.filter((item) => !item.preorder).slice(0, 4),
    [filteredProducts],
  )

  useEffect(() => {
    void loadProducts()
  }, [])

  async function loadProducts() {
    setLoadingProducts(true)
    setError('')
    try {
      const data = await apiRequest('/api/products')
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingProducts(false)
    }
  }

  function persistAuth(nextAuth) {
    localStorage.setItem(TOKEN_KEY, nextAuth.token)
    localStorage.setItem(EMAIL_KEY, nextAuth.email)
    localStorage.setItem(ROLE_KEY, nextAuth.role)
    setAuth(nextAuth)
  }

  async function handleRegister(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    try {
      const data = await apiRequest('/api/auth/register', {
        method: 'POST',
        body: registerForm,
      })

      persistAuth({ token: data.token, email: data.email, role: data.role })
      setSuccess(`Registered successfully as ${data.role}. You are now logged in.`)
      setRegisterForm({ email: '', password: '' })
      await loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleLogin(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    try {
      const data = await apiRequest('/api/auth/login', {
        method: 'POST',
        body: loginForm,
      })

      persistAuth({ token: data.token, email: data.email, role: data.role })
      setSuccess(`Welcome back ${data.email}. Role: ${data.role}`)
      setLoginForm({ email: '', password: '' })
      await loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleCreateProduct(event) {
    event.preventDefault()
    setError('')
    setSuccess('')

    try {
      const payload = {
        name: productForm.name,
        description: productForm.description,
        price: Number(productForm.price),
        currency: productForm.currency,
        preorder: productForm.preorder,
        releaseDate: productForm.releaseDate || null,
        stockQuantity: Number(productForm.stockQuantity),
      }

      await apiRequest('/api/products', {
        method: 'POST',
        body: payload,
        token: auth.token,
      })

      setSuccess('Product created successfully.')
      setProductForm({
        name: '',
        description: '',
        price: '',
        currency: 'EUR',
        preorder: false,
        releaseDate: '',
        stockQuantity: '',
      })
      await loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EMAIL_KEY)
    localStorage.removeItem(ROLE_KEY)
    setAuth({ token: '', email: '', role: '' })
    setSuccess('Logged out successfully.')
  }

  function toggleLanguage() {
    setLanguage((prev) => (prev === 'en' ? 'de' : 'en'))
  }

  function addToWishlist(productId) {
    setWishlist((prev) => (prev.includes(productId) ? prev : [...prev, productId]))
  }

  function removeFromWishlist(productId) {
    setWishlist((prev) => prev.filter((id) => id !== productId))
  }

  function addToCart(productId) {
    setCart((prev) => [...prev, productId])
  }

  function renderProductCard(product, showPreorderCta = false) {
    return (
      <article key={product.id} className="product-card">
        <span className={`pill ${product.preorder ? 'is-preorder' : 'is-stock'}`}>
          {product.preorder ? t.preorders : t.stock}
        </span>
        <h3>{product.name}</h3>
        <p>{product.description || '—'}</p>
        <p className="price">{formatPrice(product.price, product.currency, language)}</p>
        <p className="meta">{t.stock}: {product.stockQuantity}</p>
        {product.preorder && <p className="meta">{t.releaseDate}: {product.releaseDate || 'TBD'}</p>}

        <div className="card-actions">
          <button type="button" className="ghost" onClick={() => addToWishlist(product.id)}>
            {t.addWishlist}
          </button>
          <button type="button" onClick={() => addToCart(product.id)}>
            {showPreorderCta ? t.preorderNow : t.addCart}
          </button>
        </div>
      </article>
    )
  }

  const wishlistProducts = products.filter((item) => wishlist.includes(item.id))

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-main">
          <a href="#" className="brand">
            <img src="/favicon.svg" alt="AR DeckDrop" className="brand-logo" />
            <div>
              <strong>AR - DECKDROP</strong>
              <span>TCG • Accessories • Figures • Merch</span>
            </div>
          </a>

          <div className="search-wrap">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder}
            />
          </div>

          <div className="header-actions">
            <button className="ghost" type="button" onClick={toggleLanguage}>
              {language === 'en' ? 'DE' : 'EN'}
            </button>
            <button type="button" className="ghost">♡ {t.wishlist} ({wishlist.length})</button>
            <button type="button" className="ghost">👤 {t.account}</button>
            <button type="button" className="ghost">🛒 {t.cart} ({cart.length})</button>
          </div>
        </div>

        <nav className="header-nav">
          <a href="#home">{t.home}</a>
          <a href="#shop">{t.shop}</a>
          <a href="#blog">{t.blog}</a>
          <a href="#about">{t.about}</a>
          <a href="#contact">{t.contact}</a>
          <details>
            <summary>{t.categories}</summary>
            <div className="category-menu">
              {FEATURED_CATEGORIES.map((category) => (
                <button type="button" key={category} onClick={() => setSearchTerm(category)}>{category}</button>
              ))}
            </div>
          </details>
        </nav>
      </header>

      <main>
        <section id="home" className="hero-section">
          <div className="hero-text">
            <p className="eyebrow">AR - DECKDROP.de</p>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroText}</p>
            <div className="hero-actions">
              <a href="#shop" className="cta">{t.shopNow}</a>
              <a href="#preorders" className="cta ghost">{t.viewPreorders}</a>
            </div>
          </div>
          <div className="hero-media" aria-hidden="true" />
        </section>

        <section className="section-block">
          <div className="section-head">
            <h2>{t.featuredCategories}</h2>
          </div>
          <div className="category-grid">
            {FEATURED_CATEGORIES.map((category) => (
              <button key={category} type="button" className="category-card" onClick={() => setSearchTerm(category)}>
                {category}
              </button>
            ))}
          </div>
        </section>

        <section id="shop" className="section-block">
          <div className="section-head">
            <h2>{t.hotProducts}</h2>
            <button type="button" className="ghost" onClick={loadProducts} disabled={loadingProducts}>
              {loadingProducts ? '...' : 'Refresh'}
            </button>
          </div>
          <div className="product-grid">
            {(hotProducts.length ? hotProducts : filteredProducts).map((product) => renderProductCard(product))}
            {!filteredProducts.length && <p className="empty-state">{t.noProducts}</p>}
          </div>
        </section>

        <section className="section-block">
          <div className="section-head"><h2>{t.newArrivals}</h2></div>
          <div className="product-grid">
            {newArrivals.map((product) => renderProductCard(product))}
            {!newArrivals.length && <p className="empty-state">{t.noProducts}</p>}
          </div>
        </section>

        <section id="preorders" className="section-block">
          <div className="section-head"><h2>{t.preorders}</h2></div>
          <div className="product-grid">
            {preorderProducts.map((product) => renderProductCard(product, true))}
            {!preorderProducts.length && <p className="empty-state">{t.noProducts}</p>}
          </div>
        </section>

        <section className="section-block">
          <div className="section-head"><h2>{t.recommended}</h2></div>
          <div className="product-grid">
            {recommendedProducts.map((product) => renderProductCard(product))}
            {!recommendedProducts.length && <p className="empty-state">{t.noProducts}</p>}
          </div>
        </section>

        <section className="section-block utility-grid">
          <article className="panel">
            <h2>{t.accountAccess}</h2>
            <p>{t.loggedAs}: <strong>{auth.email || 'Guest'}</strong> • {t.role}: <strong>{auth.role || 'N/A'}</strong></p>
            {isAuthenticated && (
              <button type="button" onClick={logout} className="ghost">
                {t.logout}
              </button>
            )}

            <div className="auth-columns">
              <form onSubmit={handleRegister} className="form-grid">
                <h3>{t.register}</h3>
                <input
                  type="email"
                  required
                  placeholder={t.email}
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm((s) => ({ ...s, email: e.target.value }))}
                />
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder={t.password}
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm((s) => ({ ...s, password: e.target.value }))}
                />
                <button type="submit">{t.register}</button>
              </form>

              <form onSubmit={handleLogin} className="form-grid">
                <h3>{t.login}</h3>
                <input
                  type="email"
                  required
                  placeholder={t.email}
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((s) => ({ ...s, email: e.target.value }))}
                />
                <input
                  type="password"
                  required
                  placeholder={t.password}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((s) => ({ ...s, password: e.target.value }))}
                />
                <button type="submit">{t.login}</button>
              </form>
            </div>
          </article>

          <article className="panel">
            <h2>{t.quickAdmin}</h2>
            {!isAdmin && <p>Only ADMIN can create products.</p>}
            <form onSubmit={handleCreateProduct} className="form-grid" aria-disabled={!isAdmin}>
              <input
                type="text"
                required
                placeholder={t.name}
                value={productForm.name}
                onChange={(e) => setProductForm((s) => ({ ...s, name: e.target.value }))}
                disabled={!isAdmin}
              />
              <textarea
                placeholder={t.description}
                value={productForm.description}
                onChange={(e) => setProductForm((s) => ({ ...s, description: e.target.value }))}
                disabled={!isAdmin}
              />
              <div className="inline-fields">
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder={t.price}
                  value={productForm.price}
                  onChange={(e) => setProductForm((s) => ({ ...s, price: e.target.value }))}
                  disabled={!isAdmin}
                />
                <input
                  type="text"
                  required
                  maxLength={3}
                  placeholder={t.currency}
                  value={productForm.currency}
                  onChange={(e) => setProductForm((s) => ({ ...s, currency: e.target.value.toUpperCase() }))}
                  disabled={!isAdmin}
                />
              </div>
              <div className="inline-fields">
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  placeholder={t.quantity}
                  value={productForm.stockQuantity}
                  onChange={(e) => setProductForm((s) => ({ ...s, stockQuantity: e.target.value }))}
                  disabled={!isAdmin}
                />
                <input
                  type="date"
                  placeholder={t.releaseDate}
                  value={productForm.releaseDate}
                  onChange={(e) => setProductForm((s) => ({ ...s, releaseDate: e.target.value }))}
                  disabled={!isAdmin}
                />
              </div>
              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={productForm.preorder}
                  onChange={(e) => setProductForm((s) => ({ ...s, preorder: e.target.checked }))}
                  disabled={!isAdmin}
                />
                {t.preorder}
              </label>
              <button type="submit" disabled={!isAdmin}>{t.createProduct}</button>
            </form>
          </article>
        </section>

        <section className="section-block utility-grid">
          <article className="panel">
            <h2>{t.newsletterTitle}</h2>
            <p>{t.newsletterText}</p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder={t.email} required />
              <button type="submit">{t.subscribe}</button>
            </form>
          </article>

          <article className="panel">
            <h2>{t.socialTitle}</h2>
            <p>{t.socialSub}</p>
            <div className="social-preview">
              <div>TCG Drop Preview</div>
              <div>Unboxing Reel</div>
              <div>Release Calendar</div>
            </div>
          </article>
        </section>

        <section className="section-block">
          <div className="section-head"><h2>{t.wishlist}</h2></div>
          <div className="wishlist-wrap">
            {wishlistProducts.map((item) => (
              <div key={item.id} className="wishlist-item">
                <span>{item.name}</span>
                <button type="button" className="ghost" onClick={() => removeFromWishlist(item.id)}>
                  {t.remove}
                </button>
              </div>
            ))}
            {!wishlistProducts.length && <p className="empty-state">{t.noProducts}</p>}
          </div>
        </section>
      </main>

      {error && <p className="alert error">{error}</p>}
      {success && <p className="alert success">{success}</p>}

      <footer className="site-footer" id="contact">
        <div>
          <h3>{t.customerService}</h3>
          <a href="#">{t.shipping}</a>
          <a href="#">{t.returns}</a>
          <a href="#">{t.contact}</a>
          <a href="#">FAQ</a>
        </div>
        <div>
          <h3>{t.legal}</h3>
          <a href="#">{t.terms}</a>
          <a href="#">{t.privacy}</a>
          <a href="#">{t.impressum}</a>
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
          <small>API: {API_BASE_URL}</small>
        </div>
      </footer>
    </div>
  )
}

*/
