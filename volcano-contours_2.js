chart = {
  const n = data.width;
  const m = data.height;
  const width = 928;
  const height = Math.round(m / n * width);
  const path = d3.geoPath().projection(d3.geoIdentity().scale(width / n));
  const contours = d3.contours().size([n, m]);
  const color = d3.scaleSequential(d3.interpolateTurbo).domain(d3.extent(data.values)).nice();


  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");


  svg.append("g")
      .attr("stroke", "black")
    .selectAll()
    .data(color.ticks(20))
    .join("path")
      .attr("d", d => path(contours.contour(data.values, d)))
      .attr("fill", color);


  return svg.node();
}