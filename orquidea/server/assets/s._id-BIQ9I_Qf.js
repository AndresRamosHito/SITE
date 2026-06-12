import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, HelpCircle, Lock, MapPin, ShieldCheck, CheckCircle2, ThumbsUp, Loader2, Send, BadgeCheck, MessageCircle } from "lucide-react";
import { S as Shell, R as REGION } from "./Shell-C-rNY99I.js";
import { O as Orchid } from "./Orchid-COmBCarK.js";
import { T as TaxonCombobox } from "./TaxonCombobox-BZStUzNJ.js";
import { s as supabase } from "./client-DcL2yrVT.js";
import { u as useAuth } from "./use-auth-peUko5yJ.js";
import { b as Route } from "./router-D5x7JZDN.js";
import "@supabase/supabase-js";
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
function SightingDetail() {
  const {
    id
  } = Route.useParams();
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const sightingQ = useQuery({
    queryKey: ["sighting", id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.rpc("sighting_public_one", {
        p_id: id
      });
      if (error) throw error;
      return data?.[0] ?? null;
    }
  });
  const commentsQ = useQuery({
    queryKey: ["sighting-comments", id],
    queryFn: async () => {
      const [comm, agree, taxa, profs] = await Promise.all([supabase.from("sighting_comments").select("id, user_id, body, suggested_taxon_id, created_at").eq("sighting_id", id).order("created_at", {
        ascending: true
      }), supabase.from("comment_agreements").select("comment_id, user_id"), supabase.from("taxa").select("id, sci_name, common_name"), supabase.from("profiles").select("id, handle, display_name")]);
      if (comm.error) throw comm.error;
      const taxaById = new Map((taxa.data ?? []).map((t) => [t.id, t]));
      const profById = new Map((profs.data ?? []).map((p) => [p.id, p]));
      const agreeBy = /* @__PURE__ */ new Map();
      for (const a of agree.data ?? []) {
        const arr = agreeBy.get(a.comment_id) ?? [];
        arr.push(a.user_id);
        agreeBy.set(a.comment_id, arr);
      }
      return {
        rows: comm.data ?? [],
        taxaById,
        profById,
        agreeBy
      };
    }
  });
  const [body, setBody] = useState("");
  const [suggested, setSuggested] = useState("");
  const addComment = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("auth required");
      const trimmed = body.trim();
      if (!trimmed && !suggested) throw new Error("Escribe algo o sugiere una especie.");
      const {
        error
      } = await supabase.from("sighting_comments").insert({
        sighting_id: id,
        user_id: user.id,
        body: trimmed || null,
        suggested_taxon_id: suggested || null
      });
      if (error) throw error;
    },
    onSuccess: async () => {
      setBody("");
      setSuggested("");
      await Promise.all([qc.invalidateQueries({
        queryKey: ["sighting-comments", id]
      }), qc.invalidateQueries({
        queryKey: ["sighting", id]
      })]);
    }
  });
  const toggleAgree = useMutation({
    mutationFn: async ({
      commentId,
      agreed
    }) => {
      if (!user) throw new Error("auth required");
      if (agreed) {
        const {
          error
        } = await supabase.from("comment_agreements").delete().eq("comment_id", commentId).eq("user_id", user.id);
        if (error) throw error;
      } else {
        const {
          error
        } = await supabase.from("comment_agreements").insert({
          comment_id: commentId,
          user_id: user.id
        });
        if (error) throw error;
      }
    },
    onSuccess: async () => {
      await Promise.all([qc.invalidateQueries({
        queryKey: ["sighting-comments", id]
      }), qc.invalidateQueries({
        queryKey: ["sighting", id]
      })]);
    }
  });
  const s = sightingQ.data;
  return /* @__PURE__ */ jsx(Shell, { active: "feed", children: /* @__PURE__ */ jsxs("div", { className: "px-4 pt-4", children: [
    /* @__PURE__ */ jsxs("button", { type: "button", onClick: () => navigate({
      to: "/"
    }), className: "inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground", children: [
      /* @__PURE__ */ jsx(ArrowLeft, { size: 14 }),
      " Volver"
    ] }),
    sightingQ.isLoading && /* @__PURE__ */ jsx("div", { className: "mt-6 h-44 rounded-3xl bg-muted animate-pulse" }),
    sightingQ.isSuccess && !s && /* @__PURE__ */ jsx("div", { className: "mt-8 rounded-2xl border border-border p-6 text-center text-sm text-muted-foreground", children: "Este avistamiento no existe o fue eliminado." }),
    s && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("article", { className: "mt-4 rounded-3xl border border-border/70 bg-card overflow-hidden shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative h-56 grid place-items-center bg-gradient-to-br from-accent/40 to-secondary/30", children: [
          s.photo_url ? /* @__PURE__ */ jsx("img", { src: s.photo_url, alt: s.sci_name ?? "Avistamiento", className: "h-full w-full object-cover" }) : /* @__PURE__ */ jsx(Orchid, { sciName: s.sci_name, size: 180 }),
          !s.sci_name && !s.photo_url && /* @__PURE__ */ jsxs("div", { className: "absolute inset-0 grid place-items-center gap-2 text-leaf pointer-events-none", children: [
            /* @__PURE__ */ jsx(HelpCircle, { size: 28 }),
            /* @__PURE__ */ jsx("span", { className: "text-xs font-semibold", children: "Sin identificar" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "font-display italic text-[18px] leading-tight", children: s.sci_name ?? "Orquídea sin identificar" }),
              s.common_name && /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: s.common_name }),
              s.taxon_id && /* @__PURE__ */ jsx(Link, { to: "/especies/$id", params: {
                id: s.taxon_id
              }, className: "mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-leaf", children: "Ver ficha de la especie →" })
            ] }),
            /* @__PURE__ */ jsx(StatusBadge, { status: s.status })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted-foreground", children: [
            /* @__PURE__ */ jsx("span", { children: relativeTime(s.observed_at ?? s.created_at) }),
            s.is_masked ? /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Lock, { size: 12 }),
              " Ubicación protegida · ",
              REGION
            ] }) : /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(MapPin, { size: 12 }),
              " ",
              s.location_label ?? REGION
            ] })
          ] }),
          s.is_sensitive && /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded-xl bg-warn/10 border border-warn/30 px-3 py-2 text-[12px] text-foreground/80 flex gap-2", children: [
            /* @__PURE__ */ jsx(ShieldCheck, { size: 14, className: "text-warn shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsx("div", { children: "Especie sensible. Las coordenadas exactas no se muestran a nadie excepto al observador y los verificadores." })
          ] }),
          s.notes && /* @__PURE__ */ jsx("p", { className: "mt-3 text-sm text-foreground/85 whitespace-pre-wrap leading-snug", children: s.notes })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("section", { className: "mt-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsx("h2", { className: "font-display text-lg font-semibold", children: "Discusión" }),
          /* @__PURE__ */ jsxs("span", { className: "text-[11px] text-muted-foreground inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(CheckCircle2, { size: 12 }),
            " 3 acuerdos → verificado"
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: "Las sugerencias de ID son comunitarias. Cuando una especie sugerida acumula 3 personas de acuerdo, el avistamiento se marca como verificado." }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-3", children: [
          commentsQ.isLoading && /* @__PURE__ */ jsx("div", { className: "h-16 rounded-xl bg-muted animate-pulse" }),
          commentsQ.data && commentsQ.data.rows.length === 0 && /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-dashed border-border p-4 text-xs text-muted-foreground text-center", children: "Nadie ha comentado todavía. Sé el primero en proponer una ID." }),
          commentsQ.data?.rows.map((c) => {
            const taxon = c.suggested_taxon_id ? commentsQ.data.taxaById.get(c.suggested_taxon_id) : null;
            const prof = commentsQ.data.profById.get(c.user_id);
            const agrees = commentsQ.data.agreeBy.get(c.id) ?? [];
            const support = 1 + agrees.length;
            const iAgree = user ? agrees.includes(user.id) : false;
            const isMine = user?.id === c.user_id;
            return /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-border bg-card p-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-[11px] text-muted-foreground", children: [
                /* @__PURE__ */ jsxs("span", { className: "font-medium text-foreground/80", children: [
                  "@",
                  prof?.handle ?? "spotter"
                ] }),
                /* @__PURE__ */ jsx("span", { children: relativeTime(c.created_at) })
              ] }),
              taxon && /* @__PURE__ */ jsxs("div", { className: "mt-2 rounded-lg bg-leaf/10 text-leaf px-2.5 py-1.5 text-xs", children: [
                "Sugiere: ",
                /* @__PURE__ */ jsx("span", { className: "italic font-semibold", children: taxon.sci_name }),
                taxon.common_name && /* @__PURE__ */ jsxs("span", { className: "opacity-70", children: [
                  " · ",
                  taxon.common_name
                ] })
              ] }),
              c.body && /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-foreground/85 whitespace-pre-wrap leading-snug", children: c.body }),
              c.suggested_taxon_id && /* @__PURE__ */ jsxs("div", { className: "mt-2 flex items-center justify-between", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-muted-foreground", children: [
                  support,
                  " de 3 apoyos"
                ] }),
                user ? /* @__PURE__ */ jsxs("button", { type: "button", disabled: isMine || toggleAgree.isPending, onClick: () => toggleAgree.mutate({
                  commentId: c.id,
                  agreed: iAgree
                }), className: "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition " + (isMine ? "bg-muted text-muted-foreground cursor-not-allowed" : iAgree ? "bg-leaf text-leaf-foreground" : "bg-leaf/10 text-leaf hover:bg-leaf/20"), children: [
                  /* @__PURE__ */ jsx(ThumbsUp, { size: 11 }),
                  " ",
                  isMine ? "Tu sugerencia" : iAgree ? "De acuerdo" : "Estoy de acuerdo"
                ] }) : /* @__PURE__ */ jsx(Link, { to: "/login", className: "text-[11px] text-leaf font-semibold", children: "Entra para apoyar" })
              ] })
            ] }, c.id);
          })
        ] }),
        user ? /* @__PURE__ */ jsxs("form", { className: "mt-4 rounded-2xl border border-border bg-card p-3 space-y-2", onSubmit: (e) => {
          e.preventDefault();
          addComment.mutate();
        }, children: [
          /* @__PURE__ */ jsx("label", { className: "block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground", children: "Sugerir especie (opcional)" }),
          /* @__PURE__ */ jsx(TaxonCombobox, { value: suggested, onChange: (id2) => setSuggested(id2), placeholder: "— Sin sugerencia —" }),
          /* @__PURE__ */ jsx("textarea", { value: body, onChange: (e) => setBody(e.target.value), placeholder: "Comentario, observación de campo, ¿por qué piensas que es esta especie?", rows: 3, className: "w-full rounded-lg border border-border bg-background px-2 py-1.5 text-sm resize-none" }),
          addComment.error && /* @__PURE__ */ jsx("div", { className: "text-[11px] text-destructive", children: addComment.error.message }),
          /* @__PURE__ */ jsxs("button", { type: "submit", disabled: addComment.isPending, className: "inline-flex items-center gap-1.5 rounded-full bg-leaf text-leaf-foreground px-3 py-1.5 text-xs font-semibold disabled:opacity-50", children: [
            addComment.isPending ? /* @__PURE__ */ jsx(Loader2, { size: 12, className: "animate-spin" }) : /* @__PURE__ */ jsx(Send, { size: 12 }),
            "Publicar"
          ] })
        ] }) : /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-2xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground", children: [
          /* @__PURE__ */ jsx(Link, { to: "/login", className: "text-leaf font-semibold", children: "Entra" }),
          " ",
          "para comentar o sugerir una ID."
        ] })
      ] })
    ] })
  ] }) });
}
function StatusBadge({
  status
}) {
  if (status === "verified") {
    return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-leaf/10 text-leaf px-2 py-1 text-[10px] font-semibold uppercase tracking-wide", children: [
      /* @__PURE__ */ jsx(BadgeCheck, { size: 11 }),
      " Verificado"
    ] });
  }
  if (status === "needs_id") {
    return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-orchid/10 text-orchid px-2 py-1 text-[10px] font-semibold uppercase tracking-wide", children: [
      /* @__PURE__ */ jsx(HelpCircle, { size: 11 }),
      " Necesita ID"
    ] });
  }
  if (status === "rejected") {
    return /* @__PURE__ */ jsx("span", { className: "inline-flex items-center gap-1 rounded-full bg-destructive/10 text-destructive px-2 py-1 text-[10px] font-semibold uppercase tracking-wide", children: "Rechazado" });
  }
  return /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 rounded-full bg-muted text-muted-foreground px-2 py-1 text-[10px] font-semibold uppercase tracking-wide", children: [
    /* @__PURE__ */ jsx(MessageCircle, { size: 11 }),
    " En revisión"
  ] });
}
export {
  SightingDetail as component
};
