var svg8 = d3.select("body")
  .append("svg")
  .attr("class", "8")
  .attr("width", w)
  .attr("height", h)
  .append("g")
    .attr("transform", "translate(" + 10 + "," + 10 + ")");
  
var dataset = [1,3,5,7];
  
var circles = svg8.selectAll("circle")
  .data(dataset, function(d,i){return i;})
  .enter()
  .append("circle")
  .attr("cx", function(d,i){return 10*d;})
  .attr("cy", function(d,i){return 10*(i+1);})
  .attr("fill", "pink")
  .attr("fill", function(d,i) {return "rgb("+colorScale(i)+", 0, 255)";})
  .attr("r", 5);
  
function updateDataset(){
  dataset[1] = 9;
  dataset[3] = 8;
  
  // Transition
  var t0 = svg8.transition().duration(1000).ease(d3.easeQuadInOut);
  // Kreise
  circles.exit().remove();
  circles.data(dataset, function(d,i){return i;})
  .enter();
  
  t0.selectAll("circle")// Kreise
    .attr("cx", function(d,i){return 10*d;})
    .attr("cy", function(d,i){return 10*(i+1);});
}
