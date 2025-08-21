map = {
  const context = DOM.context2d(width, height);
  const path = d3.geoPath(projection, context);
  context.beginPath(), path(graticule), context.strokeStyle = "#ccc", context.stroke();
  context.beginPath(), path(land), context.fillStyle = "#000", context.fill();
  context.beginPath(), path(night), context.fillStyle = "rgba(0,0,255,0.3)", context.fill();
  context.beginPath(), path(sphere), context.strokeStyle = "#000", context.stroke();
  return context.canvas;
}