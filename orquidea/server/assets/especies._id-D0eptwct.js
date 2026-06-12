import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Shield, Map, Plus, Loader2, ExternalLink, BadgeCheck, Leaf, Globe, GraduationCap } from "lucide-react";
import { S as Shell, R as REGION } from "./Shell-C-rNY99I.js";
import { O as Orchid } from "./Orchid-COmBCarK.js";
import { S as StatusPill } from "./StatusPill-CccD2zVB.js";
import { s as supabase } from "./client-DcL2yrVT.js";
import { c as Route } from "./router-D5x7JZDN.js";
import "./use-auth-peUko5yJ.js";
import "react";
import "@supabase/supabase-js";
async function fetchWikiSummary(sciName) {
  const slug = encodeURIComponent(sciName.trim().replaceAll(" ", "_"));
  for (const lang of ["es", "en"]) {
    try {
      const res = await fetch(`https://${lang}.wikipedia.org/api/rest_v1/page/summary/${slug}`);
      if (!res.ok) continue;
      const j = await res.json();
      if (j.type !== "standard" || !j.extract) continue;
      return {
        title: j.title ?? sciName,
        extract: j.extract,
        url: j.content_urls?.desktop?.page ?? `https://${lang}.wikipedia.org/wiki/${slug}`,
        thumbnail: j.thumbnail?.source ?? null,
        lang
      };
    } catch {
    }
  }
  return null;
}
function externalSources(sciName) {
  const q = encodeURIComponent(sciName);
  return [{
    name: "EncicloVida",
    detail: "CONABIO · biodiversidad mexicana",
    href: `https://enciclovida.mx/busquedas/resultados?busqueda=basica&nombre=${q}`,
    icon: /* @__PURE__ */ jsx(Leaf, { size: 15 })
  }, {
    name: "NaturaLista",
    detail: "iNaturalist México · observaciones",
    href: `https://www.naturalista.mx/taxa/search?q=${q}`,
    icon: /* @__PURE__ */ jsx(Globe, { size: 15 })
  }, {
    name: "GBIF",
    detail: "Registros globales de la especie",
    href: `https://www.gbif.org/species/search?q=${q}`,
    icon: /* @__PURE__ */ jsx(Map, { size: 15 })
  }, {
    name: "Kew · POWO",
    detail: "Plants of the World Online",
    href: `https://powo.science.kew.org/results?q=${q}`,
    icon: /* @__PURE__ */ jsx(BadgeCheck, { size: 15 })
  }, {
    name: "Google Académico",
    detail: "Literatura científica",
    href: `https://scholar.google.com/scholar?q=%22${q}%22`,
    icon: /* @__PURE__ */ jsx(GraduationCap, { size: 15 })
  }];
}
function SpeciesDetailPage() {
  const {
    id
  } = Route.useParams();
  const taxonQ = useQuery({
    queryKey: ["taxon", id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("taxa").select("id, sci_name, common_name, genus, family, tribe, description, conservation_status, is_sensitive, ref_image_url, synonyms, region").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  const t = taxonQ.data;
  const wikiQ = useQuery({
    queryKey: ["wiki-summary", t?.sci_name],
    enabled: !!t?.sci_name,
    staleTime: 1e3 * 60 * 60,
    queryFn: () => fetchWikiSummary(t.sci_name)
  });
  const sightingsQ = useQuery({
    queryKey: ["taxon-sightings", id],
    enabled: !!t,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("sightings_public").select("id, status, location_label, observed_at, created_at, is_masked").eq("taxon_id", id).order("created_at", {
        ascending: false
      }).limit(5);
      if (error) throw error;
      return data ?? [];
    }
  });
  return /* @__PURE__ */ jsx(Shell, { active: "species", children: /* @__PURE__ */ jsxs("div", { className: "px-4 pt-4 pb-10", children: [
    /* @__PURE__ */ jsxs(Link, { to: "/especies", className: "inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground", children: [
      /* @__PURE__ */ jsx(ArrowLeft, { size: 12 }),
      " Herbario"
    ] }),
    taxonQ.isLoading && /* @__PURE__ */ jsx("div", { className: "mt-4 h-56 rounded-3xl bg-muted animate-pulse" }),
    taxonQ.isSuccess && !t && /* @__PURE__ */ jsx("div", { className: "mt-8 rounded-2xl border border-border p-6 text-center text-sm text-muted-foreground", children: "Esta especie no existe en el catálogo." }),
    t && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("article", { className: "sheet-card mt-4 rounded-3xl overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative h-52 grid place-items-center bg-gradient-to-br from-accent/40 to-secondary/30", children: [
          t.ref_image_url ? /* @__PURE__ */ jsx("img", { src: t.ref_image_url, alt: t.sci_name, className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsx(Orchid, { sciName: t.sci_name, size: 170 }),
          /* @__PURE__ */ jsx("span", { className: "absolute top-3 left-3 specimen-label rounded bg-background/90 px-2 py-1 border border-border/60", children: "Orchidaceae" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsx("h1", { className: "font-display italic text-xl leading-tight", children: t.sci_name }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mt-0.5", children: t.common_name ?? "Sin nombre común registrado" })
            ] }),
            t.conservation_status && /* @__PURE__ */ jsx(StatusPill, { status: t.conservation_status })
          ] }),
          /* @__PURE__ */ jsxs("dl", { className: "mt-4 grid grid-cols-3 gap-2 text-center", children: [
            /* @__PURE__ */ jsx(TaxRow, { label: "Género", value: t.genus ?? t.sci_name.split(" ")[0], italic: true }),
            /* @__PURE__ */ jsx(TaxRow, { label: "Tribu", value: t.tribe ?? "—" }),
            /* @__PURE__ */ jsx(TaxRow, { label: "Región", value: t.region ?? REGION })
          ] }),
          t.synonyms && t.synonyms.length > 0 && /* @__PURE__ */ jsxs("p", { className: "mt-3 text-[11px] text-muted-foreground", children: [
            /* @__PURE__ */ jsx("span", { className: "specimen-label", children: "Sinónimos · " }),
            /* @__PURE__ */ jsx("span", { className: "italic", children: t.synonyms.join(", ") })
          ] }),
          t.is_sensitive && /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded-xl bg-warn/10 border border-warn/30 px-3 py-2.5 text-xs text-foreground/80 flex gap-2", children: [
            /* @__PURE__ */ jsx(Shield, { size: 14, className: "text-warn shrink-0 mt-0.5" }),
            "Especie sensible al saqueo — las ubicaciones de sus avistamientos se publican solo como área amplia."
          ] }),
          t.description && /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-foreground/85 leading-snug whitespace-pre-wrap", children: t.description })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsxs(Link, { to: "/mapa", search: {
          especie: t.sci_name
        }, className: "rounded-2xl bg-leaf text-leaf-foreground py-2.5 text-xs font-semibold inline-flex items-center justify-center gap-1.5", children: [
          /* @__PURE__ */ jsx(Map, { size: 14 }),
          " Ver en el mapa"
        ] }),
        /* @__PURE__ */ jsxs(Link, { to: "/capture", className: "rounded-2xl bg-orchid text-orchid-foreground py-2.5 text-xs font-semibold inline-flex items-center justify-center gap-1.5", children: [
          /* @__PURE__ */ jsx(Plus, { size: 14 }),
          " Registrar avistamiento"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mt-6", children: [
        /* @__PURE__ */ jsx("div", { className: "specimen-label", children: "En la enciclopedia" }),
        wikiQ.isLoading && /* @__PURE__ */ jsxs("div", { className: "sheet-card mt-2 rounded-2xl p-4 text-xs text-muted-foreground inline-flex items-center gap-2 w-full", children: [
          /* @__PURE__ */ jsx(Loader2, { size: 13, className: "animate-spin" }),
          " Buscando resumen en Wikipedia…"
        ] }),
        wikiQ.isSuccess && wikiQ.data && /* @__PURE__ */ jsxs("a", { href: wikiQ.data.url, target: "_blank", rel: "noopener noreferrer", className: "sheet-card mt-2 block rounded-2xl p-4 hover:border-leaf/40 transition", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
            wikiQ.data.thumbnail && /* @__PURE__ */ jsx("img", { src: wikiQ.data.thumbnail, alt: "", className: "h-16 w-16 rounded-xl object-cover shrink-0 border border-border/60" }),
            /* @__PURE__ */ jsx("div", { className: "min-w-0", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-foreground/85 leading-snug line-clamp-5", children: wikiQ.data.extract }) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-2.5 text-[11px] text-leaf font-semibold inline-flex items-center gap-1", children: [
            "Leer en Wikipedia (",
            wikiQ.data.lang === "es" ? "español" : "inglés",
            ")",
            " ",
            /* @__PURE__ */ jsx(ExternalLink, { size: 11 })
          ] })
        ] }),
        wikiQ.isSuccess && !wikiQ.data && /* @__PURE__ */ jsx("div", { className: "sheet-card mt-2 rounded-2xl p-4 text-xs text-muted-foreground", children: "No encontramos un artículo de Wikipedia para esta especie. Prueba las fuentes de abajo." })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mt-6", children: [
        /* @__PURE__ */ jsx("div", { className: "specimen-label", children: "Explora en la web" }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 space-y-2", children: externalSources(t.sci_name).map((src) => /* @__PURE__ */ jsxs("a", { href: src.href, target: "_blank", rel: "noopener noreferrer", className: "sheet-card flex items-center gap-3 rounded-2xl px-3.5 py-3 hover:border-leaf/40 transition", children: [
          /* @__PURE__ */ jsx("span", { className: "grid h-9 w-9 place-items-center rounded-xl bg-leaf/10 text-leaf shrink-0", children: src.icon }),
          /* @__PURE__ */ jsxs("span", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsx("span", { className: "block text-sm font-semibold leading-tight", children: src.name }),
            /* @__PURE__ */ jsx("span", { className: "block text-[11px] text-muted-foreground truncate", children: src.detail })
          ] }),
          /* @__PURE__ */ jsx(ExternalLink, { size: 14, className: "text-muted-foreground shrink-0" })
        ] }, src.name)) })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mt-6", children: [
        /* @__PURE__ */ jsx("div", { className: "specimen-label", children: "Avistamientos de la comunidad" }),
        sightingsQ.isLoading && /* @__PURE__ */ jsx("div", { className: "mt-2 h-14 rounded-2xl bg-muted animate-pulse" }),
        sightingsQ.isSuccess && sightingsQ.data.length === 0 && /* @__PURE__ */ jsx("div", { className: "mt-2 rounded-2xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground", children: "Nadie la ha registrado todavía. ¡Sé la primera persona en encontrarla!" }),
        /* @__PURE__ */ jsx("ul", { className: "mt-2 space-y-2", children: (sightingsQ.data ?? []).filter((s) => s.id != null).map((s) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(Link, { to: "/s/$id", params: {
          id: s.id
        }, className: "sheet-card flex items-center justify-between gap-2 rounded-2xl px-3.5 py-2.5 text-xs hover:border-leaf/40 transition", children: [
          /* @__PURE__ */ jsx("span", { className: "truncate text-foreground/85", children: s.is_masked ? "Ubicación protegida" : s.location_label ?? REGION }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-2 shrink-0 text-muted-foreground", children: [
            new Date(s.observed_at ?? s.created_at ?? Date.now()).toLocaleDateString("es-MX"),
            s.status === "verified" && /* @__PURE__ */ jsx(BadgeCheck, { size: 12, className: "text-leaf" })
          ] })
        ] }) }, s.id)) })
      ] })
    ] })
  ] }) });
}
function TaxRow({
  label,
  value,
  italic
}) {
  return /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-accent/30 px-2 py-2 min-w-0", children: [
    /* @__PURE__ */ jsx("dt", { className: "specimen-label", children: label }),
    /* @__PURE__ */ jsx("dd", { className: "mt-0.5 text-xs font-medium truncate " + (italic ? "italic" : ""), children: value })
  ] });
}
export {
  SpeciesDetailPage as component
};
