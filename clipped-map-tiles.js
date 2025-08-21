map = svg`<svg viewBox="0 0 ${width} ${height}">
  <defs>
    <path id="land" d="${path(land)}"/>
    <clipPath id="clip"><use xlink:href="${location}#land" /></clipPath>
  </defs>
  <g clip-path="url(${location}#clip)">
    ${tile().map(([x, y, z], i, {translate: [tx, ty], scale: k}) => svg`<image xlink:href="${url(x, y, z)}" x="${(x + tx) * k - 0.5}" y="${(y + ty) * k - 0.5}" width="${k + 1}" height="${k + 1}">`)}
    ${tile().map(([x, y, z], i, {translate: [tx, ty], scale: k}) => svg`<image xlink:href="${url(x, y, z)}" x="${(x + tx) * k}" y="${(y + ty) * k}" width="${k}" height="${k}">`)}
  </g>
  <use xlink:href="${location}#land" fill="none" stroke="black" stroke-width="0.5" />
</svg>`