// create SVG element
var svg = d3.select("#Kreis")
  .append("svg")
  .attr("width", 50)
  .attr("height", 50);
svg.append("circle")
  .attr("cx", 25)
  .attr("cy", 25)
  .attr("r", 20)
  .style("fill", "rgb(255,255,0)")
  .style("stroke", "rgb(0,255,0)")
  .style("stroke-width", 2);