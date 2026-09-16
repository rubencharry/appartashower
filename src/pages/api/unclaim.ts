import type { APIRoute } from 'astro';
import { createServerClient } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);

  if (!body?.giftId) {
    return new Response(JSON.stringify({ error: 'giftId es requerido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabase = createServerClient();

  const { data: gift } = await supabase
    .from('gifts')
    .select('claimed_quantity')
    .eq('id', body.giftId)
    .single();

  const currentClaimed = gift?.claimed_quantity ?? 0;
  const cancelQuantity = Math.min(
    currentClaimed,
    Math.max(1, parseInt(body.cancelQuantity ?? String(currentClaimed), 10) || currentClaimed)
  );
  const newClaimed = Math.max(0, currentClaimed - cancelQuantity);

  const update =
    newClaimed <= 0
      ? { claimed_quantity: 0, claimed_by: null, claimed_at: null }
      : { claimed_quantity: newClaimed };

  const { data, error } = await supabase
    .from('gifts')
    .update(update)
    .eq('id', body.giftId)
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
