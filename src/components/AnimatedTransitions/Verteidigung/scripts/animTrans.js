const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);
  
//////////////// Header //////////////////
modifyHeader(me);

//////////////// Content //////////////////
linkeSpalte.append("h2").text("In der Anwendung");

var auflistung = linkeSpalte.append("ul");
auflistung.append("li")
  .text("Programme und Betriebssysteme (siehe rechts)");
auflistung.append("li")
  .text("Verschiedene Branchen, z.B. im ")
  .append("a")
  .attr("href", "https://archive.nytimes.com/www.nytimes.com/interactive/2013/05/25/sunday-review/corporate-taxes.html")
  .text("Journalismus")
  .attr("target", "_blank");
  
linkeSpalte.append("h2").text("Für Clusteroperationen");

auflistung = linkeSpalte.append("ul");
auflistung.append("li")
  .text("Knoten: Bewegung, Clusterwechsel, Hinzufügen und Entfernen");
auflistung.append("li")
  .text("Hüllen: Bewegung, Verformung, Verschmelzung und Aufteilung, Hinzufügen und Entfernen");
  
// var fig1 = linkeSpalte.append("figure");
// var bildBeschreibung1 = "Obamas Bundeshaushaltsvorschlag im Jahr 2013 der New York Times";
// 
// fig1.append("div")
//   .style("overflow", "hidden")
//   .attr("width", function(){
//     var sp = document.getElementById("linkeSpalte");
//     var sizes = sp.getBoundingClientRect();
//     return sizes.width;
//   })
//   .attr("height", 415)
//   .append("iframe")// https://www.w3schools.com/html/html_iframe.asp
//   // https://stackoverflow.com/questions/7018379/embed-part-of-website
//   .attr("class", "scale")
//   .attr("alt", bildBeschreibung1)
//   .attr("src", "https://archive.nytimes.com/www.nytimes.com/interactive/2013/05/25/sunday-review/corporate-taxes.html#interactiveFreeFormMain")// https://archive.nytimes.com/www.nytimes.com/interactive/2012/02/13/us/politics/2013-budget-proposal-graphic.html#interactiveFreeFormMain
//   //.style("display", "hidden")
//   .style("scrolling", "no")
//   .attr("width", function(){
//     var sp = document.getElementById("linkeSpalte");
//     var sizes = sp.getBoundingClientRect();
//     return sizes.width*2;
//   })
//   .attr("height", 1600)
//   .style("margin-left", "-10px")
//   .style("margin-top", "-100px")
//   .style("margin-right", "-10px")
//   .style("margin-bottom", "-400px");
//   
// fig1.append("figcaption")
//   .text(bildBeschreibung1 + "Quelle: ")
//   .append("a").attr("href", "https://archive.nytimes.com/www.nytimes.com/interactive/2013/05/25/sunday-review/corporate-taxes.html").text("Link");
  
var fig2 = rechteSpalte.append("figure");
var bildBeschreibung2 = "Anwendung animierter Transitionen am Beispiel vom MAC OS X";

fig2.append("iframe")// https://www.w3schools.com/html/html_youtube.asp
  .attr("alt", bildBeschreibung2)
  .attr("src", "https://www.youtube.com/embed/M4hADEehlcM")
  .attr("width", function(){
    var sp = document.getElementById("rechteSpalte");
    var sizes = sp.getBoundingClientRect();
    return sizes.width;
  })
  .attr("height", 315);// https://www.w3schools.com/html/html_iframe.asp
  
fig2.append("figcaption")
  .text(bildBeschreibung2);


//////////////// Footer //////////////////  
modifyFooter(me);
