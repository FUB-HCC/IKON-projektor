//////////////// Datas ////////////////////
var vertices4 = [
  {x:  2, y: 20},
  {x:  8, y:  5},
  {x: 10, y: 10},
  {x: 22, y:  8},
];

vertices4 = uhrzeigersinn(vertices4);
var radius4 = 4;
var hullOffset = 1.5;

///////////////// Buttons //////////////
var buttonAdd = d3.select("body")
  .append("button")
  .text("add circle");
var buttonDel = d3.select("body")
  .append("button")
  .text("delete circle");
d3.select("body").append("br");

////////////////// Scaling ////////////
var xScale4 = d3.scaleLinear()
  .domain([getMinXofShapes(), getMaxXofShapes()])
  .range([0, width]);
var yScale4 = d3.scaleLinear()
  .domain([getMinYofShapes(), getMaxYofShapes()])
  .range([height, 0]);
  
function getMinXofShapes(){
  return Math.min(0, d3.min(vertices4, function(d){return d.x;}) -3*hullOffset);
}
function getMaxXofShapes(){
  return d3.max(vertices4, function(d){return d.x;}) +3*hullOffset;
}
function getMinYofShapes(){
  return Math.min(0, d3.min(vertices4, function(d){return d.y;}) -3*hullOffset);
}
function getMaxYofShapes(){
  return d3.max(vertices4, function(d){return d.y;}) +3*hullOffset;
}

//////////////// SVG ////////////////////
var svg4 = d3.select("body")
  .append("svg")
  .attr("width",  width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
//////////////// Hülle ////////////////
var hullVertices4 = calculateHull(vertices4);

//console.log(hullVertices4);
//console.log(gegenuhrzeigersinn(vertices4));

function makeHull2Path(hullVertices){
  if (hullVertices.length == 0)
    return null;
  else {
    var p = hullVertices[hullVertices.length-1];
    var string = "M ";
    if (hullVertices.length == 1) {
      return string + xScale4(p.x) + " " + yScale4(p.y) + " Z";
    }
    else {// mehr als nur 1 Punkt
      for (i=0; i < hullVertices.length-1; i++){
        p = hullVertices[i];
        if (i%3 == 0)
          string = string + xScale4(p.x) + " " + yScale4(p.y) + " Q ";
        else if ((i-1)%3 == 0)
          string = string + xScale4(p.x) + " " + yScale4(p.y) + ", ";
        else
          string = string + xScale4(p.x) + " " + yScale4(p.y) + " L ";
      }
      p = hullVertices[hullVertices.length-1];
      return string + xScale4(p.x) + " " + yScale4(p.y) + " Z";
      // https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
    }// ende else: lenght > 1
  }// ende else: lenght > 0
}

var hull4 = svg4.selectAll("path.hull4")
  .data([makeHullSmooth(hullVertices4, hullOffset)])
  .enter()
  .append("path")
  .attr("class", "hull4")
  .attr("d", function(d){return makeHull2Path(d);})
  .attr('fill', 'pink')
  .attr("fill-opacity", 0.4)
  .attr('stroke', 'pink')
  .attr('stroke-width', '3')
  .style("stroke-linejoin", "round"); // shape the line join
  // http://www.d3noob.org/2014/02/styles-in-d3js.html

//console.log(hull4);

//////////// Axen /////////////
var xAxis4 = d3.axisBottom(xScale4);
var yAxis4 = d3.axisLeft(yScale4).ticks(6);

var xAchse4 = svg4.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis4)
  .append("text")
    .attr("transform", "translate("+width+",-10)")
    .attr("dy", ".71em")
    .style("text-anchor", "left")
    .text("x-Achse");
  
var yAchse4 = svg4.append("g")
  .attr("class", "y axis")
  .call(yAxis4)
  .append("text")
    .attr("transform", "translate(20,-12)")
    .attr("dy", ".71em")
    .style("text-anchor", "right")
    .text("y-Achse");

