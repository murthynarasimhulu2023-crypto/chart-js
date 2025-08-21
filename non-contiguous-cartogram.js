chart = {


  // Specify the chart’s dimensions. In this case we use the bounding box of the projected
  // US-Atlas, see https://github.com/topojson/us-atlas
  const width = 975;
  const height = 610;


  // Create the color scale.
  const color = d3.scaleSequential(d3.extent(Array.from(data.values()).flat()), d3.interpolateReds).nice();


  // The path generator is used to draw the shapes and to compute their centroids.
  const path = d3.geoPath();


  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("style", "max-width: 100%; height: auto;");


  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states))
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("d", path);


  
  function transform(d, year) {
    const [x, y] = path.centroid(d);
    return `
      translate(${x},${y})
      scale(${Math.sqrt(data.get(d.id)[year])})
      translate(${-x},${-y})
    `;
  }


  // Append a path for each state.
  const state = svg.append("g")
      .attr("stroke", "#000")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features.filter(d => data.has(d.id)))
    .join("path")
      .attr("vector-effect", "non-scaling-stroke")
      .attr("d", path)
      .attr("fill", d => color(data.get(d.id)[0]))
      .attr("transform", d => transform(d, 0));


  // Append tooltips.
  const format = d3.format(".1%");
  state.append("title")
      .text(d => `${d.properties.name}
${format(data.get(d.id)[0])} in 2008
${format(data.get(d.id)[1])} in 2018`);


  return Object.assign(svg.node(), {
    update(year) {
      state.transition()
          .duration(750)
          .attr("fill", d => color(data.get(d.id)[year]))
          .attr("transform", d => transform(d, year));
    },
    scales: {color}
  });
}