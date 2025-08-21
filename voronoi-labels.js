chart = {
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto;");
  
  const cells = data.map((d, i) => [d, voronoi.cellPolygon(i)]);


  svg.append("g")
      .attr("stroke", "orange")
    .selectAll("path")
    .data(cells)
    .join("path")
      .attr("d", ([d, cell]) => `M${d3.polygonCentroid(cell)}L${d}`);


  svg.append("path")
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("d", voronoi.render());


  svg.append("path")
      .attr("d", delaunay.renderPoints(null, 2));


  svg.append("g")
      .style("font", "10px sans-serif")
    .selectAll("text")
    .data(cells)
    .join("text")
      .each(function([[x, y], cell]) {
        const [cx, cy] = d3.polygonCentroid(cell);
        const angle = (Math.round(Math.atan2(cy - y, cx - x) / Math.PI * 2) + 4) % 4;
        d3.select(this).call(angle === 0 ? orient.right
            : angle === 3 ? orient.top
            : angle === 1 ? orient.bottom
            : orient.left);
      })
      .attr("transform", ([d]) => `translate(${d})`)
      .attr("display", ([, cell]) => -d3.polygonArea(cell) > 2000 ? null : "none")
      .text((d, i) => i);


  return svg.node();
}