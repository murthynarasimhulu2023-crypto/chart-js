svg = {
  const width = 928;
  const height = 400;


  const svg = d3
    .create("svg")
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; font: 14.5px sans-serif;");


  // Important! Make sure the SVG is attached to the DOM before calling occlusion(),
  // so that the bounding boxes can be measured.
  yield svg.node();


  const n = 1000;
  svg
    .selectAll("text")
    .data(rwg(n))
    .join("text")
    .text((d) => d)
    .attr("x", () => (width * Math.random()) | 0)
    .attr("y", () => (height * Math.random()) | 0);


  // Raise on mouseover, set data-priority on click.
  let priority = 0;
  svg
    .selectAll("text")
    .on("mouseover", function () {
      d3.select(this).attr("fill", "red").raise();
      svg.call(occlusion);
    })
    .on("mouseout", function () {
      d3.select(this).attr("fill", null);
      svg.call(occlusion);
    })
    .on("click", function () {
      const node = d3.select(this);
      const cur = +node.attr("data-priority");
      node
        .attr("data-priority", cur ? null : ++priority)
        .style("fill", cur ? null : "steelblue");
      svg.call(occlusion);
    });


  // Introduce random changes.
  do {
    const i = (Math.random() * n) | 0;
    svg.select(`text:nth-of-type(${i})`).raise();
    svg.call(occlusion);


    await Promises.delay(300);
  } while (true);
}