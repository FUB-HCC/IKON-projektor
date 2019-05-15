//////////////// Graph ///////////////
var d3Area = d3.area()
  .x(function(d){return xScale(d.einwohnerzahl);})
  .y0(yScale(0))
  .y1(function(d){return yScale(d.flaeche);});
  
var d3Line = d3.line()
  .x(function(d){return xScale(d.einwohnerzahl);})
  .y(function(d){return yScale(d.flaeche);});
  
var area = shapes.selectAll("path.area")
  // Daten sortieren
  // cities.sort(d3.ascending(function(d) {return d.einwohnerzahl;}));
  .data([cities])
  .enter()
  .append("path")
  .attr("class", "area")
  .attr("d", d3Area)
  .style('opacity', 0);
  
var line = shapes.selectAll("path.line")
  .data([cities])
  .enter()
  .append("path")
  .attr("class", "line")
  .attr("d", d3Line)
  .style('opacity', 0);

//////////////// Show ///////////////
function showGraph() {  
  var t0 = svg.transition().duration(1000).ease(d3.easeQuadInOut);
  
  if (darstellung == "") {
    
  }
  else if (darstellung == "scatterplot") {
    hideCircles();
  }
  else if (darstellung == "barchart") {
    hideBars();
  }
  else if (darstellung == "piechart") {
    hidePiechart();
  }
  
  if (darstellung != "graph") {
    // Scaling
    xScale = d3.scaleLinear()
      .domain([d3.min(cities, function(d) {return d.einwohnerzahl;}), d3.max(cities, function(d) {return d.einwohnerzahl;})])
      .range([0, width]);
    yScale = d3.scaleLinear()
      .domain([0, d3.max(cities, function(d) {return d.flaeche;})])
      .range([height, 0]);
    zScale = d3.scaleLinear()
      .domain([0, d3.max(cities, function(d){return d.arbeitslosenquote;})])
      .range([1,10]);
    
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
      .style("text-anchor", "end")
      .text("Einwohnerzahl");
    
    t0.selectAll(".y.axis").call(yAxis).style('opacity', 1);
    t0.selectAll(".y.axis").select(".wo")
      .attr("transform", "translate(10,-12)")
      .style("text-anchor", "middle")
      .text("Fläche (km²)");
    
    // Graph
    d3Area = d3.area()
      .x(function(d){return xScale(d.einwohnerzahl);})
      .y0(yScale(0))
      .y1(function(d){return yScale(d.flaeche);});
      
    d3Line = d3.line()
      .x(function(d){return xScale(d.einwohnerzahl);})
      .y(function(d){return yScale(d.flaeche);});
    
    t0.selectAll("path.line")
      .style('opacity', 1)
      .attr("d", d3Line);
    t0.selectAll("path.area")
      .style('opacity', 0.3)
      .attr("d", d3Area);
    
    // Beschriftung
    t0.selectAll("text.beschriftung")
      .attr("x", function(d){return xScale(d.einwohnerzahl);})
      .attr("y", function(d){return yScale(d.flaeche);})
      .attr("transform", "translate(0,0)")
      .attr("dy", "-0.5ex")
      .style('opacity', 1)
      .style('pointer-events', 'all');
      
    darstellung = "graph";
    }// ende if ""
}

//////////////// Hide ///////////////
function hideGraph() {
  var t0 = svg.transition().duration(1000).ease(d3.easeQuadInOut);
  t0.selectAll("path.line").style("opacity", 0);
  t0.selectAll("path.area").style("opacity", 0);
}
