export const CATEGORIES = [
  'Cocina',
  'Baño',
  'Habitación',
  'Sala',
  'Herramientas',
  'Limpieza',
  'Entrada',
  'Decoración',
  'Electrodomésticos',
] as const;

export type Category = typeof CATEGORIES[number];

export const CATEGORY_EMOJI: Record<Category, string> = {
  'Cocina':           '🍳',
  'Baño':             '🛁',
  'Habitación':       '🛏️',
  'Sala':             '🛋️',
  'Herramientas':     '🔧',
  'Limpieza':         '🧹',
  'Entrada':          '🚪',
  'Decoración':       '🖼️',
  'Electrodomésticos':'⚡',
};
