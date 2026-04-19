import { useParams, Link } from 'react-router-dom'
import { formatPrice } from '../lib/format'
import { useState, useEffect } from 'react'

function ProductDetailsPage({ t, language, products, onAddWishlist, onAddCart }) {
  const { id } = useParams()
  const product = products.find(p => p.id === Number(id))
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  // Reset image index when navigating to a different product
  useEffect(() => {
    setCurrentImageIndex(0)
  }, [id])

  if (!product) {
    return (
      <section className="section-block utility-grid" style={{ placeContent: 'center', textAlign: 'center' }}>
        <article className="panel">
          <h2>Product Not Found</h2>
          <p>The product you are looking for does not exist or has been removed.</p>
          <Link to="/shop" className="cta">Return to Shop</Link>
        </article>
      </section>
    )
  }

  return (
    <section className="section-block">
      <div className="product-details-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Side: Images Gallery */}
        <div className="product-gallery" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {product.images && product.images.length > 0 ? (
             <div style={{ background: '#f5f5f5', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
               {product.images.length > 1 && (
                 <button 
                   onClick={() => setCurrentImageIndex(prev => prev === 0 ? product.images.length - 1 : prev - 1)} 
                   style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', zIndex: 1, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                 >
                   {"<"}
                 </button>
               )}
               <img 
                 src={product.images[currentImageIndex] || product.images[0]} 
                 alt={product.name} 
                 style={{ width: '100%', display: 'block', objectFit: 'contain', maxHeight: '500px', transition: 'opacity 0.3s ease-in-out' }} 
               />
               {product.images.length > 1 && (
                 <button 
                   onClick={() => setCurrentImageIndex(prev => prev === product.images.length - 1 ? 0 : prev + 1)} 
                   style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: 40, height: 40, cursor: 'pointer', zIndex: 1, fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                 >
                   {">"}
                 </button>
               )}
             </div>
          ) : (
             <div style={{ background: '#ddd', borderRadius: '8px', height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               No Image Available
             </div>
          )}

          {/* Thumbnails if multiple images exist */}
          {product.images && product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {product.images.map((img, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setCurrentImageIndex(idx)}
                  style={{ 
                    width: '80px', 
                    height: '80px', 
                    background: '#eee', 
                    borderRadius: '4px', 
                    overflow: 'hidden', 
                    cursor: 'pointer',
                    border: currentImageIndex === idx ? '2px solid #000' : '2px solid transparent',
                    opacity: currentImageIndex === idx ? 1 : 0.6,
                    transition: 'all 0.2s'
                  }}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Details & Actions */}
        <div className="product-info-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div>
            <span className={`pill ${product.preorder ? 'is-preorder' : 'is-stock'}`}>
              {product.preorder ? t.preorders : t.stock}
            </span>
            {product.category && (
               <span className="pill ghost" style={{ marginLeft: '10px' }}>{product.category.name}</span>
            )}
            {product.subcategory && (
               <span className="pill ghost" style={{ marginLeft: '5px' }}>{product.subcategory.name}</span>
            )}
          </div>

          <h1 style={{ margin: 0, fontSize: '2.5rem' }}>{product.name}</h1>
          <p className="price" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{formatPrice(product.price, product.currency, language)}</p>
          
          <div style={{ borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '1rem 0' }}>
            <p style={{ margin: 0 }}><strong>{t.stock}:</strong> {product.stockQuantity > 0 ? product.stockQuantity : <span style={{ color: 'red' }}>Sold Out</span>}</p>
            {product.preorder && (
              <p style={{ margin: '0.5rem 0 0 0' }}><strong>{t.releaseDate}:</strong> {product.releaseDate || 'TBD'}</p>
            )}
          </div>

          <div style={{ lineHeight: '1.6' }}>
            <strong>{t.description}:</strong>
            <p style={{ whiteSpace: 'pre-wrap' }}>{product.description || 'No description provided.'}</p>
          </div>

          <div className="card-actions" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
               type="button" 
               className="cta" 
               style={{ flex: 1, padding: '1rem' }} 
               onClick={() => onAddCart(product.id)}
               disabled={product.stockQuantity <= 0 && !product.preorder}
            >
              {product.preorder ? t.preorderNow : t.addCart}
            </button>
            <button 
               type="button" 
               className="ghost" 
               style={{ padding: '1rem' }} 
               onClick={() => onAddWishlist(product.id)}
            >
              {t.addWishlist}
            </button>
          </div>
          
        </div>
      </div>
    </section>
  )
}

export default ProductDetailsPage