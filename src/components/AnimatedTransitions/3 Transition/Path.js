//////////////// Variables ///////////////
var w = 150;
var h = 150;

//////////////// SVG ///////////////
var svg = d3.select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

//////////////// Dots ///////////////
var pfad = svg.append("path")
  .attr("d", "m 0,0 l 20,40 l 40,20 l -40,20 l -20,40 l -20,-40 l -40,-20 l 40,-20 z")
  .attr("fill", "teal")
  .attr("stroke", "black")
  .attr("stroke-width", 2)
  .attr("transform", "translate(60,5)");

function initPathTransition() {
  pfad.transition()
  .duration(1000)
  .attr("d", "m 0,0 l 40,20 l 20,40 l -20,40 l -40,20 l -40,-20 l -20,-40 l 20,-40 z")
  ;  
}