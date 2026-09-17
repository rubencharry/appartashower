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
  'Navidad',
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
  'Navidad':          '🎄',
};

export const CATEGORY_CLASS: Record<Category, string> = {
  'Cocina':           'cat-cocina',
  'Baño':             'cat-bano',
  'Habitación':       'cat-habitacion',
  'Sala':             'cat-sala',
  'Herramientas':     'cat-herramientas',
  'Limpieza':         'cat-limpieza',
  'Entrada':          'cat-entrada',
  'Decoración':       'cat-decoracion',
  'Electrodomésticos':'cat-electrodomesticos',
  'Navidad':          'cat-navidad',
};
