chart = {


  // Specify the chart’s dimensions.
  const width = 928;
  const height = 600;
  const marginTop = 40;
  const marginRight = 50;
  const marginBottom = 10;
  const marginLeft = 50;
  const padding = 3;
  
  // Prepare the positional scales.
  const x = d3.scalePoint()
    .domain([0, 1])
    .range([marginLeft, width - marginRight])
    .padding(0.5);


  const y = d3.scaleLinear()
    .domain(d3.extent(data.flatMap(d => [d[1970], d[1979]])))
    .range([height - marginBottom, marginTop]);


  const line = d3.line()
    .x((d, i) => x(i))
    .y(y);


  const formatNumber = y.tickFormat(100);


  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");


  // Append the x axis.
  svg.append("g")
      .attr("text-anchor", "middle")
    .selectAll("g")
    .data([0, 1])
    .join("g")
      .attr("transform", (i) => `translate(${x(i)},20)`)
      .call(g => g.append("text").text((i) => i ? 1979 : 1970))
      .call(g => g.append("line").attr("y1", 3).attr("y2", 9).attr("stroke", "currentColor"));


  // Create a line for each country.
  svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "currentColor")
    .selectAll("path")
    .data(data)
    .join("path")
      .attr("d", (d) => line([d[1970], d[1979]]));


  // Create a group of labels for each year.
  svg.append("g")
    .selectAll("g")
    .data([0, 1])
    .join("g")
      .attr("transform", (i) => `translate(${x(i) + (i ? padding : -padding)},0)`)
      .attr("text-anchor", (i) => i ? "start" : "end")
    .selectAll("text")
    .data((i) => d3.zip(
      data.map(i ? (d) => `${formatNumber(d[1979])} ${d.country}` : (d) => `${d.country} ${formatNumber(d[1970])}`),
      dodge(data.map(d => y(d[i ? 1979 : 1970])))))
    .join("text")
      .attr("y", ([, y]) => y)
      .attr("dy", "0.35em")
      .text(([text]) => text);


  return svg.node();
}