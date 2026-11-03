/* RAR · Panel de control — vanilla JS, no build step.
   Talks only to the Supabase edge function rar-panel.  ?demo=1 → simulated data. */
"use strict";
const API = "https://ozihcgohaizzdnnskcxb.supabase.co/functions/v1/rar-panel";
const DEMO = new URLSearchParams(location.search).has("demo");
const $ = (s) => document.querySelector(s);
const el = (tag, attrs = {}, html = "") => { const e = document.createElement(tag); for (const k in attrs) e.setAttribute(k, attrs[k]); e.innerHTML = html; return e; };
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const num = (v) => (v === null || v === undefined || v === "" ? null : Number(v));
const PL = ["Pl. I", "Pl. II", "Pl. III", "Pl. IV", "Pl. V", "Pl. VI"];
const FAULTS = [[1, "Sensor sin respuesta"], [2, "Sobretemperatura"], [4, "Temperatura baja"], [8, "Sin agua en depósito"],
  [16, "La niebla no sube la humedad"], [32, "Ventilador detenido"], [64, "Calefactor en descanso forzado"]];
const STAGE_COLORS = ["#0B7A70", "#2B57C9", "#7B3FC4", "#C4182E", "#E4007C", "#9C7444"];

const store = { get(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { sessionStorage.setItem(k, v); } catch {} }, del(k) { try { sessionStorage.removeItem(k); } catch {} } };

let token = store.get("rar_token");
let state = { reactors: [], sel: store.get("rar_sel") || null, hours: { t: 24, rh: 24 }, hist: {}, timers: [] };

/* ---------------------------------------------------------------- API */
async function api(action, body = {}, raw = false) {
  if (DEMO) return demoApi(action, body);
  const res = await fetch(API, { method: "POST", headers: { "content-type": "application/json", ...(token ? { authorization: "Bearer " + token } : {}) },
    body: JSON.stringify({ action, ...body }) });
  if (res.status === 401 && action !== "login") { logout("Sesión expirada. Vuelve a entrar."); throw new Error("401"); }
  if (raw) { if (!res.ok) throw new Error((await res.json()).error || res.statusText); return res; }
  const j = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(j.error || res.statusText);
  return j;
}
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.style.display = "block"; clearTimeout(t._h); t._h = setTimeout(() => (t.style.display = "none"), 3200); }

/* ---------------------------------------------------------------- login */
$("#loginForm").addEventListener("submit", async (e) => {
  e.preventDefault(); $("#loginErr").textContent = "";
  try { const r = await api("login", { password: $("#pw").value }); token = r.token; store.set("rar_token", token); $("#pw").value = ""; boot(); }
  catch (err) { $("#loginErr").textContent = err.message === "Wrong password" ? "Contraseña incorrecta" : err.message; }
});
function logout(msg) {
  token = null; store.del("rar_token"); state.timers.forEach(clearInterval); state.timers = [];
  $("#app").classList.add("hidden"); $("#login").classList.remove("hidden"); if (msg) $("#loginErr").textContent = msg;
}
$("#logoutBtn").onclick = () => logout();

