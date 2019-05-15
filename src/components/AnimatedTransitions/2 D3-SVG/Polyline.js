// create SVG element
var svg = d3.select("#Polyline")
  .append("svg")
  .attr("width", 100)
  .attr("height", 50);
svg.append("polyline")
  .attr("x", 0)
  .attr("y", 0)
  .attr("points", [[20,20], [40,25], [60,40], [80,50], [100,30]])
  .attr("fill", "yellow")
  .attr("stroke", "green")
  .attr("stroke-width", 3);