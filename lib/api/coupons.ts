import { Coupon } from '@/types/store'
import { MOCK_COUPONS } from '@/lib/mock-store-data'

const delay = (ms: number = 20) => new Promise((resolve) => setTimeout(resolve, ms))

export async function validateCoupon(
  code: string,
  subtotal: number
): Promise<{ valid: boolean; coupon?: Coupon; discount: number; error?: string }> {
  await delay()
  const cleanCode = code.trim().toUpperCase()
  const coupon = MOCK_COUPONS.find((c) => c.code === cleanCode)

  if (!coupon) {
    return { valid: false, discount: 0, error: 'Invalid coupon code. Try COLLECTOR10 or MINT200' }
  }

  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    return {
      valid: false,
      discount: 0,
      error: `Coupon applies only to orders above ₹${coupon.minOrderValue.toLocaleString('en-IN')}`,
    }
  }

  let discount = 0
  if (coupon.type === 'percent') {
    discount = Math.round((subtotal * coupon.value) / 100)
  } else {
    discount = coupon.value
  }

  return { valid: true, coupon, discount }
}
