import type { Store } from './stores';
import type { Category } from './categories';

export interface Gift {
  id: string;
  code: string;
  name: string;
  category: Category | null;
  location: Store | null;
  price: number;
  quantity: number;
  link: string | null;
  claimed_by: string | null;
  claimed_at: string | null;
  created_at: string;
}
