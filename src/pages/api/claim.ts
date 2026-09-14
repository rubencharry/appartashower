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

  const supabase = createServerClient();

  // Verificar que el regalo no esté ya apartado
  const { data: gift } = await supabase
    .from('gifts')
    .select('claimed_by')
    .eq('id', body.giftId)
    .single();

  if (gift?.claimed_by) {
    return new Response(JSON.stringify({ error: 'Este regalo ya fue apartado' }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { data, error } = await supabase
    .from('gifts')
    .update({
      claimed_by: body.claimedBy.trim(),
      claimed_at: new Date().toISOString(),
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
