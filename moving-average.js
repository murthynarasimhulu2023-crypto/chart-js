chart = {
  // Specify the chart’s dimensions.
  const width = 928;
  const height = 500;
  const marginTop = 20;
  const marginRight = 12;
  const marginBottom = 30;
  const marginLeft = 30;


  // Create the temporal scale.
  const x = d3.scaleTime()
    .domain(d3.extent(dates))
    .range([marginLeft, width - marginRight]);


  // Count the events by day.
  const bins = d3.bin()
    .domain(x.domain())
    .thresholds(x.ticks(d3.timeDay))
  (dates);


  // Apply the moving-average transform.
  const values = movingAverage(bins.map(d => d.length), N);


  // Create the vertical scale.
  const y = d3.scaleLinear()
    .domain([0, d3.max(values)]).nice()
    .rangeRound([height - marginBottom, marginTop]);


  // Create the container SVG.
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto;");


  // Append the axes.
  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));
  
  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y))
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("x2", width)
          .attr("stroke-opacity", 0.1));


  // Append the area. Ignore invalid values due to an incomplete window
  // at the start of the time period.
  const area = d3.area()
       .defined(d => !isNaN(d))
       .x((d, i) => x(bins[i].x0))
       .y0(y(0))
       .y1(y);


  svg.append("path")
      .attr("fill", "steelblue")
      .attr("d", area(values));


  return svg.node();
}