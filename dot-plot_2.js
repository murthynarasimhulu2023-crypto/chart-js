chart = {
  // Extract the categories: states and ages.
  const states = d3.group(data, d => d.state);
  const ages = new Set(data.map(d => d.age));


  // Specify the chart’s dimensions.
  const width = 928;
  const height = states.size * 16;
  const marginTop = 30;
  const marginRight = 10;
  const marginBottom = 10;
  const marginLeft = 10;


  // Prepare the scales for positional and color encodings.
  const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.share)])
      .rangeRound([marginLeft, width - marginRight]);
  
  const y = d3.scalePoint()
      .domain(d3.sort(states.keys()))
      .rangeRound([marginTop, height - marginBottom])
      .padding(1);
  
  const color = d3.scaleOrdinal()
      .domain(ages)
      .range(d3.schemeSpectral[ages.size])
      .unknown("#ccc");
  
  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");


  // Create the x axis.
  svg.append("g")
      .attr("transform", `translate(0,${marginTop})`)
      .call(d3.axisTop(x).ticks(null, "%"))
      .call(g => g.append("text")
            .text("population →")
            .attr("fill", "currentColor")
            .attr("transform", `translate(${width - marginRight},0)`)
            .attr("text-anchor", "end")
            .attr("dy", -22)
      )
      .call(g => g.selectAll(".tick line").clone().attr("stroke-opacity", 0.1).attr("y2", height - marginBottom))
      .call(g => g.selectAll(".domain").remove());


  // Add a g container for each state.
  const g = svg.append("g")
      .attr("text-anchor", "end")
      .style("font", "10px sans-serif")
    .selectAll()
    .data(states)
    .join("g")
      .attr("transform", ([state]) => `translate(0,${y(state)})`);


  // Append a grey line to each container.
  g.append("line")
      .attr("stroke", "#aaa")
      .attr("x1", ([, values]) => x(d3.min(values, d => d.share)))
      .attr("x2", ([, values]) => x(d3.max(values, d => d.share)));


  // Append the dots to each container.
  g.append("g")
    .selectAll()
    .data(([, values]) => values)
    .join("circle")
      .attr("cx", (d) => x(d.share))
      .attr("fill", (d) => color(d.age))
      .attr("r", 3.5);


  // Append the label to each container.
  g.append("text")
      .attr("dy", "0.35em")
      .attr("x", ([, values]) => x(d3.min(values, d => d.share)) - 6)
      .text(([state]) => state);


  // Expose an update function that animates the containers to new positions.
  // Expose the color scale for a legend.
  return Object.assign(svg.node(), {
    scales: {color},
    update(names) {
      y.domain(names);
      g.transition()
          .delay((d, i) => i * 10)
          .attr("transform", ([state]) => `translate(0,${y(state)})`);
    }
  });
}