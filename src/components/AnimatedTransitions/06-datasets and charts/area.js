//////////////// Variables ////////////////////
var margin = {top: 20, right: 20, bottom: 40, left: 50},
  width = 500 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

//////////////// Datas ////////////////////
var dataset = [
  {x: 0, y: 10,},
  {x: 0.7, y: 12,},
  {x: 1, y: 18,},
  {x: 1.6, y: 23,},
  {x: 2, y: 35, },
  {x: 2.4, y: 27, },
  {x: 3, y: 20,}
];

//////////////// Scaling ///////////////
var xScale = d3.scaleLinear() // d3.scale.linear() mit d3.v3, weitere Skalen: identity, sqrt, pow, log, quantize, quantile, ordinal
  .domain([0, d3.max(dataset, function(d) {return d.x;})]) // nice() rundet auf 2 Nachkommastellen
  .range([0, width]); // rangeRound() statt range()
var yScale = d3.scaleLinear()
  .domain([0, d3.max(dataset, function(d) {return d.y;})])
  .range([height, 0]); // kehrt Darst. um, sodass y nach oben größer wird
  
//////////////// SVG ////////////////////
var svg = d3.select("body")
  .append("svg")
  .attr("width",  width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
//////////////// Area ////////////////////  
var area = d3.area()
  .x(function(d){return xScale(d.x);})
  .y0(yScale(0))
  .y1(function(d){return yScale(d.y);});
  
var line = d3.line()
  .x(function(d){return xScale(d.x);})
  .y(function(d){return yScale(d.y);});
  
svg.append("path")
  .datum(dataset)// keine dynamische erneuerung. enter(), exit() können nicht benutzt werden
  .attr("class", "area")
  .attr("d", area)
  .attr("fill", "yellow")
  .style("opacity", 0.3);
  
svg.append("path")
  .datum(dataset)
  .attr("class", "area")
  .attr("d", line)
  .attr("fill", "none")
  .attr("stroke", "orange")
  .attr("stroke-width", 2);

//////////////// Axis /////////////// 
var xAxis = d3.axisBottom(xScale)
  .ticks(6);
  //.tickFormat(d3.format(".1%"));
var yAxis = d3.axisLeft()
  .scale(yScale)
  .ticks(4);

svg.append("g")
  .attr("class", "axis")// "axis"
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);
  
svg.append("g")
  .attr("class", "axis")
  .call(yAxis);
  
/* Quellen:
 * https://www.mattlayman.com/blog/2015/d3js-area-chart/
 * https://wizardace.com/d3-areachart/
 * https://stackoverflow.com/questions/13728402/what-is-the-difference-d3-datum-vs-data
 */