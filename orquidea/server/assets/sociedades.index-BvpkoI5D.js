import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Users, Loader2, Check, ArrowRight } from "lucide-react";
import { S as Shell } from "./Shell-C-rNY99I.js";
import { s as supabase } from "./client-DcL2yrVT.js";
import { u as useAuth } from "./use-auth-peUko5yJ.js";
import { useState } from "react";
import "@supabase/supabase-js";
function SocietiesPage() {
  const {
    user
  } = useAuth();
  const qc = useQueryClient();
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["societies", user?.id],
    queryFn: async () => {
      const [socs, mems] = await Promise.all([supabase.from("societies").select("id, name, full_name, color, is_official, facebook_url").order("is_official", {
        ascending: false
      }).order("name"), user ? supabase.from("society_members").select("society_id").eq("user_id", user.id) : Promise.resolve({
        data: [],
        error: null
      })]);
      if (socs.error) throw socs.error;
      if (mems.error) throw mems.error;
      const joinedIds = new Set((mems.data ?? []).map((m) => m.society_id));
      return (socs.data ?? []).map((s) => ({
        ...s,
        joined: joinedIds.has(s.id)
      }));
    }
  });
  const [pendingId, setPendingId] = useState(null);
  async function toggle(id, joined) {
    if (!user) return;
    setPendingId(id);
    if (joined) {
      await supabase.from("society_members").delete().eq("society_id", id).eq("user_id", user.id);
    } else {
      await supabase.from("society_members").insert({
        society_id: id,
        user_id: user.id
      });
    }
    await qc.invalidateQueries({
      queryKey: ["societies", user.id]
    });
    setPendingId(null);
  }
  return /* @__PURE__ */ jsx(Shell, { active: "community", children: /* @__PURE__ */ jsxs("div", { className: "px-4 pt-5 pb-10", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 place-items-center rounded-2xl bg-leaf/15 text-leaf", children: /* @__PURE__ */ jsx(Users, { size: 18 }) }),
      /* @__PURE__ */ jsx("h1", { className: "text-2xl font-display font-semibold", children: "Sociedades" })
    ] }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-xs text-muted-foreground max-w-[34ch]", children: "Únete a sociedades orquideológicas de la región para coordinar salidas, IDs y conservación." }),
    !user && /* @__PURE__ */ jsxs("div", { className: "mt-4 rounded-2xl bg-accent/40 border border-border p-3 text-xs", children: [
      /* @__PURE__ */ jsx(Link, { to: "/login", className: "font-semibold text-leaf underline", children: "Entra" }),
      " ",
      "para unirte y participar en los grupos."
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 space-y-3", children: [
      isLoading && /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: "Cargando…" }),
      (data ?? []).map((s) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl bg-card border border-border p-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsx("div", { className: "grid h-11 w-11 place-items-center rounded-xl text-white font-bold text-sm uppercase shrink-0", style: {
            background: s.color || "hsl(140 35% 32%)"
          }, children: s.name.slice(0, 3) }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [
              /* @__PURE__ */ jsx("span", { className: "font-semibold text-sm", children: s.name }),
              s.is_official && /* @__PURE__ */ jsx("span", { className: "rounded-full bg-leaf/10 text-leaf px-1.5 py-0.5 text-[9px] font-semibold uppercase", children: "Oficial" })
            ] }),
            s.full_name && /* @__PURE__ */ jsx("div", { className: "text-[11px] text-muted-foreground truncate", children: s.full_name })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-3 flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("button", { type: "button", disabled: !user || pendingId === s.id, onClick: () => toggle(s.id, s.joined), className: "flex-1 rounded-xl py-2 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition disabled:opacity-50 " + (s.joined ? "bg-leaf/10 text-leaf border border-leaf/30" : "bg-leaf text-leaf-foreground"), children: pendingId === s.id ? /* @__PURE__ */ jsx(Loader2, { size: 13, className: "animate-spin" }) : s.joined ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(Check, { size: 13 }),
            " Miembro"
          ] }) : "Unirme" }),
          s.joined && /* @__PURE__ */ jsxs(Link, { to: "/sociedades/$id", params: {
            id: s.id
          }, className: "rounded-xl bg-card border border-border px-3 py-2 text-xs font-semibold inline-flex items-center gap-1", children: [
            "Entrar ",
            /* @__PURE__ */ jsx(ArrowRight, { size: 12 })
          ] })
        ] })
      ] }, s.id))
    ] })
  ] }) });
}
export {
  SocietiesPage as component
};
