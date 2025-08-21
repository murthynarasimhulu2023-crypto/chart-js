chart = {


  // Specify the chart’s dimensions.
  const width = 928;
  const height = 600;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 30;
  const marginLeft = 30;


  // Create the positional and color scales.
  const x = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([marginLeft, width - marginRight]);


  const y = d3.scaleLinear()
    .domain([
      d3.min(data, d => Math.min(d.value0, d.value1)),
      d3.max(data, d => Math.max(d.value0, d.value1))
    ])
    .range([height - marginBottom, marginTop]);


  const colors = [d3.schemeRdYlBu[3][2], d3.schemeRdYlBu[3][0]];


  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;")
      .datum(data);


  // Create the axes.
  svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(d3.axisBottom(x)
       .ticks(width / 80)
       .tickSizeOuter(0))
    .call(g => g.select(".domain").remove());


  svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select(".domain").remove())
    .call(g => g.selectAll(".tick line").clone()
        .attr("x2", width - marginLeft - marginRight)
        .attr("stroke-opacity", 0.1))
    .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", -marginLeft)
        .attr("y", -30)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("↑ Temperature (°F)"));


  // Create the clipPaths.
  svg.append("clipPath")
      .attr("id", "above")
    .append("path")
      .attr("d", d3.area()
          .curve(d3.curveStep)
          .x(d => x(d.date))
          .y0(0)
          .y1(d => y(d.value1)));


  svg.append("clipPath")
      .attr("id","below")
    .append("path")
      .attr("d", d3.area()
          .curve(d3.curveStep)
          .x(d => x(d.date))
          .y0(height)
          .y1(d => y(d.value1)));


  // Create the color areas.
  svg.append("path")
      .attr("clip-path", "url(#above)")
      .attr("fill", colors[1])
      .attr("d", d3.area()
          .curve(d3.curveStep)
          .x(d => x(d.date))
          .y0(height)
          .y1(d => y(d.value0)));


  svg.append("path")
      .attr("clip-path", "url(#below)")
      .attr("fill", colors[0])
      .attr("d", d3.area()
          .curve(d3.curveStep)
          .x(d => x(d.date))
          .y0(0)
          .y1(d => y(d.value0)));


  // Create the black line.
  svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("d", d3.line()
          .curve(d3.curveStep)
          .x(d => x(d.date))
          .y(d => y(d.value0)));
  
  return svg.node();
}