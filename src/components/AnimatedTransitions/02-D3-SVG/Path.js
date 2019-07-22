var svg = d3.select("#Path")
  .append("svg")
  .attr("width", 100)
  .attr("height", 50);
  
var lineGraph = svg.append("path")
  .attr("d", "M 100, 0 L 75, 50 L 40, 20 Z")
  .attr("fill", "yellow")
  .attr("stroke", "green")
  .attr("stroke-width", 3);