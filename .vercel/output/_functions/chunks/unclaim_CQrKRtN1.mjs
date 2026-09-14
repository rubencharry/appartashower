import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { t as createServerClient } from "./supabase_Cg_uvX_N.mjs";
//#region src/pages/api/unclaim.ts
var unclaim_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async ({ request }) => {
	const body = await request.json().catch(() => null);
	if (!body?.giftId) return new Response(JSON.stringify({ error: "giftId es requerido" }), {
		status: 400,
		headers: { "Content-Type": "application/json" }
	});
	const { data, error } = await createServerClient().from("gifts").update({
		claimed_by: null,
		claimed_at: null
	}).eq("id", body.giftId).select().single();
	if (error) return new Response(JSON.stringify({ error: error.message }), {
		status: 500,
		headers: { "Content-Type": "application/json" }
	});
	return new Response(JSON.stringify(data), {
		status: 200,
		headers: { "Content-Type": "application/json" }
	});
};
//#endregion
//#region \0virtual:astro:page:src/pages/api/unclaim@_@ts
var page = () => unclaim_exports;
//#endregion
export { page };
