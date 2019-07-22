//////////////// Datas ////////////////////
var vertices4 = [
  {x: 22, y: 10},
  {x: 12, y: 16},
  {x:  2, y: 20}
];
var radius4 = 5;

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
  .domain([0, d3.max(vertices4, function(d){return d.x;})])
  .range([0, width]);
var yScale4 = d3.scaleLinear()
  .domain([0, d3.max(vertices4, function(d){return d.y;})])
  .range([height, 0]);

//////////////// SVG ////////////////////
var svg4 = d3.select("body")
  .append("svg")
  .attr("width",  width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
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
var circs4 = svg4.selectAll("circle")
  .data(vertices4, function(d){return d.x*100+d.y;})
  .enter()
  .append("circle")
  .attr("cx", function(d) {return xScale4(d.x);})
  .attr("cy", function(d) {return yScale4(d.y);})
  .attr("r",  radius4)
  .style("stroke", "orange")
  .style("stroke-width", 2)
  .style("fill", "yellow")
  .style("opacity", 1);
  
////////////////// Funktionen ///////////////////
function rescale(circle,delay){
  xScale4.domain([0, d3.max(vertices4, function(d){return d.x;})]);
  yScale4.domain([0, d3.max(vertices4, function(d){return d.y;})]);
  
  var t0 = svg4.transition()
    .duration(1000)
    .ease(d3.easeQuadInOut)
    .delay(delay)
    .on("end", removeCirc(circle.exit()));
    
  t0.selectAll("g.x.axis").call(xAxis4);
  t0.selectAll("g.y.axis").call(yAxis4);
  
  t0.selectAll("circle")
    .attr("cx", function(d) {return xScale4(d.x);})
    .attr("cy", function(d) {return yScale4(d.y);});
    
//   function removeCirc(){
//     circle.exit().transition().remove();
//   }
}

function removeCirc(cOld){
  cOld.transition().delay(1000).remove();
}

function fadeCirc(circle,delay,rescalingNeeded){
  var cOld = circle.exit();
  
  cOld.style("fill", "red");
    
  cOld.transition()
    .duration(1000)
    .ease(d3.easeQuadInOut)
    .delay(delay)
    .on("end", function(){
      if (!rescalingNeeded) 
        removeCirc(cOld);
      else 
        rescale(circle,0);
    })
    .attr("r", 0)
    .style("opacity", 0);
}

function appearCirc(circle,delay){    
  var cNew = circle.enter()
    .append("circle")// create new circles needed
    .style("stroke", "orange")
    .style("stroke-width", 2)
    .style("fill", "yellow")
    .attr("r", radius4)
    .style("opacity", 0)
    .attr("cx", function(d) {return xScale4(d.x);})
    .attr("cy", function(d) {return yScale4(d.y);});
  
  cNew.transition()
    .duration(1000)
    .ease(d3.easeQuadInOut)
    .delay(delay)
    //.styleTween("opacity", function(){return d3.interpolate(0 ,1)});
    .style("opacity", 1);
}

///////////////// Button Add ////////////
buttonAdd.on("click", function(){
  var newP = {x: Math.floor(Math.random()*30),y: Math.floor(Math.random()*30)};
  
  var newPistMax = newP.x > d3.max(vertices4, function(d){return d.x}) || newP.y > d3.max(vertices4, function(d){return d.y});
  
  vertices4.push(newP);
  var circle = svg4.selectAll("circle")
    .data(vertices4, function(d){return d.x*100+d.y;});
  var delay = 0;
  
  if (newPistMax || vertices4.length == 1){
    // rescaling
    rescale(circle,0);
    delay = 1000;
  }// ende: rescaling
  
  appearCirc(circle,delay);
});// end click function

///////////////// Button Delete ////////////
buttonDel.on("click", function(){
  // entfernt ein zufälliges Element
  if (vertices4.length > 0) {
    var delIdx = Math.floor(Math.random()*vertices4.length);
    var delElem = vertices4[delIdx];
    vertices4.splice(delIdx,1);
    // https://www.w3schools.com/js/js_array_methods.asp
    
    var circle = svg4.selectAll("circle")
      .data(vertices4, function(d){return d.x*100+d.y;});
    var rescalingNeeded = delElem.x > d3.max(vertices4, function(d){return d.x}) || delElem.y > d3.max(vertices4, function(d){return d.y});  
    
    if (rescalingNeeded) {    
      fadeCirc(circle,0,rescalingNeeded);
    }
    else {
      fadeCirc(circle,0,rescalingNeeded);
    }
  }// else: keine Kreise vorhanden
});// end click function


/* Quellen:
 * http://bl.ocks.org/alansmithy/e984477a741bc56db5a5
 * https://d3indepth.com/enterexit/
 * https://stackoverflow.com/questions/10692100/invoke-a-callback-at-the-end-of-a-transition
 */
