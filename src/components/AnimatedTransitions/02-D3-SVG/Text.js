var svg = d3.select("#Text")
  .append("svg")
  .attr("width", 100)
  .attr("height", 20);
  
svg.append("text")
  .attr("x", 0)
  .attr("y", 0)
  .attr("dy", "2ex")
  .attr("font-family", "sans-serif")
  .attr("font-size", "16px")
  .attr("fill", "green")
  .text("I love SVG!");