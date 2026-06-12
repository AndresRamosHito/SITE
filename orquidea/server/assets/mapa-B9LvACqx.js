import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef, useMemo } from "react";
import { ShieldCheck, Info, Lock } from "lucide-react";
import { S as Shell, R as REGION } from "./Shell-C-rNY99I.js";
import { MapContainer, TileLayer, Circle, Popup, useMap } from "react-leaflet";
import { Link } from "@tanstack/react-router";
import L from "leaflet";
import "leaflet.markercluster";
import { s as supabase } from "./client-DcL2yrVT.js";
import { R as Route } from "./router-D5x7JZDN.js";
import "./use-auth-peUko5yJ.js";
import "@supabase/supabase-js";
function FitToBbox({ bbox }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(L.latLngBounds([bbox.min_lat, bbox.min_lng], [bbox.max_lat, bbox.max_lng]), {
      padding: [16, 16]
    });
  }, [map, bbox]);
  return null;
}
function pinIcon(verified) {
  const fill = verified ? "hsl(140 35% 32%)" : "hsl(322 70% 48%)";
  const html = `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:${fill};border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.3)"></span>`;
  return L.divIcon({ html, className: "", iconSize: [14, 14], iconAnchor: [7, 7] });
}
function ClusteredPins({ points }) {
  const map = useMap();
  useEffect(() => {
    const cluster = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 45,
      spiderfyOnMaxZoom: true
    });
    points.forEach((p) => {
      if (p.lat == null || p.lng == null || p.is_sensitive || p.is_masked) return;
      const verified = p.status === "verified";
      const marker = L.marker([p.lat, p.lng], { icon: pinIcon(verified) });
      const linkHref = `/s/${p.id}`;
      marker.bindPopup(
        `<div style="font-size:12px"><div style="font-weight:600;font-style:italic">${p.sci_name ?? "Sin identificar"}</div>${p.common_name ? `<div style="font-size:11px">${p.common_name}</div>` : ""}<div style="font-size:10px;text-transform:uppercase;letter-spacing:.05em;opacity:.7;margin-top:4px">${verified ? "Verificado" : "Pendiente"}</div><a href="${linkHref}" style="display:inline-block;margin-top:6px;font-size:11px;font-weight:600;color:#2d6a4f;text-decoration:underline">Ver detalle →</a></div>`
      );
      cluster.addLayer(marker);
    });
    map.addLayer(cluster);
    return () => {
      map.removeLayer(cluster);
    };
  }, [map, points]);
  return null;
}
function LocateButton() {
  const map = useMap();
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick: () => {
        if (!("geolocation" in navigator)) return;
        navigator.geolocation.getCurrentPosition(
          (pos) => map.setView([pos.coords.latitude, pos.coords.longitude], 12),
          () => {
          },
          { enableHighAccuracy: true, timeout: 8e3 }
        );
      },
      className: "absolute top-3 right-3 z-[400] rounded-full bg-card border border-border shadow-sm h-9 w-9 grid place-items-center text-foreground",
      "aria-label": "Ubicarme",
      children: /* @__PURE__ */ jsxs(
        "svg",
        {
          width: "16",
          height: "16",
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "2",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          children: [
            /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "3" }),
            /* @__PURE__ */ jsx("path", { d: "M12 2v3M12 19v3M2 12h3M19 12h3" })
          ]
        }
      )
    }
  );
}
function SightingsMap({
  points,
  bbox,
  heightClass = "aspect-[4/5]"
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const containerRef = useRef(null);
  const center = useMemo(
    () => [(bbox.min_lat + bbox.max_lat) / 2, (bbox.min_lng + bbox.max_lng) / 2],
    [bbox]
  );
  const sensitivePts = useMemo(
    () => points.filter((p) => (p.is_sensitive || p.is_masked) && p.lat != null && p.lng != null),
    [points]
  );
  const normalPts = useMemo(
    () => points.filter((p) => !p.is_sensitive && !p.is_masked && p.lat != null && p.lng != null),
    [points]
  );
  if (!mounted) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref: containerRef,
        className: "w-full rounded-3xl bg-gradient-to-br from-leaf/15 via-accent/30 to-background animate-pulse " + heightClass
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "w-full rounded-3xl overflow-hidden border border-border relative z-0 " + heightClass,
      children: /* @__PURE__ */ jsxs(
        MapContainer,
        {
          center,
          zoom: 9,
          scrollWheelZoom: false,
          style: { height: "100%", width: "100%" },
          children: [
            /* @__PURE__ */ jsx(
              TileLayer,
              {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> © <a href="https://carto.com/attributions">CARTO</a>',
                url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              }
            ),
            /* @__PURE__ */ jsx(FitToBbox, { bbox }),
            /* @__PURE__ */ jsx(LocateButton, {}),
            /* @__PURE__ */ jsx(ClusteredPins, { points: normalPts }),
            sensitivePts.map((p) => /* @__PURE__ */ jsx(
              Circle,
              {
                center: [p.lat, p.lng],
                radius: 2500,
                pathOptions: {
                  color: "hsl(38 70% 45%)",
                  weight: 1.5,
                  fillColor: "hsl(38 80% 55%)",
                  fillOpacity: 0.25
                },
                children: /* @__PURE__ */ jsx(Popup, { children: /* @__PURE__ */ jsxs("div", { className: "text-xs", children: [
                  /* @__PURE__ */ jsx("div", { className: "font-semibold italic", children: p.sci_name ?? "Sin identificar" }),
                  /* @__PURE__ */ jsx("div", { className: "text-[11px] opacity-70 mt-0.5", children: "Especie sensible — solo área aproximada" }),
                  p.location_label && /* @__PURE__ */ jsx("div", { className: "text-[11px] mt-1", children: p.location_label }),
                  /* @__PURE__ */ jsx(
                    Link,
                    {
                      to: "/s/$id",
                      params: { id: p.id },
                      className: "inline-block mt-2 text-[11px] font-semibold text-leaf underline",
                      children: "Ver detalle →"
                    }
                  )
                ] }) })
              },
              p.id
            ))
          ]
        }
      )
    }
  );
}
const BBOX = {
  min_lat: 16.6,
  max_lat: 17.9,
  min_lng: -97,
  max_lng: -95.6
};
function MapPage() {
  const {
    especie
  } = Route.useSearch();
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["map-bbox", BBOX],
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.rpc("sightings_in_bbox", BBOX);
      if (error) throw error;
      return data2 ?? [];
    }
  });
  const [status, setStatus] = useState("all");
  const [showSensitive, setShowSensitive] = useState(true);
  const [taxon, setTaxon] = useState(especie ?? "");
  const all = data ?? [];
  const filtered = useMemo(() => {
    const q = taxon.trim().toLowerCase();
    return all.filter((p) => {
      if (p.lat == null || p.lng == null) return false;
      if (!showSensitive && (p.is_sensitive || p.is_masked)) return false;
      if (status === "verified" && p.status !== "verified") return false;
      if (status === "pending" && p.status === "verified") return false;
      if (q) {
        const hay = `${p.sci_name ?? ""} ${p.common_name ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [all, status, showSensitive, taxon]);
  const hiddenMasked = all.filter((p) => p.is_masked && p.lat == null).length;
  return /* @__PURE__ */ jsx(Shell, { active: "map", children: /* @__PURE__ */ jsxs("div", { className: "px-4 pt-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "specimen-label", children: REGION }),
        /* @__PURE__ */ jsx("h1", { className: "mt-0.5 text-2xl font-display font-semibold", children: "Mapa" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1 max-w-[28ch]", children: "Coordenadas redondeadas a cuadrícula. Especies sensibles solo como área." })
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-leaf/10 text-leaf px-2 py-1 text-[10px] font-semibold whitespace-nowrap", children: [
        /* @__PURE__ */ jsx(ShieldCheck, { size: 11 }),
        " Protegido"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 flex-wrap", children: [
        /* @__PURE__ */ jsx(Chip, { active: status === "all", onClick: () => setStatus("all"), children: "Todos" }),
        /* @__PURE__ */ jsx(Chip, { active: status === "verified", onClick: () => setStatus("verified"), children: "Verificados" }),
        /* @__PURE__ */ jsx(Chip, { active: status === "pending", onClick: () => setStatus("pending"), children: "Pendientes" }),
        /* @__PURE__ */ jsx(Chip, { active: showSensitive, onClick: () => setShowSensitive((v) => !v), children: showSensitive ? "Sensibles ✓" : "Sensibles" })
      ] }),
      /* @__PURE__ */ jsx("input", { value: taxon, onChange: (e) => setTaxon(e.target.value), placeholder: "Buscar por especie…", className: "w-full rounded-xl border border-input bg-card px-3 py-2 text-sm outline-none focus:border-leaf focus:ring-2 focus:ring-leaf/20" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-3", children: /* @__PURE__ */ jsx(SightingsMap, { points: filtered, bbox: BBOX, heightClass: "h-[56vh] min-h-[320px]" }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-4 text-[11px] flex-wrap", children: [
      /* @__PURE__ */ jsx(Legend, { dotClass: "bg-leaf", label: "Verificado" }),
      /* @__PURE__ */ jsx(Legend, { dotClass: "bg-orchid", label: "Pendiente" }),
      /* @__PURE__ */ jsx(Legend, { dotClass: "bg-warn/40 border border-warn", label: "Sensible (área)" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded-2xl bg-card border border-border p-3 text-xs text-foreground/80 flex gap-2", children: [
      /* @__PURE__ */ jsx(Info, { size: 14, className: "text-leaf shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxs("div", { children: [
        isLoading ? "Cargando puntos…" : `${filtered.length} avistamientos en ${REGION}.`,
        hiddenMasked > 0 && /* @__PURE__ */ jsxs(Fragment, { children: [
          " · ",
          /* @__PURE__ */ jsx(Lock, { size: 11, className: "inline" }),
          " ",
          hiddenMasked,
          " ocultos por completo."
        ] })
      ] })
    ] })
  ] }) });
}
function Chip({
  active,
  onClick,
  children
}) {
  return /* @__PURE__ */ jsx("button", { type: "button", onClick, className: "rounded-full px-3 py-1.5 text-xs font-medium border transition-colors " + (active ? "bg-leaf text-leaf-foreground border-leaf" : "bg-card text-foreground/70 border-border hover:bg-accent"), children });
}
function Legend({
  dotClass,
  label
}) {
  return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 text-muted-foreground", children: [
    /* @__PURE__ */ jsx("span", { className: "inline-block rounded-full h-2.5 w-2.5 " + dotClass }),
    label
  ] });
}
export {
  MapPage as component
};
