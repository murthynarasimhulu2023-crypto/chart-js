viewof context = {
  const context = DOM.context2d(width, height);
  context.canvas.style.display = "block";
  context.canvas.style.maxWidth = "100%";
  context.canvas.value = context;
  return context.canvas;
}