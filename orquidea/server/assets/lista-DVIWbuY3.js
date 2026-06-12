import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Award, Search, Flower2, Plus, BadgeCheck, HelpCircle } from "lucide-react";
import { S as Shell, R as REGION } from "./Shell-C-rNY99I.js";
import { O as Orchid } from "./Orchid-COmBCarK.js";
import { S as StatusPill } from "./StatusPill-CccD2zVB.js";
import { u as useAuth } from "./use-auth-peUko5yJ.js";
import { s as supabase } from "./client-DcL2yrVT.js";
import "@supabase/supabase-js";
function ListPage() {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !user) navigate({
      to: "/login"
    });
  }, [loading, user, navigate]);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["my-list", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [sRes, pRes, tRes] = await Promise.all([supabase.from("sightings").select("id, taxon_id, photo_url, location_label, observed_at, created_at, status, notes").eq("user_id", user.id).order("observed_at", {
        ascending: false,
        nullsFirst: false
      }), supabase.from("profiles").select("display_name, handle, points, region").eq("id", user.id).maybeSingle(), supabase.from("taxa").select("id, sci_name, common_name, conservation_status, is_sensitive")]);
      const taxaById = new Map((tRes.data ?? []).map((t) => [t.id, t]));
      return {
        sightings: sRes.data ?? [],
        profile: pRes.data,
        taxaById
      };
    }
  });
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const sightings = useMemo(() => data?.sightings ?? [], [data]);
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sightings.filter((s) => {
      if (filter !== "all" && s.status !== filter) return false;
      if (q) {
        const t = s.taxon_id ? data?.taxaById.get(s.taxon_id) : null;
        const hay = `${t?.sci_name ?? ""} ${t?.common_name ?? ""} ${s.location_label ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [sightings, filter, search, data]);
  if (loading || !user) return /* @__PURE__ */ jsx(Shell, { active: "list", children: /* @__PURE__ */ jsx("div", { className: "p-6 text-sm text-muted-foreground", children: "Cargando…" }) });
  const species = new Set(sightings.filter((s) => s.taxon_id).map((s) => s.taxon_id));
  const verified = sightings.filter((s) => s.status === "verified").length;
  const profile = data?.profile;
  return /* @__PURE__ */ jsx(Shell, { active: "list", children: /* @__PURE__ */ jsxs("div", { className: "px-4 pt-5 pb-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "rounded-3xl bg-gradient-to-br from-leaf to-leaf/70 text-leaf-foreground p-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "text-xs opacity-80", children: [
            "@",
            profile?.handle ?? "—"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "font-display text-xl font-semibold", children: profile?.display_name ?? "Mi lista" }),
          /* @__PURE__ */ jsxs("div", { className: "text-[11px] opacity-80 mt-1 inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(MapPin, { size: 11 }),
            " ",
            profile?.region ?? REGION
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1 text-xs opacity-90", children: [
            /* @__PURE__ */ jsx(Award, { size: 12 }),
            " puntos"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "font-display text-3xl font-semibold leading-none", children: profile?.points ?? 0 })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-3 gap-2 text-center", children: [
        /* @__PURE__ */ jsx(Stat, { n: sightings.length, label: "avistamientos" }),
        /* @__PURE__ */ jsx(Stat, { n: species.size, label: "especies" }),
        /* @__PURE__ */ jsx(Stat, { n: verified, label: "verificados" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("h2", { className: "mt-6 font-display text-lg font-semibold", children: "Mi life list" }),
    sightings.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-2", children: [
      /* @__PURE__ */ jsx("div", { className: "flex gap-2 flex-wrap", children: [["all", "Todas"], ["verified", "Verificadas"], ["needs_id", "Necesitan ID"], ["pending", "En revisión"]].map(([v, label]) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setFilter(v), className: "rounded-full px-3 py-1.5 text-xs font-medium border transition-colors " + (filter === v ? "bg-leaf text-leaf-foreground border-leaf" : "bg-card text-foreground/70 border-border hover:bg-accent"), children: label }, v)) }),
      /* @__PURE__ */ jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsx(Search, { size: 14, className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsx("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Busca en tu lista por especie o lugar…", className: "w-full rounded-xl border border-input bg-card pl-9 pr-3 py-2 text-sm outline-none focus:border-leaf focus:ring-2 focus:ring-leaf/20" })
      ] })
    ] }),
    isLoading && /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-muted-foreground", children: "Cargando…" }),
    !isLoading && sightings.length === 0 && /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-2xl border border-dashed border-border p-6 text-center", children: [
      /* @__PURE__ */ jsx(Flower2, { className: "mx-auto text-leaf", size: 28 }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm font-medium", children: "Aún no has registrado orquídeas." }),
      /* @__PURE__ */ jsxs(Link, { to: "/capture", className: "mt-3 inline-flex items-center gap-1 rounded-full bg-orchid text-orchid-foreground px-3 py-1.5 text-xs font-semibold", children: [
        /* @__PURE__ */ jsx(Plus, { size: 12 }),
        " Registrar la primera"
      ] })
    ] }),
    !isLoading && sightings.length > 0 && visible.length === 0 && /* @__PURE__ */ jsx("p", { className: "mt-4 text-center text-xs text-muted-foreground", children: "Ninguna observación coincide con el filtro." }),
    /* @__PURE__ */ jsx("ul", { className: "mt-3 space-y-3", children: visible.map((s) => {
      const t = s.taxon_id ? data?.taxaById.get(s.taxon_id) : null;
      return /* @__PURE__ */ jsxs("li", { className: "sheet-card rounded-2xl overflow-hidden flex relative hover:border-leaf/40 transition", children: [
        /* @__PURE__ */ jsx("div", { className: "w-24 h-24 shrink-0 grid place-items-center bg-accent/30", children: s.photo_url ? /* @__PURE__ */ jsx("img", { src: s.photo_url, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ jsx(Orchid, { sciName: t?.sci_name ?? null, size: 70 }) }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 p-3 min-w-0", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("div", { className: "font-display italic text-sm truncate", children: t?.sci_name ?? "Sin identificar" }),
              /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground truncate", children: t?.common_name ?? "Pediremos ayuda a la comunidad" })
            ] }),
            t?.conservation_status && /* @__PURE__ */ jsx(StatusPill, { status: t.conservation_status })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-1.5 text-[11px] text-muted-foreground flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsx("span", { children: new Date(s.observed_at ?? s.created_at).toLocaleDateString("es-MX") }),
            /* @__PURE__ */ jsx("span", { children: "·" }),
            /* @__PURE__ */ jsx("span", { className: "truncate", children: s.location_label ?? REGION })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "mt-1 text-[11px]", children: s.status === "verified" ? /* @__PURE__ */ jsxs("span", { className: "text-leaf inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(BadgeCheck, { size: 11 }),
            " verificado"
          ] }) : s.status === "needs_id" ? /* @__PURE__ */ jsxs("span", { className: "text-orchid inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(HelpCircle, { size: 11 }),
            " necesita ID"
          ] }) : /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: "en revisión" }) })
        ] }),
        /* @__PURE__ */ jsx(Link, { to: "/s/$id", params: {
          id: s.id
        }, className: "absolute inset-0", "aria-label": `Ver avistamiento de ${t?.sci_name ?? "orquídea sin identificar"}` })
      ] }, s.id);
    }) })
  ] }) });
}
function Stat({
  n,
  label
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-background/15 py-2", children: [
    /* @__PURE__ */ jsx("div", { className: "font-display text-xl font-semibold", children: n }),
    /* @__PURE__ */ jsx("div", { className: "text-[10px] opacity-80 uppercase tracking-wide", children: label })
  ] });
}
export {
  ListPage as component
};
