var w = 600;
var h = 75;

var svg = d3.select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h);
  
var r4 = svg.append("rect");
var r5 = svg.append("rect")
  .attr("x", 40)
  .attr("width", 40)
  .attr("height", 40)
  .style("opacity", 0);

function initTweens() {
  r4.transition().duration(2000)
    .attrTween("x", function() { return d3.interpolate("20", "0"); })
    .attrTween("y", function() { return d3.interpolate("20", "0"); })
    .attrTween("width", function() { return d3.interpolate("0", "40"); })
    .attrTween("height", function() { return d3.interpolate("0", "40"); })
    .styleTween("fill", function() { return d3.interpolate("green", "red"); });
  r5.transition().duration(2000).delay(2000)
    .styleTween("fill", function() { return d3.interpolate("red", "green"); })
    .styleTween("opacity", function() { return d3.interpolate("0", "1"); });
  r4.transition().duration(2000).delay(3000)
    .styleTween("opacity", function() { return d3.interpolate("1", "0"); })
    .remove();
}

/* Quelle: 
 * https://bost.ocks.org/mike/transition/
*/