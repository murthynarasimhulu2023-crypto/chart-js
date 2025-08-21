chart = {


  // Declare the chart dimensions and margins.
  const width = 928;
  const height = 720;
  const marginTop = 10;
  const marginRight = 10;
  const marginBottom = 30;
  const marginLeft = 40;
  
  // Declare the scales.
  const x = d3.scaleUtc()
      .domain(d3.extent(data, d => d.date))
      .range([marginLeft, width - marginRight]);


  const y = d3.scaleLinear()
      .range([height - marginBottom, marginTop]);
  
  const color = d3.scaleOrdinal()
      .domain(regionRank)
      .range(d3.schemeCategory10)
      .unknown("gray");


  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");


  // Create the areas
  const area = d3.area()
      .x(d => x(d.data.date))
      .y0(d => y(d[0]))
      .y1(d => y(d[1]));
  svg.append("g")
      .attr("fill-opacity", 0.8)
    .selectAll("path")
    .data(series)
    .join("path")
      .attr("fill", ({key}) => color(regionByState.get(key)))
      .attr("d", area)
    .append("title")
      .text(({key}) => key);


  // Create the lines.
  const midline = d3.line()
      .curve(d3.curveBasis)
      .x(d => x(d.data.date))
      .y(d => y((d[0] + d[1]) / 2));


  svg.append("g")
      .attr("fill", "none")
      .attr("stroke-width", 0.75)
    .selectAll("path")
    .data(series)
    .join("path")
      .attr("stroke", ({key}) => d3.lab(color(regionByState.get(key))).darker())
      .attr("d", area.lineY1());


  // Append a path for text labels
  svg.append("defs")
    .selectAll("path")
    .data(series)
    .join("path")
      .attr("id", d => (d.id = DOM.uid("state")).id)
      .attr("d", midline);


  // Append the labels.
  svg.append("g")
      .style("font", "10px sans-serif")
      .attr("text-anchor", "middle")
    .selectAll("text")
    .data(series)
    .join("text")
      .attr("dy", "0.35em")
    .append("textPath")
      .attr("href", d => d.id.href)
      .attr("startOffset", d => `${Math.max(0.05, Math.min(0.95, d.offset = d3.maxIndex(d, d => d[1] - d[0]) / (d.length - 1))) * 100}%`)
      .text(d => d.key);


  // Append the axes.
  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));


  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(10, "%"))
      .call(g => g.select(".domain").remove());


  return Object.assign(svg.node(), {scales: {color}});
}