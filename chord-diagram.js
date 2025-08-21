chart = {
  const width = 928;
  const height = width;
  const {names, colors} = data;
  const outerRadius = Math.min(width, height) * 0.5 - 60;
  const innerRadius = outerRadius - 10;
  const tickStep = d3.tickStep(0, d3.sum(data.flat()), 100);
  const formatValue = d3.format(".1~%");


  const chord = d3.chord()
      .padAngle(10 / innerRadius)
      .sortSubgroups(d3.descending)
      .sortChords(d3.descending);


  const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius);


  const ribbon = d3.ribbon()
      .radius(innerRadius - 1)
      .padAngle(1 / innerRadius);


  const color = d3.scaleOrdinal(names, colors);


  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "width: 100%; height: auto; font: 10px sans-serif;");


  const chords = chord(data);


  const group = svg.append("g")
    .selectAll()
    .data(chords.groups)
    .join("g");


  group.append("path")
      .attr("fill", d => color(names[d.index]))
      .attr("d", arc);


  group.append("title")
      .text(d => `${names[d.index]}\n${formatValue(d.value)}`);


  const groupTick = group.append("g")
    .selectAll()
    .data(d => groupTicks(d, tickStep))
    .join("g")
      .attr("transform", d => `rotate(${d.angle * 180 / Math.PI - 90}) translate(${outerRadius},0)`);


  groupTick.append("line")
      .attr("stroke", "currentColor")
      .attr("x2", 6);


  groupTick.append("text")
      .attr("x", 8)
      .attr("dy", "0.35em")
      .attr("transform", d => d.angle > Math.PI ? "rotate(180) translate(-16)" : null)
      .attr("text-anchor", d => d.angle > Math.PI ? "end" : null)
      .text(d => formatValue(d.value));


  group.select("text")
      .attr("font-weight", "bold")
      .text(function(d) {
        return this.getAttribute("text-anchor") === "end"
            ? `↑ ${names[d.index]}`
            : `${names[d.index]} ↓`;
      });


  svg.append("g")
      .attr("fill-opacity", 0.8)
    .selectAll("path")
    .data(chords)
    .join("path")
      .style("mix-blend-mode", "multiply")
      .attr("fill", d => color(names[d.source.index]))
      .attr("d", ribbon)
    .append("title")
      .text(d => `${formatValue(d.source.value)} ${names[d.target.index]} → ${names[d.source.index]}${d.source.index === d.target.index ? "" : `\n${formatValue(d.target.value)} ${names[d.source.index]} → ${names[d.target.index]}`}`);


  return svg.node();
}