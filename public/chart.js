// Ortak SVG trend grafigi ciziciyi hem tek-makine (history.html) hem de
// gruplu (history-groups.html) gecmis sayfalari kullaniyor.

function inThresholdRange(value, threshold) {
  if (!threshold) return true;
  if (threshold.min_value !== null && threshold.min_value !== undefined && value < threshold.min_value) return false;
  if (threshold.max_value !== null && threshold.max_value !== undefined && value > threshold.max_value) return false;
  return true;
}

// Ilk ve son deger arasindaki degisime gore genel egilim ozeti (baslik yanindaki rozet).
function computeTrendBadge(valid) {
  const first = valid[0].value, last = valid[valid.length - 1].value;
  const diff = last - first;
  const tolerance = Math.max(Math.abs(first) * 0.002, 0.01);
  let direction = "flat", arrow = "→";
  if (diff > tolerance) { direction = "up"; arrow = "▲"; }
  else if (diff < -tolerance) { direction = "down"; arrow = "▼"; }
  const sign = diff > 0 ? "+" : "";
  return { direction, text: `${arrow} ${sign}${diff.toFixed(2)}` };
}

function toExportRows(valid, label) {
  const header = ["Tarih", label];
  const rows = valid.map((p) => [new Date(p.recorded_at).toLocaleString("tr-TR"), p.value.toFixed(2).replace(".", ",")]);
  return [header, ...rows];
}

