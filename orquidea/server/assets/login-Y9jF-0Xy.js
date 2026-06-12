import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ArrowLeft, Flower2, Mail, Loader2 } from "lucide-react";
import { s as supabase } from "./client-DcL2yrVT.js";
import { u as useAuth } from "./use-auth-peUko5yJ.js";
import "@supabase/supabase-js";
function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [errMsg, setErrMsg] = useState(null);
  const {
    user,
    loading
  } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && user) {
      void (async () => {
        const {
          data
        } = await supabase.from("profiles").select("handle").eq("id", user.id).maybeSingle();
        const isDefault = !data?.handle || data.handle.startsWith("spotter_");
        navigate({
          to: isDefault ? "/onboarding" : "/",
          replace: true
        });
      })();
    }
  }, [loading, user, navigate]);
  async function onSubmit(e) {
    e.preventDefault();
    if (!email) return;
    setStatus("sending");
    setErrMsg(null);
    const {
      error
    } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin + "/onboarding"
      }
    });
    if (error) {
      setStatus("error");
      setErrMsg(error.message);
      return;
    }
    setStatus("sent");
  }
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen flex items-center justify-center px-6 bg-background", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-sm", children: [
    /* @__PURE__ */ jsxs(Link, { to: "/", className: "inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground", children: [
      /* @__PURE__ */ jsx(ArrowLeft, { size: 14 }),
      " Al muro"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: "grid h-12 w-12 place-items-center rounded-full bg-leaf text-leaf-foreground", children: /* @__PURE__ */ jsx(Flower2, { size: 22 }) }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsxs("h1", { className: "font-display text-2xl tracking-tight", children: [
          "Orqu",
          /* @__PURE__ */ jsx("span", { className: "font-bold text-orchid", children: "ID" }),
          "ea"
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-muted-foreground", children: "por OrchidArc · Sierra de Oaxaca" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("h2", { className: "mt-8 font-display text-xl", children: "Entra" }),
    /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Continúa con Google o recibe un enlace mágico por correo." }),
    /* @__PURE__ */ jsxs("button", { type: "button", onClick: async () => {
      const {
        lovable
      } = await import("./index-BkoDOqJ9.js");
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/onboarding"
      });
      if (result.error) setErrMsg(result.error.message ?? "Error con Google");
    }, className: "mt-5 w-full rounded-xl border border-input bg-card hover:bg-accent font-semibold py-3 text-sm inline-flex items-center justify-center gap-2", children: [
      /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 48 48", "aria-hidden": true, children: [
        /* @__PURE__ */ jsx("path", { fill: "#FFC107", d: "M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.2-.1-2.3-.4-3.5z" }),
        /* @__PURE__ */ jsx("path", { fill: "#FF3D00", d: "M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" }),
        /* @__PURE__ */ jsx("path", { fill: "#4CAF50", d: "M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.3 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.6 39.6 16.2 44 24 44z" }),
        /* @__PURE__ */ jsx("path", { fill: "#1976D2", d: "M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.2 5.2c-.4.4 6.6-4.8 6.6-14.7 0-1.2-.1-2.3-.4-3.5z" })
      ] }),
      "Continuar con Google"
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-5 flex items-center gap-3 text-[10px] uppercase tracking-wider text-muted-foreground", children: [
      /* @__PURE__ */ jsx("span", { className: "h-px flex-1 bg-border" }),
      " o con correo ",
      /* @__PURE__ */ jsx("span", { className: "h-px flex-1 bg-border" })
    ] }),
    status === "sent" ? /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-2xl border border-leaf/30 bg-leaf/5 p-5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-leaf font-medium", children: [
        /* @__PURE__ */ jsx(Mail, { size: 16 }),
        " Enlace enviado"
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-foreground/80", children: [
        "Revisa tu bandeja en ",
        /* @__PURE__ */ jsx("b", { children: email }),
        " y abre el enlace para entrar."
      ] })
    ] }) : /* @__PURE__ */ jsxs("form", { onSubmit, className: "mt-6 space-y-3", children: [
      /* @__PURE__ */ jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Correo electrónico" }),
        /* @__PURE__ */ jsx("input", { type: "email", required: true, autoComplete: "email", placeholder: "tucorreo@ejemplo.com", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none focus:border-leaf focus:ring-2 focus:ring-leaf/20" })
      ] }),
      errMsg && /* @__PURE__ */ jsx("p", { className: "text-xs text-destructive", children: errMsg }),
      /* @__PURE__ */ jsxs("button", { type: "submit", disabled: status === "sending", className: "w-full rounded-xl bg-leaf text-leaf-foreground font-semibold py-3 text-sm disabled:opacity-60 inline-flex items-center justify-center gap-2", children: [
        status === "sending" && /* @__PURE__ */ jsx(Loader2, { size: 14, className: "animate-spin" }),
        "Enviar enlace mágico"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "mt-8 text-[11px] text-muted-foreground leading-relaxed", children: [
      "Al continuar, aceptas el código de conducta: ",
      /* @__PURE__ */ jsx("b", { children: "solo observar, nunca recolectar" }),
      ". Las ubicaciones de especies sensibles se ocultan automáticamente."
    ] })
  ] }) });
}
export {
  LoginPage as component
};
