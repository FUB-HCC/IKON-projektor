//////////////// SVG ////////////////////
var svg12 = new SVG("#svg12");
//svg12.svg.call(tooltip);// call the function on the selection

//////////////// Scaling ////////////////////
var scale12 = new Scale(datasetAdd);

//////////////// Kreise ////////////////////
var circs12 = new Kreise(datasetAdd, svg12.svg, "class12", scale12,
                         function(d){return d.x*100+d.y;}, tooltipPos);

function addCircleRadius() {
  var circles = svg12.svg.selectAll("circle.class12")
    .data(datasetAdd, function(d){return d.x*100+d.y;})
    .enter();
  circles.append("circle")// create new circles needed
      .attr("class", "class12")
      .on("mouseover", tooltipPos.show)
      .on("mouseout", tooltipPos.hide)
      .attr("r", 0)
      //.style("opacity", 0)
      .attr("cx", function(d) {return scale12.xScale(d.x);})
      .attr("cy", function(d) {return scale12.yScale(d.y);});
      
  svg12.svg.selectAll("circle.class12")
    .transition()
    .duration(transDurationAddCirc)
    //.ease(d3.easeLinear)// d3.easeBackOut.overshoot(5)
    .attr("r", radius);
}

function delCircleRadius() {
  var circles = svg12.svg.selectAll("circle.class12")
    .data(datasetAdd, function(d){return d.x*100+d.y;})
    .exit();
  circles.transition()
    .duration(transDurationAddCirc)
    //.ease(d3.easeLinear)// d3.easeBackOut.overshoot(5)
    .attr("r", 0)
    .remove();
}
