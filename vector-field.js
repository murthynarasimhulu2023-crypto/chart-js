map = {
  const projection = d3.geoEquirectangular();


  // Specify the dimensions.
  const width = 928;
  const margin = 10;


  // Compute the height
  const points = {type: "MultiPoint", coordinates: data.map(d => [d.longitude, d.latitude])};
  const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(width - margin * 2, points)).bounds(points);
  const [tx, ty] = projection.translate();
  const height = Math.ceil(y1 - y0) + margin * 2;
  projection.translate([tx + margin, ty + margin]);


  // Create the scales.
  const length = d3.scaleSqrt([0, d3.max(data, d => d.speed)], [0, 2]);
  const color = d3.scaleSequential([0, 360], d3.interpolateRainbow);


  const context = DOM.context2d(width, height);
  const path = d3.geoPath(projection, context);
  context.canvas.style.maxWidth = "100%";
  context.fillRect(0, 0, width, height);
  context.strokeStyle = "#eee";
  context.lineWidth = 1.5;
  context.lineJoin = "round";
  context.beginPath(), path(land), context.stroke();
  for (const {longitude, latitude, speed, dir} of data) {
    context.save();
    context.translate(...projection([longitude, latitude]));
    context.scale(length(speed), length(speed));
    context.rotate(dir * Math.PI / 180);
    context.beginPath();
    context.moveTo(-2, -2);
    context.lineTo(2, -2);
    context.lineTo(0, 8);
    context.closePath();
    context.fillStyle = color(dir);
    context.fill();
    context.restore();
  }
  return context.canvas;
}