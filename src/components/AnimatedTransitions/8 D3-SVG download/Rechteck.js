var width = 100;
var height = 50;
var frame = 2;
var filename = "myImage";

var svg = d3.select("#placeholder")//#placeholder
  .append("svg")
  .attr("width",  width)
  .attr("height", height)
  .attr("xmlns", "http://www.w3.org/2000/svg");
  
svg.append("rect")
  .attr("x", 0.5*frame)
  .attr("y", 0.5*frame)
  .attr("width",  width-frame)
  .attr("height", height-frame)
  .style("fill", "yellow")
  .style("stroke", "orange")
  .style("stroke-width", frame);
  
// d3.select("#download").on("click", function() {
//   d3.select(this)
//     .attr("href", 'data:application/octet-stream;base64,' + btoa(d3.select("#placeholder").html()))
//     .attr("download", filename+".svg")
//     .attr("xmlns", "http://www.w3.org/2000/svg")
//     .attr("version", "1.1")
// });

d3.select("#download")
  .attr("href", "data:image/svg+xml;charset=utf-8;base64," + 
    btoa(unescape(encodeURIComponent(
      d3.selectAll("svg")
      .attr("version", "1.1")
      .attr("xmlns", "http://www.w3.org/2000/svg")
      .node().parentNode.innerHTML)
      )
    )
  )
  .attr("download", filename+".svg");