import { jsx, jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Flower2, BadgeCheck } from "lucide-react";
import { S as Shell, R as REGION } from "./Shell-C-rNY99I.js";
import { s as supabase } from "./client-DcL2yrVT.js";
import "@tanstack/react-router";
import "./use-auth-peUko5yJ.js";
import "react";
import "@supabase/supabase-js";
function RankingPage() {
  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const {
        data: data2,
        error
      } = await supabase.rpc("leaderboard", {
        p_limit: 50
      });
      if (error) throw error;
      return data2 ?? [];
    }
  });
  return /* @__PURE__ */ jsx(Shell, { active: "board", children: /* @__PURE__ */ jsxs("div", { className: "px-4 pt-5", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-2xl font-display font-semibold", children: "Ranking" }),
    /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
      "Spotters más activos en la ",
      REGION,
      "."
    ] }),
    isLoading && /* @__PURE__ */ jsx("p", { className: "mt-4 text-sm text-muted-foreground", children: "Cargando…" }),
    !isLoading && (data?.length ?? 0) === 0 && /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-2xl border border-dashed border-border p-6 text-center", children: [
      /* @__PURE__ */ jsx(Trophy, { size: 28, className: "mx-auto text-warn" }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm font-medium", children: "Aún no hay ranking." }),
      /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Sé el primero en registrar y verificar avistamientos." })
    ] }),
    /* @__PURE__ */ jsx("ol", { className: "mt-5 space-y-2", children: (data ?? []).map((row) => {
      const podium = row.position <= 3;
      return /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3 rounded-2xl border p-3 " + (podium ? "bg-gradient-to-r from-warn/10 to-transparent border-warn/40" : "bg-card border-border"), children: [
        /* @__PURE__ */ jsx("div", { className: "grid h-10 w-10 place-items-center rounded-full font-display font-semibold " + (row.position === 1 ? "bg-warn text-background" : row.position === 2 ? "bg-muted-foreground/30 text-foreground" : row.position === 3 ? "bg-orchid/80 text-orchid-foreground" : "bg-accent text-accent-foreground"), children: row.position }),
        /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsx("div", { className: "font-medium text-sm truncate", children: row.display_name ?? "—" }),
          /* @__PURE__ */ jsxs("div", { className: "text-[11px] text-muted-foreground truncate", children: [
            "@",
            row.handle ?? "—"
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-right text-[11px] text-muted-foreground", children: [
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Flower2, { size: 11 }),
            " ",
            row.species,
            " esp."
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(BadgeCheck, { size: 11 }),
            " ",
            row.verified,
            " verif."
          ] })
        ] })
      ] }, row.user_id);
    }) })
  ] }) });
}
export {
  RankingPage as component
};
