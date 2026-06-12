import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { Flower2, MapPin, ShieldAlert, Leaf, UserCircle, LogIn, Home, Map, Plus, BookOpen, Users } from "lucide-react";
import { u as useAuth } from "./use-auth-peUko5yJ.js";
const REGION = "Sierra de Oaxaca";
function Shell({ children, active = "feed" }) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen w-full bg-background flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "relative w-full max-w-[460px] min-h-screen flex flex-col bg-background border-x border-border/60 shadow-[0_0_40px_-20px_rgba(0,0,0,0.15)]", children: [
    /* @__PURE__ */ jsxs("header", { className: "flex items-center justify-between px-4 py-3 border-b border-border/60 sticky top-0 z-20 bg-background/95 backdrop-blur", children: [
      /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2.5", children: [
        /* @__PURE__ */ jsx("span", { className: "grid h-9 w-9 place-items-center rounded-full bg-leaf text-leaf-foreground", children: /* @__PURE__ */ jsx(Flower2, { size: 17 }) }),
        /* @__PURE__ */ jsxs("div", { className: "leading-tight", children: [
          /* @__PURE__ */ jsxs("div", { className: "font-display text-[17px] tracking-tight", children: [
            "Orqu",
            /* @__PURE__ */ jsx("span", { className: "font-bold text-orchid", children: "ID" }),
            "ea"
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-[10px] text-muted-foreground flex items-center gap-1", children: [
            "por OrchidArc · ",
            /* @__PURE__ */ jsx(MapPin, { size: 9 }),
            " ",
            REGION
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/reportar",
            "aria-label": "Reportar comercio ilegal",
            className: "grid h-9 w-9 place-items-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition",
            children: /* @__PURE__ */ jsx(ShieldAlert, { size: 16 })
          }
        ),
        /* @__PURE__ */ jsxs("span", { className: "hidden xs:inline-flex items-center gap-1 rounded-full bg-leaf/10 text-leaf px-2 py-1 text-[10px] font-semibold", children: [
          /* @__PURE__ */ jsx(Leaf, { size: 10 }),
          " Solo observar"
        ] }),
        !loading && (user ? /* @__PURE__ */ jsx(
          Link,
          {
            to: "/lista",
            className: "grid h-9 w-9 place-items-center rounded-full bg-accent text-accent-foreground",
            "aria-label": "Mi cuenta",
            children: /* @__PURE__ */ jsx(UserCircle, { size: 18 })
          }
        ) : /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/login",
            className: "flex items-center gap-1 rounded-full bg-leaf text-leaf-foreground px-3 py-1.5 text-xs font-semibold",
            children: [
              /* @__PURE__ */ jsx(LogIn, { size: 12 }),
              " Entrar"
            ]
          }
        ))
      ] })
    ] }),
    /* @__PURE__ */ jsx("main", { className: "flex-1 pb-24", children }),
    /* @__PURE__ */ jsxs("nav", { className: "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[460px] bg-background/95 backdrop-blur border-t border-border/60 px-2 py-2 z-20 flex items-center justify-around", children: [
      /* @__PURE__ */ jsx(NavLink, { to: "/", icon: /* @__PURE__ */ jsx(Home, { size: 20 }), label: "Inicio", active: active === "feed" }),
      /* @__PURE__ */ jsx(NavLink, { to: "/mapa", icon: /* @__PURE__ */ jsx(Map, { size: 20 }), label: "Mapa", active: active === "map" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: user ? "/capture" : "/login" }),
          "aria-label": "Nuevo avistamiento",
          className: "grid h-14 w-14 -mt-6 place-items-center rounded-full bg-orchid text-orchid-foreground shadow-lg shadow-orchid/30 hover:scale-105 transition",
          children: /* @__PURE__ */ jsx(Plus, { size: 26 })
        }
      ),
      /* @__PURE__ */ jsx(
        NavLink,
        {
          to: "/especies",
          icon: /* @__PURE__ */ jsx(BookOpen, { size: 20 }),
          label: "Especies",
          active: active === "species"
        }
      ),
      /* @__PURE__ */ jsx(
        NavLink,
        {
          to: "/sociedades",
          icon: /* @__PURE__ */ jsx(Users, { size: 20 }),
          label: "Comunidad",
          active: active === "community"
        }
      )
    ] })
  ] }) });
}
function NavLink({
  to,
  icon,
  label,
  active
}) {
  return /* @__PURE__ */ jsxs(
    Link,
    {
      to,
      className: "relative flex flex-col items-center gap-0.5 px-3 py-1 text-[10px] font-medium transition " + (active ? "text-leaf font-semibold" : "text-muted-foreground hover:text-foreground"),
      children: [
        icon,
        /* @__PURE__ */ jsx("span", { children: label }),
        /* @__PURE__ */ jsx(
          "span",
          {
            "aria-hidden": true,
            className: "absolute -bottom-1 h-1 w-1 rounded-full bg-orchid transition-opacity " + (active ? "opacity-100" : "opacity-0")
          }
        )
      ]
    }
  );
}
export {
  REGION as R,
  Shell as S
};
