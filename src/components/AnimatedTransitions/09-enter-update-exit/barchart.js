//////////////////// Barchart ///////////////////
var rects = shapes.selectAll("rect.area")
  .data(cities)
  .enter()
  .append("rect")
  .attr("class", "area")
  .attr("x", function(d){return nameScale(d.name);})
  .attr("y", function(d) {return yScale(d.arbeitslosenquote);})
  .attr("width", nameScale.bandwidth())
  .attr("height", 0)
  .on("mouseover", tooltip.show)
  .on("mouseout", tooltip.hide)
  .style('opacity', 0)
  .style('pointer-events', 'none');

var outline = shapes.selectAll("rect.line")
  .data(cities)
  .enter()
  .append("rect")
  .attr("class", "line")
  .attr("x", function(d){return nameScale(d.name);})
  .attr("y", function(d) {return yScale(d.arbeitslosenquote);})
  .attr("width", nameScale.bandwidth())
  .attr("height", 0)
  .on("mouseover", tooltip.show)
  .on("mouseout", tooltip.hide)
  .style('opacity', 0)
  .style('pointer-events', 'none');
      
///////////////// SHOW ////////////////////
function showBarchart() {
  var t0 = svg.transition().duration(1000).ease(d3.easeQuadInOut);
  
  if (darstellung == "") {
    
  }
  else if (darstellung == "scatterplot") {
    hideCircles();
//     t0.selectAll("rect.line")
//       .attr("cx", function(d) {return xScale(d.einwohnerzahl);})
//       .attr("cy", function(d) {return yScale(d.flaeche);})
//       .attr("r",  function(d) {return zScale(d.arbeitslosenquote);})
//       .attr("rx",0)
//       .attr("ry",0)
//       .style('opacity', 1)
      
  }
  else if (darstellung == "graph") {
    hideGraph();
  }
  else if (darstellung == "piechart") {
    hidePiechart();
  }

  if (darstellung != "barchart") {
    // Scaling
    yScale = d3.scaleLinear()
      .domain([0, d3.max(cities, function(d) {return d.arbeitslosenquote;})])
      .range([height, 0]);
    nameScale = d3.scaleBand()//https://github.com/d3/d3/blob/master/API.md#ordinal-scales
      .domain(cities.map(function(d) {return d.name;}))
      .range([0, width])
      //.padding(0);// sets inner and outer padding
      .paddingInner(0.1) // set padding between bands
      .paddingOuter(0.1);// set padding outside the first and last bands
    
    // Axen
    xAxis = d3.axisBottom(nameScale);
    yAxis = d3.axisLeft()
      .scale(yScale)
      .ticks(6)
      .tickFormat(d3.format(".0%"));// https://github.com/d3/d3-format
    
    t0.selectAll(".x.axis")
      .call(xAxis)
      .style('opacity', 1);
    t0.selectAll(".x.axis").select(".wo")
      .attr("transform", "translate(" + (width+margin.right) + ", 22)")
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Stadt");
    
    t0.selectAll(".y.axis")
      .call(yAxis)
      .style('opacity', 1);
    t0.selectAll(".y.axis").select(".wo")
      .attr("transform", "translate(10,-12)")
      .style("text-anchor", "middle")
      .text("Arbeitslosenquote");
    
    // Bars
    t0.selectAll("rect.line")
      .attr("x", function(d) {return nameScale(d.name);})
      .attr("y", function(d) {return yScale(d.arbeitslosenquote);})
      .attr("width", nameScale.bandwidth()) // https://bl.ocks.org/d3indepth/1aef77d17863e603ff4e84226db5b227
      .attr("height", function(d){return height-yScale(d.arbeitslosenquote);})
      .style('opacity', 1)
      .style('pointer-events', 'all');
      
    t0.selectAll("rect.area")
      .attr("x", function(d){return nameScale(d.name);})
      .attr("y", function(d) {return yScale(d.arbeitslosenquote);})
      .attr("width", nameScale.bandwidth())
      .attr("height", function(d){return height-yScale(d.arbeitslosenquote);})
      .style('opacity', 0.3)
      .style('pointer-events', 'all');
    
    // Beschriftung
    t0.selectAll("text.beschriftung")
      .style('opacity', 0)
      .style('pointer-events', 'none')
      .attr("dy", "-0.5ex")
      .attr("x", function(d,i){return nameScale(d.name);})
      .attr("y", yScale(0)+20)
      .attr("transform", "translate(0,0)");
    
    darstellung = "barchart";
  }
}

///////////////// HIDE ////////////////////
function hideBars() {
  var t0 = svg.transition().duration(1000).ease(d3.easeQuadInOut);
  t0.selectAll("rect.line")
    .style("opacity", 0)
    .style('pointer-events', 'none');
  t0.selectAll("rect.area")
    .style("opacity", 0)
    .style('pointer-events', 'none');
}
