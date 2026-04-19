import ProductCard from '../components/ProductCard'

function WishlistPage({ t, language, products, onAddWishlist, onAddCart }) {
  return (
    <section className="section-block">
      <div className="section-head">
        <h2>{t.wishlist}</h2>
      </div>
      <div className="product-grid">
        {products.map((product) => (
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
  )
}

export default WishlistPage
