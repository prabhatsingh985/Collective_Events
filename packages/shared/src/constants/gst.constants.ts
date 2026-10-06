export const TOY_HSN_CODES = {
  GENERAL_TOYS: '950300',
  PUZZLES: '95030030',
  PLASTIC_TOYS: '95030010',
  WOODEN_TOYS: '95030020',
  ELECTRONIC_TOYS: '95030090',
  BOARD_GAMES: '95049090',
} as const;

export const GST_RATES = {
  STANDARD_TOY: 18.0,
  REDUCED_WOODEN_HANDICRAFT: 12.0,
  EXEMPT: 0.0,
} as const;

export interface GstBreakup {
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  totalWithTax: number;
}

export function calculateGstBreakup(
  price: number,
  gstPercent: number,
  isInterState: boolean
): GstBreakup {
  const taxableAmount = Math.round(price * 100) / 100;
  const totalTax = Math.round(((taxableAmount * gstPercent) / 100) * 100) / 100;
  
  if (isInterState) {
    return {
      taxableAmount,
      cgst: 0,
      sgst: 0,
      igst: totalTax,
      totalTax,
      totalWithTax: Math.round((taxableAmount + totalTax) * 100) / 100,
    };
  }

  const halfTax = Math.round((totalTax / 2) * 100) / 100;
  return {
    taxableAmount,
    cgst: halfTax,
    sgst: Math.round((totalTax - halfTax) * 100) / 100,
    igst: 0,
    totalTax,
    totalWithTax: Math.round((taxableAmount + totalTax) * 100) / 100,
  };
}
