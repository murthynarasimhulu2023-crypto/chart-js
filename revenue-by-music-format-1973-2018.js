chart = {  


  const width = 928;
  const height = 500;
  const marginTop = 20;
  const marginRight = 30;
  const marginBottom = 30;
  const marginLeft = 30;


  // Create scales.
  const x = d3.scaleBand()
      .domain(data.map(d => d.year))
      .rangeRound([marginLeft, width - marginRight]);


  const y = d3.scaleLinear()
      .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
      .range([height - marginBottom, marginTop]);


  const color = d3.scaleOrdinal()
      .domain(colors.keys())
      .range(colors.values());


  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto;");


  // Create the bars.
  const formatRevenue = x => (+(x / 1e9).toFixed(2) >= 1) 
    ? `${(x / 1e9).toFixed(2)}B` 
    : `${(x / 1e6).toFixed(0)}M`;


  svg.append("g")
    .selectAll("g")
    .data(series)
    .join("g")
      .attr("fill", ({key}) => color(key))
      .call(g => g.selectAll("rect")
        .data(d => d)
        .join("rect")
          .attr("x", d => x(d.data.year))
          .attr("y", d => y(d[1]))
          .attr("width", x.bandwidth() - 1)
          .attr("height", d => y(d[0]) - y(d[1]))
       .append("title")
          .text(d => `${d.data.name}, ${d.data.year}
${formatRevenue(d.data.value)}`));


  // Create axes.
  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x)
          .tickValues(d3.ticks(...d3.extent(x.domain()), width / 80))
          .tickSizeOuter(0));


  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y)
          .tickFormat(x => (x / 1e9).toFixed(0)))
      .call(g => g.select(".domain").remove())
      .call(g => g.select(".tick:last-of-type text").clone()
          .attr("x", 3)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text("Revenue (billions, adj.)"));


  return Object.assign(svg.node(), {scales: {color}});
}