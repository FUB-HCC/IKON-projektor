var svg = d3.select("#svgcontainer3")
  .append("svg")
  .attr("width", 400)
  .attr("height", 30);
  
var opacityScale = d3.interpolateNumber(0,1); // interpolator

for (i=0; i<8; i++) {
  svg.append("rect")
  .attr("x", i*35)
  .attr("width",  30)
  .attr("height", 30)
  .style("fill", "yellow")
  .style("stroke", "orange")
  .style("stroke-width", 2)
  .style("opacity", opacityScale(i)/8);
}