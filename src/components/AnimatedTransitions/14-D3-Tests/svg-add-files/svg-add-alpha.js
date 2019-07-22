//////////////// SVG ////////////////////
var svg11 = new SVG("#svg11");
//svg11.svg.call(tooltip);// call the function on the selection

//////////////// Scaling ////////////////////
var scale11 = new Scale(datasetAdd);

//////////////// Kreise ////////////////////
var circs11 = new Kreise(datasetAdd, svg11.svg, "class11", scale11,
                         function(d){return d.x*100+d.y;}, tooltipPos);

function addCircleAlpha() {
  var circles = svg11.svg.selectAll("circle.class11")
    .data(datasetAdd, function(d){return d.x*100+d.y;})
    .enter();
  circles.append("circle")// create new circles needed
      .attr("class", "class11")
      .on("mouseover", tooltipPos.show)
      .on("mouseout", tooltipPos.hide)
      .attr("r", radius)
      .style("opacity", 0)
      .attr("cx", function(d) {return scale11.xScale(d.x);})
      .attr("cy", function(d) {return scale11.yScale(d.y);});
      
  svg11.svg.selectAll("circle.class11")
    .transition()
    .duration(transDurationAddCirc)
    //.ease(d3.easeLinear)// d3.easeBackOut.overshoot(5)
    .style("opacity", 1);
}

function delCircleAlpha() {
  var circles = svg11.svg.selectAll("circle.class11")
    .data(datasetAdd, function(d){return d.x*100+d.y;})
    .exit();
  circles.transition()
    .duration(transDurationAddCirc)
    //.ease(d3.easeLinear)// d3.easeBackIn.overshoot(5)
    .style("opacity", 0)
    .remove();
}
