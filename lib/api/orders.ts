import { Order } from '@/types/store'
import { MOCK_ORDERS } from '@/lib/mock-store-data'

const delay = (ms: number = 30) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getOrders(): Promise<Order[]> {
  await delay()
  return [...MOCK_ORDERS]
}

export async function getOrderById(id: string): Promise<Order | null> {
  await delay()
  return MOCK_ORDERS.find((o) => o.id === id) || null
}
