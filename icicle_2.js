chart = {
  // Specify the chart’s dimensions.
  const width = 928;
  const height = 2400;
  const format = d3.format(",d");


  // Create a color scale (a color for each child of the root node and their descendants).
  const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))


  // Create a partition layout.
  const partition = d3.partition()
      .size([height, width])
      .padding(1);


  // Apply the partition layout.
  const root = partition(d3.hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.height - a.height || b.value - a.value));


  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif");


  // Add a cell for each node of the hierarchy.
  const cell = svg
    .selectAll()
    .data(root.descendants())
    .join("g")
      .attr("transform", d => `translate(${d.y0},${d.x0})`);


  cell.append("title")
      .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

