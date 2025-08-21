map = {
  const context = DOM.context2d(width, height);
  const path = d3.geoPath(projection, context);
  context.save();
  context.beginPath(), path(outline), context.clip(), context.fillStyle = "#fff", context.fillRect(0, 0, width, height);
  context.beginPath(), path(graticule), context.strokeStyle = "#ccc", context.stroke();
  context.beginPath(), path(land), context.fillStyle = "#000", context.fill();
  context.restore();
  context.beginPath(), path(outline), context.strokeStyle = "#000", context.stroke();
  return context.canvas;
}