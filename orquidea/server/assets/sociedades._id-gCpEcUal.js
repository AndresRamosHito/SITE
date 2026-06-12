import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useRef, useEffect, useState } from "react";
import { ArrowLeft, Loader2, Send } from "lucide-react";
import { S as Shell } from "./Shell-C-rNY99I.js";
import { s as supabase } from "./client-DcL2yrVT.js";
import { u as useAuth } from "./use-auth-peUko5yJ.js";
import { a as Route } from "./router-D5x7JZDN.js";
import "@supabase/supabase-js";
function SocietyDetail() {
  const {
    id
  } = Route.useParams();
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const endRef = useRef(null);
  useEffect(() => {
    if (!loading && !user) navigate({
      to: "/login"
    });
  }, [loading, user, navigate]);
  const {
    data: society
  } = useQuery({
    queryKey: ["society", id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("societies").select("id, name, full_name, color").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    }
  });
  const {
    data: messages,
    isLoading
  } = useQuery({
    queryKey: ["society-messages", id],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("society_messages").select("id, body, created_at, user_id, author:profiles!society_messages_user_id_fkey(handle, avatar_url)").eq("society_id", id).order("created_at", {
        ascending: true
      }).limit(200);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user
  });
  useEffect(() => {
    if (!user) return;
    const ch = supabase.channel(`soc:${id}`).on("postgres_changes", {
      event: "INSERT",
      schema: "public",
      table: "society_messages",
      filter: `society_id=eq.${id}`
    }, () => qc.invalidateQueries({
      queryKey: ["society-messages", id]
    })).subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [id, user, qc]);
  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end"
    });
  }, [messages]);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  async function send() {
    if (!user || !body.trim() || sending) return;
    setSending(true);
    const {
      error
    } = await supabase.from("society_messages").insert({
      society_id: id,
      user_id: user.id,
      body: body.trim().slice(0, 1e3)
    });
    if (!error) setBody("");
    setSending(false);
  }
  if (!user) return null;
  return /* @__PURE__ */ jsx(Shell, { active: "community", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col h-[calc(100vh-60px-96px)]", children: [
    /* @__PURE__ */ jsxs("div", { className: "px-4 pt-4 pb-3 border-b border-border/60 sticky top-[60px] bg-background/95 backdrop-blur z-10", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/sociedades", className: "inline-flex items-center gap-1 text-[11px] text-muted-foreground", children: [
        /* @__PURE__ */ jsx(ArrowLeft, { size: 11 }),
        " Sociedades"
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center gap-2", children: [
        /* @__PURE__ */ jsx("span", { className: "grid h-8 w-8 place-items-center rounded-lg text-white font-bold text-[11px] uppercase", style: {
          background: society?.color || "hsl(140 35% 32%)"
        }, children: society?.name?.slice(0, 3) || "···" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "font-semibold text-sm leading-tight", children: society?.name ?? "Sociedad" }),
          society?.full_name && /* @__PURE__ */ jsx("div", { className: "text-[10px] text-muted-foreground", children: society.full_name })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-3 space-y-2", children: [
      isLoading && /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Cargando…" }),
      (messages ?? []).length === 0 && !isLoading && /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground text-center py-8", children: "Sin mensajes todavía. Sé el primero en saludar." }),
      (messages ?? []).map((m) => {
        const mine = m.user_id === user.id;
        return /* @__PURE__ */ jsx("div", { className: "flex " + (mine ? "justify-end" : "justify-start"), children: /* @__PURE__ */ jsxs("div", { className: "max-w-[80%] rounded-2xl px-3 py-2 text-sm " + (mine ? "bg-leaf text-leaf-foreground rounded-br-sm" : "bg-card border border-border rounded-bl-sm"), children: [
          !mine && /* @__PURE__ */ jsxs("div", { className: "text-[10px] font-semibold opacity-70 mb-0.5", children: [
            "@",
            m.author?.handle ?? "anon"
          ] }),
          /* @__PURE__ */ jsx("div", { className: "whitespace-pre-wrap break-words", children: m.body })
        ] }) }, m.id);
      }),
      /* @__PURE__ */ jsx("div", { ref: endRef })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: (e) => {
      e.preventDefault();
      void send();
    }, className: "px-3 py-3 border-t border-border/60 bg-background flex gap-2 items-end", children: [
      /* @__PURE__ */ jsx("textarea", { value: body, onChange: (e) => setBody(e.target.value), placeholder: "Escribe un mensaje…", rows: 1, maxLength: 1e3, className: "flex-1 rounded-2xl border border-input bg-card px-3 py-2 text-sm outline-none focus:border-leaf focus:ring-2 focus:ring-leaf/20 resize-none" }),
      /* @__PURE__ */ jsx("button", { type: "submit", disabled: sending || !body.trim(), className: "grid h-10 w-10 place-items-center rounded-full bg-leaf text-leaf-foreground disabled:opacity-50 shrink-0", "aria-label": "Enviar", children: sending ? /* @__PURE__ */ jsx(Loader2, { size: 16, className: "animate-spin" }) : /* @__PURE__ */ jsx(Send, { size: 16 }) })
    ] })
  ] }) });
}
export {
  SocietyDetail as component
};
