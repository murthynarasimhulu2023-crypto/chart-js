chart = {
  const width = 928;
  const height = 500;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 30;
  const marginLeft = 40;
  
  // Create the scales.
  const x = d3.scaleUtc()
      .domain(d3.extent(data, d => d.date))
      .rangeRound([marginLeft, width - marginRight]);


  const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d.temperature)).nice()
      .rangeRound([height - marginBottom, marginTop]);


  const color = d3.scaleOrdinal(conditions.keys(), Array.from(conditions.values(), d => d.color))
    .unknown("black");


  // Create the path generator.
  const line = d3.line()
      .curve(d3.curveStep)
      .x(d => x(d.date))
      .y(d => y(d.temperature));


  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");


  // Append the axes.
  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
      .call(g => g.select(".domain").remove());


  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())
      .call(g => g.select(".tick:last-of-type text").append("tspan").text(data.y));


  // Create the grid.
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


  // Create the linear gradient.
  const colorId = DOM.uid("color");
  svg.append("linearGradient")
      .attr("id", colorId.id)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("x2", width)
    .selectAll("stop")
    .data(data)
    .join("stop")
      .attr("offset", d => x(d.date) / width)
      .attr("stop-color", d => color(d.condition));


  // Create the main path.
  svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", colorId)
      .attr("stroke-width", 2)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);


  return Object.assign(svg.node(), {scales: {color}});
}