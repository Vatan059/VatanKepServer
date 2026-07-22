// Ortak SVG trend grafigi ciziciyi hem tek-makine (history.html) hem de
// gruplu (history-groups.html) gecmis sayfalari kullaniyor.

function buildLinePath(points, x, y) {
  return points.map((p, i) => `${i === 0 ? "M" : "L"}${x(p.recorded_at)},${y(p.value)}`).join(" ");
}

function renderTrendChart(container, label, points) {
  const card = document.createElement("div");
  card.className = "chart-card";
  const title = document.createElement("div");
  title.className = "chart-title";
  title.textContent = label;
  card.appendChild(title);

  const valid = points.filter((p) => p.value !== null && p.value !== undefined);
  if (valid.length < 2) {
    const empty = document.createElement("div");
    empty.className = "chart-empty";
    empty.textContent = "Yeterli veri yok.";
    card.appendChild(empty);
    container.appendChild(card);
    return;
  }

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

  const path = document.createElementNS(svgNS, "path");
  path.setAttribute("d", buildLinePath(valid, x, y));
  path.setAttribute("class", "line");
  svg.appendChild(path);

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
  container.appendChild(card);
}
