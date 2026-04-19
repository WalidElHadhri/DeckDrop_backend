import { useState, useMemo } from 'react'
import ProductCard from '../components/ProductCard'
import { FEATURED_CATEGORIES } from '../lib/content'

function ShopPage({ t, language, products, onAddWishlist, onAddCart }) {
  const [selectedCategory, setSelectedCategory] = useState('')

  const displayedProducts = useMemo(() => {
    if (!selectedCategory) return products
    return products.filter(p => p.category?.name === selectedCategory)
  }, [products, selectedCategory])

  return (
    <section className="section-block">
      <div className="section-head">
        <h2>{t.shop}</h2>
      </div>

      <div className="shop-filters" style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button 
          type="button" 
          className={selectedCategory === '' ? 'active' : 'ghost'} 
          onClick={() => setSelectedCategory('')}
        >
          All
        </button>
        {FEATURED_CATEGORIES.map(cat => (
          <button 
            key={cat}
            type="button" 
            className={selectedCategory === cat ? 'active' : 'ghost'} 
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="product-grid">
        {displayedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            t={t}
            language={language}
            onAddWishlist={onAddWishlist}
            onAddCart={onAddCart}
          />
        ))}
        {!displayedProducts.length && <p className="empty-state">{t.noProducts}</p>}
      </div>
    </section>
  )
}

export default ShopPage
