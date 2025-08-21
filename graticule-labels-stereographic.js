map = {
  const clipIn = DOM.uid();
  const clipOut = DOM.uid();
  return html`<svg width=${width} height=${height} viewBox="0 0 ${width} ${height}" style="display:block;">
  <defs>
    <clipPath id="${clipIn.id}"><path d="${path(outline)}"></path></clipPath>
    <clipPath id="${clipOut.id}"><path d="M0,0V${height}H${width}V0Z${path(outline)}"></path></clipPath>
  </defs>
  <path d="${path(graticule)}" stroke="#ccc" fill="none"></path>
  <path clip-path="${clipIn}" d="${path(land)}"></path>
  <path fill-opacity="0.1" clip-path="${clipOut}" d="${path(land)}"></path>
  <path d="${path(outline)}" stroke="#000" fill="none"></path>
  <g font-size="10" font-family="sans-serif" text-anchor="middle">
    ${d3.range(-80, 80 + 1, 10).map(y => svg`
    <text transform="translate(${offset(projection([longitude + 90, y]), 10) + ""})" dy="0.35em" x="6">${formatLatitude(y)}</text>
    <text transform="translate(${offset(projection([longitude - 90, y]), 10) + ""})" dy="0.35em" x="-6">${formatLatitude(y)}</text>`)}
  </g>
</svg>`;
}