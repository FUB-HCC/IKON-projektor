//////////////// Datas ////////////////////
var verticesBefore = d3.range(4);
  verticesBefore[0] = [2,2];
  verticesBefore[1] = [0,2];
  verticesBefore[2] = [1,0.8];
  verticesBefore[3] = [2,0];

var verticesAfter = d3.range(4);
  verticesAfter[0] = [4,2];
  verticesAfter[1] = [2,4];
  verticesAfter[2] = [0,2];
  verticesAfter[3] = [2.4,0];

var currentVertices = "verticesBefore";

////////////////// Scaling ////////////
var xScale2 = d3.scaleLinear()
  .domain([d3.min(verticesBefore, function(d){return d[0];}), d3.max(verticesBefore, function(d){return d[0];})])
  .range([0, width]);
var yScale2 = d3.scaleLinear()
  .domain([d3.min(verticesBefore, function(d){return d[1];}), d3.max(verticesBefore, function(d){return d[1];})])
  .range([height, 0]);

//////////////// SVG ////////////////////
var svg2 = d3.select("body")
  .append("svg")
  .attr("class", "morph")
  .attr("width",  width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//////////////// Hülle ////////////////////  
var hullVertices2 = (verticesBefore.length < 3) ? verticesBefore : d3.polygonHull(verticesBefore);

var hull2 = svg2.selectAll("path.morph")
  .data([hullVertices2])
  .enter()
  .append("path")
  .attr("class", "morph")
  //.attr("d", function(d){return "M"+d.join("L")+"Z";})
  .attr("d", function(d){return "M "+
    d.map(function(d){
      return [xScale2(d[0]), yScale2(d[1])];
    }).join(" L ")+" Z";
  })
  .attr('fill', 'pink')
  .attr("fill-opacity", 0.4)
  .attr('stroke', 'pink')
  .attr('stroke-width', '10')
  .style("stroke-linejoin", "round"); // shape the line join
  // http://www.d3noob.org/2014/02/styles-in-d3js.html

///////////// Polygonzug /////////////
var polygon2 = svg2.selectAll("polygon.morph")
  .data([verticesBefore])
  .enter()
  .append("polygon")
  .attr("class", "morph")
  .attr("points", function(d){
    return d.map(function(d){
      return [xScale2(d[0]), yScale2(d[1])].join(",");
    }).join(" ");
  })
  .style("fill", "gray")
  .style("fill-opacity", 0.1)
  .style("stroke", "gray")
  .style("stroke-width", 2);
  
/////////////// Zentrum //////////////////
var center2 = d3.polygonCentroid(verticesBefore);

var circM = svg2.append("circle")
  .attr("class", "morphcenter")
  .attr("cx", function(){return xScale2(center2[0]);})
  .attr("cy", function(){return yScale2(center2[1]);})
  .attr("r",  3)
  .style("stroke", "red")
  .style("stroke-width", 2)
  .style("fill", "violet");

//////////////// Kreise ///////////////
var circs2 = svg2.selectAll("circle.morph")
  .data(verticesBefore)
  .enter()
  .append("circle")
  .attr("class", "morph")
  .attr("cx", function(d) {return xScale2(d[0]);})
  .attr("cy", function(d) {return yScale2(d[1]);})
  .attr("r",  3)
  .style("stroke", "orange")
  .style("stroke-width", 2)
  .style("fill", "yellow");
  
//////////// Axen /////////////
var xAxis2 = d3.axisBottom(xScale2);
var yAxis2 = d3.axisLeft(yScale2).ticks(6);

var xAchse2 = svg2.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis2)
  .append("text")
    .attr("transform", "translate("+width+",-10)")
    .attr("dy", ".71em")
    .style("text-anchor", "left")
    .text("x-Achse");
  
var yAchse2 = svg2.append("g")
  .attr("class", "y axis")
  .call(yAxis2)
  .append("text")
    .attr("transform", "translate(20,-12)")
    .attr("dy", ".71em")
    .style("text-anchor", "right")
    .text("y-Achse");
    
//////////////// Transition ///////////
function morph(){// toggelt den Aufruf
  if (currentVertices == "verticesBefore") {
    morph2(verticesAfter);
    currentVertices = "verticesAfter";
  }
  else {
    morph2(verticesBefore);
    currentVertices = "verticesBefore";
  }
}

function morph2(vertices){
  // aktualisiert die Scalings
  xScale2.domain([d3.min(vertices, function(d){return d[0];}),
                 d3.max(vertices, function(d){return d[0];})]);
  yScale2.domain([d3.min(vertices, function(d){return d[1];}),
                 d3.max(vertices, function(d){return d[1];})]);
  // aktualisiert die Grafiken
  var t0 = svg2.transition().duration(3000).ease(d3.easeQuadInOut);
  // --------- Kreise ---------
  circs2.exit().remove();
  circs2.data(vertices).enter();
  t0.selectAll("circle.morph")// Kreise
    .attr("cx", function(d) {return xScale2(d[0]);})
    .attr("cy", function(d) {return yScale2(d[1]);});
  // --------- Polygon ---------
  polygon2.exit().remove();
  polygon2.data([vertices]).enter();
  t0.selectAll("polygon.morph")// Polygonzug
    .attr("points", function(d){
      return d.map(function(d){
        return [xScale2(d[0]), yScale2(d[1])].join(",");
      }).join(" ");
    });
  // --------- Hülle ---------
  hull2.exit().remove();
  hull2.data([(vertices.length < 3) ? vertices : d3.polygonHull(vertices)]).enter();
  t0.selectAll("path.morph")// Hülle
    .attr("d", function(d){return "M"+d.map(function(d){return [xScale2(d[0]), yScale2(d[1])];}).join("L")+"Z";});
  // --------- Axen ---------
  t0.selectAll("g.x.axis").call(xAxis2);
  t0.selectAll("g.y.axis").call(yAxis2);
  // ----------- Zentrum -----------
  center2 = d3.polygonCentroid(vertices);
  t0.selectAll("circle.morphcenter")
    .attr("cx", function(){return xScale2(center2[0]);})
    .attr("cy", function(){return yScale2(center2[1]);});
}

/* Quellen:
 * https://github.com/d3/d3-polygon/blob/master/README.md#polygonArea
 * https://bl.ocks.org/mbostock/4341699
 * http://bl.ocks.org/hollasch/9d3c098022f5524220bd84aae7623478
 * http://bl.ocks.org/larsenmtl/39a028da44db9e8daf14578cb354b5cb
 */
