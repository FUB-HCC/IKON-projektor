var logoHeight = 70;
var header = d3.select("body").append("header")
  .attr("id", "header");
  
var logoDiv = header.append("div")
  .attr("id", "logoDiv")
  .style("height", logoHeight + "px");

logoDiv.append("img")
  .attr("alt", "Logo der Freien Universität Berlin")
  .attr("src", "../images/fu-logo.png")
  .attr("height", logoHeight + "px")
  .style("float", "left")
  .style("margin-right", "10px");
  
logoDiv.append("img")
  .attr("alt", "Logo der Freien Universität Berlin")
  .attr("src", "../images/hcc-logo.png")
  .attr("height", logoHeight + "px")
  .style("float", "right")
  .style("margin-left", "10px");

header.append("div")// grau
  .style("padding", "1px 12px 0 12px")//top-right-bottom-left
  .attr("id", "menueBar");
  
var menueList = d3.select("#menueBar")
  .append("nav")
  .append("ul");


header.append("div")// grün
  .attr("id", "greenBar")
  .style("background-color", "rgb(107, 158, 31)")// CD: #9c0
  .style("text-align", "center")
  .append("h1")
  .attr("class", "greenBar")
  .attr("id", "headline")
  .text(" ")
  .style("color", "white");


function modifyHeader(site) {
  if (pagenumber(site) > 0) {
    var liste = menueList.selectAll("li")
      .data(menue)
      .enter()
      .append("li")
      .attr("class", "dropdowndiv");
    liste.append("a")
      .attr("class", "menueList")
      .style("color", function(d){
        if (d == seiten[pagenumber(site)].menue)
          return "rgb(34, 34, 34)";//gray
        else
          return "rgb(102, 102, 102)";//lightgray
      })
      .attr("href", d => d.url + ".html")
      .text(d => d.name)
      .style("float", "left");
    var dropDownList = liste.append("div")
      .attr("class", "dropdown-content");
    dropDownList.selectAll("a")// p
      .data(function(d){
        var eintrag = seiten.filter(s => s.menue.name == d.name);
        if (eintrag.length < 2)
          return [];
        else
          return eintrag;
      })
      .enter()
      .append("a")
      .text(s => s.name)
      .attr("href", s => s.url + ".html");
    // Pfeil
    liste.append("p")
      .attr("class", "arrow")
      .style("line-height", "0px")
      .style("left", function(){
        return (this.parentElement.getBoundingClientRect().right -1) + "px";
      })
      .style("top", function(){
        return (this.parentElement.getBoundingClientRect().top - 3) + "px";
      })
      .text(function(d,i){// der letzte Punkt erhält keinen Pfeil
        if (i < menue.length-1)
          return " ❭ ";
        else
          return " ";
      });
      
    ///////////////// Seitentitel //////////////
    d3.select("#headline")
      .text(seiten[pagenumber(site)].name);
  }
}
