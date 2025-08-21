chart = {
  const context = DOM.context2d(width, height);
  const path = d3.geoPath(projection, context);


  function render(land) {
    context.clearRect(0, 0, width, height);
    context.beginPath(), path(sphere), context.fillStyle = "#fff", context.fill();
    context.beginPath(), path(land), context.fillStyle = "#000", context.fill();
    context.beginPath(), path(sphere), context.stroke();
  }


  return d3.select(context.canvas)
    .call(drag(projection)
        .on("drag.render", () => render(land110))
        .on("end.render", () => render(land50)))
    .call(() => render(land50))
    .node();
}