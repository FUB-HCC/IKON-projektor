var svg = d3.select("#Filter")
  .append("svg")
  .attr("width", 140)
  .attr("height", 90);
  
var defs = svg.append("defs");
  
var filter = defs.append("filter")
  .attr("id", "filter2")// !!! important - define id to reference it later
  .attr('x', -20)
  .attr('y', -20)
  .attr("width", 100)
  .attr("height", 50);
  
// <filter id="filter1" x="0" y="0">
// <feGaussianBlur in="SourceGraphic" stdDeviation="10" />
filter.append('feGaussianBlur')
  .attr("in", "SourceGraphic")
  .attr("stdDeviation", 10);
   
svg.append("rect")
  .attr("x", 20)
  .attr("y", 20)
  .attr("width", 100)
  .attr("height", 50)
  .attr("fill", "green")
  .style("filter", "url(#filter2)");