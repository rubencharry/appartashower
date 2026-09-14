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

  const { data, error } = await supabase
    .from('gifts')
    .update({ claimed_by: null, claimed_at: null })
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
