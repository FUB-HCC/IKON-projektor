//////////////// Variables ///////////////
var w = 150;
var h = 150;

//////////////// SVG ///////////////
var svg = d3.select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

var r1 = svg.append("rect")
  .attr("x", 0) // default
  .attr("y", 0) // default
  .attr("width", 100)
  .attr("height", 50)
  .attr("fill", "rgb(0,200,200)")
  .style("stroke", "black")
  .style("stroke-width", 2)
  .attr("rx", 0)  // default
  .attr("ry", 0); // default

function initTransition() {

// Create a transition
var t = d3.transition().duration(3000);
r1.transition(t)
  .style("fill", "rgb(0,200,0)")
  .attr("x", 100)
  .attr("y", 100)
  .attr("width", 50)
  .attr("rx", 25)
  .attr("ry", 25);

}