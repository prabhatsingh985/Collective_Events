import { Drop } from '@/types/store'
import { MOCK_DROPS, ALL_PRODUCTS } from '@/lib/mock-store-data'
import { Product } from '@/types/store'

const delay = (ms: number = 25) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getDrops(): Promise<Drop[]> {
  await delay()
  return [...MOCK_DROPS]
}

export async function getActiveDrop(): Promise<Drop | null> {
  await delay()
  return MOCK_DROPS.find((d) => d.status === 'live') || MOCK_DROPS[0] || null
}

export async function getUpcomingDrops(): Promise<Drop[]> {
  await delay()
  return MOCK_DROPS.filter((d) => d.status === 'upcoming')
}

export async function getDropBySlug(slug: string): Promise<Drop | null> {
  await delay()
  return MOCK_DROPS.find((d) => d.slug === slug) || null
}

export async function getDropItems(drop: Drop): Promise<Product[]> {
  await delay()
  return ALL_PRODUCTS.filter((p) => drop.itemIds.includes(p.id))
}
