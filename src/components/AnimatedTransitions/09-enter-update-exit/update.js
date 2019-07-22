//////////////// Variables ////////////////////
var margin = {top: 20, right: 20, bottom: 40, left: 50},
  width = 500 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

//////////////// Datas ////////////////////
var dataset = [];
var numDataPoints = 10;
var xRange = 10;
var yRange = Math.random() * 90+10;

for (var i = 0; i <= numDataPoints; i++) {
  var newNumber1 = i / numDataPoints * xRange;
  var newNumber2 = Math.round(Math.random() * yRange);
  dataset.push({x: newNumber1, y: newNumber2});
}

//////////////// SVG ////////////////////
var svg1 = d3.select("body")
  .append("svg")
  .attr("class", "updateSvg")
  .attr("width",  width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

//////////////// Scaling ///////////////
var xScaleU = d3.scaleLinear()
  .range([0, width]); // rangeRound() statt range()
var yScaleU = d3.scaleLinear()
  .range([height, 0]); // kehrt Darst. um, sodass y nach oben größer wird
xScaleU.domain([0, d3.max(dataset, function(d) {return d.x;})]);
yScaleU.domain([0, d3.max(dataset, function(d) {return d.y;})]);

//////////////// Axis /////////////// 
var xAxis = d3.axisBottom(xScaleU)
  .ticks(6);
  //.tickFormat(d3.format(".1%"));
var yAxis = d3.axisLeft()
  .scale(yScaleU)
  .ticks(4);
  
var xAchse = svg1.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);
  
var yAchse = svg1.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
    .attr("class", "wo")
    .attr("transform", "translate(10,-12)")
    .attr("dy", ".71em")
    .style("text-anchor", "middle")
    .text("Geschwindigkeit (m/s)");
    //.attr("fill", "black");

//////////////// D3-Funktionen ////////////////////  
var d3AreaU = d3.area()
  .x(function(d){return xScaleU(d.x);})
  .y0(yScaleU(0))
  .y1(function(d){return yScaleU(d.y);});
  
var d3LineU = d3.line()
  //.interpolate("basis")
  .x(function(d){return xScaleU(d.x);})
  .y(function(d){return yScaleU(d.y);});

//////////////// Abbild ///////////////
var flaeche = svg1.selectAll("path.area")
  .data([dataset]) // Join new data with old elements, if any
  .enter() // update old elements as needed
  .append("path")
  .attr("class", "area")
  //.attr("fill", "yellow")
  //.style("opacity", 0.3)
  .attr("d", d3AreaU); // after merging the entered elements with the update selection
  
var graph = svg1.selectAll("path.line")
  .data([dataset])
  .enter()
  .append("path")
  .attr("class", "line")
  //.attr("fill", "none")
  //.attr("stroke", "orange")
  //.attr("stroke-width", 2)
  .attr("d", d3LineU);

////////////////////////// UPDATE //////////////////
function update() {
  dataset = [];
  yRange = Math.random() * 90+10;

  for (var i = 0; i <= numDataPoints; i++) {
    var newNumber1 = i / numDataPoints * xRange;
    var newNumber2 = Math.round(Math.random() * yRange);
    dataset.push({x: newNumber1, y: newNumber2});
  }
  //////////////// Datas /////////////
  flaeche.exit().remove();
  graph.exit().remove();
  flaeche.data([dataset]).enter();
  graph.data([dataset]).enter();

  //////////////// Transition ///////////////
  var t0 = svg1.transition().duration(750);
  
  //////////////// Abbild ///////////////
  t0.selectAll("path.line").attr("d", d3LineU);
  t0.selectAll("path.area").attr("d", d3AreaU);
  
  yScaleU.domain([0, d3.max(dataset, function(d) {return d.y;})]);
  
  var t1 = t0.transition();
  t1.selectAll("path.line").attr("d", d3LineU);
  t1.selectAll("path.area").attr("d", d3AreaU);
  t1.selectAll(".y.axis").call(yAxis);
}

//update();

/* Quellen:
 * https://bl.ocks.org/mbostock/3903818
 * https://medium.com/@c_behrens/enter-update-exit-6cafc6014c36
 * https://bost.ocks.org/mike/join/
 * http://synthesis.sbecker.net/articles/2012/07/09/learning-d3-part-2
 * https://bl.ocks.org/mbostock/3808218
 * http://bl.ocks.org/d3noob/7030f35b72de721622b8
 * https://bost.ocks.org/mike/selection/#data
 * https://stackoverflow.com/questions/13181194/d3js-when-to-use-datum-and-data
 * https://stackoverflow.com/questions/8538651/d3-update-data-and-update-graph
 */