function downloadCsv(rows, label) {
  const csv = "﻿" + rows.map((r) => r.join(";")).join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const safeLabel = label.replace(/[^a-z0-9_\-]+/gi, "_");
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
  a.href = url;
  a.download = `${safeLabel}_${stamp}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function copyRowsToClipboard(rows, button) {
  const text = rows.map((r) => r.join("\t")).join("\n");
  const original = button.textContent;
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = "✓ Kopyalandi";
    button.classList.add("copied");
  } catch (err) {
    button.textContent = "Kopyalanamadi";
  }
  setTimeout(() => {
    button.textContent = original;
    button.classList.remove("copied");
  }, 1500);
}

// threshold (opsiyonel): {min_value, max_value}. Verilirse alt/ust sinir icin
// kesikli referans cizgileri eklenir ve sinirin disina cikan segmentler/satirlar
// "line-alert" / "value-row-alert" sinifiyla farkli renkte gosterilir.
function renderTrendChart(container, label, points, threshold) {
  const card = document.createElement("div");
  card.className = "chart-card";

  const valid = points.filter((p) => p.value !== null && p.value !== undefined);

  const header = document.createElement("div");
  header.className = "chart-header";
  const titleRow = document.createElement("div");
  titleRow.className = "chart-title-row";
  const title = document.createElement("span");
  title.className = "chart-title";
  title.textContent = label;
  titleRow.appendChild(title);
  header.appendChild(titleRow);
  card.appendChild(header);

  if (valid.length < 2) {
    const empty = document.createElement("div");
    empty.className = "chart-empty";
    empty.textContent = "Yeterli veri yok.";
    card.appendChild(empty);
    container.appendChild(card);
    return;
  }

  const trend = computeTrendBadge(valid);
  const badge = document.createElement("span");
  badge.className = `trend-badge ${trend.direction}`;
  badge.textContent = trend.text;
  titleRow.appendChild(badge);

  const actions = document.createElement("div");
  actions.className = "chart-actions";
  const copyBtn = document.createElement("button");
  copyBtn.type = "button";
  copyBtn.className = "chart-btn";
  copyBtn.textContent = "📋 Kopyala";
  copyBtn.addEventListener("click", () => copyRowsToClipboard(toExportRows(valid, label), copyBtn));
  const exportBtn = document.createElement("button");
  exportBtn.type = "button";
  exportBtn.className = "chart-btn";
  exportBtn.textContent = "⬇ Excel";
  exportBtn.addEventListener("click", () => downloadCsv(toExportRows(valid, label), label));
  actions.appendChild(copyBtn);
  actions.appendChild(exportBtn);
  header.appendChild(actions);

  const width = 700, height = 160, padL = 44, padR = 10, padT = 10, padB = 20;
  const minT = valid[0].recorded_at, maxT = valid[valid.length - 1].recorded_at;
  const values = valid.map((p) => p.value);
  let minV = Math.min(...values), maxV = Math.max(...values);
  if (minV === maxV) { minV -= 1; maxV += 1; }
  const pad = (maxV - minV) * 0.1;
  minV -= pad; maxV += pad;

  const x = (t) => padL + ((t - minT) / (maxT - minT || 1)) * (width - padL - padR);
  const y = (v) => padT + (1 - (v - minV) / (maxV - minV)) * (height - padT - padB);

  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  [minV, (minV + maxV) / 2, maxV].forEach((v) => {
    const ly = y(v);
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", padL); line.setAttribute("x2", width - padR);
    line.setAttribute("y1", ly); line.setAttribute("y2", ly);
    line.setAttribute("class", "gridline");
    svg.appendChild(line);

    const text = document.createElementNS(svgNS, "text");
    text.setAttribute("x", padL - 6); text.setAttribute("y", ly + 3);
    text.setAttribute("text-anchor", "end");
    text.setAttribute("class", "axis-label");
    text.textContent = v.toFixed(1);
    svg.appendChild(text);
  });

  const hasThreshold =
    threshold && ((threshold.min_value !== null && threshold.min_value !== undefined) || (threshold.max_value !== null && threshold.max_value !== undefined));

  if (hasThreshold) {
    [threshold.min_value, threshold.max_value].forEach((v) => {
      if (v === null || v === undefined) return;
      const ly = y(v);
      const line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", padL); line.setAttribute("x2", width - padR);
      line.setAttribute("y1", ly); line.setAttribute("y2", ly);
      line.setAttribute("class", "threshold-line");
      svg.appendChild(line);
    });

    // Tek parca yerine ardisik nokta ciftleri: iki uctan biri sinir disindaysa
    // o segment "line-alert" sinifiyla (farkli renk), degilse yukselis/dusus
    // yonune gore "line-up"/"line-down" sinifiyla cizilir.
    for (let i = 0; i < valid.length - 1; i++) {
      const a = valid[i], b = valid[i + 1];
      const outOfRange = !inThresholdRange(a.value, threshold) || !inThresholdRange(b.value, threshold);
      const seg = document.createElementNS(svgNS, "path");
      seg.setAttribute("d", `M${x(a.recorded_at)},${y(a.value)} L${x(b.recorded_at)},${y(b.value)}`);
      const trendClass = outOfRange ? "line-alert" : b.value > a.value ? "line-up" : b.value < a.value ? "line-down" : "";
      seg.setAttribute("class", `line ${trendClass}`.trim());
      svg.appendChild(seg);
    }
  } else {
    // Sinir tanimli degilse segmentleri sadece yukselis/dusus yonune gore renklendir.
    for (let i = 0; i < valid.length - 1; i++) {
      const a = valid[i], b = valid[i + 1];
      const seg = document.createElementNS(svgNS, "path");
      seg.setAttribute("d", `M${x(a.recorded_at)},${y(a.value)} L${x(b.recorded_at)},${y(b.value)}`);
      const trendClass = b.value > a.value ? "line-up" : b.value < a.value ? "line-down" : "";
      seg.setAttribute("class", `line ${trendClass}`.trim());
      svg.appendChild(seg);
    }
  }

  const last = valid[valid.length - 1];
  const dot = document.createElementNS(svgNS, "circle");
  dot.setAttribute("cx", x(last.recorded_at)); dot.setAttribute("cy", y(last.value));
  dot.setAttribute("r", 4);
  dot.setAttribute("class", "end-dot");
  svg.appendChild(dot);

  const crosshair = document.createElementNS(svgNS, "line");
  crosshair.setAttribute("y1", padT); crosshair.setAttribute("y2", height - padB);
  crosshair.setAttribute("class", "crosshair");
  crosshair.style.display = "none";
  svg.appendChild(crosshair);

  const hoverRect = document.createElementNS(svgNS, "rect");
  hoverRect.setAttribute("x", padL); hoverRect.setAttribute("y", padT);
  hoverRect.setAttribute("width", width - padL - padR); hoverRect.setAttribute("height", height - padT - padB);
  hoverRect.setAttribute("class", "hover-layer");
  svg.appendChild(hoverRect);

  const tooltip = document.createElement("div");
  tooltip.className = "tooltip";
  tooltip.style.display = "none";
  card.style.position = "relative";

  hoverRect.addEventListener("mousemove", (e) => {
    const rect = svg.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * width;
    const t = minT + ((relX - padL) / (width - padL - padR)) * (maxT - minT);
    let nearest = valid[0];
    for (const p of valid) {
      if (Math.abs(p.recorded_at - t) < Math.abs(nearest.recorded_at - t)) nearest = p;
    }
    crosshair.setAttribute("x1", x(nearest.recorded_at));
    crosshair.setAttribute("x2", x(nearest.recorded_at));
    crosshair.style.display = "block";

    tooltip.style.display = "block";
    tooltip.textContent = `${nearest.value.toFixed(2)} — ${new Date(nearest.recorded_at).toLocaleTimeString("tr-TR")}`;
    tooltip.style.left = (e.clientX - rect.left + 12) + "px";
    tooltip.style.top = (e.clientY - rect.top - 30) + "px";
  });
  hoverRect.addEventListener("mouseleave", () => {
    crosshair.style.display = "none";
    tooltip.style.display = "none";
  });

  card.appendChild(svg);
  card.appendChild(tooltip);

  // Grafigin altinda okunan degerleri tarih-saat ile listeleyen tablo (en yeni ustte).
  const table = document.createElement("div");
  table.className = "value-table";
  const MAX_ROWS = 500;
  const reversed = valid.slice().reverse().slice(0, MAX_ROWS);
  table.innerHTML = reversed
    .map((p) => {
      const rowClass = hasThreshold && !inThresholdRange(p.value, threshold) ? "value-row value-row-alert" : "value-row";
      return `<div class="${rowClass}"><span class="value-time">${new Date(p.recorded_at).toLocaleString("tr-TR")}</span><span class="value-num">${p.value.toFixed(2)}</span></div>`;
    })
    .join("");
  if (valid.length > MAX_ROWS) {
    const note = document.createElement("div");
    note.className = "value-table-note";
    note.textContent = `Son ${MAX_ROWS} kayit gosteriliyor (toplam ${valid.length}).`;
    table.appendChild(note);
  }
  card.appendChild(table);

  container.appendChild(card);
}
