import { Link } from 'react-router-dom'
import { FEATURED_CATEGORIES } from '../lib/content'
import ProductCard from '../components/ProductCard'

function HomePage({
  t,
  language,
  products,
  hotProducts,
  newArrivals,
  preorderProducts,
  recommendedProducts,
  onAddWishlist,
  onAddCart,
  onCategorySelect,
}) {
  return (
    <>
      <section className="hero-section">
        <div className="hero-text">
          <p className="eyebrow">AR - DECKDROP.de</p>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroText}</p>
          <div className="hero-actions">
            <Link to="/shop" className="cta">{t.shopNow}</Link>
            <Link to="/shop?tab=preorders" className="cta ghost">{t.viewPreorders}</Link>
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
            <button
              key={category}
              type="button"
              className="category-card"
              onClick={() => onCategorySelect(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-head"><h2>{t.hotProducts}</h2></div>
        <div className="product-grid">
          {(hotProducts.length ? hotProducts : products).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              t={t}
              language={language}
              onAddWishlist={onAddWishlist}
              onAddCart={onAddCart}
            />
          ))}
          {!products.length && <p className="empty-state">{t.noProducts}</p>}
        </div>
      </section>

      <section className="section-block">
        <div className="section-head"><h2>{t.newArrivals}</h2></div>
        <div className="product-grid">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              t={t}
              language={language}
              onAddWishlist={onAddWishlist}
              onAddCart={onAddCart}
            />
          ))}
          {!newArrivals.length && <p className="empty-state">{t.noProducts}</p>}
        </div>
      </section>

      <section className="section-block">
        <div className="section-head"><h2>{t.preorders}</h2></div>
        <div className="product-grid">
          {preorderProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              t={t}
              language={language}
              onAddWishlist={onAddWishlist}
              onAddCart={onAddCart}
              showPreorderCta
            />
          ))}
          {!preorderProducts.length && <p className="empty-state">{t.noProducts}</p>}
        </div>
      </section>

      <section className="section-block">
        <div className="section-head"><h2>{t.recommended}</h2></div>
        <div className="product-grid">
          {recommendedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              t={t}
              language={language}
              onAddWishlist={onAddWishlist}
              onAddCart={onAddCart}
            />
          ))}
          {!recommendedProducts.length && <p className="empty-state">{t.noProducts}</p>}
        </div>
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
    </>
  )
}

export default HomePage
