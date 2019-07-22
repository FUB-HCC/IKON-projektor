//////////////// Variables ///////////////
var w = 220;
var h = 150;
var size = 40;

//////////////// Dataset ///////////////
var dataset = [{"x": size, "y": size}, {"x": size*2, "y": size}]; // size ist kein pointer

//////////////// SVG ///////////////
var svg = d3.select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);

//////////////// Shapes /////////////// - enter, update and exit states -
var circles = svg.selectAll("circle")
  .data(dataset) // update
  .enter() // enter
  .append("circle")
  .attr("cx", function(d) {return d.x;})
  .attr("cy", function(d) {return d.y;})
  .attr("r", size)
  .attr("stroke", "black")
  .attr("stroke-width", 2)
  .attr("fill", "pink")
  .attr("transform", "translate(15,15)")
  .attr("opacity", 0.75);
  
function initJoins() {
  circles.exit()
//     .transition().duration(2000)
//     .attr("r", 0)
    .remove(); // exit
  
  size = 50; // verändert nicht dataset  :(
  dataset[1].x=3*size;
  dataset.push({"x": size*2, "y": size});
  
  // By reselecting elements and minimizing DOM changes, you vastly improve rendering performance!
  circles
    .data(dataset)
    .enter() // maintains the desired correspondence between elements and data
    .append("circle")
//       .attr("r", 0)
//       .transition().duration(2000)
      .attr("stroke", "black") // alles für den neuen Kreis:
      .attr("stroke-width", 2)
      .attr("fill", "blue")
      .attr("transform", "translate(15,15)")
      .attr("opacity", 0.5)
    .merge(circles) // zeichnet Veränderung der alten Kreise
      .attr("cx", function(d) {return d.x;})
      .attr("cy", function(d) {return d.y;})
      .attr("r", size);
}

/* Quelle:
 * https://bost.ocks.org/mike/join/
 * 
 */