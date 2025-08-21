chart = {
  // Specify the chart’s dimensions.
  const width = 928;
  const height = 500;
  const marginTop = 20;
  const marginRight = 30;
  const marginBottom = 30;
  const marginLeft = 40;


  // Create the scales.
  const x = d3.scaleUtc()
      .domain(d3.extent(data, d => d.date))
      .range([marginLeft, width - marginRight]);


  const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d.temperature)).nice()
      .range([height - marginBottom, marginTop]);


  const color = d3.scaleSequential(y.domain(), d3.interpolateTurbo);


  // Create the path generator.
  const line = d3.line()
    .curve(d3.curveStep)
    .defined(d => !isNaN(d.temperature))
    .x(d => x(d.date))
    .y(d => y(d.temperature));
  
  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");


  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
     .call(g => g.select(".domain").remove());


  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())
     .call(g => g.select(".tick:last-of-type text").append("tspan").text("°F"));


  // Append the color gradient.
  const gradient = DOM.uid();
  svg.append("linearGradient")
      .attr("id", gradient.id)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", 0)
      .attr("y1", height - marginBottom)
      .attr("x2", 0)
      .attr("y2", marginTop)
    .selectAll("stop")
      .data(d3.ticks(0, 1, 10))
    .join("stop")
      .attr("offset", d => d)
      .attr("stop-color", color.interpolator());


  // Append the line.
  svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", gradient)
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", line);


  return Object.assign(svg.node(), {scales: {color}});
}