var layout = d3.select("body").append("div")
  .attr("id", "layout");
  
var linkeSpalte = layout.append("div")
  .style("width", "48%")
  .style("float", "left")
  .style("text-align", "left")
  .attr("id", "linkeSpalte");

var rechteSpalte = layout.append("div")
  .style("width", "48%")
  .style("float", "right")
  .style("text-align", "left")
  .attr("id", "rechteSpalte");

/* Quellen: 
 * https://internetingishard.com/html-and-css/advanced-positioning/
 */
