var svg = d3.select("#svgcontainer2")
  .append("svg")
  .attr("width", 500)
  .attr("height", 80);
  
var string = d3.interpolateString(
  "M 168 205.55555555555557 L 168 370 L 0 123.33333333333334 L 0 123.33333333333334 Z  M 420 246.66666666666669 L 210 246.66666666666669 L 294 0 Z",
  "M 70 0 L 70 74 L 0 111 L 0 0  Z  M 70 0 L 70 74 L 0 111 L 0 0  Z"
);

/* ----: "M 168 205.55555555555557    L 168 370   L 0 123.33333333333334  Z  M 420 246.66666666666669 L 210 246.66666666666669 L 294 0  Z"
 * 0.00: "M 168 205.55555555555557    L 168 370   L 0 123.33333333333334  L 420 246.66666666666669  Z  M 210 246.66666666666669 L 294 0 L 0 111 L 0 0  Z"
 * 0.25: "M 143.5 154.16666666666669  L 143.5 296 L 0 120.25 L 315 185    Z  M 175 185 L 238 18.5 L 0 111 L 0 0  Z"
 * 0.50: "M 119 102.77777777777779    L 119 222   L 0 117.16666666666667  L 210 123.33333333333334  Z  M 140 123.33333333333334 L 182 37 L 0 111 L 0 0  Z"
 * 0.75: "M 94.5 51.388888888888886   L 94.5 148  L 0 114.08333333333334  L 105 61.666666666666686  Z  M 105 61.666666666666686 L 126 55.5 L 0 111 L 0 0  Z"
 * 1.00: "M 70 0                      L 70 74     L 0 111                 L 0 0  Z  M 70 0 L 70 74 L 0 111 L 0 0  Z"
 * ----: "M 70 0                      L 70 74     L 0 111                 L 0 0  Z  M 70 0 L 70 74 L 0 111 L 0 0  Z"
 */

for (i=0; i<5; i++) {
  svg.append("text")
  //.attr("x", i*100)
  .attr("y", i*15)
  .attr("width",  95)
  .attr("height", 15)
  .attr("dy", "2ex")
  .style("font-family", "Verdana")
  .style("font-size", "12px")
  .style("fill", "black")
  .text(string(i/4));
}

//////////// im SVG ///////////
const datas = [
  "M 168 205.55555555555557 L 168 370 L 0 123.33333333333334 L 0 123.33333333333334 Z  M 420 246.66666666666669 L 210 246.66666666666669 L 294 0 L 294 0 Z",
  "M 70 0 L 70 74 L 0 111 L 0 0  Z  M 70 0 L 70 74 L 0 111 L 0 0  Z"
];

var which = 0;

var btn = d3.select("body")
  .append("button")
  .attr("type","button")
  .on("click", morph)
  .append("div")
  .attr("class","label")
  .text("morph");
  
d3.select("body")
  .append("br");
  
var svg2 = d3.select("body")
  .append("svg")
  .attr("width", 500)
  .attr("height", 400)
  .append("g")
  .attr("transform", "translate(20,20)");
  
var paths = svg2.selectAll("path.u")
  .data([datas[which]])
  .enter()
  .append("path")
  .attr("class", "u")
  .attr("d", function(d){return d;})
  //.attr("d", function(){return string(0);})
  .style("opacity", 0.5)
  .attr('fill', "gray")
  .attr('stroke', "gray");
  
function morph(){
  which = (which+1) % datas.length; // wechselt durch
  
  paths = svg2.selectAll("path.u")
    .data([datas[which]]);
    
  console.log(paths);
  
  paths.enter()
    .append("path")
    .attr("class", "u")
    .attr("d", function(d){return d})
    .style("opacity", 0)
    .attr('fill', "gray")
    .attr('stroke', "gray")
    .merge(paths)
      .transition().delay(1000).duration(2000)
      .attr("d", function(d){return d})
      .style("opacity", 0.5);
  
  paths.exit()
    .transition().delay(1000).duration(1000)
    .style("opacity", 0)
    .remove();
}
