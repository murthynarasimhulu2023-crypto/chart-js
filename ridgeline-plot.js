chart = {


  // Prepare the series:
  const dates = Array.from(d3.group(traffic, d => +d.date).keys()).sort(d3.ascending);
  const series = d3.groups(traffic, d => d.name).map(([name, values]) => {
    const value = new Map(values.map(d => [+d.date, d.value]));
    return {name, values: dates.map(d => value.get(d))};
  });


  // Specify the chart’s dimensions.
  const overlap = 8;
  const width = 928;
  const height = series.length * 17;
  const marginTop = 40;
  const marginRight = 20;
  const marginBottom = 30;
  const marginLeft = 120;


  // Create the scales.
  const x = d3.scaleTime()
      .domain(d3.extent(dates))
      .range([marginLeft, width - marginRight]);


  const y = d3.scalePoint()
      .domain(series.map(d => d.name))
      .range([marginTop, height - marginBottom]);


  const z = d3.scaleLinear()
      .domain([0, d3.max(series, d => d3.max(d.values))]).nice()
      .range([0, -overlap * y.step()]);


  // Create the area generator and its top-line generator.
  const area = d3.area()
      .curve(d3.curveBasis)
      .defined(d => !isNaN(d))
      .x((d, i) => x(dates[i]))
      .y0(0)
      .y1(d => z(d));


  const line = area.lineY1();


  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;");


  // Append the axes.
  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x)
          .ticks(width / 80)
          .tickSizeOuter(0));


  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).tickSize(0).tickPadding(4))
      .call(g => g.select(".domain").remove());


  // Append a layer for each series.
  const group = svg.append("g")
    .selectAll("g")
    .data(series)
    .join("g")
      .attr("transform", d => `translate(0,${y(d.name) + 1})`);


  group.append("path")
      .attr("fill", "#ddd")
      .attr("d", d => area(d.values));


  group.append("path")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("d", d => line(d.values));


  return svg.node();
}