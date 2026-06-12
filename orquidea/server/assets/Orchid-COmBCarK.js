import { jsxs, jsx } from "react/jsx-runtime";
const ORCHID_PALETTES = {
  "Laelia speciosa": { c1: "#D86BA6", c2: "#B23A77", lip: "#7E1C53" },
  "Laelia gouldiana": { c1: "#C257A0", c2: "#8E2C82", lip: "#5C1A5E" },
  "Barkeria whartoniana": { c1: "#E86B9A", c2: "#C23D70", lip: "#8A1F4E" },
  "Euchile mariae": { c1: "#E9E6C8", c2: "#BFC79A", lip: "#6F8A4E" },
  "Rhynchostele cervantesii": { c1: "#F2DCE7", c2: "#D98FB4", lip: "#9B3D6E" },
  "Encyclia adenocaula": { c1: "#EFA8C6", c2: "#D26C97", lip: "#A23C6A" },
  "Prosthechea vitellina": { c1: "#EE7A3C", c2: "#C4421E", lip: "#7A2410" },
  "Stanhopea tigrina": { c1: "#F0E2B8", c2: "#C9A24A", lip: "#7A2E1E" },
  "Cuitlauzina pendula": { c1: "#FBF1E8", c2: "#E7C8D6", lip: "#C76C95" },
  "Rhynchostele bictoniensis": { c1: "#E8DFA6", c2: "#B7A85C", lip: "#8A4A6E" }
};
const FALLBACK = { c1: "#E7D7C7", c2: "#B89A82", lip: "#6F5544" };
function paletteFor(sciName) {
  if (!sciName) return FALLBACK;
  return ORCHID_PALETTES[sciName] ?? FALLBACK;
}
function Orchid({ sciName, size = 120 }) {
  const t = paletteFor(sciName);
  const uid = "g_" + (sciName ?? "x").replace(/\W/g, "_") + "_" + size;
  const tepals = [90, 162, 234, 306, 18];
  return /* @__PURE__ */ jsxs("svg", { width: size, height: size, viewBox: "0 0 120 120", "aria-hidden": true, children: [
    /* @__PURE__ */ jsxs("defs", { children: [
      /* @__PURE__ */ jsxs("radialGradient", { id: uid + "bg", cx: "50%", cy: "42%", r: "65%", children: [
        /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: "#ffffff", stopOpacity: "0.9" }),
        /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: t.c2, stopOpacity: "0.10" })
      ] }),
      /* @__PURE__ */ jsxs("linearGradient", { id: uid + "p", x1: "0", y1: "0", x2: "0", y2: "1", children: [
        /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: t.c1 }),
        /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: t.c2 })
      ] })
    ] }),
    /* @__PURE__ */ jsx("circle", { cx: "60", cy: "58", r: "56", fill: "url(#" + uid + "bg)" }),
    tepals.map((a, i) => /* @__PURE__ */ jsx("g", { transform: `rotate(${a} 60 60)`, children: /* @__PURE__ */ jsx("ellipse", { cx: "60", cy: "28", rx: "13", ry: "27", fill: "url(#" + uid + "p)", stroke: "rgba(0,0,0,0.06)" }) }, i)),
    /* @__PURE__ */ jsx("ellipse", { cx: "60", cy: "80", rx: "17", ry: "20", fill: t.lip, opacity: "0.95" }),
    /* @__PURE__ */ jsx("ellipse", { cx: "60", cy: "76", rx: "9", ry: "11", fill: "#ffffff", opacity: "0.18" }),
    /* @__PURE__ */ jsx("ellipse", { cx: "60", cy: "60", rx: "6.5", ry: "9", fill: "#fffdf6", opacity: "0.92" }),
    /* @__PURE__ */ jsx("circle", { cx: "60", cy: "58", r: "2.6", fill: t.lip, opacity: "0.8" })
  ] });
}
export {
  Orchid as O
};
