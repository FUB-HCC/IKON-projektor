var svg = d3.select("#Transformation")
  .append("svg")
  .attr("width", 130)
  .attr("height", 120);
  
svg.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", 100)
  .attr("height", 50)
  .attr("transform", "translate(30, 20) rotate(30) scale(0.75)")
  .style("fill", "yellow")
  .style("stroke", "green")
  .style("stroke-width", 2);