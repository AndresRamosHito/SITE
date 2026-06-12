import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Loader2, ShieldAlert, ArrowLeft, ShieldCheck } from "lucide-react";
import { S as Shell } from "./Shell-C-rNY99I.js";
import { s as supabase } from "./client-DcL2yrVT.js";
import { u as useAuth } from "./use-auth-peUko5yJ.js";
import "@supabase/supabase-js";
const STATUSES = ["new", "triaged", "escalated", "closed"];
function AdminReportsPage() {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [isAdmin, setIsAdmin] = useState(null);
  const [filter, setFilter] = useState("new");
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({
        to: "/login"
      });
      return;
    }
    supabase.from("profiles").select("role").eq("id", user.id).maybeSingle().then(({
      data: data2
    }) => setIsAdmin(data2?.role === "admin"));
  }, [user, loading, navigate]);
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["admin-reports", filter],
    queryFn: async () => {
      let q = supabase.from("trade_reports").select("id, kind, taxon_id, location_text, details, anonymous, status, created_at, reporter_id, reviewer_notes, taxon:taxa(sci_name)").order("created_at", {
        ascending: false
      }).limit(100);
      if (filter !== "all") q = q.eq("status", filter);
      const {
        data: data2,
        error
      } = await q;
      if (error) throw error;
      return data2 ?? [];
    },
    enabled: isAdmin === true
  });
  async function updateStatus(id, status, notes) {
    await supabase.from("trade_reports").update({
      status,
      reviewer_notes: notes ?? void 0,
      reviewer_id: user.id,
      resolved_at: status === "closed" ? (/* @__PURE__ */ new Date()).toISOString() : null
    }).eq("id", id);
    qc.invalidateQueries({
      queryKey: ["admin-reports"]
    });
  }
  if (loading || isAdmin === null) {
    return /* @__PURE__ */ jsx(Shell, { children: /* @__PURE__ */ jsx("div", { className: "p-8 text-center text-sm text-muted-foreground", children: /* @__PURE__ */ jsx(Loader2, { className: "animate-spin inline", size: 16 }) }) });
  }
  if (isAdmin === false) {
    return /* @__PURE__ */ jsx(Shell, { children: /* @__PURE__ */ jsxs("div", { className: "px-4 pt-10 text-center", children: [
      /* @__PURE__ */ jsx(ShieldAlert, { size: 36, className: "mx-auto text-destructive" }),
      /* @__PURE__ */ jsx("h1", { className: "mt-3 font-display text-xl", children: "Solo administradores" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-muted-foreground", children: "Esta cola está reservada al equipo de OrchidArc." }),
      /* @__PURE__ */ jsx(Link, { to: "/", className: "mt-5 inline-flex items-center gap-1 text-xs underline", children: "Volver" })
    ] }) });
  }
  return /* @__PURE__ */ jsx(Shell, { children: /* @__PURE__ */ jsxs("div", { className: "px-4 pt-5 pb-10", children: [
    /* @__PURE__ */ jsxs(Link, { to: "/", className: "inline-flex items-center gap-1 text-xs text-muted-foreground", children: [
      /* @__PURE__ */ jsx(ArrowLeft, { size: 12 }),
      " Volver"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 place-items-center rounded-2xl bg-destructive/10 text-destructive", children: /* @__PURE__ */ jsx(ShieldCheck, { size: 18 }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-display font-semibold", children: "Reportes" })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Cola de comercio ilegal — solo admins." }),
    /* @__PURE__ */ jsx("div", { className: "mt-4 flex gap-1.5 flex-wrap", children: ["all", ...STATUSES].map((s) => /* @__PURE__ */ jsx("button", { onClick: () => setFilter(s), className: "rounded-full px-3 py-1 text-[11px] font-medium border " + (filter === s ? "bg-foreground text-background border-foreground" : "bg-card text-foreground/70 border-border"), children: s === "all" ? "Todos" : statusLabel(s) }, s)) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3", children: [
      isLoading && /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Cargando…" }),
      (data ?? []).length === 0 && !isLoading && /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground text-center py-10", children: "Sin reportes en esta cola." }),
      (data ?? []).map((r) => /* @__PURE__ */ jsx(ReportCard, { report: r, onUpdate: updateStatus }, r.id))
    ] })
  ] }) });
}
function statusLabel(s) {
  return {
    new: "Nuevos",
    triaged: "Triaje",
    escalated: "Escalados",
    closed: "Cerrados"
  }[s];
}
function ReportCard({
  report,
  onUpdate
}) {
  const [notes, setNotes] = useState(report.reviewer_notes ?? "");
  const [busy, setBusy] = useState(null);
  async function go(s) {
    setBusy(s);
    await onUpdate(report.id, s, notes);
    setBusy(null);
  }
  return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsx("span", { className: "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase " + statusColor(report.status), children: statusLabel(report.status) }),
      /* @__PURE__ */ jsx("span", { className: "text-[10px] text-muted-foreground", children: new Date(report.created_at).toLocaleString("es-MX", {
        dateStyle: "short",
        timeStyle: "short"
      }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-2 text-xs", children: [
      /* @__PURE__ */ jsxs("div", { className: "font-semibold", children: [
        kindLabel(report.kind),
        report.taxon?.sci_name && /* @__PURE__ */ jsxs("span", { className: "font-normal italic", children: [
          " · ",
          report.taxon.sci_name
        ] })
      ] }),
      report.location_text && /* @__PURE__ */ jsxs("div", { className: "mt-0.5 text-foreground/80", children: [
        "📍 ",
        report.location_text
      ] }),
      report.details && /* @__PURE__ */ jsx("div", { className: "mt-1 text-foreground/80 whitespace-pre-wrap", children: report.details }),
      /* @__PURE__ */ jsx("div", { className: "mt-1.5 text-[10px] text-muted-foreground", children: report.anonymous ? "Anónimo" : "Identificado" })
    ] }),
    /* @__PURE__ */ jsx("textarea", { value: notes, onChange: (e) => setNotes(e.target.value), rows: 2, placeholder: "Notas internas…", className: "mt-2 w-full rounded-lg border border-border bg-background px-2 py-1.5 text-xs" }),
    /* @__PURE__ */ jsx("div", { className: "mt-2 flex gap-1.5 flex-wrap", children: STATUSES.filter((s) => s !== report.status).map((s) => /* @__PURE__ */ jsx("button", { onClick: () => go(s), disabled: busy === s, className: "rounded-lg border border-border bg-background px-2.5 py-1 text-[11px] font-medium disabled:opacity-50", children: busy === s ? "…" : "→ " + statusLabel(s) }, s)) })
  ] });
}
function statusColor(s) {
  return {
    new: "bg-orchid/15 text-orchid",
    triaged: "bg-warn/15 text-warn",
    escalated: "bg-destructive/15 text-destructive",
    closed: "bg-leaf/15 text-leaf"
  }[s];
}
function kindLabel(k) {
  return {
    market_sale: "Mercado/Feria",
    online_sale: "Anuncio online",
    field_extraction: "Extracción en campo",
    other: "Otro"
  }[k ?? ""] ?? "—";
}
export {
  AdminReportsPage as component
};
