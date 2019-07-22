var svg = d3.select("#Rechteck")
  .append("svg")
  .attr("width", 110)
  .attr("height", 60);
svg.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", 100)
  .attr("height", 50)
  .style("fill", "rgb(255,255,0)")
  .style("stroke", "rgb(0,255,0)")
  .style("stroke-width", 2);