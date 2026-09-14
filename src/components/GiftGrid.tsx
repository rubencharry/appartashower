import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { STORES } from '../lib/stores';
import type { Gift } from '../lib/types';
import type { Store } from '../lib/stores';
import GiftCard from './GiftCard';

interface Props {
  initialGifts: Gift[];
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export default function GiftGrid({ initialGifts, supabaseUrl, supabaseAnonKey }: Props) {
  const [gifts, setGifts] = useState<Gift[]>(initialGifts);
  const [activeStore, setActiveStore] = useState<Store | null>(null);

  // Fallback: si el SSR llegó vacío, buscar desde el cliente
  useEffect(() => {
    if (initialGifts.length === 0) {
      fetch('/api/gifts')
        .then((r) => r.json())
        .then((data) => { if (Array.isArray(data)) setGifts(data); })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const channel = supabase
      .channel('gifts-realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'gifts' },
        (payload) => {
          setGifts((prev) =>
            prev.map((g) => (g.id === payload.new.id ? (payload.new as Gift) : g))
          );
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [supabaseUrl, supabaseAnonKey]);

  function handleUpdate(updated: Gift) {
    setGifts((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
  }

  const visible = activeStore ? gifts.filter((g) => g.location === activeStore) : gifts;
  const available = gifts.filter((g) => !g.claimed_by).length;

  return (
    <div>
      <div className="gift-stats">
        <span className="gift-stats__pill gift-stats__pill--available">
          {available} disponibles
        </span>
        <span className="gift-stats__pill gift-stats__pill--claimed">
          {gifts.length - available} apartados
        </span>
      </div>

      <div className="store-filter">
        <button
          className={`store-filter__chip ${activeStore === null ? 'store-filter__chip--active' : ''}`}
          onClick={() => setActiveStore(null)}
        >
          Todos
        </button>
        {STORES.map((store) => (
          <button
            key={store}
            className={`store-filter__chip ${activeStore === store ? 'store-filter__chip--active' : ''}`}
            onClick={() => setActiveStore(activeStore === store ? null : store)}
          >
            {store}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="gift-empty">No hay regalos en este almacén todavía.</p>
      ) : (
        <div className="gift-grid">
          {visible.map((gift) => (
            <GiftCard key={gift.id} gift={gift} onUpdate={handleUpdate} />
          ))}
        </div>
      )}
    </div>
  );
}
