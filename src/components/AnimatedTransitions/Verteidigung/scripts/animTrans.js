const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);
  
//////////////// Header //////////////////
modifyHeader(me);

//////////////// Content //////////////////
linkeSpalte.append("h2").text("Definition");
linkeSpalte.append("p")
  .text("Paar visueller Zustände & ihr interpolierter Übergang");

linkeSpalte.append("h2").text("Anwendungsbeispiel");
linkeSpalte.append("p")
  .text("Programme und Betriebssysteme (siehe rechts) & versch. Branchen, z.B. im ")
  .append("a")
  .attr("href", "https://archive.nytimes.com/www.nytimes.com/interactive/2013/05/25/sunday-review/corporate-taxes.html")
  .text("Journalismus")
  .attr("target", "_blank");
  

 
  
////////// rechts
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
