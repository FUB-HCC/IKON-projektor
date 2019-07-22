//////////////// SVG ////////////////////
var svg14 = new SVG("#svg14");
//svg14.svg.call(tooltip);// call the function on the selection

//////////////// Scaling ////////////////////
var scale14 = new Scale(datasetAdd);

//////////////// Kreise ////////////////////
var circs14 = new Kreise(datasetAdd, svg14.svg, "class14", scale14,
                         function(d){return d.x*100+d.y;}, tooltipPos);

function addCircleNoTrans() {
  var circles = svg14.svg.selectAll("circle.class14")
    .data(datasetAdd, function(d){return d.x*100+d.y;})
    .enter();
  circles.append("circle")// create new circles needed
      .attr("class", "class14")
      .on("mouseover", tooltipPos.show)
      .on("mouseout", tooltipPos.hide)
      .attr("r", 0)
      .style("opacity", 0)
      .attr("cx", function(d) {return scale14.xScale(d.x);})
      .attr("cy", function(d) {return scale14.yScale(d.y);});
      
  svg14.svg.selectAll("circle.class14")
    .transition()
    .delay(transDurationAddCirc-1)
    .duration(1)
    .style("opacity", 1)
    .attr("r", radius);
}

function delCircleNoTrans() {
  var circles = svg14.svg.selectAll("circle.class14")
    .data(datasetAdd, function(d){return d.x*100+d.y;})
    .exit();
  circles.transition()
    .delay(transDurationAddCirc-1)
    .duration(1)
    //.ease(d3.easeLinear)// d3.easeBackOut.overshoot(5)
    .style("opacity", 0)
    .remove();
}