//////////////// Kreise ///////////////
var schwerpunkt4 = schwerpunkt(vertices4);
//console.log(schwerpunkt4);
var circS4 = svg4.append("circle")
  .attr("class", "s4")
  .attr("cx", xScale4(schwerpunkt4.x))
  .attr("cy", yScale4(schwerpunkt4.y))
  .attr("r",  radius4/2)
  .style("stroke", "red")
  .style("stroke-width", 2)
  .style("fill", "red")
  .style("fill-opacity", 0.5);

//console.log(vertices4.map(function(d){return "["+d.x+","+d.y+"], "+(getAngle(schwerpunkt4,{x:d.x, y:d.y}) / Math.PI).toPrecision(2)+" PI"}));
  
var circs4 = svg4.selectAll("circle.c4")
  .data(vertices4, function(d){return d.x*100+d.y;})
  .enter()
  .append("circle")
  .attr("class", "c4")
  .attr("cx", function(d) {return xScale4(d.x);})
  .attr("cy", function(d) {return yScale4(d.y);})
  .attr("r",  radius4)
  .style("stroke", "orange")
  .style("stroke-width", 2)
  .style("fill", "yellow")
  .style("opacity", 1);
  
// var hullCcircs4 = svg4.selectAll("circle.hull4")
//   .data(makeHullSmooth(hullVertices4, hullOffset), function(d){return d.x*100+d.y;})
//   .enter()
//   .append("circle")
//   .attr("class", "hull4")
//   .attr("cx", function(d) {return xScale4(d.x);})
//   .attr("cy", function(d) {return yScale4(d.y);})
//   .attr("r",  1)
//   .style("fill", "black");
  
////////////////// Funktionen ///////////////////
function rescale(circle,delay,duration){
  xScale4.domain([getMinXofShapes(), getMaxXofShapes()]);
  yScale4.domain([getMinYofShapes(), getMaxYofShapes()]);
  
  var t0 = svg4.transition()
    .duration(duration)
    .ease(d3.easeQuadInOut)
    .delay(delay);
    
  t0.selectAll("g.x.axis").call(xAxis4);
  t0.selectAll("g.y.axis").call(yAxis4);
  
  t0.selectAll("circle.c4")
    .attr("cx", function(d) {return xScale4(d.x);})
    .attr("cy", function(d) {return yScale4(d.y);});
    
  t0.select("circle.s4")
    .attr("cx", xScale4(schwerpunkt4.x))
    .attr("cy", yScale4(schwerpunkt4.y));
  
  t0.selectAll("path.hull4")
    .attr("d", function(d){return makeHull2Path(d);});
}

function moveSchwerpunkt(delay,duration){
  schwerpunkt4 = schwerpunkt(vertices4);
  circS4.transition()
    .delay(delay)
    .duration(duration)
    .ease(d3.easeQuadInOut)
    .attr("cx", xScale4(schwerpunkt4.x))
    .attr("cy", yScale4(schwerpunkt4.y));
}

function disappearCirc(circle,delay,duration){
//   var cOld = circle.exit();
//   
  circle.transition()
    .delay(delay)
    .duration(duration)
    .ease(d3.easeBackIn.overshoot(5))
    .attr("r", 0)
    .remove();
    //.style("opacity", 0);
}

function aktualisiereHuelle(delay,duration) {
  // Hülle bekommt neuen Knoten und vergrößert sich oder verliert einen Knoten und verkleinert sich
  var newHull = calculateHull(vertices4); 
  var huellen = huellenAbgleichen(hullVertices4, newHull);
  hullVertices4 = delUnneccessaryNodes(copyPolygon(huellen[1]));
  // passt alte Hülle noch schnell an
  
  //hull4.exit().remove();
  hull4.data([makeHullSmooth(huellen[0], hullOffset)]).enter();
  hull4.transition()
    .delay(delay)
    .duration(1)
    //.attr("fill", "green")
    .attr("d", function(d){return makeHull2Path(d);});
  // transformiert zur neuen Hülle
  //hull4.exit().remove();
  hull4.data([makeHullSmooth(huellen[1], hullOffset)]).enter();
  hull4.transition()
    .delay(delay+1)
    .duration(duration-2)
    .ease(d3.easeQuadInOut)
    .attr("d", function(d){return makeHull2Path(d);})
    .attr("fill", "pink");
  hull4.data([makeHullSmooth(hullVertices4, hullOffset)]).enter();
  hull4.transition()
    .delay(delay+1+duration-2)
    .duration(1)
    //.attr("fill", "red")
    .attr("d", function(d){return makeHull2Path(d);});
}

