chart = {
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);


  svg.append("g")
      .call(xAxis);


  svg.append("g")
      .call(yAxis);


  const train = svg.append("g")
      .attr("stroke-width", 1.5)
    .selectAll("g")
    .data(data)
    .join("g");


  train.append("path")
      .attr("fill", "none")
      .attr("stroke", d => colors[d.type])
      .attr("d", d => line(d.stops));


  train.append("g")
      .attr("stroke", "white")
      .attr("fill", d => colors[d.type])
    .selectAll("circle")
    .data(d => d.stops)
    .join("circle")
      .attr("transform", d => `translate(${x(d.station.distance)},${y(d.time)})`)
      .attr("r", 2.5);


  svg.append("g")
      .call(tooltip);


  return svg.node();
}