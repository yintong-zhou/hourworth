import { describe, expect, it } from 'vitest'
import {
  filterProducts,
  getCategories,
  getPriceForCurrency,
  groupByCategory,
  normalizeCatalog,
} from './products'

const RAW_CATALOG = {
  currency_reference: { us: 'USD', eu: 'EUR' },
  products: [
    {
      category: 'Dispensa',
      model: 'Caffè macinato',
      configuration: '250 g miscela classica',
      price_us_usd: 4.5,
      price_eu_eur: 3.8,
    },
    {
      category: 'Smartphones',
      model: 'iPhone 16',
      configuration: '128 GB',
      price_us_usd: 799,
      price_eu_eur: 949,
    },
    {
      category: 'Smartphones',
      model: 'iPhone 16 Pro',
      configuration: '128 GB',
      price_us_usd: 999,
      price_eu_eur: 1199,
    },
  ],
}

describe('normalizeCatalog', () => {
  it('maps each raw product to a normalized shape with a stable, unique, accent-free id', () => {
    const products = normalizeCatalog(RAW_CATALOG)
    expect(products).toHaveLength(3)
    expect(products[0]).toEqual({
      id: 'dispensa-caffe-macinato-250-g-miscela-classica-0',
      category: 'Dispensa',
      model: 'Caffè macinato',
      configuration: '250 g miscela classica',
      priceUSD: 4.5,
      priceEUR: 3.8,
    })
    const ids = products.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('returns an empty array for a missing or malformed catalog', () => {
    expect(normalizeCatalog(null)).toEqual([])
    expect(normalizeCatalog({})).toEqual([])
  })
})

describe('getCategories', () => {
  it('returns the unique categories in first-seen order', () => {
    const products = normalizeCatalog(RAW_CATALOG)
    expect(getCategories(products)).toEqual(['Dispensa', 'Smartphones'])
  })
})

describe('getPriceForCurrency', () => {
  it('picks the real regional price instead of converting via a fixed rate', () => {
    const [, iphone] = normalizeCatalog(RAW_CATALOG)
    expect(getPriceForCurrency(iphone, 'USD')).toBe(799)
    expect(getPriceForCurrency(iphone, 'EUR')).toBe(949)
  })
})

describe('filterProducts', () => {
  const products = normalizeCatalog(RAW_CATALOG)

  it('returns everything with no filters', () => {
    expect(filterProducts(products)).toHaveLength(3)
  })

  it('filters by category', () => {
    const result = filterProducts(products, { category: 'Smartphones' })
    expect(result).toHaveLength(2)
    expect(result.every((p) => p.category === 'Smartphones')).toBe(true)
  })

  it('filters by a case-insensitive search on model', () => {
    const result = filterProducts(products, { search: 'pro' })
    expect(result).toHaveLength(1)
    expect(result[0].model).toBe('iPhone 16 Pro')
  })

  it('combines category and search filters', () => {
    const result = filterProducts(products, { search: 'caffè', category: 'Smartphones' })
    expect(result).toHaveLength(0)
  })
})

describe('groupByCategory', () => {
  it('groups products, preserving first-seen category order', () => {
    const products = normalizeCatalog(RAW_CATALOG)
    const groups = groupByCategory(products)
    expect(groups.map((g) => g.category)).toEqual(['Dispensa', 'Smartphones'])
    expect(groups[1].items).toHaveLength(2)
  })
})
