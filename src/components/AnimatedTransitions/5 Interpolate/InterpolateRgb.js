var svg = d3.select("#svgcontainer1")
  .append("svg")
  .attr("width", 200)
  .attr("height", 30);
  
var colorScale = d3.interpolateRgb("rgb(255,0,0)", "rgb(255,255,0)");

for (i=0; i<5; i++) {
  svg.append("rect")
  .attr("x", i*35)
  .attr("width",  30)
  .attr("height", 30)
  .style("fill", colorScale(i/4))
  .style("stroke", "green")
  .style("stroke-width", 2);
}