chart = {
  const context = DOM.context2d(width, height);
  const path = d3.geoPath(mutable projection, context).pointRadius(1.5);


  function render() {
    context.clearRect(0, 0, width, height);


    context.beginPath();
    path(graticule);
    context.lineWidth = 0.5;
    context.strokeStyle = "#aaa";
    context.stroke();


    context.beginPath();
    path(mesh);
    context.lineWidth = 0.5;
    context.strokeStyle = "#000";
    context.stroke();


    context.beginPath();
    path(sphere);
    context.lineWidth = 1.5;
    context.strokeStyle = "#000";
    context.stroke();


    context.beginPath();
    path({type: "MultiPoint", coordinates: points});
    context.fillStyle = "#f00";
    context.fill();
  }
  
  function dragged() {
    mutable projection = mutable projection;
    render();
  }


  return d3.select(context.canvas)
    .call(drag(mutable projection).on("drag.render", dragged))
    .call(render)
    .node();
}