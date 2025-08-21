chart = {


  // Specify the chart’s dimensions.
  const width = 928;
  const height = 500;
  const marginTop = 20;
  const marginRight = 30;
  const marginBottom = 34;
  const marginLeft = 0;
  
  const yearStep = 1;
  const yearMin = d3.min(data, d => d.year);


  // Construct the scales.
  const x = d3.scaleBand()
    .domain(Array.from(d3.group(data, d => d.age).keys()).sort(d3.ascending))
    .range([width - marginRight, marginLeft]);


  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([height - marginBottom, marginTop]);


  const color = d3.scaleOrdinal(["M", "F"], ["#4e79a7", "#e15759"]);


  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("width", width)
      .attr("height", height)
      .attr("style", `max-width: 100%; height: auto;`);


  // Add the axes.
  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x)
          .tickValues(d3.ticks(...d3.extent(data, d => d.age), width / 40))
          .tickSizeOuter(0))
      .call(g => g.append("text")
          .attr("x", marginRight)
          .attr("y", marginBottom - 4)
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .text("← Age"));


  svg.append("g")
      .attr("transform", `translate(${width - marginRight},0)`)
      .call(d3.axisRight(y).ticks(null, "s"))
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
          .attr("x", marginRight)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "end")
          .text("Population ↑"));


  const group = svg.append("g");


  let rect = group.selectAll("rect");


  return Object.assign(svg.node(), {
    update(year) {
      const dx = x.step() * (year - yearMin) / yearStep;


      const t = svg.transition()
          .ease(d3.easeLinear)
          .duration(delay);


      rect = rect
        .data(data.filter(d => d.year === year), d => `${d.sex}:${d.year - d.age}`)
        .join(
          enter => enter.append("rect")
            .style("mix-blend-mode", "darken")
            .attr("fill", d => color(d.sex))
            .attr("x", d => x(d.age) + dx)
            .attr("y", d => y(0))
            .attr("width", x.bandwidth() + 1)
            .attr("height", 0),
          update => update,
          exit => exit.call(rect => rect.transition(t).remove()
            .attr("y", y(0))
            .attr("height", 0))
        );


      rect.transition(t)
          .attr("y", d => y(d.value))
          .attr("height", d => y(0) - y(d.value));


      group.transition(t)
          .attr("transform", `translate(${-dx},0)`);
    },
    scales: {color}
  });
}