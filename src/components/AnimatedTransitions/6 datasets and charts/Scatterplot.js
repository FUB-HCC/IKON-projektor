//////////////// Dataset ///////////////
//var dataset = [[5, 20], [480, 90], [250, 50], [100, 33], [330, 95], [410, 12], [475, 44], [25, 67], [85, 21], [220, 88], [600, 150]];
//Dynamic, random dataset
var dataset = [];
var numDataPoints = 40;
var xRange = 1;
var yRange = Math.random() * 990+10;
for (var i = 0; i < numDataPoints; i++) {
    var newNumber1 = Math.random() * xRange;
    var newNumber2 = Math.round(Math.random() * yRange);
    dataset.push([newNumber1, newNumber2]);
}

//////////////// Variables ///////////////
var w = 650;
var h = 300;
var padding = 30;

//////////////// Scaling ///////////////
var xScale = d3.scaleLinear() // d3.scale.linear() mit d3.v3, weitere Skalen: identity, sqrt, pow, log, quantize, quantile, ordinal
  .domain([0, d3.max(dataset, function(d) {return d[0];})]) // nice() roundet auf 2 Nachkommastellen
  .range([padding, w-padding*2]); // rangeRound() statt range()
var yScale = d3.scaleLinear()
  .domain([0, d3.max(dataset, function(d) {return d[1];})])
  .range([h-padding, padding]); // kehrt Darst. um, sodass y nach oben größer wird
var rScale = d3.scaleLinear()
  .domain([0, d3.max(dataset, function(d) {return d[1];})])
  .range([2, 7]);

//////////////// SVG ///////////////
//Create SVG element
var svg = d3.select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);
  
//////////////// Dots ///////////////
svg.selectAll("circle")
  .data(dataset)
  .enter()
  .append("circle")
  .attr("cx", function(d) {return xScale(d[0]);})
  .attr("cy", function(d) {return yScale(d[1]);})
  .attr("r",  function(d) {return rScale(d[1]);})
  .attr("fill", "teal");
  
//////////////// Labels ///////////////  
svg.selectAll("text")
  .data(dataset)
  .enter()
  .append("text")
  .attr("x", function(d) {return xScale(d[0])+rScale(d[1]);})
  .attr("y", function(d) {return yScale(d[1])-rScale(d[1]);})
  .text(function(d) {return "("+d[0].toFixed(2)+", "+d[1]+")";})
  .attr("font-family", "sans-serif")
  .attr("font-size", "10px")
  .attr("fill", "gray");

//////////////// Axis /////////////// 
var xAxis = d3.axisBottom(xScale)
  .ticks(6)
  .tickFormat(d3.format(".1%"));
var yAxis = d3.axisLeft()
  .scale(yScale)
  .ticks(4);

svg.append("g")
  .attr("class", "axis")// "axis axis--x"
  .call(xAxis)
  .attr("transform", "translate(0," + (h-padding) + ")");
  
svg.append("g")
  .attr("class", "axis")
  .call(yAxis)
  .attr("transform", "translate(" + padding + ", 0)");



  
/* Quellen:
 * http://alignedleft.com/tutorials/d3/scales
 * 
 * 
  identity — A 1:1 scale, useful primarily for pixel values
  sqrt — A square root scale
  pow — A power scale (good for the gym)
  log — A logarithmic scale
  quantize — A linear scale with discrete values for its output range, for when you want to sort data into “buckets”
  quantile — Similar to above, but with discrete values for its input domain (when you already have “buckets”)
  ordinal — Ordinal scales use non-quantitative values (like category names) for output; perfect for comparing apples and oranges

 * */