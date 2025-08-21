chart = {


  // Declare the chart dimensions and margins.
  const width = 928;
  const height = Math.round(width * 1.2)
  const marginTop = 40;
  const marginRight = 40;
  const marginBottom = 40;
  const marginLeft = 40;


  // Ceate the scales.
  const x = d3.scaleLinear([-0.39, 2.19], [marginLeft, width - marginRight]);
  const y = d3.scaleLinear([-7, 19], [marginTop, height - marginBottom]);
  const z = bv2rgb;


  // Create the SVG container.
  const svg = d3.create("svg")
      .attr("width", width + 28)
      .attr("height", height)
      .attr("viewBox", [-14, 0, width + 28, height])
      .attr("style", "max-width: calc(100% + 28px); height: auto;")
      .style("margin", "0 -14px")
      .style("background", "#000")
      .style("color", "#fff")
      .style("display", "block")
      .attr("fill", "currentColor")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10);


  // Create a small (sub pixel) rectangle for each star.
  svg.append("g")
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("x", d => x(d.color))
      .attr("y", d => y(d.absolute_magnitude))
      .attr("fill", d => z(d.color))
      .attr("width", 0.75)
      .attr("height", 0.75);


  // Create the axes.
  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(d3.scaleLog(y.domain().map(m => Math.pow(10, 4.83 - m)), y.range())));


  svg.append("g")
      .attr("transform", `translate(${width - marginRight},0)`)
      .call(d3.axisRight(y).ticks(null, "+"));


  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(null, "+f"));


  svg.append("g")
      .attr("transform", `translate(0,${marginTop})`)
      .call(((temperatures) => d3.axisTop(x)
          .tickValues(temperatures.map(color))
          .tickFormat((_, i) => temperatures[i].toLocaleString("en")))
        (d3.range(3000, 10001, 1000).concat(20000)));


  svg.selectAll(".domain").remove();


  svg.append("text")
      .attr("dy", 12)
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${marginLeft},${(marginTop + height - marginBottom) / 2}) rotate(-90)`)
      .call(text => text.append("tspan").attr("fill-opacity", 0.8).text("← darker\xa0"))
      .call(text => text.append("tspan").attr("font-weight", "bold").text("\xa0Luminosity L☉\xa0"))
      .call(text => text.append("tspan").attr("fill-opacity", 0.8).text("\xa0brighter →"));


  svg.append("text")
      .attr("dy", -6)
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${width - marginRight},${(marginTop + height - marginBottom) / 2}) rotate(-90)`)
      .call(text => text.append("tspan").attr("fill-opacity", 0.8).text("← darker\xa0"))
      .call(text => text.append("tspan").attr("font-weight", "bold").text("\xa0Absolute magnitude M\xa0"))
      .call(text => text.append("tspan").attr("fill-opacity", 0.8).text("\xa0brighter →"));


  svg.append("text")
      .attr("x", (marginLeft + width - marginRight) / 2)
      .attr("y", marginTop)
      .attr("dy", 12)
      .attr("text-anchor", "middle")
      .call(text => text.append("tspan").attr("fill-opacity", 0.8).text("← hotter\xa0"))
      .call(text => text.append("tspan").attr("font-weight", "bold").text("\xa0Temperature K\xa0"))
      .call(text => text.append("tspan").attr("fill-opacity", 0.8).text("\xa0colder →"));


  svg.append("text")
      .attr("x", (marginLeft + width - marginRight) / 2)
      .attr("y", height - marginBottom)
      .attr("dy", -6)
      .attr("text-anchor", "middle")
      .call(text => text.append("tspan").attr("fill-opacity", 0.8).text("← blue\xa0"))
      .call(text => text.append("tspan").attr("font-weight", "bold").text("\xa0Color B-V\xa0"))
      .call(text => text.append("tspan").attr("fill-opacity", 0.8).text("\xa0red →"));


  return svg.node();
}