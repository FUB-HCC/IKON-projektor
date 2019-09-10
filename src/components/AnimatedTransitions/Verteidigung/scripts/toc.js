const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);
  
//////////////// Header //////////////////
modifyHeader(me);

//////////////// Content //////////////////
var aufzahlung = d3.select("body").select("#layout")
  .append("ol").style("text-align", "left");
  
aufzahlung.selectAll("li")
  .data(menue.slice(2))// nimmt Index und TOC raus
  .enter()
  .append("li")
  .append("a")
  .attr("href", d => d.url + ".html")
  .text(d => d.name);


//////////////// Footer //////////////////  
modifyFooter(me);
