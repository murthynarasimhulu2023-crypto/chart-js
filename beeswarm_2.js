chart = {
  const width = 928;
  const height = 160;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 20;
  const marginLeft = 20;
  const radius = 3;
  const padding = 1.5;


  const x = d3.scaleLinear()
      .domain(d3.extent(cars, d => d["weight (lb)"]))
      .range([marginLeft, width - marginRight]);


  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");
  
  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));
  
  svg.append("g")
    .selectAll()
    .data(dodge(cars, {radius: radius * 2 + padding, x: d => x(d["weight (lb)"])}))
    .join("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => height - marginBottom - radius - padding - d.y)
      .attr("r", radius)
    .append("title")
      .text(d => d.data.name);


  return svg.node();
}