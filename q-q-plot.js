chart = {
  const width = 640;
  const height = width;
  const marginTop = 20;
  const marginRight = 40;
  const marginBottom = 30;
  const marginLeft = 40;


  const x = d3.scaleLinear()
      .domain([qmin, qmax]).nice()
      .range([marginLeft, width - marginRight]);


  const y = d3.scaleLinear()
      .domain([qmin, qmax]).nice()
      .range([height - marginBottom, marginTop]);
  
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .style("max-width", `${width}px`);


  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom + 6})`)
      .call(d3.axisBottom(x.copy().interpolate(d3.interpolateRound)))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("stroke-opacity", 0.1)
          .attr("y1", -height))
      .call(g => g.append("text")
          .attr("x", width - marginRight)
          .attr("y", -3)
          .attr("fill", "currentColor")
          .attr("font-weight", "bold")
          .text("Batch 2"));


  svg.append("g")
      .attr("transform", `translate(${marginLeft - 6},0)`)
      .call(d3.axisLeft(y.copy().interpolate(d3.interpolateRound)))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("stroke-opacity", 0.1)
          .attr("x1", width))
      .call(g => g.select(".tick:last-of-type text").clone()
          .attr("x", 3)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text("Batch 1"));


  svg.append("line")
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.3)
      .attr("x1", x(qmin))
      .attr("x2", x(qmax))
      .attr("y1", y(qmin))
      .attr("y2", y(qmax));


  svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(d3.range(n))
    .join("circle")
      .attr("cx", i => x(q(qx, i)))
      .attr("cy", i => y(q(qy, i)))
      .attr("r", 3);


  return svg.node();
}