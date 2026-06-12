import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Target, Calendar, Award, Flower2 } from "lucide-react";
import { S as Shell, R as REGION } from "./Shell-C-rNY99I.js";
import { O as Orchid } from "./Orchid-COmBCarK.js";
import { s as supabase } from "./client-DcL2yrVT.js";
import "@tanstack/react-router";
import "./use-auth-peUko5yJ.js";
import "react";
import "@supabase/supabase-js";
function HuntsPage() {
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["hunts"],
    queryFn: async () => {
      const [hRes, tRes, taxaRes, bRes] = await Promise.all([supabase.from("hunts").select("id, title, blurb, region, starts_at, ends_at, reward_badge_id").order("starts_at", {
        ascending: false,
        nullsFirst: false
      }), supabase.from("hunt_targets").select("hunt_id, taxon_id"), supabase.from("taxa").select("id, sci_name, common_name, is_sensitive"), supabase.from("badges").select("id, name, icon")]);
      if (hRes.error) throw hRes.error;
      const taxaById = new Map((taxaRes.data ?? []).map((t) => [t.id, t]));
      const badgesById = new Map((bRes.data ?? []).map((b) => [b.id, b]));
      const targetsByHunt = /* @__PURE__ */ new Map();
      for (const t of tRes.data ?? []) {
        if (!targetsByHunt.has(t.hunt_id)) targetsByHunt.set(t.hunt_id, []);
        targetsByHunt.get(t.hunt_id).push(t.taxon_id);
      }
      return {
        hunts: hRes.data ?? [],
        taxaById,
        badgesById,
        targetsByHunt
      };
    }
  });
  const now = Date.now();
  const hunts = data?.hunts ?? [];
  return /* @__PURE__ */ jsx(Shell, { active: "hunts", children: /* @__PURE__ */ jsxs("div", { className: "px-4 pt-5 pb-6", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-display font-semibold", children: "Retos" }),
    /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
      "Misiones temporales en la ",
      REGION,
      ". Encuentra todos los objetivos para ganar la insignia."
    ] }),
    isLoading && /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: "Cargando…" }),
    !isLoading && hunts.length === 0 && /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-2xl border border-dashed border-border p-6 text-center", children: [
      /* @__PURE__ */ jsx(Target, { size: 28, className: "mx-auto text-leaf" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm font-medium", children: "Aún no hay retos activos." }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Los administradores publicarán retos estacionales pronto." })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-5 space-y-4", children: hunts.map((h) => {
      const ends = h.ends_at ? new Date(h.ends_at).getTime() : null;
      const starts = h.starts_at ? new Date(h.starts_at).getTime() : null;
      const active = (!starts || starts <= now) && (!ends || ends >= now);
      const targets = (data?.targetsByHunt.get(h.id) ?? []).map((id) => data?.taxaById.get(id)).filter(Boolean);
      const badge = h.reward_badge_id ? data?.badgesById.get(h.reward_badge_id) : null;
      return /* @__PURE__ */ jsxs("article", { className: "rounded-3xl border border-border bg-card overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "p-4 flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "grid h-11 w-11 place-items-center rounded-2xl bg-orchid/10 text-orchid shrink-0", children: /* @__PURE__ */ jsx(Target, { size: 20 }) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("h2", { className: "font-display text-base font-semibold", children: h.title }),
              active ? /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide bg-leaf/15 text-leaf rounded-full px-2 py-0.5 font-semibold", children: "activo" }) : ends && ends < now ? /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide bg-muted text-muted-foreground rounded-full px-2 py-0.5", children: "cerrado" }) : /* @__PURE__ */ jsx("span", { className: "text-[10px] uppercase tracking-wide bg-warn/15 text-warn rounded-full px-2 py-0.5", children: "próximo" })
            ] }),
            h.blurb && /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: h.blurb }),
            /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground", children: [
              h.ends_at && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsx(Calendar, { size: 11 }),
                " hasta ",
                new Date(h.ends_at).toLocaleDateString("es-MX")
              ] }),
              badge && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-warn", children: [
                /* @__PURE__ */ jsx(Award, { size: 11 }),
                " ",
                badge.name
              ] })
            ] })
          ] })
        ] }),
        targets.length > 0 && /* @__PURE__ */ jsxs("div", { className: "bg-accent/20 px-3 py-3 border-t border-border", children: [
          /* @__PURE__ */ jsxs("div", { className: "text-[10px] uppercase tracking-wide text-muted-foreground mb-2 px-1", children: [
            /* @__PURE__ */ jsx(Flower2, { size: 10, className: "inline mr-1" }),
            "Objetivos · ",
            targets.length
          ] }),
          /* @__PURE__ */ jsx("div", { className: "flex gap-2 overflow-x-auto pb-1", children: targets.map((t) => /* @__PURE__ */ jsxs("div", { className: "shrink-0 w-24 rounded-xl bg-card border border-border p-2 text-center", children: [
            /* @__PURE__ */ jsx(Orchid, { sciName: t.sci_name, size: 60 }),
            /* @__PURE__ */ jsx("div", { className: "font-display italic text-[10px] leading-tight mt-1 truncate", children: t.sci_name }),
            t.common_name && /* @__PURE__ */ jsx("div", { className: "text-[9px] text-muted-foreground truncate", children: t.common_name })
          ] }, t.id)) })
        ] })
      ] }, h.id);
    }) })
  ] }) });
}
export {
  HuntsPage as component
};
