//////////////// SVG ////////////////////
var svg31 = new SVG("#svg31");

//////////////// Scaling ////////////////////
var scale31 = new Scale(datasetStaggering);

//////////////// Kreise ////////////////////
var circs31 = new Farbkreise(datasetStaggering, svg31.svg, "class31", scale31,
                         function(d,i){return i;}, tooltipIdx, staggGroupsNumber);

function moveColCirclesFarbe() {
  var circles = svg31.svg.selectAll("circle.class31")
    .data(datasetStaggering, function(d,i){return i;});
  
  for (j=0; j<staggGroupsNumber; j++) {
    svg31.svg.selectAll("circle.class31")
      .filter(function(d,i){return i%staggGroupsNumber == j;})
      .transition()
      .duration(singleTransDuration)
      .delay(j*singleTransDuration - j*transUberdeckungsZeit)
      .ease(d3.easeQuadInOut)// d3.easeQuadInOut, d3.easeLinear, d3.easePolyInOut.exponent(3)
      .attr("cx", function(d) {return scale31.xScale(d.x);})
      .attr("cy", function(d) {return scale31.yScale(d.y);});
  }
}
