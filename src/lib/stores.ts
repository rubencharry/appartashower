export const STORES = [
  'Home Center',
  'Dollar City',
  'Falabella',
  'Alkosto',
  'Mercado Libre',
] as const;

export type Store = typeof STORES[number];
