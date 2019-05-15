//////////////// Datas ////////////////////
var vertices5 = [
  {x:  2, y: 20},
  {x:  8, y:  5},
  {x: 10, y: 10},
  {x: 22, y:  8},
];

vertices5 = uhrzeigersinn(vertices5);
var radius5 = 4;
var hullOffset5 = 30;

///////////////// Buttons //////////////
var buttonAdd5 = d3.select("body")
  .append("button")
  .text("add circle");
var buttonDel5 = d3.select("body")
  .append("button")
  .text("delete circle");
d3.select("body").append("br");

////////////////// Scaling ////////////
var xScale5 = d3.scaleLinear()
  .domain([getMinXofShapes5(), getMaxXofShapes5()])
  .range([0, width]);
var yScale5 = d3.scaleLinear()
  .domain([getMinYofShapes5(), getMaxYofShapes5()])
  .range([height, 0]);

function getMinXofShapes5(){
  return Math.min(0, d3.min(vertices5, function(d){return d.x;}));
}
function getMaxXofShapes5(){
  return d3.max(vertices5, function(d){return d.x;});
}
function getMinYofShapes5(){
  return Math.min(0, d3.min(vertices5, function(d){return d.y;}));
}
function getMaxYofShapes5(){
  return d3.max(vertices5, function(d){return d.y;});
}

//////////////// SVG ////////////////////
var svg5 = d3.select("body")
  .append("svg")
  .attr("width",  width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
//////////////// Hülle ////////////////
var hullVertices5 = calculateHull(vertices5);

//console.log(hullVertices5);

function makeHull2Path5(hullVertices) {
  var string = "M ";
  hullVertices.forEach(function(d){
    string = string + xScale5(d.x) + " " + yScale5(d.y) + " L ";
  });
  string = string.slice(0,string.length-2) + " Z";
  // console.log(string);
  return string;
}

var hullPath5 = function(d) {
    return "M " + d.map(function(p){return xScale5(p.x) + ", " + yScale5(p.y);})
    .join(" L ") + " Z";
};

var hull5 = svg5.selectAll("path.hull5")
  .data([hullVertices5])
  .enter()
  .append("path")
  .attr("class", "hull5")
  .attr("d", function(d) {return makeHull2Path5(hullVertices5);})// hullPath5
  .attr('fill', '#FFDDDD')
  .attr('stroke', '#EEBBBB')
  .style("opacity", 0.7)
  .style("paint-order", "stroke markers fill")
  .attr('stroke-width', hullOffset5)
  .style("stroke-linejoin", "round"); // shape the line join
  // http://www.d3noob.org/2014/02/styles-in-d3js.html


//////////// Axen /////////////
var xAxis5 = d3.axisBottom(xScale5);
var yAxis5 = d3.axisLeft(yScale5).ticks(6);

var xAchse5 = svg5.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis5)
  .append("text")
    .attr("transform", "translate("+width+",-10)")
    .attr("dy", ".71em")
    .style("text-anchor", "left")
    .text("x-Achse");
  
var yAchse5 = svg5.append("g")
  .attr("class", "y axis")
  .call(yAxis5)
  .append("text")
    .attr("transform", "translate(20,-12)")
    .attr("dy", ".71em")
    .style("text-anchor", "right")
    .text("y-Achse");

//////////////// Kreise ///////////////
var circs5 = svg5.selectAll("circle.c5")
  .data(vertices5, function(d){return d.x*100+d.y;})
  .enter()
  .append("circle")
  .attr("class", "c5")
  .attr("cx", function(d) {return xScale5(d.x);})
  .attr("cy", function(d) {return yScale5(d.y);})
  .attr("r",  radius5)
  .style("stroke", "orange")
  .style("stroke-width", 2)
  .style("fill", "yellow")
  .style("opacity", 1);

///////////////// Mittelpunkt ////////////
var mittelpunkt5 = schwerpunkt(vertices5);

var mitte5 = svg5.append("g")
  .attr("class", "mid5")
  .attr("transform", "translate(" + 
    (xScale5(mittelpunkt5.x)) + "," + 
    (yScale5(mittelpunkt5.y)) + ")");
  mitte5.append("line")
      .attr("x1", -radius5)
      .attr("x2", +radius5)
      .attr("y1", -radius5)
      .attr("y2", +radius5)
      .style("stroke", "red")
      .style("stroke-width", 2);
  mitte5.append("line")
      .attr("x1", -radius5)
      .attr("x2", +radius5)
      .attr("y1", +radius5)
      .attr("y2", -radius5)
      .style("stroke", "red")
      .style("stroke-width", 2);
      //.style("fill", "none");
  
////////////////// Funktionen ///////////////////
function rescale5(circle,delay,duration){
  xScale5.domain([getMinXofShapes5(), getMaxXofShapes5()]);
  yScale5.domain([getMinYofShapes5(), getMaxYofShapes5()]);
  
  var t0 = svg5.transition()
    .duration(duration)
    .ease(d3.easeQuadInOut)
    .delay(delay);
    
  t0.selectAll("g.x.axis").call(xAxis5);
  t0.selectAll("g.y.axis").call(yAxis5);
  
  t0.selectAll("circle.c5")
    .attr("cx", function(d) {return xScale5(d.x);})
    .attr("cy", function(d) {return yScale5(d.y);});
    
  t0.select("g.mid5")
    .attr("transform", "translate(" + 
      xScale5(mittelpunkt5.x) + "," + 
      yScale5(mittelpunkt5.y) + ")"
    );
  
  t0.selectAll("path.hull5")
    .attr("d", function(d) {return makeHull2Path5(hullVertices5);});// hullPath5
}

