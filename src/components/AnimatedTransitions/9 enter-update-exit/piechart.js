//////////////////// Piechart ///////////////////
var r = 0.5*height;

function color(i) {
  // https://bl.ocks.org/mbostock/310c99e53880faec2434
  // https://github.com/d3/d3-interpolate/blob/master/README.md#interpolateHcl
  var interpolate = d3.piecewise(d3.interpolateRgb.gamma(5), ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
  var colorScale = d3.scaleLinear()
    .domain([0, cities.length-1])
    .range([0,1])
  return interpolate(colorScale(i));
}

var radius = d3.scaleSqrt()
  .domain([0, d3.max(cities, function(d) {return d.einwohnerzahl;})])
  .range([0, height]);

var arc = d3.arc()
  .outerRadius(r)
  .innerRadius(r/2)
  .cornerRadius(0) // abgerundete Ecken
  .padRadius(55); // zwischenraum zw. arcs
  
var pie = d3.pie()
  .sort(null)
  .padAngle(0.1)
  .value(function(d) {return d.einwohnerzahl;});

var piechart = shapes.selectAll("path.arcs")
  .data(pie(cities)) // https://bl.ocks.org/mbostock/f098d146315be4d1db52
  .enter()
  .append("path")
  .attr("class", "arcs")
  .attr("d", arc)
  .style("fill", function(d,i){return color(i);})
  .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
  .style('opacity', 0);
   
d3.selectAll("path.arcs")// https://stackoverflow.com/questions/24768819/apply-d3-tooltip-to-donut-multiples
  .on("mouseover", tooltip.show)
  .on("mouseout", tooltip.hide)
  .style('pointer-events', 'none');
  
var pie_titel = beschriftung.append("text")
  .attr("class", "pietitel")
  .attr("dy", "0.2ex")
  .style("font-weight", "bold")
  .style("font-size", "85%")
  .style("text-anchor", "middle")
  .text("Einwohnerzahl")
  .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
  .style('opacity', 0);

  
//////////////// Show ///////////////
function showPiechart() {  
  var t0 = svg.transition().duration(1000).ease(d3.easeQuadInOut);
  
  if (darstellung == "") {
    // Beschriftung
    // https://blockbuilder.org/cricku/9af3b270bc2ac5d860ecd44da2471dc2
    // https://bl.ocks.org/d3indepth/c9fd848b9410cc543a437b34c266ac64
    d3.selectAll("path.arcs")
      .each(function(d,i){
        var a = d3.select(this)
        namen.each(function(e,j){
          if (i==j) {
            d3.select(this)
              .attr("x", arc.centroid(d)[0])
              .attr("y", arc.centroid(d)[1])
              .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
              .style("opacity", 1)
              .style('pointer-events', 'all');
          }
        })
      });
  }
  else if (darstellung == "scatterplot") {
    hideCircles();
  }
  else if (darstellung == "barchart") {
    hideBars();
  }
  else if (darstellung == "graph") {
    hideGraph();
  }
  
  if (darstellung != "piechart") {
    // Scaling
    
    // Axen
    t0.selectAll(".x.axis")
      .style('opacity', 0);
    t0.selectAll(".y.axis")
      .style('opacity', 0);
      
    // Arcs
    t0.selectAll("path.arcs")
      .attr("d", arc)
      .style("fill", function(d,i){return color(i);})
      .style('opacity', 1);
//       .style('pointer-events', 'all');
    
    d3.selectAll("path.arcs").style('pointer-events', 'all');
    
    // Beschriftung
    // verbesserung der Auswahl: https://stackoverflow.com/questions/28390754/get-one-element-from-d3js-selection-by-index
    d3.selection().selectAll("path.arcs")
      .each(function(d,i){
        var a = d3.select(this)
        namen.each(function(e,j){
          if (i==j) {
            d3.select(this).transition().duration(1000).ease(d3.easeQuadInOut)
              .attr("x", arc.centroid(d)[0])
              .attr("y", arc.centroid(d)[1])
              .attr("transform", "translate(" + width/2 + "," + height/2 + ")")
              .style("opacity", 1)
              .style('pointer-events', 'all')
              .attr("dy", "0.5ex");
          }
        })
      });

    t0.select("text.pietitel").style("opacity", 1);
    
    darstellung = "piechart";
  }
}

///////////////// HIDE ////////////////////
function hidePiechart() {
  var t0 = svg.transition().duration(1000).ease(d3.easeQuadInOut);
  t0.selectAll("path.arcs")
    .style("opacity", 0);// .style("display", "none"), .style("visibility", "hidden")
  piechart.selectAll("path.arcs").style('pointer-events', 'none');
  pie_titel.style("opacity", 0);
}
