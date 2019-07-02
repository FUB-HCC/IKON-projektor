var width = 100;
var height = 50;
var frame = 2;
var filename = "myImage";

var svg = d3.select("body")//#placeholder
  .append("svg")
  .attr("id", "figureSvg")
  .attr("width",  width)
  .attr("height", height)
  .style("float", "none")
  .attr("xmlns", "http://www.w3.org/2000/svg");
  
svg.append("rect")
  .attr("x", 0.5*frame)
  .attr("y", 0.5*frame)
  .attr("width",  width-frame)
  .attr("height", height-frame)
  .attr("fill", "yellow")
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
  
  
d3.select("body")
  .append("p")
  .text("Die Grafik kann auch per Tastendruck 'p' herunter geladen werden.");
  
  
// per Taste, ohne Button
// https://developer.mozilla.org/en-US/docs/Web/API/Document/keypress_event
document.addEventListener('keypress', speicherSVG);

function speicherSVG(keypress) {
  console.log(keypress.key);
  if (keypress.key == "p"){
    var svgElem = document.getElementById("figureSvg");    
    svgElem.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    var svgData = svgElem.outerHTML;
    var preface = '<?xml version="1.0" standalone="no"?>\r\n';
    var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "mySVG.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }
}

svg.select("rect")
  .transition().duration(10000)
  .attr("fill", "red");

/* Quellen:
 * https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
 */
