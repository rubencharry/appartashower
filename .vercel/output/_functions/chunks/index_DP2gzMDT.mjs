import { t as __exportAll } from "./rolldown-runtime_D7D4PA-g.mjs";
import { d as renderHead, i as renderComponent, l as renderTemplate } from "./server_DzBc2ZSr.mjs";
import { t as createComponent } from "./compiler_BbkADcOY.mjs";
import { t as createServerClient } from "./supabase_Cg_uvX_N.mjs";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Fragment as Fragment$1, jsx, jsxs } from "react/jsx-runtime";
//#region src/lib/stores.ts
var STORES = [
	"Home Center",
	"Dollar City",
	"Falabella",
	"Alkosto",
	"Mercado Libre"
];
//#endregion
//#region src/lib/categories.ts
var CATEGORY_EMOJI = {
	"Cocina": "🍳",
	"Baño": "🛁",
	"Habitación": "🛏️",
	"Sala": "🛋️",
	"Herramientas": "🔧",
	"Limpieza": "🧹",
	"Entrada": "🚪",
	"Decoración": "🖼️",
	"Electrodomésticos": "⚡"
};
//#endregion
//#region src/components/ClaimModal.tsx
function ClaimModal({ gift, onClose, onClaimed }) {
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	async function handleSubmit(e) {
		e.preventDefault();
		if (!name.trim()) return;
		setLoading(true);
		setError("");
		try {
			const res = await fetch("/api/claim", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					giftId: gift.id,
					claimedBy: name
				})
			});
			const data = await res.json();
			if (!res.ok) {
				setError(data.error ?? "Ocurrió un error. Intenta de nuevo.");
				return;
			}
			onClaimed(data);
		} catch {
			setError("No se pudo conectar. Verifica tu conexión.");
		} finally {
			setLoading(false);
		}
	}
	return /* @__PURE__ */ jsx("div", {
		className: "modal-backdrop",
		onClick: onClose,
		children: /* @__PURE__ */ jsxs("div", {
			className: "modal-box",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ jsx("button", {
					className: "modal-close",
					onClick: onClose,
					"aria-label": "Cerrar",
					children: "✕"
				}),
				/* @__PURE__ */ jsx("div", {
					className: "modal-icon",
					children: "🎁"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "modal-title",
					children: "¡Qué detalle tan bonito!"
				}),
				/* @__PURE__ */ jsxs("p", {
					className: "modal-subtitle",
					children: ["Vas a apartar ", /* @__PURE__ */ jsx("strong", { children: gift.name })]
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: handleSubmit,
					className: "modal-form",
					children: [
						/* @__PURE__ */ jsx("label", {
							htmlFor: "claim-name",
							className: "modal-label",
							children: "¿Cuál es tu nombre?"
						}),
						/* @__PURE__ */ jsx("input", {
							id: "claim-name",
							type: "text",
							value: name,
							onChange: (e) => setName(e.target.value),
							placeholder: "Tu nombre",
							className: "modal-input",
							maxLength: 60,
							required: true,
							autoFocus: true
						}),
						error && /* @__PURE__ */ jsx("p", {
							className: "modal-error",
							children: error
						}),
						/* @__PURE__ */ jsx("button", {
							type: "submit",
							disabled: loading || !name.trim(),
							className: "modal-btn",
							children: loading ? "Guardando..." : "Apartar regalo"
						})
					]
				})
			]
		})
	});
}
//#endregion
//#region src/components/GiftCard.tsx
function formatPrice(price) {
	return new Intl.NumberFormat("es-CO", {
		style: "currency",
		currency: "COP",
		maximumFractionDigits: 0
	}).format(price);
}
function GiftImage({ gift }) {
	const [errored, setErrored] = useState(false);
	const emoji = gift.category ? CATEGORY_EMOJI[gift.category] : "🎁";
	if (errored) return /* @__PURE__ */ jsx("div", {
		className: "gift-card__image-placeholder",
		children: /* @__PURE__ */ jsx("span", { children: emoji })
	});
	return /* @__PURE__ */ jsx("img", {
		src: `/img/${gift.code}.png`,
		alt: gift.name,
		className: "gift-card__image",
		loading: "lazy",
		onError: () => setErrored(true)
	});
}
function GiftCard({ gift, onUpdate }) {
	const [showModal, setShowModal] = useState(false);
	const [unclaiming, setUnclaiming] = useState(false);
	const isClaimed = Boolean(gift.claimed_by);
	const emoji = gift.category ? CATEGORY_EMOJI[gift.category] : null;
	async function handleUnclaim() {
		setUnclaiming(true);
		try {
			const res = await fetch("/api/unclaim", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ giftId: gift.id })
			});
			if (res.ok) onUpdate(await res.json());
		} finally {
			setUnclaiming(false);
		}
	}
	const imageWrap = /* @__PURE__ */ jsxs("div", {
		className: "gift-card__image-wrap",
		children: [
			/* @__PURE__ */ jsx(GiftImage, { gift }),
			gift.link && /* @__PURE__ */ jsxs("div", {
				className: "gift-card__link-overlay",
				children: [/* @__PURE__ */ jsx("span", {
					className: "gift-card__link-icon",
					children: "↗"
				}), /* @__PURE__ */ jsx("span", { children: "Ver referencia" })]
			}),
			isClaimed ? /* @__PURE__ */ jsxs("div", {
				className: "gift-card__badge gift-card__badge--claimed",
				children: [/* @__PURE__ */ jsx("span", { children: "✓" }), /* @__PURE__ */ jsx("span", { children: "Apartado" })]
			}) : /* @__PURE__ */ jsx("div", {
				className: "gift-card__badge gift-card__badge--available",
				children: /* @__PURE__ */ jsx("span", { children: "Disponible" })
			})
		]
	});
	return /* @__PURE__ */ jsxs(Fragment$1, { children: [/* @__PURE__ */ jsxs("div", {
		className: `gift-card ${isClaimed ? "gift-card--claimed" : ""}`,
		children: [gift.link ? /* @__PURE__ */ jsx("a", {
			href: gift.link,
			target: "_blank",
			rel: "noopener noreferrer",
			className: "gift-card__image-link",
			children: imageWrap
		}) : imageWrap, /* @__PURE__ */ jsxs("div", {
			className: "gift-card__body",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "gift-card__meta",
					children: [emoji && gift.category && /* @__PURE__ */ jsxs("span", {
						className: "gift-card__category",
						children: [/* @__PURE__ */ jsx("span", { children: emoji }), /* @__PURE__ */ jsx("span", { children: gift.category })]
					}), gift.location && /* @__PURE__ */ jsx("span", {
						className: "gift-card__location",
						children: gift.location
					})]
				}),
				/* @__PURE__ */ jsx("h3", {
					className: "gift-card__name",
					children: gift.name
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "gift-card__footer",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "gift-card__price-wrap",
						children: [/* @__PURE__ */ jsx("span", {
							className: "gift-card__price",
							children: formatPrice(gift.price)
						}), gift.quantity > 1 && /* @__PURE__ */ jsxs("span", {
							className: "gift-card__quantity",
							children: ["× ", gift.quantity]
						})]
					}), isClaimed ? /* @__PURE__ */ jsx("button", {
						className: "gift-card__btn-unclaim",
						onClick: handleUnclaim,
						disabled: unclaiming,
						children: unclaiming ? "Liberando..." : "Cancelar reserva"
					}) : /* @__PURE__ */ jsx("button", {
						className: "gift-card__btn",
						onClick: () => setShowModal(true),
						children: "Apartar"
					})]
				})
			]
		})]
	}), showModal && /* @__PURE__ */ jsx(ClaimModal, {
		gift,
		onClose: () => setShowModal(false),
		onClaimed: (updated) => {
			onUpdate(updated);
			setShowModal(false);
		}
	})] });
}
//#endregion
//#region src/components/GiftGrid.tsx
function GiftGrid({ initialGifts, supabaseUrl, supabaseAnonKey }) {
	const [gifts, setGifts] = useState(initialGifts);
	const [activeStore, setActiveStore] = useState(null);
	useEffect(() => {
		const supabase = createClient(supabaseUrl, supabaseAnonKey);
		const channel = supabase.channel("gifts-realtime").on("postgres_changes", {
			event: "UPDATE",
			schema: "public",
			table: "gifts"
		}, (payload) => {
			setGifts((prev) => prev.map((g) => g.id === payload.new.id ? payload.new : g));
		}).subscribe();
		return () => {
			supabase.removeChannel(channel);
		};
	}, [supabaseUrl, supabaseAnonKey]);
	function handleUpdate(updated) {
		setGifts((prev) => prev.map((g) => g.id === updated.id ? updated : g));
	}
	const visible = activeStore ? gifts.filter((g) => g.location === activeStore) : gifts;
	const available = gifts.filter((g) => !g.claimed_by).length;
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "gift-stats",
			children: [/* @__PURE__ */ jsxs("span", {
				className: "gift-stats__pill gift-stats__pill--available",
				children: [available, " disponibles"]
			}), /* @__PURE__ */ jsxs("span", {
				className: "gift-stats__pill gift-stats__pill--claimed",
				children: [gifts.length - available, " apartados"]
			})]
		}),
		/* @__PURE__ */ jsxs("div", {
			className: "store-filter",
			children: [/* @__PURE__ */ jsx("button", {
				className: `store-filter__chip ${activeStore === null ? "store-filter__chip--active" : ""}`,
				onClick: () => setActiveStore(null),
				children: "Todos"
			}), STORES.map((store) => /* @__PURE__ */ jsx("button", {
				className: `store-filter__chip ${activeStore === store ? "store-filter__chip--active" : ""}`,
				onClick: () => setActiveStore(activeStore === store ? null : store),
				children: store
			}, store))]
		}),
		visible.length === 0 ? /* @__PURE__ */ jsx("p", {
			className: "gift-empty",
			children: "No hay regalos en este almacén todavía."
		}) : /* @__PURE__ */ jsx("div", {
			className: "gift-grid",
			children: visible.map((gift) => /* @__PURE__ */ jsx(GiftCard, {
				gift,
				onUpdate: handleUpdate
			}, gift.id))
		})
	] });
}
//#endregion
//#region src/pages/index.astro
var pages_exports = /* @__PURE__ */ __exportAll({
	default: () => $$Index,
	file: () => $$file,
	url: () => ""
});
var $$Index = createComponent(async ($$result, $$props, $$slots) => {
	let initialGifts = [];
	try {
		const { data } = await createServerClient().from("gifts").select("*").order("created_at", { ascending: true });
		initialGifts = data ?? [];
	} catch {
		initialGifts = [];
	}
	return renderTemplate`<html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Lista de regalos · Appartashower</title><meta name="description" content="Lista de regalos para nuestro nuevo hogar"><link rel="icon" type="image/svg+xml" href="/favicon.svg"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500&display=swap" rel="stylesheet">${renderHead($$result)}</head><body><header class="site-header"><span class="site-logo">Aparta<span>shower</span></span><span class="site-header__tag">Lista de regalos 🎁</span></header><section class="hero"><div class="hero__blob hero__blob--purple"></div><div class="hero__blob hero__blob--pink"></div><div class="hero__blob hero__blob--sm"></div><div class="hero__content"><span class="hero__eyebrow">✨ Nuevo hogar, nueva etapa</span><h1 class="hero__title">Gracias por ser parte<br>de este <span class="hero__title--accent">nuevo comienzo</span></h1><p class="hero__message">Su presencia y cariño son el regalo más grande que podríamos recibir.<strong> Cada uno de ustedes hace este lugar especial.</strong><br><br>Si quieren contribuir a hacer nuestro nuevo hogar más acogedor, aquí les compartimos nuestra lista de deseos que con mucho amor construimos, visitamos cada uno de los lugares para facilitarles la elección. Solo haz clic en <strong>"Apartar"</strong> para que nadie más lo regale.</p><div class="hero__divider"></div></div></section><main class="main"><h2 class="section-title">Nuestra lista de deseos</h2><p class="section-subtitle">Actualizada en tiempo real · los regalos apartados aparecen marcados automáticamente</p>${renderComponent($$result, "GiftGrid", GiftGrid, {
		"client:load": true,
		"initialGifts": initialGifts,
		"supabaseUrl": "https://owoehgnzkyysquakmtga.supabase.co",
		"supabaseAnonKey": "sb_publishable_NxnfXgpA2D25mmNIH3E9Iw_45-GI9Kk",
		"client:component-hydration": "load",
		"client:component-path": "C:/Users/Charr/Proyectos personales/Appartashower/src/components/GiftGrid.tsx",
		"client:component-export": "default"
	})}</main><footer class="site-footer"><p>Hecho con ❤️ para nuestro nuevo hogar · 2026</p></footer></body></html>`;
}, "C:/Users/Charr/Proyectos personales/Appartashower/src/pages/index.astro", void 0);
var $$file = "C:/Users/Charr/Proyectos personales/Appartashower/src/pages/index.astro";
//#endregion
//#region \0virtual:astro:page:src/pages/index@_@astro
var page = () => pages_exports;
//#endregion
export { page };