/* ---------------------------------------------------------------- boot / polling */
async function boot() {
  $("#login").classList.add("hidden"); $("#app").classList.remove("hidden");
  if (DEMO) $("#demoFlag").classList.remove("hidden");
  const today = new Date(); $("#exTo").value = today.toISOString().slice(0, 10);
  $("#exFrom").value = new Date(today - 7 * 864e5).toISOString().slice(0, 10);
  buildRanges();
  await refresh(); await loadHistory("t"); await loadHistory("rh"); loadLog();
  state.timers.push(setInterval(refresh, 5000));
  state.timers.push(setInterval(() => { loadHistory("t"); loadHistory("rh"); }, 60000));
  state.timers.push(setInterval(loadLog, 15000));
  state.timers.push(setInterval(tickClock, 1000)); tickClock();
}
function tickClock() { $("#clock").textContent = new Date().toLocaleString("es-MX", { timeZone: "America/Mexico_City", weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit" }); }

const cur = () => state.reactors.find((r) => r.id === state.sel) || state.reactors[0];
const ageS = (ts) => (ts ? (Date.now() - new Date(ts).getTime()) / 1000 : Infinity);
const ageTxt = (s) => (s === Infinity ? "nunca" : s < 60 ? `hace ${Math.round(s)} s` : s < 3600 ? `hace ${Math.round(s / 60)} min` : s < 86400 ? `hace ${Math.round(s / 3600)} h` : `hace ${Math.round(s / 86400)} d`);

async function refresh() {
  try { const r = await api("overview"); state.reactors = r.reactors; }
  catch (e) { if (e.message !== "401") $("#banner").innerHTML = `<b style="color:var(--garnet)">Sin conexión con el servidor.</b> <span class="muted">${esc(e.message)}</span>`; return; }
  if (!state.sel || !state.reactors.some((r) => r.id === state.sel)) state.sel = state.reactors[0]?.id;
  renderTabs(); renderLive();
}

/* ---------------------------------------------------------------- tabs */
function renderTabs() {
  const nav = $("#tabs"); nav.innerHTML = "";
  state.reactors.forEach((r, i) => {
    const a = ageS(r.last_seen), on = a < 120, f = num(r.live?.faults) || 0;
    const b = el("button", { class: "tab" + (r.id === state.sel ? " active" : ""), "aria-pressed": r.id === state.sel });
    b.innerHTML = `<span class="dot ${on ? (f ? "bad" : "on") : ""}"></span><span><span class="pl">${PL[i] || ""}</span>
      <div class="nm">${esc(r.name)}</div><div class="st">${on ? (r.live?.t != null ? `${Number(r.live.t).toFixed(1)} °C · ${Number(r.live.rh).toFixed(0)} %` : "en línea") : "sin conexión · " + ageTxt(a)}</div></span>`;
    b.onclick = () => { state.sel = r.id; store.set("rar_sel", r.id); renderTabs(); renderLive(); loadHistory("t"); loadHistory("rh"); loadLog(); };
    nav.appendChild(b);
  });
}

/* ---------------------------------------------------------------- live */
function renderLive() {
  const r = cur(); if (!r) return;
  const L = r.live || {}, a = ageS(r.last_seen), on = a < 120;
  const f = num(L.faults) || 0;
  const running = L.running !== false;
  $("#banner").className = "banner" + (on ? "" : " offline");
  $("#banner").innerHTML = on
    ? `<span class="dot ${f ? "bad" : "on"}"></span><b>${esc(r.name)}</b><span class="muted">${running ? "en marcha" : "en pausa"} · etapa <b>${esc(L.stage ?? "—")}</b> · día <b>${L.day != null ? Number(L.day).toFixed(1) : "—"}</b>${L.override ? ' · <span style="color:var(--saffron)">modo manual</span>' : ""}</span><span class="grow"></span><span class="muted">Wi-Fi ${L.rssi ?? "—"} dBm · ${r.queued ? r.queued + " orden(es) en cola" : "sin órdenes en cola"}</span>`
    : `<span class="dot"></span><b>${esc(r.name)} · sin conexión</b><span class="muted">último contacto ${ageTxt(a)}. Las órdenes se guardan y se envían cuando vuelva.</span>`;
  $("#liveAge").textContent = on ? "actualizado " + ageTxt(a) : "";

  $("#gT").innerHTML = gauge({ v: num(L.t), sp: num(L.t_sp), min: 10, max: 40, unit: "°C", label: "Temperatura", color: "var(--turquoise)", dec: 1, on });
  $("#gRH").innerHTML = gauge({ v: num(L.rh), sp: num(L.rh_sp), min: 0, max: 100, unit: "%", label: "Humedad", color: "var(--lapis)", dec: 0, on });

  const fz = $("#faults"); fz.innerHTML = "";
  if (!on) fz.appendChild(el("span", { class: "chip note" }, "Sin datos en vivo"));
  else if (!f) fz.appendChild(el("span", { class: "chip ok" }, "Sin fallas · todo en orden"));
  else FAULTS.forEach(([bit, w]) => { if (f & bit) fz.appendChild(el("span", { class: "chip bad" }, "Falla: " + w)); });

  const acts = [
    ["Calefactor", L.heater ? "ON" : "off", L.heater, null],
    ["Bomba", L.pump ? "ON" : "off", L.pump, null],
    ["Válvula", L.valve ? "abierta" : "cerrada", L.valve, null],
    ["Agua", L.water === false ? "VACÍO" : L.water ? "ok" : "—", false, null, L.water === false],
    ["Ventiladores", L.fan != null ? Math.round(L.fan * 100) + "%" : "—", (L.fan || 0) > 0.05, L.fan, false, L.rpm ? `${L.rpm} rpm` : ""],
    ["Luz", L.light != null ? Math.round(L.light * 100) + "%" : "—", (L.light || 0) > 0.02, L.light],
  ];
  $("#acts").innerHTML = acts.map(([k, v, isOn, frac, alarm, sub]) =>
    `<div class="act ${on && isOn ? "on" : ""} ${alarm ? "alarm" : ""}"><div class="k">${k}</div><div class="v">${on ? v : "—"}</div>
     ${sub ? `<div class="muted" style="font-size:12.5px">${sub}</div>` : ""}${frac != null ? `<div class="bar"><i style="width:${on ? Math.round(frac * 100) : 0}%"></i></div>` : ""}</div>`).join("");

  // camera
  const cam = $("#cam");
  if (r.snap_url) {
    const img = cam.querySelector("img");
    if (!img || img.dataset.ts !== r.snap_ts) cam.innerHTML = `<img alt="Foto del reactor" data-ts="${esc(r.snap_ts)}" src="${esc(r.snap_url)}"><span class="ts">${new Date(r.snap_ts).toLocaleString("es-MX")}</span>`;
    $("#camAge").textContent = ageTxt(ageS(r.snap_ts));
  } else { cam.innerHTML = `<div class="ph">Sin imagen todavía.<br>Conecta la cámara del reactor.</div>`; $("#camAge").textContent = ""; }
  if (r.snap_requested) { if (!cam.querySelector(".rec")) cam.insertAdjacentHTML("beforeend", `<span class="rec"><span class="dot bad"></span>FOTO PEDIDA</span>`); }

  renderTimeline(r, L);
}

/* ---------------------------------------------------------------- gauge */
function gauge({ v, sp, min, max, unit, label, color, dec, on }) {
  const W = 240, H = 190, cx = 120, cy = 120, R = 92, A0 = -210, A1 = 30; // degrees
  const ang = (x) => A0 + ((Math.max(min, Math.min(max, x)) - min) / (max - min)) * (A1 - A0);
  const pt = (a, r = R) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const arc = (a0, a1, r = R) => { const [x0, y0] = pt(a0, r), [x1, y1] = pt(a1, r); return `M${x0} ${y0} A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`; };
  let ticks = "";
  for (let i = 0; i <= 10; i++) { const a = A0 + (i / 10) * (A1 - A0), [x0, y0] = pt(a, R + 12), [x1, y1] = pt(a, R + (i % 5 ? 16 : 20));
    ticks += `<line x1="${x0}" y1="${y0}" x2="${x1}" y2="${y1}" stroke="#E2B54A" stroke-opacity="${i % 5 ? .35 : .8}" stroke-width="1.2"/>`; }
  const has = on && v !== null && !isNaN(v);
  const spMark = sp !== null && !isNaN(sp) ? (() => { const a = ang(sp), [x, y] = pt(a, R - 15), [x2, y2] = pt(a, R + 9); return `<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="#E2B54A" stroke-width="3" stroke-linecap="round"/>`; })() : "";
  const diff = has && sp !== null ? v - sp : null;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label} ${has ? v.toFixed(dec) + unit : "sin dato"}">
    <path d="${arc(A0, A1)}" stroke="rgba(255,255,255,.08)" stroke-width="14" fill="none" stroke-linecap="round"/>
    ${has ? `<path d="${arc(A0, ang(v))}" stroke="${color}" stroke-width="14" fill="none" stroke-linecap="round" style="filter:drop-shadow(0 0 8px ${color})"/>` : ""}
    ${ticks}${spMark}
    <text x="${cx}" y="${cy - 2}" text-anchor="middle" font-family="Cambria,Georgia,serif" font-size="46" fill="#fff">${has ? v.toFixed(dec) : "—"}<tspan font-size="18" fill="#D9C8D6">${unit}</tspan></text>
    <text x="${cx}" y="${cy + 24}" text-anchor="middle" font-size="13" fill="#D9C8D6" font-family="Assistant,sans-serif">objetivo ${sp !== null && !isNaN(sp) ? sp.toFixed(dec) + unit : "—"}${diff !== null ? ` · ${diff >= 0 ? "+" : ""}${diff.toFixed(dec)}` : ""}</text>
    <text x="${pt(A0, R + 4)[0] + 6}" y="${H - 6}" font-size="11" fill="#D9C8D6" font-family="Assistant">${min}</text>
    <text x="${pt(A1, R + 4)[0] - 14}" y="${H - 6}" font-size="11" fill="#D9C8D6" font-family="Assistant">${max}</text>
    <text x="${cx}" y="${H - 6}" text-anchor="middle" font-size="12" letter-spacing="2.2" font-weight="700" fill="#D9C8D6" font-family="Assistant">${label.toUpperCase()}</text>
  </svg>`;
}

/* ---------------------------------------------------------------- timeline */
function renderTimeline(r, L) {
  const sc = (r.scenario && Array.isArray(r.scenario.stages) && r.scenario.stages.length) ? r.scenario : null;
  const box = $("#timeline");
  if (!sc) { $("#scName").textContent = ""; box.innerHTML = `<div class="muted">El reactor aún no ha reportado su escenario. Usa «Editar escenario…» para enviar uno.</div>`; return; }
  $("#scName").textContent = sc.name ? "· " + sc.name : "";
  const total = sc.stages.reduce((s, x) => s + Number(x.days || 0), 0) || 1;
  const day = num(L.day);
  let html = `<div class="tl-track">`;
  sc.stages.forEach((s, i) => {
    const w = (Number(s.days) / total) * 100;
    html += `<div class="tl-seg" style="width:${w}%;background:${s.drought ? "#9C7444" : STAGE_COLORS[i % STAGE_COLORS.length]}" title="${esc(s.name)} · ${s.days} d · ${s.tMin}–${s.tMax} °C · ${s.rhNight}/${s.rhDay} %">${w > 7 ? esc(s.name) : ""}</div>`;
  });
  html += `</div>`;
  if (day !== null) html += `<div class="tl-now" style="left:${Math.min(100, (day / total) * 100)}%" data-l="día ${day.toFixed(1)}"></div>`;
  html += `<div class="tl-legend"><span>día 0</span><span>${sc.stages.map((s) => `${esc(s.name)} ${s.days} d`).join(" · ")}</span><span>día ${total}</span></div>`;
  box.innerHTML = html;
}

