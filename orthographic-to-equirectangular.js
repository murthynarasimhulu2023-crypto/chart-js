canvas = {
  const context = DOM.context2d(width, height);
  const path = d3.geoPath(projection, context);
  while (true) {
    for (let i = 0, n = 480; i < n; ++i) {
      const t = d3.easeCubic(2 * i > n ? 2 - 2 * i / n : 2 * i / n);
      projection.alpha(t).rotate(rotate(t)).scale(scale(t));
      context.clearRect(0, 0, width, height);
      context.beginPath();
      path(graticule);
      context.lineWidth = 1;
      context.strokeStyle = "#aaa";
      context.stroke();
      context.beginPath();
      path(sphere);
      context.lineWidth = 1.5;
      context.strokeStyle = "#000";
      context.stroke();
      context.beginPath();
      path(equator);
      context.lineWidth = 1.5;
      context.strokeStyle = "#f00";
      context.stroke();
      yield context.canvas;
    }
  }
}