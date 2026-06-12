import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Check, ArrowLeft, ShieldAlert, Lock, AlertCircle, Loader2 } from "lucide-react";
import { S as Shell } from "./Shell-C-rNY99I.js";
import { s as supabase } from "./client-DcL2yrVT.js";
import { u as useAuth } from "./use-auth-peUko5yJ.js";
import "@supabase/supabase-js";
function ReportPage() {
  const {
    user
  } = useAuth();
  const [taxa, setTaxa] = useState([]);
  const [kind, setKind] = useState("market_sale");
  const [taxonId, setTaxonId] = useState("");
  const [locationText, setLocationText] = useState("");
  const [details, setDetails] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    supabase.from("taxa").select("id, sci_name, common_name").order("sci_name").then(({
      data
    }) => {
      if (data) setTaxa(data);
    });
  }, []);
  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const willBeAnonymous = anonymous || !user;
      const {
        error: error2
      } = await supabase.from("trade_reports").insert({
        kind,
        taxon_id: taxonId || null,
        location_text: locationText || null,
        details: details || null,
        anonymous: willBeAnonymous,
        reporter_id: willBeAnonymous ? null : user.id
      });
      if (error2) throw error2;
      setDone(true);
    } catch (e) {
      setError(e.message || "No pudimos enviar el reporte.");
    } finally {
      setSubmitting(false);
    }
  }
  if (done) {
    return /* @__PURE__ */ jsx(Shell, { children: /* @__PURE__ */ jsxs("div", { className: "px-4 pt-10 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "mx-auto grid h-16 w-16 place-items-center rounded-full bg-leaf/15 text-leaf", children: /* @__PURE__ */ jsx(Check, { size: 28 }) }),
      /* @__PURE__ */ jsx("h1", { className: "mt-4 font-display text-2xl font-semibold", children: "Reporte enviado" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground max-w-xs mx-auto", children: "Gracias por ayudar a proteger las orquídeas de la Sierra. El equipo de OrchidArc revisará tu reporte." }),
      /* @__PURE__ */ jsx(Link, { to: "/", className: "mt-6 inline-flex items-center gap-1 rounded-full bg-leaf text-leaf-foreground px-4 py-2 text-xs font-semibold", children: "Volver al inicio" })
    ] }) });
  }
  return /* @__PURE__ */ jsx(Shell, { children: /* @__PURE__ */ jsxs("div", { className: "px-4 pt-5 pb-10", children: [
    /* @__PURE__ */ jsxs(Link, { to: "/", className: "inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground", children: [
      /* @__PURE__ */ jsx(ArrowLeft, { size: 12 }),
      " Volver"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 place-items-center rounded-2xl bg-destructive/10 text-destructive", children: /* @__PURE__ */ jsx(ShieldAlert, { size: 20 }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-display font-semibold", children: "Reportar comercio" })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mt-2", children: [
      "Reporta saqueo, ventas en mercados, anuncios online o extracción en campo. ",
      /* @__PURE__ */ jsx(Lock, { size: 10, className: "inline" }),
      " Puedes hacerlo de forma anónima."
    ] }),
    /* @__PURE__ */ jsx(Field, { label: "¿Qué viste?", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: [{
      v: "market_sale",
      l: "Mercado/Feria"
    }, {
      v: "online_sale",
      l: "Anuncio online"
    }, {
      v: "field_extraction",
      l: "Extracción en campo"
    }, {
      v: "other",
      l: "Otro"
    }].map((o) => /* @__PURE__ */ jsx("button", { type: "button", onClick: () => setKind(o.v), className: "rounded-xl border px-3 py-2 text-xs font-medium " + (kind === o.v ? "bg-destructive/10 border-destructive text-destructive" : "bg-card border-border text-foreground/80"), children: o.l }, o.v)) }) }),
    /* @__PURE__ */ jsx(Field, { label: "Especie (si la reconoces)", children: /* @__PURE__ */ jsxs("select", { value: taxonId, onChange: (e) => setTaxonId(e.target.value), className: "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm", children: [
      /* @__PURE__ */ jsx("option", { value: "", children: "— No estoy seguro —" }),
      taxa.map((t) => /* @__PURE__ */ jsxs("option", { value: t.id, children: [
        t.sci_name,
        t.common_name ? ` · ${t.common_name}` : ""
      ] }, t.id))
    ] }) }),
    /* @__PURE__ */ jsx(Field, { label: "Lugar (mercado, sitio web, paraje)", children: /* @__PURE__ */ jsx("input", { value: locationText, onChange: (e) => setLocationText(e.target.value), placeholder: "Ej. tianguis de Tlacolula, dom.", className: "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" }) }),
    /* @__PURE__ */ jsx(Field, { label: "Detalles", children: /* @__PURE__ */ jsx("textarea", { value: details, onChange: (e) => setDetails(e.target.value), rows: 4, placeholder: "Cantidades, precios, fotos publicadas, vendedor… cualquier detalle ayuda.", className: "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" }) }),
    user && /* @__PURE__ */ jsxs("label", { className: "mt-4 flex items-center gap-2 text-xs text-foreground/80", children: [
      /* @__PURE__ */ jsx("input", { type: "checkbox", checked: anonymous, onChange: (e) => setAnonymous(e.target.checked) }),
      "Enviar de forma anónima (no asociar a mi cuenta @",
      user.email,
      ")"
    ] }),
    error && /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-xl bg-destructive/10 border border-destructive/30 px-3 py-2.5 text-xs text-destructive flex gap-2", children: [
      /* @__PURE__ */ jsx(AlertCircle, { size: 14, className: "shrink-0 mt-0.5" }),
      " ",
      error
    ] }),
    /* @__PURE__ */ jsxs("button", { onClick: submit, disabled: submitting || !details && !locationText, className: "mt-6 w-full rounded-2xl bg-destructive text-destructive-foreground py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50", children: [
      submitting ? /* @__PURE__ */ jsx(Loader2, { size: 16, className: "animate-spin" }) : /* @__PURE__ */ jsx(ShieldAlert, { size: 16 }),
      "Enviar reporte"
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 text-[10px] text-muted-foreground text-center", children: "Tu reporte llega solo al equipo de OrchidArc. No se publica en el muro." })
  ] }) });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block mt-4", children: [
    /* @__PURE__ */ jsx("span", { className: "text-xs font-medium text-foreground/80", children: label }),
    /* @__PURE__ */ jsx("div", { className: "mt-1.5", children })
  ] });
}
export {
  ReportPage as component
};
