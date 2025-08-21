chart = {


  const data = d3.sort(states, d => d[2019] - d[2010])
    .map((d) => ({
      ...d,
      value: metric === "absolute" ? d[2019] - d[2010] : (d[2019] - d[2010]) / d[2010]
    }));
  
  // Specify the chart’s dimensions.
  const barHeight = 25;
  const marginTop = 30;
  const marginRight = 60;
  const marginBottom = 10;
  const marginLeft = 60;
  const height = Math.ceil((data.length + 0.1) * barHeight) + marginTop + marginBottom;


  // Create the positional scales.
  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.value))
    .rangeRound([marginLeft, width - marginRight]);


  const y = d3.scaleBand()
    .domain(data.map(d => d.State))
    .rangeRound([marginTop, height - marginBottom])
    .padding(0.1);


  // Create the format function.
  const format = d3.format(metric === "absolute" ? "+,d" : "+.1%");
  const tickFormat = metric === "absolute" ? d3.formatPrefix("+.1", 1e6) : d3.format("+.0%");


  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");


  // Add a rect for each state.
  svg.append("g")
    .selectAll()
    .data(data)
    .join("rect")
      .attr("fill", (d) => d3.schemeRdBu[3][d.value > 0 ? 2 : 0])
      .attr("x", (d) => x(Math.min(d.value, 0)))
      .attr("y", (d) => y(d.State))
      .attr("width", d => Math.abs(x(d.value) - x(0)))
      .attr("height", y.bandwidth());


  // Add a text label for each state.
  svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
    .selectAll()
    .data(data)
    .join("text")
      .attr("text-anchor", d => d.value < 0 ? "end" : "start")
      .attr("x", (d) => x(d.value) + Math.sign(d.value - 0) * 4)
      .attr("y", (d) => y(d.State) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .text(d => format(d.value));


  // Add the axes and grid lines.
  svg.append("g")
    .attr("transform", `translate(0,${marginTop})`)
    .call(d3.axisTop(x).ticks(width / 80).tickFormat(tickFormat))
    .call(g => g.selectAll(".tick line").clone()
          .attr("y2", height - marginTop - marginBottom)
          .attr("stroke-opacity", 0.1))
    .call(g => g.select(".domain").remove());


  svg.append("g")
    .attr("transform", `translate(${x(0)},0)`)
    .call(d3.axisLeft(y).tickSize(0).tickPadding(6))
    .call(g => g.selectAll(".tick text").filter((d, i) => data[i].value < 0)
        .attr("text-anchor", "start")
        .attr("x", 6));


  return svg.node();
}