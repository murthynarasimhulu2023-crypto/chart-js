chart = {


  // Specify the chart’s dimensions.
  const width = 640;
  const height = 400;
  const marginTop = 20;
  const marginRight = 0;
  const marginBottom = 30;
  const marginLeft = 40;
  
  // Declare the x (horizontal position) scale and the corresponding axis generator.
  const x = d3.scaleBand()
    .domain(data.map(d => d.letter))
    .range([marginLeft, width - marginRight])
    .padding(0.1);


  const xAxis = d3.axisBottom(x).tickSizeOuter(0);


  // Declare the y (vertical position) scale.
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.frequency)]).nice()
    .range([height - marginBottom, marginTop]);


  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("style", `max-width: ${width}px; height: auto; font: 10px sans-serif; overflow: visible;`);


  // Create a bar for each letter.
  const bar = svg.append("g")
      .attr("fill", "steelblue")
    .selectAll("rect")
    .data(data)
    .join("rect")
      .style("mix-blend-mode", "multiply") // Darker color when bars overlap during the transition.
      .attr("x", d => x(d.letter))
      .attr("y", d => y(d.frequency))
      .attr("height", d => y(0) - y(d.frequency))
      .attr("width", x.bandwidth());


  // Create the axes.
  const gx = svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis);
  
  const gy = svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).tickFormat((y) => (y * 100).toFixed()))
      .call(g => g.select(".domain").remove());


  // Return the chart, with an update function that takes as input a domain
  // comparator and transitions the x axis and bar positions accordingly. 
  return Object.assign(svg.node(), {
    update(order) {
      x.domain(data.sort(order).map(d => d.letter));


      const t = svg.transition()
          .duration(750);


      bar.data(data, d => d.letter)
          .order()
        .transition(t)
          .delay((d, i) => i * 20)
          .attr("x", d => x(d.letter));


      gx.transition(t)
          .call(xAxis)
        .selectAll(".tick")
          .delay((d, i) => i * 20);
    }
  });
}