function appearCirc(circle,delay,duration){    
  var cNew = circle.enter()
    .append("circle")// create new circles needed
    .attr("class", "c4")
    .style("stroke", "orange")
    .style("stroke-width", 2)
    .style("fill", "yellow")
    .attr("r", 0)
    //.style("opacity", 1)
    .attr("cx", function(d) {return xScale4(d.x);})
    .attr("cy", function(d) {return yScale4(d.y);});
  
  cNew.transition()
    .duration(duration)
    .ease(d3.easeBackOut.overshoot(5))// easeElasticOut,easeBounceOut
    .delay(delay)
    //.styleTween("opacity", function(){return d3.interpolate(0 ,1)});
    //.style("opacity", 1)
    .attr("r", radius4);
}

function rescalingNeeded(circPos){
  var scaling = circPos.x < getMinXofShapes();
  scaling = scaling || circPos.x > getMaxXofShapes();
  scaling = scaling || circPos.y < getMinYofShapes();
  return scaling || circPos.y > getMaxYofShapes();
}

function hullDiminishNeeded(oldCircPos) {
  //return hullVertices4.includes(oldCircPos);
  var includes = false;
  hullVertices4.forEach(function(d){
    if (equalPoints(d, oldCircPos))
      includes = true;
  });
  return includes;
}

function hullExpansionNeeded(newCircPos){
  var pos = [newCircPos.x, newCircPos.y];
  var nodes = hullVertices4.map(function(d){return [d.x, d.y];});
  return ! d3.polygonContains(nodes, pos);// hullVertices4
}

///////////////// Button Add ////////////
buttonAdd.on("click", function(){
  var newP = {x: Math.floor(Math.random()*40),
              y: Math.floor(Math.random()*40)};
  var delay = 0;
  var rescaleNecess = rescalingNeeded(newP);
  // fügt neues Element hinzu
  vertices4.push(newP);
  vertices4 = uhrzeigersinn(vertices4);
  
  var circle = svg4.selectAll("circle.c4")
    .data(vertices4, function(d){return d.x*100+d.y;});
  
  // rescaling if neccessary
  if (rescaleNecess || vertices4.length <= 1){
    // rescaling
    rescale(circle,0,1000);
    delay = 1000;
  }
  
  appearCirc(circle,delay,750);
  moveSchwerpunkt(delay+750,1000);
  
  if (hullExpansionNeeded(newP))
    aktualisiereHuelle(delay+750, 1000);
});// end click function

///////////////// Button Delete ////////////
buttonDel.on("click", function(){
  // entfernt ein zufälliges Element
  if (vertices4.length > 0) {
    var delIdx = Math.floor(Math.random()*vertices4.length);
    var delElem = vertices4[delIdx];
    // löscht Element
    vertices4.splice(delIdx,1);
    // https://www.w3schools.com/js/js_array_methods.asp
    
    var circle = svg4.selectAll("circle.c4")
      .data(vertices4, function(d){return d.x*100+d.y;});
    
    disappearCirc(circle.exit(),0,750);//circs, delay, duration
    moveSchwerpunkt(750,1000);
    
    if (hullDiminishNeeded(delElem)) {
      aktualisiereHuelle(750,1000);// delay, duration
      if (rescalingNeeded(delElem))
        rescale(circle,1750,1000);
    }
  }// else: keine Kreise vorhanden
});// end click function


/* Quellen:
 * http://bl.ocks.org/alansmithy/e984477a741bc56db5a5
 * https://d3indepth.com/enterexit/
 * https://stackoverflow.com/questions/10692100/invoke-a-callback-at-the-end-of-a-transition
 * https://stackoverflow.com/questions/17086415/d3-how-to-properly-chain-transitions-on-different-selections
 */