/* ---------------------------------------------------------------- charts */
function buildRanges() {
  document.querySelectorAll(".range").forEach((g) => {
    const k = g.dataset.chart; g.innerHTML = "";
    [[6, "6 h"], [24, "24 h"], [168, "7 d"], [720, "30 d"], [2160, "90 d"]].forEach(([h, l]) => {
      const b = el("button", { class: h === state.hours[k] ? "on" : "" }, l);
      b.onclick = () => { state.hours[k] = h; buildRanges(); loadHistory(k); }; g.appendChild(b);
    });
  });
}
async function loadHistory(k) {
  const r = cur(); if (!r) return;
  try { const h = await api("history", { reactor: r.id, hours: state.hours[k] }); state.hist[k] = h.rows; }
  catch { return; }
  const rows = state.hist[k] || [];
  if (k === "t") drawChart($("#chartT"), rows, { v: "t", sp: "t_sp", duty: "heater", color: "#5FE0D2", dutyColor: "rgba(255,95,174,.28)", unit: "°C", dec: 1 });
  else drawChart($("#chartRH"), rows, { v: "rh", sp: "rh_sp", duty: "pump", color: "#9DB8FF", dutyColor: "rgba(95,224,210,.25)", unit: "%", dec: 0 });
}
function drawChart(box, rows, o) {
  const W = box.clientWidth || 600, H = box.clientHeight || 240, P = { l: 42, r: 12, t: 10, b: 26 };
  if (!rows.length) { box.innerHTML = `<div class="muted" style="display:grid;place-items:center;height:100%">Sin datos en este periodo.</div>`; return; }
  const xs = rows.map((r) => new Date(r.ts).getTime());
  const vals = rows.flatMap((r) => [num(r[o.v]), num(r[o.sp])]).filter((x) => x !== null);
  let lo = Math.min(...vals), hi = Math.max(...vals); const pad = Math.max(1, (hi - lo) * 0.12); lo -= pad; hi += pad;
  const x0 = xs[0], x1 = xs[xs.length - 1] === x0 ? x0 + 60000 : xs[xs.length - 1];
  const X = (t) => P.l + ((t - x0) / (x1 - x0)) * (W - P.l - P.r), Y = (v) => P.t + (1 - (v - lo) / (hi - lo)) * (H - P.t - P.b);
  const line = (key) => { let d = "", pen = false, prev = null;
    rows.forEach((r, i) => { const v = num(r[key]); if (v === null) { pen = false; return; }
      const gap = prev !== null && xs[i] - prev > (x1 - x0) / 40; d += `${pen && !gap ? "L" : "M"}${X(xs[i]).toFixed(1)} ${Y(v).toFixed(1)}`; pen = true; prev = xs[i]; });
    return d; };
  let grid = "", yt = 5;
  for (let i = 0; i <= yt; i++) { const v = lo + ((hi - lo) * i) / yt, y = Y(v);
    grid += `<line x1="${P.l}" x2="${W - P.r}" y1="${y}" y2="${y}" stroke="rgba(255,255,255,.07)"/><text x="${P.l - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="#D9C8D6">${v.toFixed(o.dec)}</text>`; }
  const span = x1 - x0, fmt = span > 3 * 864e5 ? { day: "numeric", month: "short" } : { hour: "2-digit", minute: "2-digit" };
  for (let i = 0; i <= 5; i++) { const t = x0 + (span * i) / 5;
    grid += `<text x="${X(t)}" y="${H - 6}" text-anchor="middle" font-size="11" fill="#D9C8D6">${new Date(t).toLocaleString("es-MX", fmt)}</text>`; }
  const bw = Math.max(1, (W - P.l - P.r) / rows.length);
  const duty = rows.map((r, i) => { const d = num(r[o.duty]) || 0; return d > 0 ? `<rect x="${X(xs[i]) - bw / 2}" y="${H - P.b - d * 34}" width="${bw}" height="${d * 34}" fill="${o.dutyColor}"/>` : ""; }).join("");
  box.innerHTML = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">${grid}${duty}
    <path d="${line(o.sp)}" fill="none" stroke="#E2B54A" stroke-width="1.6" stroke-dasharray="5 4"/>
    <path d="${line(o.v)}" fill="none" stroke="${o.color}" stroke-width="2.2" style="filter:drop-shadow(0 0 4px ${o.color})"/>
    <line class="xh" x1="0" x2="0" y1="${P.t}" y2="${H - P.b}" stroke="rgba(255,255,255,.35)" visibility="hidden"/>
    <circle class="xd" r="4.5" fill="${o.color}" visibility="hidden"/></svg><div class="tip"></div>`;
  const svg = box.querySelector("svg"), tip = box.querySelector(".tip"), xh = svg.querySelector(".xh"), xd = svg.querySelector(".xd");
  svg.onmousemove = (e) => { const bx = svg.getBoundingClientRect(), mx = ((e.clientX - bx.left) / bx.width) * W;
    let best = 0; xs.forEach((t, i) => { if (Math.abs(X(t) - mx) < Math.abs(X(xs[best]) - mx)) best = i; });
    const r = rows[best], v = num(r[o.v]); if (v === null) return;
    xh.setAttribute("x1", X(xs[best])); xh.setAttribute("x2", X(xs[best])); xh.setAttribute("visibility", "visible");
    xd.setAttribute("cx", X(xs[best])); xd.setAttribute("cy", Y(v)); xd.setAttribute("visibility", "visible");
    tip.style.display = "block"; tip.style.left = (X(xs[best]) / W) * 100 + "%"; tip.style.top = (Y(v) / H) * 100 + "%";
    tip.innerHTML = `<b>${v.toFixed(o.dec)} ${o.unit}</b> · objetivo ${num(r[o.sp])?.toFixed(o.dec) ?? "—"}<br>${new Date(r.ts).toLocaleString("es-MX")}${r.stage ? " · " + esc(r.stage) : ""}`; };
  svg.onmouseleave = () => { tip.style.display = "none"; xh.setAttribute("visibility", "hidden"); xd.setAttribute("visibility", "hidden"); };
}
window.addEventListener("resize", () => { clearTimeout(window._rz); window._rz = setTimeout(() => { loadHistory("t"); loadHistory("rh"); }, 300); });

/* ---------------------------------------------------------------- log */
async function loadLog() {
  const r = cur(); if (!r) return;
  let d; try { d = await api("events", { reactor: r.id }); } catch { return; }
  const items = [
    ...d.commands.map((c) => ({ ts: c.created_at, html: `<span class="st-${c.status}">● ${c.status}</span> orden <b>${esc(c.cmd?.cmd)}</b>${c.result ? ` — ${esc(c.result)}` : ""}` })),
    ...d.events.map((e) => ({ ts: e.ts, html: `${e.faults ? '<span style="color:var(--garnet)">▲</span>' : '<span style="color:var(--gold)">◆</span>'} ${esc(e.msg)}` })),
  ].sort((a, b) => new Date(b.ts) - new Date(a.ts)).slice(0, 40);
  $("#log").innerHTML = items.length ? `<table>${items.map((i) => `<tr><td>${new Date(i.ts).toLocaleString("es-MX", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</td><td>${i.html}</td></tr>`).join("")}</table>`
    : `<div class="muted">Sin actividad todavía.</div>`;
}

/* ---------------------------------------------------------------- commands */
async function send(cmd, msg) {
  const r = cur(); if (!r) return;
  try { await api("command", { reactor: r.id, cmd }); toast(msg || "Orden enviada"); loadLog(); refresh(); }
  catch (e) { toast("Error: " + e.message); }
}
$("#startBtn").onclick = () => { if (confirm(`¿Iniciar un experimento nuevo en ${cur()?.name}? El reloj del escenario vuelve al día 0.`)) send({ cmd: "start" }, "Experimento iniciado (día 0)"); };
$("#pauseBtn").onclick = () => send({ cmd: "pause" }, "Pausa enviada");
$("#resumeBtn").onclick = () => send({ cmd: "resume" }, "Reanudar enviado");
$("#statusBtn").onclick = () => send({ cmd: "status" }, "Estado pedido");
$("#mistBtn").onclick = () => send({ cmd: "mist", seconds: Math.min(120, Math.max(1, Number($("#mistS").value) || 10)) }, "Niebla enviada");
$("#dayBtn").onclick = () => { const d = Number($("#dayN").value); if (d >= 0 && confirm(`¿Mover el reloj del experimento al día ${d}?`)) send({ cmd: "setDay", day: d }, "Día actualizado"); };
const ovLbl = (v) => (Number(v) < 0 ? "auto" : v + "%");
$("#ovFan").oninput = (e) => ($("#ovFanV").textContent = ovLbl(e.target.value));
$("#ovLight").oninput = (e) => ($("#ovLightV").textContent = ovLbl(e.target.value));
$("#ovBtn").onclick = () => { const f = Number($("#ovFan").value), l = Number($("#ovLight").value);
  send({ cmd: "override", fan: f < 0 ? null : f / 100, light: l < 0 ? null : l / 100, minutes: Math.min(240, Math.max(1, Number($("#ovMin").value) || 15)) }, "Modo manual enviado"); };
$("#ovClear").onclick = () => { $("#ovFan").value = -1; $("#ovLight").value = -1; $("#ovFanV").textContent = "auto"; $("#ovLightV").textContent = "auto"; send({ cmd: "override", fan: null, light: null, minutes: 0 }, "Vuelta a automático"); };
$("#snapBtn").onclick = async () => { try { await api("snap", { reactor: cur().id }); toast("Foto pedida · llega en menos de 1 min"); refresh(); } catch (e) { toast("Error: " + e.message); } };
$("#galleryBtn").onclick = async () => {
  const g = $("#gallery"); g.innerHTML = `<div class="muted">Cargando…</div>`; $("#galDlg").showModal();
  try { const d = await api("snapshots", { reactor: cur().id, limit: 24 });
    g.innerHTML = d.snapshots.length ? d.snapshots.map((s) => `<a href="${esc(s.url)}" target="_blank" rel="noopener"><img src="${esc(s.url)}" alt="" title="${new Date(s.ts).toLocaleString("es-MX")}"></a>`).join("") : `<div class="muted">Sin fotos.</div>`; }
  catch (e) { g.innerHTML = esc(e.message); }
};

/* ---------------------------------------------------------------- export */
async function download(reactorId, from, to) {
  if (DEMO) { toast("En modo demo no hay CSV real"); return; }
  const res = await api("export", { reactor: reactorId, from, to }, true);
  const blob = await res.blob(), a = el("a", { href: URL.createObjectURL(blob), download: `RAR_${reactorId}_${from.slice(0, 10)}_${to.slice(0, 10)}.csv` });
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
const range = () => [new Date($("#exFrom").value + "T00:00:00-06:00").toISOString(), new Date($("#exTo").value + "T23:59:59-06:00").toISOString()];
$("#exportBtn").onclick = async () => { try { const [f, t] = range(); await download(cur().id, f, t); toast("CSV descargado"); } catch (e) { toast("Error: " + e.message); } };
$("#exportAllBtn").onclick = async () => { const [f, t] = range(); for (const r of state.reactors) { try { await download(r.id, f, t); } catch {} } toast("CSV de todos los reactores"); };

/* ---------------------------------------------------------------- password */
$("#pwBtn").onclick = () => { $("#pwErr").textContent = ""; $("#pwDlg").showModal(); };
$("#pwSave").onclick = async () => { try { await api("change_password", { old_password: $("#pwOld").value, new_password: $("#pwNew").value }); $("#pwDlg").close(); toast("Contraseña cambiada"); }
  catch (e) { $("#pwErr").textContent = e.message; } };

/* ---------------------------------------------------------------- scenario editor */
const PRESETS = {
  "Laboratorio estable": { name: "lab-stable", loop: true, sun: { sunrise: 7, sunset: 21 }, stages: [
    { name: "lab-stable", days: 30, ramp: false, tMax: 26, tMin: 24, rhDay: 90, rhNight: 95, lightMax: 1, windBase: 0.3 }] },
  "Lab → tormenta → sequía": { name: "lab-to-storm-to-drought", loop: false, sun: { sunrise: 7, sunset: 21 }, stages: [
    { name: "lab-stable", days: 14, ramp: false, tMax: 26, tMin: 24, rhDay: 90, rhNight: 95, lightMax: 1, windBase: 0.3 },
    { name: "wet-season", days: 30, ramp: true, tMax: 28, tMin: 18, rhDay: 85, rhNight: 98, lightMax: 0.8, windBase: 0.35, gustsPerDay: 3, rainPerDay: 6, rainSeconds: 25 },
    { name: "storm-week", days: 7, ramp: false, tMax: 24, tMin: 17, rhDay: 95, rhNight: 99, lightMax: 0.4, windBase: 0.5, gustsPerDay: 40, rainPerDay: 24, rainSeconds: 60 },
    { name: "drought", days: 21, ramp: true, drought: true, tMax: 30, tMin: 15, rhDay: 55, rhNight: 70, lightMax: 1, windBase: 0.45, gustsPerDay: 4 },
    { name: "recovery", days: 14, ramp: true, tMax: 26, tMin: 22, rhDay: 88, rhNight: 95, lightMax: 1, windBase: 0.3, rainPerDay: 2 }] },
  "Bosque de niebla (año comprimido)": { name: "cloud-forest-year", loop: true, sun: { sunrise: 6.5, sunset: 19.5 }, stages: [
    { name: "dry-cold", days: 20, ramp: true, tMax: 21, tMin: 10, rhDay: 75, rhNight: 95, lightMax: 0.9, windBase: 0.35, gustsPerDay: 2, rainPerDay: 1 },
    { name: "dry-warm", days: 20, ramp: true, tMax: 26, tMin: 13, rhDay: 65, rhNight: 90, lightMax: 1, windBase: 0.4, gustsPerDay: 3 },
    { name: "rainy", days: 30, ramp: true, tMax: 24, tMin: 16, rhDay: 92, rhNight: 99, lightMax: 0.6, windBase: 0.3, gustsPerDay: 4, rainPerDay: 8, rainSeconds: 30 },
    { name: "nortes", days: 20, ramp: true, tMax: 20, tMin: 12, rhDay: 95, rhNight: 99, lightMax: 0.5, windBase: 0.45, gustsPerDay: 12, rainPerDay: 10, rainSeconds: 20 }] },
};
const COLS = [["name", "Nombre", "text"], ["days", "Días", "number"], ["ramp", "Rampa", "check"], ["tMax", "T máx", "number"], ["tMin", "T mín", "number"],
  ["rhDay", "HR día", "number"], ["rhNight", "HR noche", "number"], ["lightMax", "Luz 0–1", "number"], ["windBase", "Viento 0–1", "number"],
  ["gustsPerDay", "Ráfagas/día", "number"], ["rainPerDay", "Lluvias/día", "number"], ["rainSeconds", "Lluvia s", "number"], ["drought", "Sequía", "check"]];
let edit = null;
function openEditor() {
  const r = cur(); edit = JSON.parse(JSON.stringify(r?.scenario?.stages?.length ? r.scenario : PRESETS["Lab → tormenta → sequía"]));
  $("#preset").innerHTML = Object.keys(PRESETS).map((k) => `<option>${esc(k)}</option>`).join("");
  renderEditor(); $("#scDlg").showModal();
}
function renderEditor() {
  $("#sunR").value = edit.sun?.sunrise ?? 7; $("#sunS").value = edit.sun?.sunset ?? 21;
  const t = $("#scTable");
  t.innerHTML = `<tr>${COLS.map((c) => `<th>${c[1]}</th>`).join("")}<th></th></tr>` + edit.stages.map((s, i) => `<tr>${COLS.map(([k, , ty]) =>
    ty === "check" ? `<td style="text-align:center"><input type="checkbox" data-i="${i}" data-k="${k}" ${s[k] ? "checked" : ""}></td>`
      : `<td><input type="${ty}" step="any" data-i="${i}" data-k="${k}" value="${esc(s[k] ?? "")}"></td>`).join("")}
    <td><button class="btn quiet small" data-del="${i}" title="Quitar">✕</button></td></tr>`).join("");
  t.querySelectorAll("input").forEach((inp) => (inp.onchange = () => { const s = edit.stages[inp.dataset.i], k = inp.dataset.k;
    s[k] = inp.type === "checkbox" ? inp.checked : inp.type === "number" ? (inp.value === "" ? undefined : Number(inp.value)) : inp.value.slice(0, 15); }));
  t.querySelectorAll("[data-del]").forEach((b) => (b.onclick = () => { if (edit.stages.length > 1) { edit.stages.splice(+b.dataset.del, 1); renderEditor(); } }));
}
$("#scenarioBtn").onclick = openEditor;
$("#presetLoad").onclick = () => { edit = JSON.parse(JSON.stringify(PRESETS[$("#preset").value])); renderEditor(); };
$("#addStage").onclick = () => { if (edit.stages.length < 12) { edit.stages.push({ ...edit.stages[edit.stages.length - 1], name: "stage" + (edit.stages.length + 1) }); renderEditor(); } };
$("#scCancel").onclick = () => $("#scDlg").close();
$("#scSend").onclick = () => {
  edit.sun = { ...(edit.sun || {}), sunrise: Number($("#sunR").value), sunset: Number($("#sunS").value) };
  const bad = edit.stages.find((s) => !(s.days > 0) || !(s.tMax >= s.tMin) || s.tMax > 40 || s.tMin < 5 || s.rhDay > 100 || s.rhNight > 100);
  if (bad) { toast(`Revisa la etapa «${bad.name}»: días > 0, 5 ≤ T mín ≤ T máx ≤ 40, HR ≤ 100`); return; }
  if (!confirm("¿Enviar este escenario al reactor? Se guarda y se usa desde su día actual.")) return;
  send({ cmd: "scenario", ...edit }, "Escenario enviado"); $("#scDlg").close();
};

/* ---------------------------------------------------------------- demo */
const demo = (() => {
  const t0 = Date.now(), sc = PRESETS["Lab → tormenta → sequía"];
  const names = [["Reactor_0", "RAR Prototype (Reactor 0)"], ["Reactor_UV_1", "RAR UV · Level I"], ["Reactor_UV_2", "RAR UV · Level II"], ["Reactor_UV_3", "RAR UV · Level III"]];
  const sim = (id, t) => { const k = names.findIndex((n) => n[0] === id) + 1, h = (new Date(t).getHours() + new Date(t).getMinutes() / 60);
    const f = 0.5 - 0.5 * Math.cos(Math.PI * (((h - 3 + 24) % 24) / 10)), sp = 24 + 2 * f + (k === 3 ? -4 : 0), rsp = 95 - 5 * f + (k === 3 ? -25 : 0);
    const n = Math.sin(t / 7e5 + k) * 0.25 + Math.sin(t / 1.3e5) * 0.12;
    return { t: +(sp + n).toFixed(2), rh: +(rsp + n * 6).toFixed(1), t_sp: +sp.toFixed(2), rh_sp: +rsp.toFixed(1), heater: n < -0.05, pump: n * 6 < -1.2,
      valve: false, fan: +(0.3 + Math.max(0, n)).toFixed(2), rpm: 1400, light: +Math.max(0, Math.sin(Math.PI * (h - 7) / 14)).toFixed(2), water: true,
      faults: k === 4 ? 8 : 0, running: true, day: [3.2, 9.6, 47.5, 58.1][k - 1], stage: ["lab-stable", "lab-stable", "storm-week", "drought"][k - 1], rssi: -58 - k * 3 }; };
  return { sc, names, sim, t0 };
})();
function demoApi(action, body) {
  const now = Date.now();
  if (action === "login") return Promise.resolve({ token: "demo" });
  if (action === "overview") return Promise.resolve({ reactors: demo.names.map(([id, name], i) => ({ id, name, live: { ...demo.sim(id, now), ...(i === 3 ? { water: false, pump: false } : {}) },
    last_seen: i === 0 ? new Date(now - 3 * 3600e3).toISOString() : new Date(now - 4000).toISOString(), scenario: demo.sc, queued: i === 1 ? 1 : 0, snap_url: null })) });
  if (action === "history") { const n = 160, h = body.hours || 24, rows = [];
    for (let i = 0; i < n; i++) { const t = now - h * 3600e3 + (i / (n - 1)) * h * 3600e3, s = demo.sim(body.reactor, t);
      rows.push({ ts: new Date(t).toISOString(), ...s, heater: s.heater ? 1 : 0, pump: s.pump ? 1 : 0 }); }
    return Promise.resolve({ rows }); }
  if (action === "events") return Promise.resolve({ commands: [{ id: 2, cmd: { cmd: "mist" }, status: "done", result: "mist requested", created_at: new Date(now - 6e5).toISOString() },
    { id: 1, cmd: { cmd: "start" }, status: "done", result: "experiment started", created_at: new Date(now - 3.2 * 864e5).toISOString() }],
    events: [{ ts: new Date(now - 3.2 * 864e5).toISOString(), msg: "online", faults: 0 }] });
  return Promise.resolve({ ok: true, snapshots: [] });
}

/* ---------------------------------------------------------------- start */
if (DEMO) { token = "demo"; boot(); } else if (token) boot();
