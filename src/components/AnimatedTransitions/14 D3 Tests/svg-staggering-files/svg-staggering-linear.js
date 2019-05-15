//////////////// SVG ////////////////////
var svg33 = new SVG("#svg33");

//////////////// Scaling ////////////////////
var scale33 = new Scale(datasetStaggering);

//////////////// Kreise ////////////////////
var circs33 = new Farbkreise(datasetStaggering, svg33.svg, "class33", scale33,
                         function(d,i){return i;}, tooltipIdx, staggGroupsNumber);

function moveColCirclesLinear() {
  var circles = svg33.svg.selectAll("circle.class33")
    .data(datasetStaggering, function(d,i){return i;});
  
  svg33.svg.selectAll("circle.class33")
    .transition()
    .duration(transDurationStaggCircles)
    .ease(d3.easeQuadInOut)// d3.easeQuadInOut, d3.easeLinear, d3.easePolyInOut.exponent(3)
    .attr("cx", function(d) {return scale33.xScale(d.x);})
    .attr("cy", function(d) {return scale33.yScale(d.y);});
}
