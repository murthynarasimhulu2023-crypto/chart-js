function map(land, {
  width = 960,
  height = 500,
  devicePixelRatio = window.devicePixelRatio,
  invalidation // optional promise to stop animation
} = {}) {
  const canvas = document.createElement("canvas");
  canvas.width = width * devicePixelRatio;
  canvas.height = height * devicePixelRatio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;


  const context = canvas.getContext("2d");


  const projection = d3.geoConicEqualArea()
      .scale(150 * devicePixelRatio)
      .center([0, 33])
      .translate([width * devicePixelRatio / 2, height * devicePixelRatio / 2])
      .precision(0.3);


  const path = d3.geoPath()
      .projection(projection)
      .context(context);


  let frame;
  let x0, y0;
  let lambda0, phi0;


  canvas.onpointermove = (event) => {
    if (!event.isPrimary) return;
    const [x, y] = d3.pointer(event);
    render([
      lambda0 + (x - x0) / (width * devicePixelRatio) * 360,
      phi0 - (y - y0) / (height * devicePixelRatio) * 360
    ]);
  };


  canvas.ontouchstart = (event) => {
    event.preventDefault();
  };


  canvas.onpointerenter = (event) => {
    if (!event.isPrimary) return;
    cancelAnimationFrame(frame);
    ([x0, y0] = d3.pointer(event));
    ([lambda0, phi0] = projection.rotate());
  };


  canvas.onpointerleave = (event) => {
    if (!event.isPrimary) return;
    frame = requestAnimationFrame(tick);
  };


  function tick() {
    const [lambda, phi] = projection.rotate();
    render([lambda + 0.1, phi + 0.1]);
    return frame = requestAnimationFrame(tick);
  }


  function render(rotate) {
    projection.rotate(rotate);
    context.clearRect(0, 0, width * devicePixelRatio, height * devicePixelRatio);
    context.beginPath();
    path(land);
    context.fill();
    context.beginPath();
    path({type: "Sphere"});
    context.lineWidth = devicePixelRatio;
    context.stroke();
  }


  tick();


  if (invalidation) invalidation.then(() => cancelAnimationFrame(frame));


  return canvas;
}