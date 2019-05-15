//////////////// Variables ///////////////
var w = 200;
var h = 50;

//////////////// SVG ///////////////
var svg = d3.select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

// Create and append rectangle
var r2 = svg.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", 50)
  .attr("height", 50)
  .attr("fill", "rgb(0,200,200)")
  .style("stroke", "black")
  .style("stroke-width", 2);

function initDelay() {
// Create a transition
var t = d3.transition().delay(1500).duration(1000);
r2.transition(t)
  .style("fill", "rgb(0,200,0)")
  .attr("x", 150);
}