chart = {
  const svg = d3.create("svg")
      .attr("width", 975)
      .attr("height", 610)
      .attr("viewBox", [0, 0, 975, 610])
      .attr("style", "max-width: 100%; height: auto;");


  svg.append(legend)
      .attr("transform", "translate(870,450)");


  const x = d3.scaleQuantile(Array.from(data, d => d.diabetes), d3.range(n));
  const y = d3.scaleQuantile(Array.from(data, d => d.obesity), d3.range(n));


  const index = d3.index(data, d => d.county);
  
  const path = d3.geoPath();


  const color = (value) => {
    if (!value) return "#ccc";
    const {diabetes: a, obesity: b} = value;
    return colors[y(b) + x(a) * n];
  };


  const format = (value) => {
    if (!value) return "N/A";
    const {diabetes: a, obesity: b} = value;
    return `${a}% Diabetes${labels[x(a)] && ` (${labels[x(a)]})`}
  ${b}% Obesity${labels[y(b)] && ` (${labels[y(b)]})`}`;
  };
  
  svg.append("g")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.counties).features)
    .join("path")
      .attr("fill", d => color(index.get(d.id)))
      .attr("d", path)
    .append("title")
      .text(d => `${d.properties.name}, ${states.get(d.id.slice(0, 2)).name}
${format(index.get(d.id))}`);


  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", path);


  return svg.node();
}