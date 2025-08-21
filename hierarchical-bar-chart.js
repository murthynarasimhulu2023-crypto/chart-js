chart = {
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto;");


  x.domain([0, root.value]);


  svg.append("rect")
      .attr("class", "background")
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .attr("width", width)
      .attr("height", height)
      .attr("cursor", "pointer")
      .on("click", (event, d) => up(svg, d));


  svg.append("g")
      .call(xAxis);


  svg.append("g")
      .call(yAxis);


  down(svg, root);


  return svg.node();
}