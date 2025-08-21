map = svg`<svg viewBox="0 0 ${width} ${height}">
  ${tiles.map(([x, y, z], i, {translate: [tx, ty], scale: k}) => svg`
    <image xlink:href="${url(x, y, z)}" x="${Math.round((x + tx) * k)}" y="${Math.round((y + ty) * k)}" width="${k}" height="${k}">
  `)}
</svg>`