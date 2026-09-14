import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { t as createServerClient } from "./supabase_Cg_uvX_N.mjs";
//#region src/pages/api/claim.ts
var claim_exports = /* @__PURE__ */ __exportAll({ POST: () => POST });
var POST = async ({ request }) => {
	const body = await request.json().catch(() => null);
	if (!body?.giftId || !body?.claimedBy?.trim()) return new Response(JSON.stringify({ error: "giftId y claimedBy son requeridos" }), {
		status: 400,
		headers: { "Content-Type": "application/json" }
	});
	const supabase = createServerClient();
	const { data: gift } = await supabase.from("gifts").select("claimed_by").eq("id", body.giftId).single();
	if (gift?.claimed_by) return new Response(JSON.stringify({ error: "Este regalo ya fue apartado" }), {
		status: 409,
		headers: { "Content-Type": "application/json" }
	});
	const { data, error } = await supabase.from("gifts").update({
		claimed_by: body.claimedBy.trim(),
		claimed_at: (/* @__PURE__ */ new Date()).toISOString()
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
//#region \0virtual:astro:page:src/pages/api/claim@_@ts
var page = () => claim_exports;
//#endregion
export { page };
