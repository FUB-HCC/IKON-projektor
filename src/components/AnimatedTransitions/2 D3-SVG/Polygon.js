// create SVG element
var svg = d3.select("#Polygon")
  .append("svg")
  .attr("width", 100)
  .attr("height", 50);
svg.append("polygon")
  .attr("x", 0)
  .attr("y", 0)
  .attr("points", [[10,10], [100,20], [60,50]])
  .attr("fill", "yellow")
  .attr("stroke", "green")
  .attr("stroke-width", 1);