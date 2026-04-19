import { useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import SiteHeader from './components/SiteHeader'
import SiteFooter from './components/SiteFooter'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import WishlistPage from './pages/WishlistPage'
import CartPage from './pages/CartPage'
import AccountPage from './pages/AccountPage'
import AdminPage from './pages/AdminPage'
import CheckoutPage from './pages/CheckoutPage'
import StaticPage from './pages/StaticPage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import { API_BASE_URL, apiRequest, clearStoredAuth, getStoredAuth, persistAuth } from './lib/api'
import { content } from './lib/content'

function AppRoutes() {
  const navigate = useNavigate()

  const [language, setLanguage] = useState('en')
  const [auth, setAuth] = useState(getStoredAuth)
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [wishlist, setWishlist] = useState([])
  const [cart, setCart] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loadingProducts, setLoadingProducts] = useState(false)

  const [registerForm, setRegisterForm] = useState({ 
    email: '', 
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: ''
  })
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'EUR',
    preorder: false,
    releaseDate: '',
    stockQuantity: '',
    category: 'Pokémon TCG',
    subcategory: '',
    imageUrl: '',
  })

  const isAdmin = auth.role === 'ADMIN'
  const t = content[language]

  const filteredProducts = useMemo(() => {
    const q = searchTerm.trim().toLowerCase()
    if (!q) {
      return products
    }
    return products.filter((item) => {
      const catName = item.category?.name ?? ''
      const subcatName = item.subcategory?.name ?? ''
      const haystack = `${item.name ?? ''} ${item.description ?? ''} ${catName} ${subcatName}`.toLowerCase()
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

  const wishlistProducts = useMemo(
    () => products.filter((item) => wishlist.includes(item.id)),
    [products, wishlist],
  )

  const cartLines = useMemo(() => {
    const qtyById = cart.reduce((acc, productId) => {
      acc[productId] = (acc[productId] ?? 0) + 1
      return acc
    }, {})

    return Object.entries(qtyById)
      .map(([id, quantity]) => {
        const product = products.find((p) => p.id === Number(id))
        if (!product) {
          return null
        }
        return {
          product,
          quantity,
          subtotal: Number(product.price ?? 0) * quantity,
        }
      })
      .filter(Boolean)
  }, [cart, products])

  const cartTotal = useMemo(() => cartLines.reduce((sum, line) => sum + line.subtotal, 0), [cartLines])

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

  function storeAuth(nextAuth) {
    persistAuth(nextAuth)
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

      storeAuth({ token: data.token, email: data.email, role: data.role, lastName: data.lastName })
      setSuccess(`Registered successfully as ${data.role}.`)
      setRegisterForm({ email: '', password: '', firstName: '', lastName: '', phoneNumber: '', address: '' })
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

      storeAuth({ token: data.token, email: data.email, role: data.role, lastName: data.lastName })
      setSuccess(`Welcome back ${data.email}.`)
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
        category: productForm.category,
        subcategory: productForm.subcategory || null,
        imageUrl: productForm.imageUrl || null,
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
        category: 'Pokémon TCG',
        subcategory: '',
        imageUrl: '',
      })
      await loadProducts()
    } catch (err) {
      setError(err.message)
    }
  }

  function handleLogout() {
    clearStoredAuth()
    setAuth({ token: '', email: '', role: '', lastName: '' })
    setSuccess('Logged out successfully.')
  }

  function toggleLanguage() {
    setLanguage((prev) => (prev === 'en' ? 'de' : 'en'))
  }

  function handleCategorySelect(category) {
    setSearchTerm(category)
    navigate('/shop')
  }

  function addToWishlist(productId) {
    setWishlist((prev) => (prev.includes(productId) ? prev : [...prev, productId]))
  }

  function addToCart(productId) {
    setCart((prev) => [...prev, productId])
  }

  return (
    <div className="site-shell">
      <SiteHeader
        t={t}
        language={language}
        onToggleLanguage={toggleLanguage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        wishlistCount={wishlist.length}
        cartCount={cart.length}
        isAdmin={isAdmin}
        auth={auth}
        onCategorySelect={handleCategorySelect}
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                t={t}
                language={language}
                products={filteredProducts}
                hotProducts={hotProducts}
                newArrivals={newArrivals}
                preorderProducts={preorderProducts}
                recommendedProducts={recommendedProducts}
                onAddWishlist={addToWishlist}
                onAddCart={addToCart}
                onCategorySelect={handleCategorySelect}
              />
            }
          />
          <Route
            path="/shop"
            element={
              <ShopPage
                t={t}
                language={language}
                products={filteredProducts}
                onAddWishlist={addToWishlist}
                onAddCart={addToCart}
              />
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProductDetailsPage
                t={t}
                language={language}
                products={products}
                onAddWishlist={addToWishlist}
                onAddCart={addToCart}
              />
            }
          />
          <Route
            path="/wishlist"
            element={
              <WishlistPage
                t={t}
                language={language}
                products={wishlistProducts}
                onAddWishlist={addToWishlist}
                onAddCart={addToCart}
              />
            }
          />
          <Route path="/cart" element={<CartPage t={t} language={language} items={cartLines} total={cartTotal} />} />
          <Route
            path="/admin"
            element={
              <AdminPage
                t={t}
                isAdmin={isAdmin}
                auth={auth}
                onProductsReload={loadProducts}
              />
            }
          />
          <Route
            path="/account"
            element={
              <AccountPage
                t={t}
                auth={auth}
                registerForm={registerForm}
                setRegisterForm={setRegisterForm}
                loginForm={loginForm}
                setLoginForm={setLoginForm}
                onRegister={handleRegister}
                onLogin={handleLogin}
                onLogout={handleLogout}
              />
            }
          />
          <Route path="/checkout" element={<CheckoutPage t={t} />} />
          <Route path="/blog" element={<StaticPage title={t.blog} subtitle="Upcoming releases and preorder announcements." />} />
          <Route path="/about" element={<StaticPage title={t.about} subtitle="AR - DECKDROP brand story and quality promise." />} />
          <Route path="/contact" element={<StaticPage title={t.contact} subtitle="Reach support and find service information." />} />
          <Route path="/shipping" element={<StaticPage title={t.shipping} subtitle="Shipping zones and estimated delivery details." />} />
          <Route path="/returns" element={<StaticPage title={t.returns} subtitle="Returns process and refund conditions." />} />
          <Route path="/terms" element={<StaticPage title={t.terms} subtitle="General terms and purchase conditions." />} />
          <Route path="/privacy" element={<StaticPage title={t.privacy} subtitle="GDPR privacy and data processing details." />} />
          <Route path="/impressum" element={<StaticPage title={t.impressum} subtitle="Legal information required for Germany." />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {loadingProducts && <p className="alert success">Loading products…</p>}
      {error && <p className="alert error">{error}</p>}
      {success && <p className="alert success">{success}</p>}

      <SiteFooter t={t} apiBaseUrl={API_BASE_URL} />
    </div>
  )
}

export default AppRoutes
