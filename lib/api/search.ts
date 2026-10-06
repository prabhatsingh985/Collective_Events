import { Product, SearchResults } from '@/types/store'
import { searchStore as searchProducts } from './products'

export async function searchStore(query: string): Promise<SearchResults> {
  const res = await searchProducts(query)
  return {
    products: res.products,
    suggestions: res.suggestions,
    totalHits: res.products.length,
  }
}
