const DIACRITICS = /[\u0300-\u036f]/g

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(DIACRITICS, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function normalizeProduct(raw, index) {
  const base = slugify(`${raw.category}-${raw.model}-${raw.configuration}`)
  return {
    id: `${base || 'product'}-${index}`,
    category: raw.category,
    model: raw.model,
    configuration: raw.configuration,
    priceUSD: raw.price_us_usd,
    priceEUR: raw.price_eu_eur,
  }
}

// The catalog is a { currency_reference, products: [...] } object (see products.json),
// not a flat array — each product already carries its real US and EU market price
// (no FX conversion applied), so getPriceForCurrency below just picks the right field.
export function normalizeCatalog(raw) {
  return (raw?.products ?? []).map(normalizeProduct)
}

export function getCategories(products) {
  return Array.from(new Set(products.map((product) => product.category)))
}

export function getPriceForCurrency(product, currency) {
  return currency === 'EUR' ? product.priceEUR : product.priceUSD
}

export function filterProducts(products, { search = '', category = 'all' } = {}) {
  const query = search.trim().toLowerCase()
  return products.filter((product) => {
    if (category !== 'all' && product.category !== category) return false
    if (!query) return true
    return (
      product.model.toLowerCase().includes(query) ||
      product.configuration.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    )
  })
}

export function groupByCategory(products) {
  const order = []
  const groups = new Map()
  for (const product of products) {
    if (!groups.has(product.category)) {
      groups.set(product.category, [])
      order.push(product.category)
    }
    groups.get(product.category).push(product)
  }
  return order.map((category) => ({ category, items: groups.get(category) }))
}
