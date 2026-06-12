import { QueryClientProvider, useQueryClient, QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, useRouter, Link, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { s as supabase } from "./client-DcL2yrVT.js";
const appCss = "/orquidea/assets/styles-BNklYCo_.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$f = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#f6f1e4" },
      { name: "author", content: "OrchidArc" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "OrquIDea" },
      { property: "og:title", content: "OrquIDea" },
      { name: "twitter:title", content: "OrquIDea" },
      { name: "description", content: "OrchidArc's Flora Finder is a citizen-science app for spotting and documenting orchids." },
      { property: "og:description", content: "OrchidArc's Flora Finder is a citizen-science app for spotting and documenting orchids." },
      { name: "twitter:description", content: "OrchidArc's Flora Finder is a citizen-science app for spotting and documenting orchids." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/78946d95-ae7e-436e-8b7a-71acc2661f35/id-preview-8ef00188--120eb405-9241-4ab4-9361-97745aa50c4f.lovable.app-1780902483017.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/78946d95-ae7e-436e-8b7a-71acc2661f35/id-preview-8ef00188--120eb405-9241-4ab4-9361-97745aa50c4f.lovable.app-1780902483017.png" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,600&family=Hanken+Grotesk:wght@400;500;600;700&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$f.useRouteContext();
  return /* @__PURE__ */ jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsx(AuthSync, {}),
    /* @__PURE__ */ jsx(Outlet, {})
  ] });
}
function AuthSync() {
  const router2 = useRouter();
  const queryClient = useQueryClient();
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      router2.invalidate();
      queryClient.invalidateQueries();
    });
    return () => subscription.unsubscribe();
  }, [router2, queryClient]);
  return null;
}
const $$splitComponentImporter$e = () => import("./retos-BxOvAybb.js");
const Route$e = createFileRoute("/retos")({
  head: () => ({
    meta: [{
      title: "Retos · OrquIDea"
    }, {
      name: "description",
      content: "Retos de observación de orquídeas en la Sierra de Oaxaca."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./reportar-Q0GcpsYS.js");
const Route$d = createFileRoute("/reportar")({
  head: () => ({
    meta: [{
      title: "Reportar comercio ilegal · OrquIDea"
    }, {
      name: "description",
      content: "Reporta confidencialmente el saqueo o comercio ilegal de orquídeas en la Sierra de Oaxaca."
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./ranking-Dkh2K-3g.js");
const Route$c = createFileRoute("/ranking")({
  head: () => ({
    meta: [{
      title: "Ranking · OrquIDea"
    }, {
      name: "description",
      content: "Tabla de spotters de orquídeas en la Sierra de Oaxaca."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./onboarding-D1BEkKdu.js");
const Route$b = createFileRoute("/onboarding")({
  head: () => ({
    meta: [{
      title: "Elige tu @handle — OrquIDea"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./mapa-B9LvACqx.js");
const Route$a = createFileRoute("/mapa")({
  ssr: false,
  validateSearch: (search) => ({
    especie: typeof search.especie === "string" && search.especie ? search.especie : void 0
  }),
  head: () => ({
    meta: [{
      title: "Mapa · OrquIDea"
    }, {
      name: "description",
      content: "Avistamientos georreferenciados en la Sierra de Oaxaca con protección de ubicación para especies sensibles."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./login-Y9jF-0Xy.js");
const Route$9 = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Entrar — OrquIDea"
    }, {
      name: "description",
      content: "Recibe un enlace mágico para entrar a OrquIDea."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./lista-DVIWbuY3.js");
const Route$8 = createFileRoute("/lista")({
  head: () => ({
    meta: [{
      title: "Mi lista · OrquIDea"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./capture-B0MSzP4Q.js");
const Route$7 = createFileRoute("/capture")({
  head: () => ({
    meta: [{
      title: "Nuevo avistamiento · OrquIDea"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./index-DIgttDeL.js");
const Route$6 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "OrquIDea · por OrchidArc — orquídeas de la Sierra de Oaxaca"
    }, {
      name: "description",
      content: "App ciudadana para observar y registrar orquídeas silvestres en la Sierra de Oaxaca. Solo observar, nunca recolectar."
    }, {
      property: "og:title",
      content: "OrquIDea · por OrchidArc"
    }, {
      property: "og:description",
      content: "Comunidad de aficionados a las orquídeas en la Sierra de Oaxaca. Avistamientos, identificación colectiva y conservación."
    }, {
      name: "robots",
      content: "index,follow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./sociedades.index-BvpkoI5D.js");
const Route$5 = createFileRoute("/sociedades/")({
  ssr: false,
  head: () => ({
    meta: [{
      title: "Sociedades · OrquIDea"
    }, {
      name: "description",
      content: "Sociedades orquideológicas activas en la Sierra de Oaxaca y regiones cercanas."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./especies.index-5dLi07gz.js");
const Route$4 = createFileRoute("/especies/")({
  head: () => ({
    meta: [{
      title: "Especies · OrquIDea"
    }, {
      name: "description",
      content: "Herbario digital: explora las orquídeas de México por género y especie, con fichas, estado de conservación y enlaces a fuentes científicas."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./sociedades._id-gCpEcUal.js");
const Route$3 = createFileRoute("/sociedades/$id")({
  ssr: false,
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./s._id-BIQ9I_Qf.js");
const Route$2 = createFileRoute("/s/$id")({
  head: () => ({
    meta: [{
      title: "Avistamiento · OrquIDea"
    }, {
      name: "description",
      content: "Detalle del avistamiento — discusión, sugerencias de ID y verificación comunitaria."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./especies._id-D0eptwct.js");
const Route$1 = createFileRoute("/especies/$id")({
  head: () => ({
    meta: [{
      title: "Ficha de especie · OrquIDea"
    }, {
      name: "description",
      content: "Ficha de especie: taxonomía, conservación, avistamientos y enlaces a fuentes científicas."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./admin.reportes-BpRINLzF.js");
const Route = createFileRoute("/admin/reportes")({
  ssr: false,
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const RetosRoute = Route$e.update({
  id: "/retos",
  path: "/retos",
  getParentRoute: () => Route$f
});
const ReportarRoute = Route$d.update({
  id: "/reportar",
  path: "/reportar",
  getParentRoute: () => Route$f
});
const RankingRoute = Route$c.update({
  id: "/ranking",
  path: "/ranking",
  getParentRoute: () => Route$f
});
const OnboardingRoute = Route$b.update({
  id: "/onboarding",
  path: "/onboarding",
  getParentRoute: () => Route$f
});
const MapaRoute = Route$a.update({
  id: "/mapa",
  path: "/mapa",
  getParentRoute: () => Route$f
});
const LoginRoute = Route$9.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$f
});
const ListaRoute = Route$8.update({
  id: "/lista",
  path: "/lista",
  getParentRoute: () => Route$f
});
const CaptureRoute = Route$7.update({
  id: "/capture",
  path: "/capture",
  getParentRoute: () => Route$f
});
const IndexRoute = Route$6.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$f
});
const SociedadesIndexRoute = Route$5.update({
  id: "/sociedades/",
  path: "/sociedades/",
  getParentRoute: () => Route$f
});
const EspeciesIndexRoute = Route$4.update({
  id: "/especies/",
  path: "/especies/",
  getParentRoute: () => Route$f
});
const SociedadesIdRoute = Route$3.update({
  id: "/sociedades/$id",
  path: "/sociedades/$id",
  getParentRoute: () => Route$f
});
const SIdRoute = Route$2.update({
  id: "/s/$id",
  path: "/s/$id",
  getParentRoute: () => Route$f
});
const EspeciesIdRoute = Route$1.update({
  id: "/especies/$id",
  path: "/especies/$id",
  getParentRoute: () => Route$f
});
const AdminReportesRoute = Route.update({
  id: "/admin/reportes",
  path: "/admin/reportes",
  getParentRoute: () => Route$f
});
const rootRouteChildren = {
  IndexRoute,
  CaptureRoute,
  ListaRoute,
  LoginRoute,
  MapaRoute,
  OnboardingRoute,
  RankingRoute,
  ReportarRoute,
  RetosRoute,
  AdminReportesRoute,
  EspeciesIdRoute,
  SIdRoute,
  SociedadesIdRoute,
  EspeciesIndexRoute,
  SociedadesIndexRoute
};
const routeTree = Route$f._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Route$a as R,
  Route$3 as a,
  Route$2 as b,
  Route$1 as c,
  router as r
};
