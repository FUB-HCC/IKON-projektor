//////////////// Dataset ///////////////
var dataset = [[5, 20], [480, 90], [250, 50], [100, 33], [330, 95], [410, 12], [475, 44], [25, 67], [85, 21], [220, 88]];

//////////////// Variables ///////////////
var w = 500;
var h = 150;
var xScale = d3.scaleLinear() // d3.scale.linear() mit d3.v3
  .domain([0, d3.max(dataset, function(d) {return d[0];})])
  .range([0, w]);

var yScale = d3.scaleLinear()
  .domain([0, d3.max(dataset, function(d) {return d[1];})])
  .range([0, h]);

//////////////// SVG ///////////////
//Create SVG element
var svg = d3.select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);
  
//////////////// Dots ///////////////
svg.selectAll("circle")
  .data(dataset)
  .enter()
  .append("circle")
  .attr("cx", function(d) {return xScale(d[0]);})
  .attr("cy", function(d) {return h-yScale(d[1]);})
  .attr("r",  function(d) {return Math.sqrt(d[1]);})
  .attr("fill", "teal");

//////////////// Labels ///////////////  
svg.selectAll("text")
  .data(dataset)
  .enter()
  .append("text")
  .attr("x", function(d) {return xScale(d[0]);})
  .attr("y", function(d) {return h-yScale(d[1]);})
  .text(function(d) {return "("+d[0]+","+d[1]+")";})
  .attr("font-family", "sans-serif")
  .attr("font-size", "11px")
  .attr("fill", "black");
  
/* Quellen:
 * http://alignedleft.com/tutorials/d3/scales
 */