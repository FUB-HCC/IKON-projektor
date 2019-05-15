//////////////// SVG ////////////////////
var svg32 = new SVG("#svg32");

//////////////// Scaling ////////////////////
var scale32 = new Scale(datasetStaggering);

//////////////// Kreise ////////////////////
var circs32 = new Farbkreise(datasetStaggering, svg32.svg, "class32", scale32,
                         function(d,i){return i;}, tooltipIdx, staggGroupsNumber);

function moveColCirclesRichtung() {
  var circles = svg32.svg.selectAll("circle.class32")
    .data(datasetStaggering, function(d,i){return i;});
  
  for (quadrant=1; quadrant<=4; quadrant++) {
    svg32.svg.selectAll("circle.class32")
      .filter(function(d,i){
        var circ = this;
        var oldPos = {x: circ.cx.animVal.value, y: circ.cy.animVal.value};// https://www.javascripture.com/SVGAnimatedLength
        var newPos = {x: scale32.xScale(datasetStaggering[i].x), y: scale32.yScale(datasetStaggering[i].y)};
        var winkel = bewegungswinkel(oldPos, newPos);
        var q = getQuadrant(winkel);
//         if (quadrant == q) {
//           console.log("winkel: " + winkel + ", quadrant: " + q);
//         }
        return q == quadrant;
      })
      .transition()
      .duration(singleTransDuration)
      .delay((4-quadrant)*singleTransDuration - (4-quadrant)*transUberdeckungsZeit)
      .ease(d3.easeQuadInOut)// d3.easeQuadInOut, d3.easeLinear, d3.easePolyInOut.exponent(3)
      .attr("cx", function(d) {return scale32.xScale(d.x);})
      .attr("cy", function(d) {return scale32.yScale(d.y);});
  }
}
