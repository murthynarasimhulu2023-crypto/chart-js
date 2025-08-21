chart = {
  const width = 928;
  const height = 640;
  const marginTop = 24;
  const marginRight = 10;
  const marginBottom = 34;
  const marginLeft = 40;
  const arrowId = DOM.uid("arrow");
  const gradientIds = data.map(() => DOM.uid("gradient"));


  const x = d3.scaleLog()
      .domain(padLog(d3.extent(data.flatMap(d => [d.POP_1980, d.POP_2015])), 0.1))
      .rangeRound([marginLeft, width - marginRight]);


  const y = d3.scaleLinear()
      .domain(padLinear(d3.extent(data.flatMap(d => [d.R90_10_1980, d.R90_10_2015])), 0.1))
      .rangeRound([height - marginBottom, marginTop]);


  function padLinear([x0, x1], k) {
    const dx = (x1 - x0) * k / 2;
    return [x0 - dx, x1 + dx];
  }


  function padLog(x, k) {
    return padLinear(x.map(Math.log), k).map(Math.exp);
  }


  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");


  svg.append("defs")
    .append("marker")
      .attr("id", arrowId.id)
      .attr("markerHeight", 10)
      .attr("markerWidth", 10)
      .attr("refX", 5)
      .attr("refY", 2.5)
      .attr("orient", "auto")
    .append("path")
      .attr("fill", endColor)
      .attr("d", "M0,0v5l7,-2.5Z");


  svg.append("defs")
    .selectAll()
    .data(data)
    .join("linearGradient")
      .attr("id", (d, i) => gradientIds[i].id)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", d => x(d.POP_1980))
      .attr("x2", d => x(d.POP_2015))
      .attr("y1", d => y(d.R90_10_1980))
      .attr("y2", d => y(d.R90_10_2015))
      .call(g => g.append("stop").attr("stop-color", startColor).attr("stop-opacity", 0.5))
      .call(g => g.append("stop").attr("offset", "100%").attr("stop-color", endColor));


  svg.append("g")
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.1)
      .call(g => g.append("g")
        .selectAll("line")
        .data(x.ticks())
        .join("line")
          .attr("x1", d => 0.5 + x(d))
          .attr("x2", d => 0.5 + x(d))
          .attr("y1", marginTop)
          .attr("y2", height - marginBottom))
      .call(g => g.append("g")
        .selectAll("line")
        .data(y.ticks())
        .join("line")
          .attr("y1", d => 0.5 + y(d))
          .attr("y2", d => 0.5 + y(d))
          .attr("x1", marginLeft)
          .attr("x2", width - marginRight));


  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(width / 80, ".1s"))
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
          .attr("x", width)
          .attr("y", marginBottom - 4)
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .text("Population →"));


  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text("↑ Inequality"));


  svg.append("g")
      .attr("fill", "none")
    .selectAll()
    .data(data)
    .join("path")
      .attr("stroke", (d, i) => gradientIds[i])
      .attr("marker-end", arrowId)
      .attr("d", d => arc(x(d.POP_1980), y(d.R90_10_1980), x(d.POP_2015), y(d.R90_10_2015)));


  svg.append("g")
      .attr("fill", "currentColor")
    .selectAll()
    .data(data)
    .join("circle")
      .attr("r", 1.75)
      .attr("cx", d => x(d.POP_1980))
      .attr("cy", d => y(d.R90_10_1980));


  svg.append("g")
      .attr("fill", "currentColor")
      .attr("text-anchor", "middle")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 4)
      .attr("paint-order", "stroke fill")
    .selectAll()
    .data(data.filter(d => d.highlight))
    .join("text")
      .attr("dy", d => d.R90_10_1980 > d.R90_10_2015 ? "1.2em" : "-0.5em")
      .attr("x", d => x(d.POP_2015))
      .attr("y", d => y(d.R90_10_2015))
      .text(d => d.nyt_display);


  return svg.node();
}