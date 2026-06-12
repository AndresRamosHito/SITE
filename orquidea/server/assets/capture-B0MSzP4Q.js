import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useRef, useState, useEffect } from "react";
import { ArrowLeft, Shield, Loader2, Camera, MapPin, AlertCircle, Check } from "lucide-react";
import { S as Shell, R as REGION } from "./Shell-C-rNY99I.js";
import { u as useAuth } from "./use-auth-peUko5yJ.js";
import { s as supabase } from "./client-DcL2yrVT.js";
import { T as TaxonCombobox } from "./TaxonCombobox-BZStUzNJ.js";
import "@supabase/supabase-js";
async function stripExifAndDownscale(file, maxEdge = 1600) {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const { width, height } = fitInside(img.width, img.height, maxEdge);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas no disponible");
    ctx.drawImage(img, 0, 0, width, height);
    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob((b) => b ? resolve(b) : reject(new Error("Encoding failed")), "image/jpeg", 0.82);
    });
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
function fitInside(w, h, max) {
  if (w <= max && h <= max) return { width: w, height: h };
  const r = w > h ? max / w : max / h;
  return { width: Math.round(w * r), height: Math.round(h * r) };
}
function CapturePage() {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [locationLabel, setLocationLabel] = useState("");
  const [observedAt, setObservedAt] = useState(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 16));
  const [notes, setNotes] = useState("");
  const [selectedTaxon, setSelectedTaxon] = useState(null);
  const [variety, setVariety] = useState("");
  const [origin, setOrigin] = useState("wild");
  const [stripping, setStripping] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!loading && !user) navigate({
      to: "/login"
    });
  }, [loading, user, navigate]);
  async function handleFile(f) {
    setError(null);
    setStripping(true);
    try {
      const cleaned = await stripExifAndDownscale(f);
      setFile(cleaned);
      if (preview) URL.revokeObjectURL(preview);
      setPreview(URL.createObjectURL(cleaned));
    } catch (e) {
      setError(e.message || "No pudimos procesar la foto.");
    } finally {
      setStripping(false);
    }
  }
  async function handleSubmit() {
    if (!user || !file) return;
    setSubmitting(true);
    setError(null);
    try {
      const ext = "jpg";
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
      const up = await supabase.storage.from("sightings").upload(path, file, {
        contentType: "image/jpeg",
        upsert: false
      });
      if (up.error) throw up.error;
      const pub = supabase.storage.from("sightings").getPublicUrl(path);
      const taxonId = selectedTaxon?.id ?? "";
      const ins = await supabase.from("sightings").insert({
        user_id: user.id,
        taxon_id: taxonId || null,
        photo_url: pub.data.publicUrl,
        observed_at: new Date(observedAt).toISOString(),
        location_label: locationLabel || REGION,
        location_precision: selectedTaxon?.is_sensitive ? "fuzzed" : "fuzzed",
        notes: notes || null,
        variety: variety.trim() || null,
        origin,
        status: taxonId ? "pending" : "needs_id"
      });
      if (ins.error) throw ins.error;
      navigate({
        to: "/lista"
      });
    } catch (e) {
      setError(e.message || "No pudimos guardar el avistamiento.");
    } finally {
      setSubmitting(false);
    }
  }
  if (loading || !user) return /* @__PURE__ */ jsx(Shell, { children: /* @__PURE__ */ jsx("div", { className: "p-6 text-sm text-muted-foreground", children: "Cargando…" }) });
  return /* @__PURE__ */ jsx(Shell, { children: /* @__PURE__ */ jsxs("div", { className: "px-4 pt-5 pb-10", children: [
    /* @__PURE__ */ jsxs(Link, { to: "/", className: "inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground", children: [
      /* @__PURE__ */ jsx(ArrowLeft, { size: 12 }),
      " Volver"
    ] }),
    /* @__PURE__ */ jsx("h1", { className: "mt-2 text-2xl font-display font-semibold", children: "Nuevo avistamiento" }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "La foto se procesa en tu teléfono — eliminamos los datos de GPS antes de subirla." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5", children: [
      preview ? /* @__PURE__ */ jsxs("div", { className: "relative rounded-2xl overflow-hidden border border-border bg-card", children: [
        /* @__PURE__ */ jsx("img", { src: preview, alt: "", className: "w-full h-64 object-cover" }),
        /* @__PURE__ */ jsxs("span", { className: "absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-leaf/90 text-leaf-foreground px-2 py-1 text-[10px] font-semibold", children: [
          /* @__PURE__ */ jsx(Shield, { size: 11 }),
          " EXIF eliminado"
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => fileRef.current?.click(), className: "absolute bottom-2 right-2 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium border border-border", children: "Cambiar foto" })
      ] }) : /* @__PURE__ */ jsx("button", { type: "button", onClick: () => fileRef.current?.click(), className: "w-full h-64 rounded-2xl border-2 border-dashed border-border bg-card grid place-items-center text-muted-foreground hover:bg-accent/30 transition", children: stripping ? /* @__PURE__ */ jsxs("span", { className: "flex flex-col items-center gap-2 text-xs", children: [
        /* @__PURE__ */ jsx(Loader2, { size: 28, className: "animate-spin" }),
        " Procesando…"
      ] }) : /* @__PURE__ */ jsxs("span", { className: "flex flex-col items-center gap-2 text-xs", children: [
        /* @__PURE__ */ jsx(Camera, { size: 32 }),
        " Toca para tomar o elegir foto"
      ] }) }),
      /* @__PURE__ */ jsx("input", { ref: fileRef, type: "file", accept: "image/*", capture: "environment", className: "hidden", onChange: (e) => e.target.files?.[0] && handleFile(e.target.files[0]) })
    ] }),
    /* @__PURE__ */ jsx(Field, { label: "Especie (puedes dejarlo en blanco si no estás seguro)", children: /* @__PURE__ */ jsx(TaxonCombobox, { value: selectedTaxon?.id ?? "", onChange: (_id, t) => setSelectedTaxon(t), placeholder: "— Sin identificar (pediremos ayuda) —" }) }),
    /* @__PURE__ */ jsx(Field, { label: "Variedad o subespecie (opcional)", children: /* @__PURE__ */ jsx("input", { value: variety, onChange: (e) => setVariety(e.target.value.slice(0, 120)), placeholder: "Ej. var. alba, subsp. majus, forma peloric…", className: "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm italic" }) }),
    /* @__PURE__ */ jsx(Field, { label: "Origen del ejemplar", children: /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: [{
      v: "wild",
      label: "En su hábitat",
      hint: "Observación silvestre"
    }, {
      v: "collection",
      label: "En colección",
      hint: "Cultivo o colección particular"
    }].map((opt) => {
      const active = origin === opt.v;
      return /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => setOrigin(opt.v), className: "rounded-xl border px-3 py-2 text-left text-xs transition " + (active ? "border-leaf bg-leaf/10 text-foreground" : "border-border bg-background text-muted-foreground hover:bg-accent/30"), children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-foreground", children: opt.label }),
        /* @__PURE__ */ jsx("div", { className: "mt-0.5", children: opt.hint })
      ] }, opt.v);
    }) }) }),
    /* @__PURE__ */ jsx(Field, { label: "Lugar (texto general, sin coordenadas)", children: /* @__PURE__ */ jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsx(MapPin, { size: 14, className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
      /* @__PURE__ */ jsx("input", { value: locationLabel, onChange: (e) => setLocationLabel(e.target.value), placeholder: "Ej. cerca de Capulálpam, encinar", className: "w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2 text-sm" })
    ] }) }),
    /* @__PURE__ */ jsx(Field, { label: "Cuándo", children: /* @__PURE__ */ jsx("input", { type: "datetime-local", value: observedAt, onChange: (e) => setObservedAt(e.target.value), className: "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" }) }),
    /* @__PURE__ */ jsx(Field, { label: "Notas (hábitat, hospedero, etc.)", children: /* @__PURE__ */ jsx("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), rows: 3, className: "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm" }) }),
    selectedTaxon?.is_sensitive && /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-xl bg-warn/10 border border-warn/30 px-3 py-2.5 text-xs text-foreground/80 flex gap-2", children: [
      /* @__PURE__ */ jsx(Shield, { size: 14, className: "text-warn shrink-0 mt-0.5" }),
      "Especie sensible — su ubicación se publicará solo como región amplia, nunca como punto exacto."
    ] }),
    error && /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-xl bg-destructive/10 border border-destructive/30 px-3 py-2.5 text-xs text-destructive flex gap-2", children: [
      /* @__PURE__ */ jsx(AlertCircle, { size: 14, className: "shrink-0 mt-0.5" }),
      " ",
      error
    ] }),
    /* @__PURE__ */ jsxs("button", { onClick: handleSubmit, disabled: !file || submitting, className: "mt-6 w-full rounded-2xl bg-leaf text-leaf-foreground py-3 text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50", children: [
      submitting ? /* @__PURE__ */ jsx(Loader2, { size: 16, className: "animate-spin" }) : /* @__PURE__ */ jsx(Check, { size: 16 }),
      "Guardar avistamiento"
    ] })
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
  CapturePage as component
};
