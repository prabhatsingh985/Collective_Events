export const COURIER_CONFIG = {
  DEFAULT_VOLUMETRIC_DIVISOR: 5000,
  DELHIVERY_VOLUMETRIC_DIVISOR: 5000,
  BLUEDART_VOLUMETRIC_DIVISOR: 5000,
  SHIPROCKET_SURFACE_DIVISOR: 4750,
  SHIPROCKET_AIR_DIVISOR: 5000,
} as const;

export function calculateWeights(
  lengthCm: number,
  widthCm: number,
  heightCm: number,
  actualWeightGrams: number,
  divisor: number = COURIER_CONFIG.DEFAULT_VOLUMETRIC_DIVISOR
): {
  volumetricWeightGrams: number;
  chargeableWeightGrams: number;
} {
  // Volumetric Weight (kg) = (L * W * H) / divisor
  // Volumetric Weight (g) = ((L * W * H) / divisor) * 1000
  const volumetricKg = (lengthCm * widthCm * heightCm) / divisor;
  const volumetricWeightGrams = Math.round(volumetricKg * 1000);
  const chargeableWeightGrams = Math.max(actualWeightGrams, volumetricWeightGrams);

  return {
    volumetricWeightGrams,
    chargeableWeightGrams,
  };
}
