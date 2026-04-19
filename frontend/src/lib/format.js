export function formatPrice(value, currency = 'EUR', language = 'en') {
  const locale = language === 'de' ? 'de-DE' : 'en-US'
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0))
}
