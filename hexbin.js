chart = {


  // Specify the chart’s dimensions.
  const width = 928;
  const height = width;
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 30;
  const marginLeft = 40;


  // Create the positional scales.
  const x = d3.scaleLog()
      .domain(d3.extent(data, d => d["carat"]))
      .range([marginLeft, width - marginRight]);


  const y = d3.scaleLog()
      .domain(d3.extent(data, d => d["price"]))
      .rangeRound([height - marginBottom, marginTop]);


  // Bin the data.
  const hexbin = d3.hexbin()
    .x(d => x(d["carat"]))
    .y(d => y(d["price"]))
    .radius(radius * width / 928)
    .extent([[marginLeft, marginTop], [width - marginRight, height - marginBottom]]);


  const bins = hexbin(data);


  // Create the color scale.
  const color = d3.scaleSequential(d3.interpolateBuPu)
    .domain([0, d3.max(bins, d => d.length) / 2]);
  
  // Create the container SVG.
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);


  // Append the axes.
  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(width / 80, ""))
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
          .attr("x", width - marginRight)
          .attr("y", -4)
          .attr("fill", "currentColor")
          .attr("font-weight", "bold")
          .attr("text-anchor", "end")
          .text("Carats"));


  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(null, ".1s"))
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
          .attr("x", 4)
          .attr("y", marginTop)
          .attr("dy", ".71em")
          .attr("fill", "currentColor")
          .attr("font-weight", "bold")
          .attr("text-anchor", "start")
          .text("$ Price"));


  // Append the scaled hexagons.
  svg.append("g")
      .attr("fill", "#ddd")
      .attr("stroke", "black")
    .selectAll("path")
    .data(bins)
    .enter().append("path")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .attr("d", hexbin.hexagon())
      .attr("fill", bin => color(bin.length));


  return svg.node();
}