var svg = d3.select("#FillingLin")
  .append("svg")
  .attr("width", 100)
  .attr("height", 50);
  
var defs = svg.append("defs");
  
var gradient = defs.append('linearGradient')
  .attr('id', "fillLinear")
  .attr('x1', '0%')
  .attr('x2', '100%')
  .attr('y1', '0%')
  .attr('y2', '50%');

gradient.append('stop')
  .attr('offset', '0%')
  .style("stop-color", "yellow")
  .style("stop-opacity", "1");

gradient.append('stop')
  .attr('offset', '100%')
  .style("stop-color", "green")
  .style("stop-opacity", "1");

svg.append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", 100)
  .attr("height", 50)
  .attr("fill", "url(#fillLinear)");
  
svg.append("text")
  .attr("x", 10)
  .attr("y", 0)
  .attr("dy", "2ex")
  .attr("font-family", "Verdana")
  .attr("font-size", "32px")
  .attr("fill", "white")
  .text("SVG");