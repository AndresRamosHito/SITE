import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { R as REGION, S as Shell } from "./Shell-C-rNY99I.js";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { BookOpen, Target, Trophy, Flower2, HelpCircle, BadgeCheck, Lock, MapPin, MessageCircle } from "lucide-react";
import { O as Orchid } from "./Orchid-COmBCarK.js";
import { S as StatusPill } from "./StatusPill-CccD2zVB.js";
import { s as supabase } from "./client-DcL2yrVT.js";
import "./use-auth-peUko5yJ.js";
import "react";
import "@supabase/supabase-js";
async function fetchFeed() {
  const [feedRes, taxaRes] = await Promise.all([
    supabase.from("sightings_public").select(
      "id, taxon_id, sci_name, common_name, is_sensitive, is_masked, status, location_label, observed_at, created_at, photo_url"
    ).order("created_at", { ascending: false }).limit(40),
    supabase.from("taxa").select("id, sci_name, conservation_status")
  ]);
  if (feedRes.error) throw feedRes.error;
  if (taxaRes.error) throw taxaRes.error;
  const statusBySci = new Map(
    taxaRes.data.map((t) => [t.sci_name, t.conservation_status])
  );
  return {
    rows: feedRes.data ?? [],
    statusBySci
  };
}
function relativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 6e4);
  if (m < 1) return "ahora";
  if (m < 60) return `hace ${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h} h`;
  const d = Math.floor(h / 24);
  if (d === 1) return "ayer";
  if (d < 7) return `hace ${d} d`;
  const w = Math.floor(d / 7);
  return `hace ${w} sem`;
}
function Feed() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["sightings-public-feed"],
    queryFn: fetchFeed
  });
  return /* @__PURE__ */ jsxs("div", { className: "px-4 pt-5", children: [
    /* @__PURE__ */ jsx("div", { className: "specimen-label", children: REGION }),
    /* @__PURE__ */ jsx("h1", { className: "mt-0.5 text-2xl font-display font-semibold tracking-tight", children: "Avistamientos cercanos" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Lo que la comunidad observa en la sierra." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-3 gap-2", children: [
      /* @__PURE__ */ jsx(
        ExploreCard,
        {
          to: "/especies",
          icon: /* @__PURE__ */ jsx(BookOpen, { size: 16 }),
          label: "Herbario",
          hint: "1300+ especies",
          tone: "bg-leaf/10 text-leaf"
        }
      ),
      /* @__PURE__ */ jsx(
        ExploreCard,
        {
          to: "/retos",
          icon: /* @__PURE__ */ jsx(Target, { size: 16 }),
          label: "Retos",
          hint: "Salidas y misiones",
          tone: "bg-orchid/10 text-orchid"
        }
      ),
      /* @__PURE__ */ jsx(
        ExploreCard,
        {
          to: "/ranking",
          icon: /* @__PURE__ */ jsx(Trophy, { size: 16 }),
          label: "Ranking",
          hint: "Top spotters",
          tone: "bg-warn/10 text-warn"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 space-y-4", children: [
      isLoading && /* @__PURE__ */ jsx(FeedSkeleton, {}),
      error && /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-destructive/30 bg-destructive/5 text-destructive p-4 text-sm", children: "No pudimos cargar el muro. Intenta de nuevo en un momento." }),
      data && data.rows.length === 0 && /* @__PURE__ */ jsx(EmptyFeed, {}),
      data?.rows.map((s, i) => /* @__PURE__ */ jsx(
        FeedCard,
        {
          s,
          index: i,
          status: s.sci_name ? data.statusBySci.get(s.sci_name) ?? null : null
        },
        s.id
      ))
    ] })
  ] });
}
function FeedCard({ s, status, index }) {
  const sci = s.sci_name;
  const common = s.common_name;
  const masked = !!s.is_masked;
  return /* @__PURE__ */ jsx(
    Link,
    {
      to: "/s/$id",
      params: { id: s.id },
      className: "stagger-in block rounded-3xl border border-border/70 bg-card overflow-hidden shadow-sm hover:shadow-md hover:border-leaf/30 transition",
      style: { animationDelay: index * 40 + "ms" },
      children: /* @__PURE__ */ jsxs("article", { children: [
        /* @__PURE__ */ jsxs("div", { className: "relative h-44 grid place-items-center bg-gradient-to-br from-accent/40 to-secondary/30", children: [
          /* @__PURE__ */ jsx(Orchid, { sciName: sci, size: 150 }),
          !sci && /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 grid place-items-center gap-2 text-leaf", children: [
            /* @__PURE__ */ jsx(HelpCircle, { size: 28 }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold", children: "Sin identificar" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "font-display italic text-[15px] leading-tight", children: sci ?? "Orquídea sin identificar" }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: common ?? "Ayuda a la comunidad a identificarla" })
            ] }),
            status && /* @__PURE__ */ jsx(StatusPill, { status })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-muted-foreground", children: [
            /* @__PURE__ */ jsx("span", { children: relativeTime(s.observed_at ?? s.created_at) }),
            /* @__PURE__ */ jsx("span", { children: "·" }),
            s.status === "verified" ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-leaf font-medium", children: [
              /* @__PURE__ */ jsx(BadgeCheck, { size: 12 }),
              " verificado"
            ] }) : s.status === "needs_id" || !s.taxon_id ? /* @__PURE__ */ jsx("span", { className: "text-orchid font-medium", children: "necesita ID" }) : /* @__PURE__ */ jsx("span", { children: "en revisión" })
          ] }),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "mt-2 flex items-center gap-1.5 text-xs " + (masked ? "text-muted-foreground" : "text-foreground/80"),
              children: masked ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(Lock, { size: 13 }),
                " Ubicación protegida · ~",
                REGION
              ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(MapPin, { size: 13 }),
                " ",
                s.location_label ?? REGION
              ] })
            }
          ),
          masked && /* @__PURE__ */ jsx("div", { className: "mt-2 rounded-lg bg-warn/10 text-[11px] text-foreground/75 px-2.5 py-1.5 leading-snug", children: "Especie sensible — ubicación exacta oculta para prevenir el saqueo." }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-4 text-[11px] text-muted-foreground", children: [
            /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(MessageCircle, { size: 12 }),
              " Discusión"
            ] }),
            sci && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(BookOpen, { size: 12 }),
              " Ver ficha"
            ] })
          ] })
        ] })
      ] })
    }
  );
}
function ExploreCard({
  to,
  icon,
  label,
  hint,
  tone
}) {
  return /* @__PURE__ */ jsxs(Link, { to, className: "sheet-card rounded-2xl p-3 hover:border-leaf/40 transition", children: [
    /* @__PURE__ */ jsx("span", { className: "grid h-8 w-8 place-items-center rounded-xl " + tone, children: icon }),
    /* @__PURE__ */ jsx("span", { className: "mt-2 block text-xs font-semibold leading-tight", children: label }),
    /* @__PURE__ */ jsx("span", { className: "block text-[10px] text-muted-foreground leading-tight mt-0.5", children: hint })
  ] });
}
function EmptyFeed() {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center", children: [
    /* @__PURE__ */ jsx("div", { className: "mx-auto grid h-12 w-12 place-items-center rounded-full bg-leaf/10 text-leaf", children: /* @__PURE__ */ jsx(Flower2, { size: 22 }) }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-foreground/80 font-medium", children: "Aún no hay avistamientos en la Sierra." }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: "Cuando los primeros spotters registren orquídeas, aparecerán aquí." })
  ] });
}
function FeedSkeleton() {
  return /* @__PURE__ */ jsx(Fragment, { children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-border/70 bg-card overflow-hidden", children: [
    /* @__PURE__ */ jsx("div", { className: "h-44 bg-muted animate-pulse" }),
    /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-2", children: [
      /* @__PURE__ */ jsx("div", { className: "h-4 w-2/3 bg-muted animate-pulse rounded" }),
      /* @__PURE__ */ jsx("div", { className: "h-3 w-1/2 bg-muted animate-pulse rounded" }),
      /* @__PURE__ */ jsx("div", { className: "h-3 w-1/3 bg-muted animate-pulse rounded" })
    ] })
  ] }, i)) });
}
function HomePage() {
  return /* @__PURE__ */ jsx(Shell, { active: "feed", children: /* @__PURE__ */ jsx(Feed, {}) });
}
export {
  HomePage as component
};
