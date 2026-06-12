import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Loader2, Flower2, AtSign } from "lucide-react";
import { s as supabase } from "./client-DcL2yrVT.js";
import { u as useAuth } from "./use-auth-peUko5yJ.js";
import "@supabase/supabase-js";
function OnboardingPage() {
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  const [handle, setHandle] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  useEffect(() => {
    if (!loading && !user) navigate({
      to: "/login",
      replace: true
    });
  }, [loading, user, navigate]);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    const {
      error
    } = await supabase.rpc("claim_handle", {
      p_handle: handle
    });
    setBusy(false);
    if (error) {
      setErr(translateClaimError(error.message));
      return;
    }
    navigate({
      to: "/",
      replace: true
    });
  }
  if (loading || !user) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen grid place-items-center text-muted-foreground", children: /* @__PURE__ */ jsx(Loader2, { className: "animate-spin" }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center px-6 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-sm", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: "grid h-12 w-12 place-items-center rounded-full bg-leaf text-leaf-foreground", children: /* @__PURE__ */ jsx(Flower2, { size: 22 }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "font-display text-2xl tracking-tight", children: "Elige tu @handle" }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "Así te verá la comunidad." })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "mt-8 space-y-3", children: [
      /* @__PURE__ */ jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "@handle" }),
        /* @__PURE__ */ jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsx(AtSign, { size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsx("input", { value: handle, onChange: (e) => setHandle(e.target.value.toLowerCase()), required: true, minLength: 3, maxLength: 20, pattern: "[a-z0-9_]{3,20}", placeholder: "mariana_v", className: "w-full rounded-xl border border-input bg-card pl-9 pr-4 py-3 text-sm outline-none focus:border-leaf focus:ring-2 focus:ring-leaf/20" })
        ] })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-[11px] text-muted-foreground", children: "3-20 caracteres: minúsculas, números o guion bajo." }),
      err && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: err }),
      /* @__PURE__ */ jsxs("button", { type: "submit", disabled: busy, className: "w-full rounded-xl bg-leaf text-leaf-foreground font-semibold py-3 text-sm disabled:opacity-60 inline-flex items-center justify-center gap-2", children: [
        busy && /* @__PURE__ */ jsx(Loader2, { size: 14, className: "animate-spin" }),
        "Reclamar handle"
      ] }),
      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => navigate({
        to: "/"
      }), className: "w-full text-xs text-muted-foreground hover:text-foreground py-2", children: "Más tarde" })
    ] })
  ] }) });
}
function translateClaimError(msg) {
  if (msg.includes("handle taken")) return "Ese handle ya está en uso.";
  if (msg.includes("handle reserved")) return "Ese handle está reservado.";
  if (msg.includes("invalid handle")) return "Usa 3-20 caracteres en minúsculas, números o _.";
  if (msg.includes("too many handle changes")) return "Demasiados cambios hoy. Intenta mañana.";
  return msg;
}
export {
  OnboardingPage as component
};