function movemittelpunkt5(delay,duration){
  mittelpunkt5 = schwerpunkt(vertices5);
  
  mitte5.transition()
    .delay(delay)
    .duration(duration)
    .ease(d3.easeQuadInOut)
    .attr("transform", "translate(" + 
      xScale5(mittelpunkt5.x) + "," + 
      yScale5(mittelpunkt5.y) + ")"
    );
}

function aktualisiereHuelle5(delay,duration) {
  // Hülle bekommt neuen Knoten und vergrößert sich oder verliert einen Knoten und verkleinert sich
  var newHull = calculateHull(vertices5); 
  var huellen = huellenAbgleichen(copyPolygon(hullVertices5), newHull);
  if (huellen[1].length > 2)
    hullVertices5 = delUnneccessaryNodes(copyPolygon(huellen[1]));
  else
    hullVertices5 = copyPolygon(huellen[1]);
  
//   var t = d3.timer(function(elapsed) {
//     var stringInterpolator = d3.interpolateString(path1, path2);
//     hull5.attr("d", function(d){
//       return stringInterpolator(elapsed/duration);
//     })
//     if (elapsed > duration) t.stop();
//   }, delay);
    
  hull5.data([huellen[0]]).enter();
  hull5.transition()
    .delay(delay)
    .duration(1)
    .attr("d", function(d){return makeHull2Path5(d);});
  // transformiert zur neuen Hülle
  hull5.data([huellen[1]]).enter();
  hull5.transition()
    .delay(delay+1)
    .duration(duration-2)
    .ease(d3.easeQuadInOut)
    .attr("d", function(d){return makeHull2Path5(d);});
  hull5.data([hullVertices5]).enter();
  hull5.transition()
    .delay(delay+1+duration-2)
    .duration(1)
    .attr("d", function(d){return makeHull2Path5(d);});
}

function appearCirc5(circle,delay,duration){    
  var cNew = circle.enter()
    .append("circle")// create new circles needed
    .attr("class", "c5")
    .style("stroke", "orange")
    .style("stroke-width", 2)
    .style("fill", "yellow")
    .attr("r", 0)
    //.style("opacity", 1)
    .attr("cx", function(d) {return xScale5(d.x);})
    .attr("cy", function(d) {return yScale5(d.y);});
  
  cNew.transition()
    .duration(duration)
    .ease(d3.easeBackOut.overshoot(5))// easeElasticOut,easeBounceOut
    .delay(delay)
    //.styleTween("opacity", function(){return d3.interpolate(0 ,1)});
    //.style("opacity", 1)
    .attr("r", radius5);
}

function rescalingNeeded5(circ){
  var scaling = circ.x < getMinXofShapes5();
  scaling = scaling || circ.x > getMaxXofShapes5();
  scaling = scaling || circ.y < getMinYofShapes5();
  return scaling || circ.y > getMaxYofShapes5();
}

function hullDiminishNeeded5(oldCircPos) {
  //return hullVertices4.includes(oldCircPos);
  var includes = false;
  hullVertices5.forEach(function(d){
    if (equalPoints(d, oldCircPos))
      includes = true;
  });
  return includes;
}

function hullExpansionNeeded5(newCircPos){
  var pos = [newCircPos.x, newCircPos.y];
  var nodes = hullVertices5.map(function(d){return [d.x, d.y];});
  return ! d3.polygonContains(nodes, pos);// hullVertices4
}

///////////////// Button Add ////////////
buttonAdd5.on("click", function(){
  var newP = {x: Math.floor(Math.random()*40),
              y: Math.floor(Math.random()*40)};
  var delay = 0;
  var rescaleNecess = rescalingNeeded5(newP);
  // fügt neues Element hinzu
  vertices5.push(newP);
  vertices5 = uhrzeigersinn(vertices5);
  
  var circle = svg5.selectAll("circle.c5")
    .data(vertices5, function(d){return d.x*100+d.y;});
  
  // rescaling if neccessary
  if (rescaleNecess || vertices5.length <= 1){
    // rescaling
    rescale5(circle,0,1000);
    delay = 1000;
  }
  
  appearCirc5(circle,delay,750);
  movemittelpunkt5(delay+750,1000);
  
  if (hullExpansionNeeded5(newP))
    aktualisiereHuelle5(delay+750, 1000);
});// end click function

///////////////// Button Delete ////////////
buttonDel5.on("click", function(){
  // entfernt ein zufälliges Element
  if (vertices5.length > 0) {
    var delIdx = Math.floor(Math.random()*vertices5.length);
    var delElem = vertices5[delIdx];
    // löscht Element
    vertices5.splice(delIdx,1);
    // https://www.w3schools.com/js/js_array_methods.asp
    
    var circle = svg5.selectAll("circle.c5")
      .data(vertices5, function(d){return d.x*100+d.y;});
    
    disappearCirc(circle.exit(),0,750);//circs, delay, duration
    movemittelpunkt5(750,1000);
    
    if (hullDiminishNeeded5(delElem)) {
      aktualisiereHuelle5(750,1000);// delay, duration
      if (rescalingNeeded5(delElem))
        rescale5(circle,1750,1000);//circs, delay, duration
    }
  }// else: keine Kreise vorhanden
});// end click function


/* Quellen:
 * http://bl.ocks.org/alansmithy/e984477a741bc56db5a5
 * https://d3indepth.com/enterexit/
 * https://stackoverflow.com/questions/10692100/invoke-a-callback-at-the-end-of-a-transition
 * https://stackoverflow.com/questions/17086415/d3-how-to-properly-chain-transitions-on-different-selections
 */
