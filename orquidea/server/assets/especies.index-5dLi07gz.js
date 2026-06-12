import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { BookOpen, Search, X, ArrowLeft, Shield } from "lucide-react";
import { S as Shell } from "./Shell-C-rNY99I.js";
import { O as Orchid } from "./Orchid-COmBCarK.js";
import { S as StatusPill } from "./StatusPill-CccD2zVB.js";
import { s as supabase } from "./client-DcL2yrVT.js";
import "./use-auth-peUko5yJ.js";
import "@supabase/supabase-js";
function SpeciesIndexPage() {
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["taxa-catalog"],
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.from("taxa").select("id, sci_name, common_name, genus, conservation_status, is_sensitive").order("sci_name").limit(5e3);
      if (error) throw error;
      return data2 ?? [];
    }
  });
  const [query, setQuery] = useState("");
  const [genus, setGenus] = useState(null);
  const taxa = data ?? [];
  const genera = useMemo(() => {
    const counts = /* @__PURE__ */ new Map();
    for (const t of taxa) {
      const g = t.genus || t.sci_name.split(" ")[0];
      counts.set(g, (counts.get(g) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [taxa]);
  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (!q && !genus) return [];
    return taxa.filter((t) => {
      const g = t.genus || t.sci_name.split(" ")[0];
      if (genus && g !== genus) return false;
      if (q) {
        const hay = `${t.sci_name} ${t.common_name ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [taxa, q, genus]);
  return /* @__PURE__ */ jsx(Shell, { active: "species", children: /* @__PURE__ */ jsxs("div", { className: "px-4 pt-5 pb-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "specimen-label", children: "Herbario digital" }),
        /* @__PURE__ */ jsx("h1", { className: "mt-0.5 text-2xl font-display font-semibold", children: "Especies" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1 max-w-[32ch]", children: isLoading ? "Cargando catálogo…" : `${taxa.length} orquídeas mexicanas en ${genera.length} géneros.` })
      ] }),
      /* @__PURE__ */ jsx("span", { className: "grid h-10 w-10 place-items-center rounded-2xl bg-leaf/10 text-leaf shrink-0", children: /* @__PURE__ */ jsx(BookOpen, { size: 18 }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "relative mt-4", children: [
      /* @__PURE__ */ jsx(Search, { size: 15, className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsx("input", { value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Busca por nombre científico o común…", className: "w-full rounded-xl border border-input bg-card pl-9 pr-9 py-2.5 text-sm outline-none focus:border-leaf focus:ring-2 focus:ring-leaf/20" }),
      query && /* @__PURE__ */ jsx("button", { type: "button", "aria-label": "Limpiar búsqueda", onClick: () => setQuery(""), className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsx(X, { size: 15 }) })
    ] }),
    genus && /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setGenus(null), className: "mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-leaf", children: [
      /* @__PURE__ */ jsx(ArrowLeft, { size: 13 }),
      " Todos los géneros"
    ] }),
    !q && !genus && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "specimen-label mt-6", children: "Explora por género" }),
      isLoading && /* @__PURE__ */ jsx("div", { className: "mt-3 grid grid-cols-2 gap-2", children: [0, 1, 2, 3, 4, 5].map((i) => /* @__PURE__ */ jsx("div", { className: "h-14 rounded-2xl bg-muted animate-pulse" }, i)) }),
      /* @__PURE__ */ jsx("div", { className: "mt-3 grid grid-cols-2 gap-2", children: genera.map(([g, n], i) => /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setGenus(g), className: "stagger-in sheet-card rounded-2xl px-3.5 py-3 text-left hover:border-leaf/40 transition", style: {
        animationDelay: Math.min(i, 20) * 25 + "ms"
      }, children: [
        /* @__PURE__ */ jsx("div", { className: "font-display italic text-sm leading-tight truncate", children: g }),
        /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-muted-foreground mt-0.5", children: [
          n,
          " ",
          n === 1 ? "especie" : "especies"
        ] })
      ] }, g)) })
    ] }),
    (q || genus) && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "specimen-label mt-6", children: genus ? /* @__PURE__ */ jsxs(Fragment, { children: [
        "Género ",
        /* @__PURE__ */ jsx("span", { className: "italic normal-case text-foreground", children: genus }),
        " ·",
        " ",
        results.length
      ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        results.length,
        " resultados"
      ] }) }),
      results.length === 0 && !isLoading && /* @__PURE__ */ jsx("div", { className: "mt-3 rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground", children: "Sin resultados para tu búsqueda." }),
      /* @__PURE__ */ jsx("ul", { className: "mt-3 space-y-2", children: results.slice(0, 200).map((t, i) => /* @__PURE__ */ jsx("li", { className: "stagger-in", style: {
        animationDelay: Math.min(i, 15) * 25 + "ms"
      }, children: /* @__PURE__ */ jsxs(Link, { to: "/especies/$id", params: {
        id: t.id
      }, className: "sheet-card flex items-center gap-3 rounded-2xl p-3 hover:border-leaf/40 transition", children: [
        /* @__PURE__ */ jsx("span", { className: "grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent/40 overflow-hidden", children: /* @__PURE__ */ jsx(Orchid, { sciName: t.sci_name, size: 44 }) }),
        /* @__PURE__ */ jsxs("span", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("span", { className: "block font-display italic text-sm leading-tight truncate", children: t.sci_name }),
          /* @__PURE__ */ jsx("span", { className: "block text-[11px] text-muted-foreground truncate", children: t.common_name ?? "Sin nombre común registrado" })
        ] }),
        /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1.5 shrink-0", children: [
          t.is_sensitive && /* @__PURE__ */ jsx(Shield, { size: 12, className: "text-warn" }),
          t.conservation_status && /* @__PURE__ */ jsx(StatusPill, { status: t.conservation_status })
        ] })
      ] }) }, t.id)) }),
      results.length > 200 && /* @__PURE__ */ jsxs("p", { className: "mt-3 text-center text-[11px] text-muted-foreground", children: [
        "Mostrando 200 de ",
        results.length,
        " — afina tu búsqueda para ver más."
      ] })
    ] })
  ] }) });
}
export {
  SpeciesIndexPage as component
};
