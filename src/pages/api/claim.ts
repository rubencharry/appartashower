import type { APIRoute } from 'astro';
import { createServerClient } from '../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);

  if (!body?.giftId || !body?.claimedBy?.trim()) {
    return new Response(JSON.stringify({ error: 'giftId y claimedBy son requeridos' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const claimQuantity = Math.max(1, parseInt(body.claimQuantity ?? '1', 10) || 1);

  const supabase = createServerClient();

  const { data: gift } = await supabase
    .from('gifts')
    .select('quantity, claimed_quantity')
    .eq('id', body.giftId)
    .single();

  const currentClaimed = gift?.claimed_quantity ?? 0;
  const available = (gift?.quantity ?? 0) - currentClaimed;

  if (available <= 0) {
    return new Response(JSON.stringify({ error: 'Este regalo ya fue apartado' }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (claimQuantity > available) {
    return new Response(JSON.stringify({ error: `Solo quedan ${available} unidades disponibles` }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { data, error } = await supabase
    .from('gifts')
    .update({
      claimed_by: body.claimedBy.trim(),
      claimed_at: new Date().toISOString(),
      claimed_quantity: currentClaimed + claimQuantity,
    })
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
