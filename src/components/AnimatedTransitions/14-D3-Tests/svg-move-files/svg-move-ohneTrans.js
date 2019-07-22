//////////////// SVG ////////////////////
var svg23 = new SVG("#svg23");

//////////////// Scaling ////////////////////
var scale23 = new Scale(datasetMove);

//////////////// Kreise ////////////////////
var circs23 = new Kreise(datasetMove, svg23.svg, "class23", scale23,
                         function(d,i){return i;}, tooltipIdx);

function moveCirclesNoTrans() {
  var circles = svg23.svg.selectAll("circle.class23")
    .data(datasetMove, function(d,i){return i;});
  
  svg23.svg.selectAll("circle.class23")
    .transition()
    .delay(transDurationMoveCircles)
    .duration(1)
    //.ease(d3.easeQuadInOut)// d3.easeLinear
    .attr("cx", function(d) {return scale23.xScale(d.x);})
    .attr("cy", function(d) {return scale23.yScale(d.y);});
}
