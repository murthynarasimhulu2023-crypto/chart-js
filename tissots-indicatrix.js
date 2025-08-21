circles = {
  const step = 10;
  const circle = d3.geoCircle().center(d => d).radius(step / 4).precision(10);
  const coordinates = [];
  for (let y = -80; y <= 80; y += step) {
    for (let x = -180; x < 180; x += step) {
      coordinates.push(circle([x, y]).coordinates);
    }
  }
  return {type: "MultiPolygon", coordinates};
}