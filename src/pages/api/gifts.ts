import type { APIRoute } from 'astro';
import { createServerClient } from '../../lib/supabase';

export const GET: APIRoute = async () => {
  const supabase = createServerClient();

  const { data, error } = await supabase
    .from('gifts')
    .select('*')
    .order('created_at', { ascending: true });

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
