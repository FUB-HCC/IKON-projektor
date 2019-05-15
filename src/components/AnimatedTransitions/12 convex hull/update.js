//////////////// Variables ////////////////////
var margin = {top: 20, right: 20, bottom: 20, left: 30},
  width = 300 - margin.left - margin.right,
  height = 200 - margin.top - margin.bottom;

//////////////// Datas ////////////////////
var vertices1;

function createvertices1(){
  var angle = d3.range(5)
    .map(function(d){
      return Math.random()*(2*Math.PI);
    }).sort(function(a,b){return b-a});// ordnet die Punkte im Uhrzeigersinn an, da die Hülle auch so verläuft

  vertices1 = angle.map(function(a){// konvexes Polygon
    var r = Math.random() * 20;
    var x = r * Math.cos(a);
    var y = r * Math.sin(a);
    return [x, y];
  });
}

createvertices1();

////////////////// Scaling ////////////
var xScale1 = d3.scaleLinear()
  .domain([d3.min(vertices1, function(d){return d[0];}), d3.max(vertices1, function(d){return d[0];})])
  .range([0, width]);
var yScale1 = d3.scaleLinear()
  .domain([d3.min(vertices1, function(d){return d[1];}), d3.max(vertices1, function(d){return d[1];})])
  .range([height, 0]);

//////////////// SVG ////////////////////
var svg1 = d3.select("body")
  .append("svg")
  .attr("class", "convexHull")
  .attr("width",  width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//////////////// Hülle ////////////////////  
//var hull1 = (vertices1.length < 3) ? vertices1 : d3.polygonHull(vertices1);

var hull1 = svg1.selectAll("path.hull")
  .data([(vertices1.length < 3) ? vertices1 : d3.polygonHull(vertices1)])
  .enter()
  .append("path")
  .attr("class", "hull")
  //.attr("d", function(d){return "M"+d.join("L")+"Z";})
  .attr("d", function(d){return "M"+d.map(function(d){return [xScale1(d[0]), yScale1(d[1])];}).join("L")+"Z";})
  .attr('fill', 'pink')
  .attr("fill-opacity", 0.4)
  .attr('stroke', 'pink')
  .attr('stroke-width', '10')
  .style("stroke-linejoin", "round"); // shape the line join
  // http://www.d3noob.org/2014/02/styles-in-d3js.html

///////////// Polygonzug /////////////
var polygon1 = svg1.selectAll("polygon")
  .data([vertices1])
  .enter()
  .append("polygon")
  .attr("points", function(d){
    return d.map(function(d){
      return [xScale1(d[0]), yScale1(d[1])].join(",");
    }).join(" ");
  })
  .style("fill", "gray")
  .style("fill-opacity", 0.1)
  .style("stroke", "gray")
  .style("stroke-width", 2);

var mid = d3.polygonCentroid(polygon1);

//////////////// Kreise ///////////////
var circs = svg1.selectAll("circle")
  .data(vertices1)
  .enter()
  .append("circle")
  .attr("cx", function(d) {return xScale1(d[0]);})
  .attr("cy", function(d) {return yScale1(d[1]);})
  .attr("r",  3)
  .style("stroke", "orange")
  .style("stroke-width", 2)
  .style("fill", "yellow");
  
//////////// Axen /////////////
var xAxis = d3.axisBottom(xScale1);
var yAxis = d3.axisLeft(yScale1).ticks(6);

var xAchse = svg1.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
  .append("text")
    .attr("transform", "translate("+width+",-10)")
    .attr("dy", ".71em")
    .style("text-anchor", "left")
    .text("x-Achse");
  
var yAchse = svg1.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
    .attr("transform", "translate(20,-12)")
    .attr("dy", ".71em")
    .style("text-anchor", "right")
    .text("y-Achse");

//////////////// Transition ///////////
function update(){
  // erstellt neue Zufallswerte
  createvertices1();
  // aktualisiert die Scalings
  xScale1.domain([d3.min(vertices1, function(d){return d[0];}), d3.max(vertices1, function(d){return d[0];})]);
  yScale1.domain([d3.min(vertices1, function(d){return d[1];}), d3.max(vertices1, function(d){return d[1];})]);
  
  // Transition
  var t0 = svg1.transition().duration(3000).ease(d3.easeQuadInOut);
  // Kreise
  circs.exit().remove();
  circs.data(vertices1).enter();
  t0.selectAll("circle")// Kreise
    .attr("cx", function(d) {return xScale1(d[0]);})
    .attr("cy", function(d) {return yScale1(d[1]);});
  // Polygonzug
  polygon1.exit().remove();
  polygon1.data([vertices1]).enter();
  t0.selectAll("polygon")// Polygonzug
    .attr("points", function(d){
      return d.map(function(d){
        return [xScale1(d[0]), yScale1(d[1])].join(",");
      }).join(" ");
    });
  // Hülle
  hull1.exit().remove();
  hull1.data([(vertices1.length < 3) ? vertices1 : d3.polygonHull(vertices1)]);
  t0.selectAll("path.hull")// Hülle
    .attr("d", function(d){return "M"+d.map(function(d){return [xScale1(d[0]), yScale1(d[1])];}).join("L")+"Z";});
  // Axen
  t0.selectAll("g.x.axis").call(xAxis);
  t0.selectAll("g.y.axis").call(yAxis);
}

/* Quellen:
 * https://github.com/d3/d3-polygon/blob/master/README.md#polygonArea
 * https://bl.ocks.org/mbostock/4341699
 * http://bl.ocks.org/hollasch/9d3c098022f5524220bd84aae7623478
 * http://bl.ocks.org/larsenmtl/39a028da44db9e8daf14578cb354b5cb
 */
