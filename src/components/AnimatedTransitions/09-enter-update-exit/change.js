//////////////// Variables ////////////////////
var margin = {top: 30, right: 30, bottom: 40, left: 50},
  width = 600 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;
var darstellung = "";

//////////////// Datas ////////////////////
var cities = [
  {name: "Berlin", einwohnerzahl: 3613495, arbeitslosenquote: 0.076, flaeche: 891.68},
  {name: "Moskau", einwohnerzahl: 11503501, arbeitslosenquote: 0.029, flaeche: 2510},// km²
  {name: "Tokyo", einwohnerzahl: 9555919, arbeitslosenquote: 0.029, flaeche: 622},
  {name: "Istanbul", einwohnerzahl: 15029231, arbeitslosenquote: 0.125, flaeche: 5461},
  {name: "Rom", einwohnerzahl: 2873494, arbeitslosenquote: 0.1085, flaeche: 1285.306},
  {name: "Bombay", einwohnerzahl: 15414288, arbeitslosenquote: 0.035, flaeche: 603.4},
  {name: "Mexiko", einwohnerzahl: 8851080, arbeitslosenquote: 0.035, flaeche: 1495},
  {name: "NewYork", einwohnerzahl: 8537673, arbeitslosenquote: 0.039, flaeche: 1214.4},
  {name: "Conakry", einwohnerzahl: 1660973, arbeitslosenquote: 0.045, flaeche: 450},
  {name: "Sydney", einwohnerzahl: 5005400, arbeitslosenquote: 0.05, flaeche: 1664},
];

cities.sort(function(a,b){return +a.einwohnerzahl - +b.einwohnerzahl;});

//////////////// SVG ////////////////////
var svg = d3.select("body")
  .append("svg")
  .attr("class", "update-svg")
  .attr("width",  width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

//////////////// Transition /////////////////////
//var t0 = svg.transition().duration(1000).ease(d3.easeQuadInOut);

//////////////// Tooltips ////////////////////
// http://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7
var tooltip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-8, 0])
  .html(function(d) {return "Stadt: " + d.name + "<br>Fläche: " + d3.format(",r")(d.flaeche) + " km²<br> Einwohnerzahl: " + d3.format(",")(d.einwohnerzahl) + "<br>Arbeitslosenquote: " + d3.format(".1%")(d.arbeitslosenquote);});
  
svg.call(tooltip);// call the function on the selection


///////////////////////// Scaling /////////////////////////
var xScale = d3.scaleLinear()
  .domain([d3.min(cities, function(d) {return d.einwohnerzahl;}), d3.max(cities, function(d) {return d.einwohnerzahl;})])
  .range([0, width]);
var yScale = d3.scaleLinear()
  .domain([0, d3.max(cities, function(d) {return d.flaeche;})])
  .range([height, 0]);
var zScale = d3.scaleLinear()
  .domain([0, d3.max(cities, function(d){return d.arbeitslosenquote;})])
  .range([1,10]);
var nameScale = d3.scaleBand()
  .domain(cities.map(function(d) {return d.name;}))
  .range([0, width])
  .paddingInner(0.1) // 2 set padding between bands
  .paddingOuter(0.1);// 0.55
  
  
///////////////// Shapes /////////////////
var shapes = svg.append("g").attr("class", "shapes");

////////////// Diagrammzubehör //////////////
var beschriftung = svg.append("g").attr("class", "diagramtext");
  
///////////////////////// Axen /////////////////////////
var xAxis = d3.axisBottom(xScale)
  .ticks(6)
  .tickFormat(d3.formatPrefix(".0M",1e6));// https://github.com/d3/d3-format
var yAxis = d3.axisLeft()
  .scale(yScale)
  .ticks(4);
  
var xAchse = svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .style('opacity', 0)
  .call(xAxis)
  .append("text")
    .attr("class", "wo")
    .attr("transform", "translate(" + (width+margin.right) + ", 22)")
    .attr("dy", ".71em")
    .style("text-anchor", "end")// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor
    .text("Einwohnerzahl");

var yAchse = svg.append("g")
  .attr("class", "y axis")
  .style('opacity', 0)
  .call(yAxis)
  .append("text")
    .attr("class", "wo")
    .attr("transform", "translate(10,-12)")
    .attr("dy", ".71em")
    .style("text-anchor", "middle")
    .text("Fläche (km²)");

//////////////// Beschriftung ///////////////
var namen = beschriftung.selectAll("text.beschriftung")
  .data(cities)
  .enter()
  .append("text")
  .attr("class", "beschriftung")
  .style('opacity', 0)
  .style('pointer-events', 'none')
  .attr("x", function(d){return xScale(d.einwohnerzahl);})
  .attr("y", 0)
  .attr("dy", "-0.5ex")
  .style("text-anchor", "middle")
  .text(function(d){return d.name;})
  .on("mouseover", tooltip.show)
  .on("mouseout", tooltip.hide);
