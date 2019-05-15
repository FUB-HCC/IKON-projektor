//////////////// SVG ////////////////////
var svg21 = new SVG("#svg21");

//////////////// Scaling ////////////////////
var scale21 = new Scale(datasetMove);

//////////////// Kreise ////////////////////
var circs21 = new Kreise(datasetMove, svg21.svg, "class21", scale21,
                         function(d,i){return i;}, tooltipIdx);

function moveCirclesLinear() {
  var circles = svg21.svg.selectAll("circle.class21")
    .data(datasetMove, function(d,i){return i;});
  
  svg21.svg.selectAll("circle.class21")
    .transition()
    .duration(transDurationMoveCircles)
    .ease(d3.easeLinear)// d3.easeQuadInOut
    .attr("cx", function(d) {return scale21.xScale(d.x);})
    .attr("cy", function(d) {return scale21.yScale(d.y);});
}
