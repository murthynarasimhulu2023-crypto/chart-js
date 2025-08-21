chart = {
  const width = 928;
  const height = 500;


  const x = d3.scaleLinear([0, m - 1], [0, width]);
  const y = d3.scaleLinear([0, 1], [height, 0]);
  const z = d3.interpolateCool;


  const area = d3.area()
    .x((d, i) => x(i))
    .y0(d => y(d[0]))
    .y1(d => y(d[1]));


  const stack = d3.stack()
    .keys(d3.range(n))
    .offset(offset)
    .order(d3.stackOrderNone);


  function randomize() {
    const layers = stack(d3.transpose(Array.from({length: n}, () => bumps(m, k))));
    y.domain([
      d3.min(layers, l => d3.min(l, d => d[0])),
      d3.max(layers, l => d3.max(l, d => d[1]))
    ]);
    return layers;
  }
  
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height)
      .attr("style", "max-width: 100%; height: auto;");


  const path = svg.selectAll("path")
    .data(randomize)
    .join("path")
      .attr("d", area)
      .attr("fill", () => z(Math.random()));


  while (true) {
    yield svg.node();


    await path
      .data(randomize)
      .transition()
        .delay(1000)
        .duration(1500)
        .attr("d", area)
      .end();
  }
}