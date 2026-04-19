function CheckoutPage({ t }) {
  return (
    <section className="section-block utility-grid">
      <article className="panel">
        <h2>{t.checkout}</h2>
        <p>Customer information, shipping, and payment method selection will be completed here.</p>
        <ul>
          <li>DHL shipping method</li>
          <li>PayPal / Klarna / Visa / MasterCard / Bank transfer</li>
          <li>VAT included summary</li>
        </ul>
      </article>
      <article className="panel">
        <h2>Order summary</h2>
        <p>This route is ready for backend checkout integration.</p>
      </article>
    </section>
  )
}

export default CheckoutPage
