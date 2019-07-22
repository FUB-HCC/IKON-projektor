var svg = d3.select("#svgcontainer2")
  .append("svg")
  .attr("width", 500)
  .attr("height", 80);
  
var string = d3.interpolateString(
  "M 0 0 L 10 0 L 5 10 Z",
  "M 0 0 L 10 0 L 10 10 L 0 10 Z"
);

for (i=0; i<5; i++) {
  svg.append("text")
  //.attr("x", i*100)
  .attr("y", i*15)
  .attr("width",  95)
  .attr("height", 15)
  .attr("dy", "2ex")
  .style("font-family", "Verdana")
  .style("font-size", "11px")
  .style("fill", "black")
  .text(string(i/4));
}

//////////// im SVG ///////////
const datas = [
//   "M 168 205.55555555555557 L 168 370 L 0 123.33333333333334 L 0 123.33333333333334 Z  M 420 246.66666666666669 L 210 246.66666666666669 L 294 0 L 294 0 Z",
//   "M 70 0 L 70 74 L 0 111 L 0 0  Z  M 70 0 L 70 74 L 0 111 L 0 0  Z"
  "M 200 49.09262962643351 L 200 125.23051131601008 L 188.38604130223112 159.11008881722336 L 174.36893203883494 200 L 148.3548481548764 200 L 123.49514563106796 200 L 71.63097425019771 115.1275045844249 L 47.37864077669903 75.4400670578374 L 47.37864077669903 25.64962279966474 L 123.49514563106796 0 L 174.36893203883494 0 L 200 25.64962279966474  Z",
  "M 125.0485436893204 5.196982397317697 L 50.01714388538036 13.752006448814825 L -170.48543689320385 38.89354568315173 L -195.84248841515327 9.871568479932392 L -229.51456310679612 -28.667225481978193 L -134.84641174010864 -28.667225481978193 L -52.42718446601942 -28.667225481978193 L 50.04060682719912 -9.115309164448462 L 85.27042130675001 -2.393095521576072 L 115.53669742378045 3.3820235711157807 L 120.6633142301008 4.360235178140499 L 122.91306774342003 4.789511459714845  Z"
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
  .attr("width", 600)
  .attr("height", 400)
  .append("g")
  .attr("transform", "translate(300,100)");
  
var kreise = svg2.selectAll("circle.there")
  .data(datas[which].split(' ').filter(c => c != "Z" && c != "L" && c != "M").reduce(function(akk,d,i){
    if (i%2==0) {
      akk.push({x: d, y: 0});
      return akk;
    }
    else {
      akk[(i-1)/2].y = d;
      return akk;
    }
  },[]))
  .enter()
  .append("circle")
  .attr("class", "there")
  .attr("cx", d => d.x)
  .attr("cy", d => d.y)
  .attr("r", "4px")
  .attr('fill', "yellow")
  .attr('stroke', "orange")
  .attr('stroke-width', "1px");
  
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
      .transition().delay(0).duration(5000)
      .attr("d", function(d){return d})
      .style("opacity", 0.5);
  
  paths.exit()
    .transition().delay(0).duration(5000)
    .style("opacity", 0)
    .remove();
    
  var kreise = svg2.selectAll("circle.there")
  .data(datas[which].split(' ').filter(c => c != "Z" && c != "L" && c != "M").reduce(function(akk,d,i){
    if (i%2==0) {
      akk.push({x: d, y: 0});
      return akk;
    }
    else {
      akk[(i-1)/2].y = d;
      return akk;
    }
  },[]));
  
  kreise.attr("class", "there")
    .transition().delay(0).duration(5000)
    .attr("cx", d => d.x)
    .attr("cy", d => d.y);
}
