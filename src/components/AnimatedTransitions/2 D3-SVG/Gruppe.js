var svg = d3.select("#Gruppe")
  .append("svg")
  .attr("width", 100)
  .attr("height", 100);
  
var gruppe = svg.append("g");

var rect = gruppe.append("rect")
  .attr("x", 20)
  .attr("y", 20)
  .attr("width", 50)
  .attr("height", 50)
  .style("fill", "yellow")
  .style("stroke", "green");
  
var circle = gruppe.append("circle")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", 30)
  .style("fill", "yellow")
  .style("stroke", "green");