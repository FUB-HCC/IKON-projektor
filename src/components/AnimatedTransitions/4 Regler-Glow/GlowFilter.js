//Adjust the spread of the glow with the simple range slider
d3.select("#glowrange").on("change", function() {// input[type=range] statt #glowrange
  d3.select(".blur").attr("stdDeviation",this.value);
});


var margin = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};

var width = window.innerWidth - margin.left - margin.right - 20;
var height = window.innerHeight - margin.top - margin.bottom - 100;
      
//SVG container
var svg = d3.select('#chart')
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .on("click", switchGlow)
  .append("g")
  .attr("class", "svgWrapper")
  .attr("transform", "translate(" + (width/2 + margin.left) + "," + (height/2 + margin.top) + ")");

var glowOn = true;
//Switch between glow filter and no filter on click
function switchGlow() {
  d3.selectAll(".exampleGlow")
    .style("filter", glowOn ? "none" : "url(#glow)");
  glowOn = glowOn ? false : true;
}
  
// Container for the gradients
var defs = svg.append("defs");

// Filter for the outside glow
var filter = defs.append("filter")
  .attr("id", "glow");// !!! important - define id to reference it later
  
filter.append("feGaussianBlur")
  .attr("class", "blur")
  .attr("stdDeviation", 4.5) // !!! important parameter - blur
  .attr("result", "coloredBlur");
  
// merge result with original image
var feMerge = filter.append("feMerge");

// first layer result of blur
feMerge.append("feMergeNode")
  .attr("in", "coloredBlur");
  
// original image on top
feMerge.append('feMergeNode')
   .attr('in', 'SourceGraphic');

