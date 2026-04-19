function StaticPage({ title, subtitle }) {
  return (
    <section className="section-block">
      <div className="section-head">
        <h2>{title}</h2>
      </div>
      <p className="static-subtitle">{subtitle}</p>
      <p>
        This page is routed and ready. We can now plug dedicated content and backend data according to the full
        specification.
      </p>
    </section>
  )
}

export default StaticPage
