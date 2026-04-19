import { formatPrice } from '../lib/format'
import { Link } from 'react-router-dom'

function ProductCard({
  product,
  language,
  t,
  onAddWishlist,
  onAddCart,
  showPreorderCta = false,
}) {
  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <div style={{ height: '150px', background: '#ccc', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eee' }}>
              <span>No Image</span>
            </div>
          )}
        </div>
        <span className={`pill ${product.preorder ? 'is-preorder' : 'is-stock'}`}>
          {product.preorder ? t.preorders : t.stock}
        </span>
        <h3>{product.name}</h3>
      </Link>
      <p>{product.description || '—'}</p>
      <p className="price">{formatPrice(product.price, product.currency, language)}</p>
      <p className="meta">
        {t.stock}: {product.stockQuantity}
      </p>
      {product.preorder && (
        <p className="meta">
          {t.releaseDate}: {product.releaseDate || 'TBD'}
        </p>
      )}

      <div className="card-actions">
        <button type="button" className="ghost" onClick={() => onAddWishlist(product.id)}>
          {t.addWishlist}
        </button>
        <button type="button" onClick={() => onAddCart(product.id)}>
          {showPreorderCta ? t.preorderNow : t.addCart}
        </button>
      </div>
    </article>
  )
}

export default ProductCard
