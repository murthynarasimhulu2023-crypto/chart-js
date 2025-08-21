map = {
  const width = 954 + 28;
  const height = width;
  const cx = width / 2;
  const cy = height / 2;
  const radius = d3.scaleLinear([6, -1], [0, 8]);
  const outline = d3.geoCircle().radius(90).center([0, 90])();
  const graticule = d3.geoGraticule().stepMinor([15, 10])();


  const projection = d3.geoStereographic()
      .reflectY(true)
      .scale((width - 120) * 0.5)
      .clipExtent([[0, 0], [width, height]])
      .rotate([0, -90])
      .translate([width / 2, height / 2])
      .precision(0.1);


  const path = d3.geoPath(projection);


  const voronoi = d3.Delaunay
    .from(data.map(projection))
    .voronoi([0, 0, width, height]);


  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "display: block; margin: 0 -14px; width: 100%; height: auto; font: 10px sans-serif; color: white; background: radial-gradient(#081f4b 0%, #061616 100%);")
      .attr("text-anchor", "middle")
      .attr("fill", "currentColor");


  svg.append("path")
      .attr("d", path(graticule))
      .attr("fill", "none")
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.2);


  svg.append("path")
      .attr("d", path(outline))
      .attr("fill", "none")
      .attr("stroke", "currentColor");


  // 5-minute ticks
  svg.append("g")
      .attr("stroke", "currentColor")
    .selectAll()
    .data(d3.range(0, 1440, 5)) // every 5 minutes
    .join("line")
      .datum(d => [
        projection([d / 4, 0]),
        projection([d / 4, d % 60 ? -1 : -2])
      ])
      .attr("x1", ([[x1]]) => x1)
      .attr("x2", ([, [x2]]) => x2)
      .attr("y1", ([[, y1]]) => y1)
      .attr("y2", ([, [, y2]]) => y2);


  // hourly ticks and labels
  svg.append("g")
    .selectAll()
    .data(d3.range(0, 1440, 60)) // every hour
    .join("text")
      .attr("dy", "0.35em")
      .text(d => `${d / 60}h`)
      .attr("font-size", d => d % 360 ? null : 14)
      .attr("font-weight", d => d % 360 ? null : "bold")
      .datum(d => projection([d / 4, -4]))
      .attr("x", ([x]) => x)
      .attr("y", ([, y]) => y);


  // 10° labels
  svg.append("g")
    .selectAll()
    .data(d3.range(10, 91, 10))
    .join("text")
      .attr("dy", "0.35em")
      .text(d => `${d}°`)
      .datum(d => projection([0, d]))
      .attr("x", ([x]) => x)
      .attr("y", ([, y]) => y);


  const focusDeclination = svg.append("circle")
      .attr("cx", cx)
      .attr("cy", cy)
      .attr("fill", "none")
      .attr("stroke", "yellow");


  const focusRightAscension = svg.append("line")
      .attr("x1", cx)
      .attr("y1", cy)
      .attr("x2", cx)
      .attr("y2", cy)
      .attr("stroke", "yellow");


  svg.append("g")
      .attr("stroke", "black")
    .selectAll()
    .data(data)
    .join("circle")
      .attr("r", d => radius(d.magnitude))
      .attr("transform", d => `translate(${projection(d)})`);


  svg.append("g")
      .attr("pointer-events", "all")
      .attr("fill", "none")
    .selectAll()
    .data(data)
    .join("path")
      .on("mouseover", mouseovered)
      .on("mouseout", mouseouted)
      .attr("d", (d, i) => voronoi.renderCell(i))
    .append("title")
      .text(formatTitle);


  function mouseovered(event, d) {
    const [px, py] = projection(d);
    const dx = px - cx;
    const dy = py - cy;
    const a = Math.atan2(dy, dx);
    focusDeclination.attr("r", Math.hypot(dx, dy));
    focusRightAscension.attr("x2", cx + 1e3 * Math.cos(a)).attr("y2", cy + 1e3 * Math.sin(a));
  }


  function mouseouted(event, d) {
    focusDeclination.attr("r", null);
    focusRightAscension.attr("x2", cx).attr("y2", cy);
  }


  return svg.node();
}