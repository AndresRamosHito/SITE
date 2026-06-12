import { jsx } from "react/jsx-runtime";
const COLORS = {
  "En peligro": "#B23A3A",
  "Amenazada": "#C0712B",
  "Vulnerable": "#A98A1E",
  "Preoc. menor": "#4F7A55"
};
function StatusPill({ status }) {
  if (!status) return null;
  const c = COLORS[status] ?? "#4F7A55";
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
      style: { color: c, borderColor: c + "55", background: c + "12" },
      children: status
    }
  );
}
export {
  StatusPill as S
};
