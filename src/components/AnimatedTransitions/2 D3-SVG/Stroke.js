var svg = d3.select("#Stroke")
  .append("svg")
  .attr("width", 100)
  .attr("height", 10);
  
var lineGraph = svg.append("path")
  .attr("d", "M 0, 0 L 100, 0")
  .attr("fill", "none")
  .attr("stroke", "green")
  .attr("stroke-width", 6)
  .style("stroke-dasharray", "8,4,2,2,2,4");