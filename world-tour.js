canvas = {
  // Specify the chart’s dimensions.
  const height = Math.min(width, 720); // Observable sets a responsive *width*


  // Prepare a canvas.
  const dpr = window.devicePixelRatio ?? 1;
  const canvas = d3.create("canvas")
      .attr("width", dpr * width)
      .attr("height", dpr * height)
      .style("width", `${width}px`);
  const context = canvas.node().getContext("2d");
  context.scale(dpr, dpr);


  // Create a projection and a path generator.
  const projection = d3.geoOrthographic().fitExtent([[10, 10], [width - 10, height - 10]], {type: "Sphere"});
  const path = d3.geoPath(projection, context);
  const tilt = 20;


  function render(country, arc) {
    context.clearRect(0, 0, width, height);
    context.beginPath(), path(land), context.fillStyle = "#ccc", context.fill();
    context.beginPath(), path(country), context.fillStyle = "#f00", context.fill();
    context.beginPath(), path(borders), context.strokeStyle = "#fff", context.lineWidth = 0.5, context.stroke();
    context.beginPath(), path({type: "Sphere"}), context.strokeStyle = "#000", context.lineWidth = 1.5, context.stroke();
    context.beginPath(), path(arc), context.stroke();
    return context.canvas;
  }


  let p1, p2 = [0, 0], r1, r2 = [0, 0, 0];
  for (const country of countries) {
    mutable name = country.properties.name;
    yield render(country);


    p1 = p2, p2 = d3.geoCentroid(country);
    r1 = r2, r2 = [-p2[0], tilt - p2[1], 0];
    const ip = d3.geoInterpolate(p1, p2);
    const iv = Versor.interpolateAngles(r1, r2);


    await d3.transition()
        .duration(1250)
        .tween("render", () => t => {
          projection.rotate(iv(t));
          render(country, {type: "LineString", coordinates: [p1, ip(t)]});
        })
      .transition()
        .tween("render", () => t => {
          render(country, {type: "LineString", coordinates: [ip(t), p2]});
        })
      .end();
  }
}