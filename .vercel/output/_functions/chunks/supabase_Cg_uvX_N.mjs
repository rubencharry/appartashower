import { createClient } from "@supabase/supabase-js";
//#region src/lib/supabase.ts
function createServerClient() {
	return createClient("https://owoehgnzkyysquakmtga.supabase.co", "sb_secret_Nm5UnRPO_EBdP37z2duwPg_9b9N7vnE");
}
//#endregion
export { createServerClient as t };
