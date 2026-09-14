-- Tabla de regalos del apartashower
create table public.gifts (
  id uuid default gen_random_uuid() primary key,
  code text not null unique,
  name text not null,
  category text check (category in (
    'Cocina', 'Baño', 'Habitación', 'Sala', 'Herramientas',
    'Limpieza', 'Entrada', 'Decoración', 'Electrodomésticos'
  )),
  location text check (location in ('Home Center', 'Dollar City', 'Falabella', 'Alkosto', 'Mercado Libre')),
  price decimal(10,2) not null,
  quantity int not null default 1 check (quantity >= 1),
  link text,
  claimed_by text,
  claimed_at timestamptz,
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.gifts enable row level security;

-- Cualquiera puede leer los regalos
create policy "Anyone can read gifts"
  on public.gifts for select
  to anon, authenticated
  using (true);

-- Si la tabla ya existe, usa este ALTER para añadir la columna:
-- ALTER TABLE public.gifts ADD COLUMN category text check (category in (
--   'Cocina', 'Baño', 'Habitación', 'Sala', 'Herramientas',
--   'Limpieza', 'Entrada', 'Decoración', 'Electrodomésticos'
-- ));

-- Solo el rol de servicio puede modificar (via BFF)
-- No se permiten escrituras directas desde el cliente

-- Habilitar Realtime para actualizaciones en vivo
alter publication supabase_realtime add table public.gifts;

-- Datos de ejemplo
insert into public.gifts (name, location, price, photo_url) values
  ('Juego de sábanas queen', 'Éxito o Liverpool', 180000, null),
  ('Cafetera italiana', 'Falabella', 95000, null),
  ('Set de toallas x6', 'Homecenter', 120000, null),
  ('Lámpara de pie', 'Ikea o Homecenter', 250000, null),
  ('Organizador de closet', 'Ikea', 180000, null),
  ('Set de ollas', 'Juego de 5 ollas antiadherentes', 'Éxito', 320000, null);
