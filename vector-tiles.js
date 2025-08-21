map = svg`<svg viewBox="0 0 ${width} ${height}">${tiles.map(d => svg`
  <path fill="#eee" d="${path(filter(d.data.water, d => !d.properties.boundary))}"></path>
  <path fill="none" stroke="#aaa" d="${path(filter(d.data.water, d => d.properties.boundary))}"></path>
  <path fill="none" stroke="#000" stroke-width="0.75" d="${path(d.data.roads)}"></path>
`)}
</svg>`