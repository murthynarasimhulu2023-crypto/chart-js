chart = {
  const width = 954;
  const radius = width / 2;
  const k = 6; // 2^k colors segments per curve


  const tree = d3.cluster()
      .size([2 * Math.PI, radius - 100]);
  const root = tree(bilink(d3.hierarchy(data)
      .sort((a, b) => d3.ascending(a.height, b.height) || d3.ascending(a.data.name, b.data.name))));


  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", width)
      .attr("viewBox", [-width / 2, -width / 2, width, width])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");


  const node = svg.append("g")
    .selectAll()
    .data(root.leaves())
    .join("g")
      .attr("transform", d => `rotate(${d.x * 180 / Math.PI - 90}) translate(${d.y},0)`)
    .append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.x < Math.PI ? 6 : -6)
      .attr("text-anchor", d => d.x < Math.PI ? "start" : "end")
      .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
      .text(d => d.data.name)
      .call(text => text.append("title").text(d => `${id(d)}
${d.outgoing.length} outgoing
${d.incoming.length} incoming`));


  const line = d3.lineRadial()
      .curve(d3.curveBundle)
      .radius(d => d.y)
      .angle(d => d.x);


  const path = ([source, target]) => {
    const p = new Path;
    line.context(p)(source.path(target));
    return p;
  };


  svg.append("g")
      .attr("fill", "none")
    .selectAll()
    .data(d3.transpose(root.leaves()
      .flatMap(leaf => leaf.outgoing.map(path))
      .map(path => Array.from(path.split(k)))))
    .join("path")
      .style("mix-blend-mode", "darken")
      .attr("stroke", (d, i) => color(d3.easeQuad(i / ((1 << k) - 1))))
      .attr("d", d => d.join(""));


  return svg.node();
}