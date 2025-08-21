chart = html`<svg style="width: 100%; height: auto; display: block;" viewBox="0 0 960 500">
  <g stroke="#000" stroke-width="0.5" stroke-linejoin="round" stroke-linecap="round">
    ${Array.from(contours(values), d => svg`<path d="${path(invert(d))}" fill="${color(d.value)}" />`)}
  </g>
</svg>`