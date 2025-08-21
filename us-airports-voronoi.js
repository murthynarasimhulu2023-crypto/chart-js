chart = {
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, 975, 610])
      .attr("width", 975)
      .attr("height", 610)
      .attr("style", "max-width: 100%; height: auto;");


  svg.append("path")
      .datum(topojson.merge(us, us.objects.states.geometries.filter(d => d.id !== "02" && d.id !== "15")))
      .attr("fill", "#ddd")
      .attr("d", d3.geoPath());


  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, (a, b) => a !== b))
      .attr("fill", "none")
      .attr("stroke", "white")
      .attr("stroke-linejoin", "round")
      .attr("d", d3.geoPath());


  svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("pointer-events", "all")
    .selectAll("path")
    .data(d3.geoVoronoi().polygons(data).features)
    .join("path")
      .attr("d", d3.geoPath(projection))
    .append("title")
      .text(d => {
        const p = d.properties.site.properties;
        return `${p.name} Airport
${p.city}, ${p.state}`;
      });


  svg.append("path")
      .datum({type: "FeatureCollection", features: data})
      .attr("d", d3.geoPath(projection).pointRadius(1.5));


  return svg.node();
}