//////////////// SVG ////////////////////
var svg13 = new SVG("#svg13");
//svg13.svg.call(tooltip);// call the function on the selection

//////////////// Scaling ////////////////////
var scale13 = new Scale(datasetAdd);

//////////////// Kreise ////////////////////
var circs13 = new Kreise(datasetAdd, svg13.svg, "class13", scale13,
                         function(d){return d.x*100+d.y;}, tooltipPos);

function addCircleRadiusB() {
  var circles = svg13.svg.selectAll("circle.class13")
    .data(datasetAdd, function(d){return d.x*100+d.y;})
    .enter();
  circles.append("circle")// create new circles needed
      .attr("class", "class13")
      .on("mouseover", tooltipPos.show)
      .on("mouseout", tooltipPos.hide)
      .attr("r", 0)
      //.style("opacity", 0)
      .attr("cx", function(d) {return scale13.xScale(d.x);})
      .attr("cy", function(d) {return scale13.yScale(d.y);});
      
  svg13.svg.selectAll("circle.class13")
    .transition()
    .duration(transDurationAddCirc)
    .ease(d3.easeBackOut.overshoot(6))//d3.easeLinear
    .attr("r", radius);
}

function delCircleRadiusB() {
  var circles = svg13.svg.selectAll("circle.class13")
    .data(datasetAdd, function(d){return d.x*100+d.y;})
    .exit();
  circles.transition()
    .duration(transDurationAddCirc)
    .ease(d3.easeBackIn.overshoot(6))
    .attr("r", 0)
    .remove();
}
