var svg = d3.select("#Shadow")
  .append("svg")
  .attr("width", 120)
  .attr("height",60);
  
var defs = svg.append("defs");

// <filter id="filter2" x="0" y="0" width="150%" height="150%">
var filter = defs.append("filter")
  .attr("id", "Schatten")// !!! important - define id to reference it later
  .attr("width", "150%")
  .attr("height", "150%");
  
// <feGaussianBlur result="blurOut" in="offOut" stdDeviation="5" />
filter.append("feGaussianBlur")
  .attr("in", "SourceAlpha")
  .attr("stdDeviation", 5) // !!! important parameter - blur
  .attr("result", "blur");

// <feOffset result="offOut" in="SourceAlpha" dx="5" dy="5" />
filter.append('feOffset')
  .attr('in', 'blur')
  .attr("dx", 5) // !!! important parameter - x-offset
  .attr("dy", 5) // !!! important parameter - y-offset
  .attr("result", "offsetBlur");
  
var feMerge = filter.append("feMerge"); // merge result with original image

// first layer result of blur and offset
feMerge.append("feMergeNode")
  .attr("in", "offsetBlur")
  
// original image on top
feMerge.append('feMergeNode')
   .attr('in', 'SourceGraphic');
  
svg.append("rect")
  .attr("width", 90)
  .attr("height", 40)
  .style("fill", "yellow")
  .style("stroke", "green")
  .style("stroke-width", 2)
  .style("filter", "url(#Schatten)");