var svg = d3.select("#svgcontainer3")
  .append("svg")
  .attr("width", 200)
  .attr("height", 30);
  
var fig1 = svg.append("rect")
  .attr("x", 0)
  .attr("width",  30)
  .attr("height", 30)
  .style("fill", "pink")
  .style("stroke", "red")
  .style("stroke-width", 2);
  
var fig2 = svg.append("rect")
  .attr("x", 100)
  .attr("width",  30)
  .attr("height", 30)
  .style("fill", "yellow")
  .style("stroke", "green")
  .style("stroke-width", 2);
  
var objectScale = d3.interpolateObject("fig1", "fig2");

for (i=0; i<5; i++) {
  svg.append(objectScale(i))
  .attr("x", i*35);
  .attr("width",  30)
  .attr("height", 30)
  .style("fill", colorScale(i/4))
  .style("stroke", "green")
  .style("stroke-width", 2);
}