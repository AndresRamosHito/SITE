import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useRef, useEffect, useMemo } from "react";
import { Shield, X, ChevronsUpDown, Search, Check } from "lucide-react";
import { s as supabase } from "./client-DcL2yrVT.js";
function TaxonCombobox({ value, onChange, placeholder }) {
  const [taxa, setTaxa] = useState([]);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const wrapRef = useRef(null);
  useEffect(() => {
    supabase.from("taxa").select("id, sci_name, common_name, is_sensitive").order("sci_name").limit(5e3).then(({ data }) => {
      if (data) setTaxa(data);
    });
  }, []);
  useEffect(() => {
    if (!open) return;
    function onDown(e) {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    }
    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [open]);
  const selected = useMemo(() => taxa.find((t) => t.id === value) || null, [taxa, value]);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return taxa.slice(0, 80);
    const out = [];
    for (const t of taxa) {
      const hay = (t.sci_name + " " + (t.common_name ?? "")).toLowerCase();
      if (hay.includes(q)) {
        out.push(t);
        if (out.length >= 80) break;
      }
    }
    return out;
  }, [query, taxa]);
  function pick(t) {
    onChange(t?.id ?? "", t);
    setOpen(false);
    setQuery("");
  }
  return /* @__PURE__ */ jsxs("div", { ref: wrapRef, className: "relative", children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: () => {
          setOpen((o) => !o);
          setTimeout(() => inputRef.current?.focus(), 0);
        },
        className: "w-full flex items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-2 text-left text-sm",
        children: [
          /* @__PURE__ */ jsx("span", { className: selected ? "" : "text-muted-foreground", children: selected ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { className: "italic", children: selected.sci_name }),
            selected.common_name ? /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
              " · ",
              selected.common_name
            ] }) : null,
            selected.is_sensitive ? /* @__PURE__ */ jsx(Shield, { size: 12, className: "inline ml-1 text-warn" }) : null
          ] }) : placeholder || "Buscar especie…" }),
          /* @__PURE__ */ jsxs("span", { className: "flex items-center gap-1", children: [
            selected && /* @__PURE__ */ jsx(
              X,
              {
                size: 14,
                className: "text-muted-foreground hover:text-foreground",
                onClick: (e) => {
                  e.stopPropagation();
                  pick(null);
                }
              }
            ),
            /* @__PURE__ */ jsx(ChevronsUpDown, { size: 14, className: "text-muted-foreground" })
          ] })
        ]
      }
    ),
    open && /* @__PURE__ */ jsxs("div", { className: "absolute z-50 mt-1 w-full rounded-xl border border-border bg-popover shadow-lg overflow-hidden", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 border-b border-border px-3 py-2", children: [
        /* @__PURE__ */ jsx(Search, { size: 14, className: "text-muted-foreground" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            ref: inputRef,
            value: query,
            onChange: (e) => setQuery(e.target.value),
            placeholder: "Escribe nombre científico o común…",
            className: "w-full bg-transparent text-sm outline-none"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("ul", { className: "max-h-72 overflow-y-auto py-1", children: [
        !taxa.length && /* @__PURE__ */ jsx("li", { className: "px-3 py-2 text-xs text-muted-foreground", children: "Cargando catálogo…" }),
        taxa.length > 0 && results.length === 0 && /* @__PURE__ */ jsx("li", { className: "px-3 py-2 text-xs text-muted-foreground", children: "Sin resultados." }),
        results.map((t) => {
          const isSel = t.id === value;
          return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => pick(t),
              className: "w-full flex items-start gap-2 px-3 py-2 text-left text-sm hover:bg-accent/50",
              children: [
                /* @__PURE__ */ jsx(Check, { size: 14, className: isSel ? "mt-0.5 opacity-100" : "mt-0.5 opacity-0" }),
                /* @__PURE__ */ jsxs("span", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsx("span", { className: "italic", children: t.sci_name }),
                  t.common_name && /* @__PURE__ */ jsxs("span", { className: "text-muted-foreground", children: [
                    " · ",
                    t.common_name
                  ] }),
                  t.is_sensitive && /* @__PURE__ */ jsx(Shield, { size: 11, className: "inline ml-1 text-warn" })
                ] })
              ]
            }
          ) }, t.id);
        }),
        taxa.length > 0 && !query && taxa.length > results.length && /* @__PURE__ */ jsxs("li", { className: "px-3 py-1.5 text-[10px] text-muted-foreground text-center", children: [
          "Mostrando ",
          results.length,
          " de ",
          taxa.length,
          " — escribe para filtrar"
        ] })
      ] })
    ] })
  ] });
}
export {
  TaxonCombobox as T
};
