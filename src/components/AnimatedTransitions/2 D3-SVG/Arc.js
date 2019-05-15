var radius = 50;

var svg = d3.select("#Arc")
  .append("svg")
  .attr("width", 400+radius*2+2)
  .attr("height", radius*2+2);

var arc = d3.arc()
  .innerRadius(20)
  .outerRadius(radius)
  .startAngle(45*Math.PI/180)
  .endAngle(135*Math.PI/180);

var gruppe = svg.append("g");
  
gruppe.append("path")
  .attr("d", arc)
  .style("fill", "rgb(255,255,0)")
  .style("stroke", "rgb(0,255,0)")
  .style("stroke-width", 2)
  .attr("dy", "1ex")
  .attr("transform", "translate("+radius+","+radius+")");
  
gruppe.append("text")
  .attr("x", radius)
  .attr("y", radius)
  .attr("dy", "0.5ex")
  .attr("font-family", "sans-serif")
  .attr("font-size", "16px")
  .attr("fill", "green")
  .text(function(d,i){return "(" + arc.centroid(d,i)+")";})
  .attr("transform", function(d,i){return "translate("+arc.centroid(d,i)+")";});
