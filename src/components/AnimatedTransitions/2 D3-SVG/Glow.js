var svg = d3.select("#Glow")
  .append("svg")
  .attr("width", 120)
  .attr("height",70);
  
// Container for the gradients
var defs = svg.append("defs");

// Filter for the outside glow
var filter = defs.append("filter")
  .attr("id", "glow2");// !!! important - define id to reference it later
//   .attr("x", -10)
//   .attr("y", -10)
//   .attr("width", 90)
//   .attr("height", 40);
  
filter.append("feGaussianBlur")
  .attr("stdDeviation", 5) // !!! important parameter - blur
  .attr("result", "coloredBlur");
  
// merge result with original image
var feMerge = filter.append("feMerge");

// first layer result of blur
feMerge.append("feMergeNode")
  .attr("in", "coloredBlur");
  
// original image on top
feMerge.append('feMergeNode')
   .attr('in', 'SourceGraphic');
  
svg.append("rect")
  .attr("x", 10)
  .attr("y", 10)
  .attr("width", 90)
  .attr("height", 40)
  .style("fill", "green")
  .style("filter", "url(#glow2)");