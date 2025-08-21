projection1 = d3.geoMercator()
    .center([0, 0])
    .translate([256, 256])
    .scale(512 / (2 * Math.PI))