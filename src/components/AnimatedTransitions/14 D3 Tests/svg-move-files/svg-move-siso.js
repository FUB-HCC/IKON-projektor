//////////////// SVG ////////////////////
var svg22 = new SVG("#svg22");

//////////////// Scaling ////////////////////
var scale22 = new Scale(datasetMove);

//////////////// Kreise ////////////////////
var circs22 = new Kreise(datasetMove, svg22.svg, "class22", scale22,
                         function(d,i){return i;}, tooltipIdx);

function moveCirclesSISO() {
  var circles = svg22.svg.selectAll("circle.class22")
    .data(datasetMove, function(d,i){return i;});
  
  svg22.svg.selectAll("circle.class22")
    .transition()
    .duration(transDurationMoveCircles)
    .ease(d3.easeQuadInOut)// d3.easeQuadInOut, d3.easeLinear, d3.easePolyInOut.exponent(3)
    .attr("cx", function(d) {return scale22.xScale(d.x);})
    .attr("cy", function(d) {return scale22.yScale(d.y);});
}
