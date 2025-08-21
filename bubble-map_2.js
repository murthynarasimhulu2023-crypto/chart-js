chart = {


  // Join the geographic shapes and the population data.
  const data = population.map((d) => ({
    ...d,
    county: countymap.get(d.fips),
    state: statemap.get(d.state)
  }))
    .filter(d => d.county)
    .sort((a, b) => d3.descending(a.population, b.population));


  // Construct the radius scale.
  const radius = d3.scaleSqrt([0, d3.max(data, d => d.population)], [0, 40]);


  // Construct a path generator.
  const path = d3.geoPath();


  // Create the SVG container. Its dimensions correspond to the bounding-box
  // of the pre-projected US shapefile. 
  const svg = d3.create("svg")
      .attr("width", 975)
      .attr("height", 610)
      .attr("viewBox", [0, 0, 975, 610])
      .attr("style", "width: 100%; height: auto; height: intrinsic;");


  // Create the cartographic background layers.
  svg.append("path")
      .datum(topojson.feature(us, us.objects.nation))
      .attr("fill", "#ddd")
      .attr("d", path);


  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", path);


  // Create the legend.
  const legend = svg.append("g")
      .attr("fill", "#777")
      .attr("transform", "translate(915,608)")
      .attr("text-anchor", "middle")
      .style("font", "10px sans-serif")
    .selectAll()
      .data(radius.ticks(4).slice(1))
    .join("g");


  legend.append("circle")
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("cy", d => -radius(d))
      .attr("r", radius);


  legend.append("text")
      .attr("y", d => -2 * radius(d))
      .attr("dy", "1.3em")
      .text(radius.tickFormat(4, "s"));


  // Add a circle for each county, with a title (tooltip).
  const format = d3.format(",.0f");
  svg.append("g")
      .attr("fill", "brown")
      .attr("fill-opacity", 0.5)
      .attr("stroke", "#fff")
      .attr("stroke-width", 0.5)
    .selectAll()
    .data(data)
    .join("circle")
      .attr("transform", d => `translate(${centroid(d.county)})`)
      .attr("r", d => radius(d.population))
    .append("title")
      .text(d => `${d.county.properties.name}, ${d.state.properties.name}
${format(d.population)}`);


  return svg.node();
}