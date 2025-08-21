chart = {


  const color = d3.scaleOrdinal()
      .domain(data.map(d => d[2]))
      .range(d3.schemeCategory10);


  const zoom = d3.zoom()
      .on("zoom", zoomed);


  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);


  const g = svg.append("g")
      .attr("fill", "none")
      .attr("stroke-linecap", "round");


  g.selectAll("path")
    .data(data)
    .join("path")
      .attr("d", d => `M${x(d[0])},${y(d[1])}h0`)
      .attr("stroke", d => color(d[2]));


  const gx = svg.append("g")
        .attr("transform", `translate(0,${height})`);
  const xAxis = (g, x) => g
      .call(d3.axisTop(x).ticks(12))
      .call(g => g.select(".domain").attr("display", "none"));


  const gy = svg.append("g");
  const yAxis = (g, y) => g
      .call(d3.axisRight(y).ticks(12 * k))
      .call(g => g.select(".domain").attr("display", "none"));


  svg.call(zoom.transform, viewof transform.value);


  function zoomed({transform}) {
    g.attr("transform", transform).attr("stroke-width", 5 / transform.k);
    gx.call(xAxis, transform.rescaleX(x));
    gy.call(yAxis, transform.rescaleY(y));
  }


  return Object.assign(svg.node(), {
    update(transform) {
      svg.transition()
          .duration(1500)
          .call(zoom.transform, transform);
    }
  });
}