chart = {
  const width = 928;
  const height = width;
  const innerRadius = 180;
  const outerRadius = Math.min(width, height) / 2;


  // Stack the data into series by age
  const series = d3.stack()
      .keys(d3.union(data.map(d => d.age))) // distinct series keys, in input order
      .value(([, D], key) => D.get(key).population) // get value for each series key and stack
    (d3.index(data, d => d.state, d => d.age)); // group by stack then series key


  const arc = d3.arc()
      .innerRadius(d => y(d[0]))
      .outerRadius(d => y(d[1]))
      .startAngle(d => x(d.data[0]))
      .endAngle(d => x(d.data[0]) + x.bandwidth())
      .padAngle(1.5 / innerRadius)
      .padRadius(innerRadius);


  // An angular x-scale
  const x = d3.scaleBand()
      .domain(data.map(d => d.state))
      .range([0, 2 * Math.PI])
      .align(0);


  // A radial y-scale maintains area proportionality of radial bars
  const y = d3.scaleRadial()
      .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
      .range([innerRadius, outerRadius]);


  const color = d3.scaleOrdinal()
      .domain(series.map(d => d.key))
      .range(d3.schemeSpectral[series.length])
      .unknown("#ccc");

