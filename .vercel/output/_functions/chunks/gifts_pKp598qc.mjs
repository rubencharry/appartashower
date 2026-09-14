import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { t as createServerClient } from "./supabase_Cg_uvX_N.mjs";
//#region src/pages/api/gifts.ts
var gifts_exports = /* @__PURE__ */ __exportAll({ GET: () => GET });
var GET = async () => {
	const { data, error } = await createServerClient().from("gifts").select("*").order("created_at", { ascending: true });
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
//#region \0virtual:astro:page:src/pages/api/gifts@_@ts
var page = () => gifts_exports;
//#endregion
export { page };
