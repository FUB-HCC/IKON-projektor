// //////////////////// Scatterplot ///////////////////
var circs = shapes.selectAll("circle.area")
  .data(cities)
  .enter()
  .append("circle")
  .attr("class", "area")
  .attr("cx", function(d) {return xScale(d.einwohnerzahl);})
  .attr("cy", function(d) {return yScale(d.flaeche);})
  .attr("r",  function(d) {return zScale(d.arbeitslosenquote);})
  .on("mouseover", tooltip.show)
  .on("mouseout", tooltip.hide)
  .style('opacity', 0)
  .style('pointer-events', 'none');
  
var outline = shapes.selectAll("circle.line")
  .data(cities)
  .enter()
  .append("circle")
  .attr("class", "line")
  .attr("cx", function(d) {return xScale(d.einwohnerzahl);})
  .attr("cy", function(d) {return yScale(d.flaeche);})
  .attr("r",  function(d) {return zScale(d.arbeitslosenquote);})
  .on("mouseover", tooltip.show)
  .on("mouseout", tooltip.hide)
  .style('opacity', 0)
  .style('pointer-events', 'none');

//////////////////// SHOW /////////////////
function showScatterplot() {
  var t0 = svg.transition().duration(1000).ease(d3.easeQuadInOut);
  
  if (darstellung == "") {
    
  }
  else if (darstellung == "graph") {
    hideGraph();
  }
  else if (darstellung == "barchart") {
    hideBars();
  }
  else if (darstellung == "piechart") {
    hidePiechart();
  }
  
  if (darstellung != "scatterplot") {  
    // Scaling
    xScale = d3.scaleLinear()
      .domain([d3.min(cities, function(d) {return d.einwohnerzahl;}), d3.max(cities, function(d) {return d.einwohnerzahl;})])
      .range([0, width]);
    yScale = d3.scaleLinear()
      .domain([0, d3.max(cities, function(d) {return d.flaeche;})])
      .range([height, 0]);
    zScale = d3.scaleLinear()
      .domain([0, d3.max(cities, function(d){return d.arbeitslosenquote;})])
      .range([2,20]);
    
    // Axen
    xAxis = d3.axisBottom(xScale)
      .ticks(6)
      .tickFormat(d3.formatPrefix(".0M",1e6));// https://github.com/d3/d3-format
    yAxis = d3.axisLeft()
      .scale(yScale)
      .ticks(4);
    
    t0.selectAll(".x.axis").call(xAxis).style('opacity', 1);
    t0.selectAll(".x.axis").select(".wo")
      .attr("transform", "translate(" + (width+margin.right) + ", 22)")
      .attr("dy", ".71em")
      .style("text-anchor", "end").text("Einwohnerzahl");
    
    t0.selectAll(".y.axis").call(yAxis).style('opacity', 1);
    t0.selectAll(".y.axis").select(".wo")
      .attr("transform", "translate(10,-12)")
      .style("text-anchor", "middle")
      .text("Fläche (km²)");
    
    // Shapes
    t0.selectAll("circle.line")
      .attr("cx", function(d) {return xScale(d.einwohnerzahl);})
      .attr("cy", function(d) {return yScale(d.flaeche);})
      .attr("r",  function(d) {return zScale(d.arbeitslosenquote);})
      .style('opacity', 1) // stroke-opacity
      .style('pointer-events', 'all');
    t0.selectAll("circle.area")
      .attr("cx", function(d) {return xScale(d.einwohnerzahl);})
      .attr("cy", function(d) {return yScale(d.flaeche);})
      .attr("r",  function(d) {return zScale(d.arbeitslosenquote);})
      .style('opacity', 0.3)// fill-opacity
      .style('pointer-events', 'all');
    
    // Beschriftung
    t0.selectAll("text.beschriftung")
      .attr("x", function(d){return xScale(d.einwohnerzahl);})
      .attr("y", function(d){return yScale(d.flaeche)-zScale(d.arbeitslosenquote);})
      .attr("transform", "translate(0,0)")
      .attr("dy", "-0.5ex")
      .style('opacity', 1)
      .style('pointer-events', 'all');
    
    darstellung = "scatterplot";
  }// ende if ""
}// ende Funktion

function hideCircles() {
  var t0 = svg.transition().duration(1000).ease(d3.easeQuadInOut);
  t0.selectAll("circle.area")
    .style('opacity', 0)
    .style('pointer-events', 'none');
  t0.selectAll("circle.line")
    .style('opacity', 0)
    .style('pointer-events', 'none');
}
