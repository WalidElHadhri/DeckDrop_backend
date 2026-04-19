import { formatPrice } from '../lib/format'

function CartPage({ t, language, items, total }) {
  return (
    <section className="section-block">
      <div className="section-head">
        <h2>{t.cart}</h2>
      </div>

      <div className="cart-list">
        {items.map((line) => (
          <article key={line.product.id} className="cart-line">
            <div>
              <h3>{line.product.name}</h3>
              <p>
                {t.quantityShort}: {line.quantity}
              </p>
            </div>
            <strong>{formatPrice(line.subtotal, line.product.currency, language)}</strong>
          </article>
        ))}
        {!items.length && <p className="empty-state">{t.noProducts}</p>}
      </div>

      <p className="cart-total">
        {t.total}: <strong>{formatPrice(total, 'EUR', language)}</strong>
      </p>
    </section>
  )
}

export default CartPage
