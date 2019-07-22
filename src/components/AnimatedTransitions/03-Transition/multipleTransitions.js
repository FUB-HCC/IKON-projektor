//////////////// Variables ///////////////
var w = 50;
var h = 50;

//////////////// SVG ///////////////
var svg = d3.select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

// Create and append rectangle
var r3 = svg.append("rect")
  .attr("width", 50)
  .attr("height", 50)
  .attr("fill", "rgb(0,200,200)")
  .style("stroke", "black")
  .style("stroke-width", 2);
  
function initMultiTrans() {

// Create a transition
var t = d3.transition().duration(1000);
r3.transition(t)
    .style("fill", "green")
  .transition(t)
    .style("fill", "red")
  .transition(t)// create
    .delay(1000)// modify
    .style("fill", "brown")// scheduling, starting, ending
    .remove();
}

/* Quelle:
 * https://visual.ly/blog/creating-animations-and-transitions-with-d3-js/
 * */