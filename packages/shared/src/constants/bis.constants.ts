export const BIS_STANDARDS = {
  MECHANICAL_PHYSICAL: 'IS 9873 (Part 1): Safety aspects related to mechanical and physical properties',
  FLAMMABILITY: 'IS 9873 (Part 2): Flammability',
  MIGRATION_OF_ELEMENTS: 'IS 9873 (Part 3): Migration of certain elements (Heavy metals test)',
  ELECTRIC_TOYS: 'IS 15644: Safety of electric toys',
} as const;

export const TOY_AGE_GROUPS = [
  '0-6 Months',
  '6-12 Months',
  '1-3 Years',
  '3-6 Years',
  '6-8 Years',
  '8-12 Years',
  '12+ Years',
] as const;

export type ToyAgeGroup = (typeof TOY_AGE_GROUPS)[number];
