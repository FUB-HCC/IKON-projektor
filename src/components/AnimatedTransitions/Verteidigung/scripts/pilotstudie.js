const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);
  
//////////////// Header //////////////////
modifyHeader(me);

//////////////// Content //////////////////  
linkeSpalte.append("h2").text("Ziel");
var auflistung = linkeSpalte.append("ul");
auflistung.append("li")
  .text("Fragestellungen sammeln & bewerten");
auflistung.append("li")
  .text("Feedback zur Transitionsdauer, Animationsart & Hüllensichtbarkeit");
  
linkeSpalte.append("h2").text("Aufbau");
auflistung = linkeSpalte.append("ul");
auflistung.append("li")
  .text("Vergleich von Überblendung und anim. Transition");
auflistung.append("li")
  .text("Animationsdauer frei wählbar");
auflistung.append("li")
  .text("Animationen wiederholbar");
  
linkeSpalte.append("h2").text("Methode");
linkeSpalte.append("p")
  .text("Think aloud")
  .style("line-height", "0px")
  .style("margin-bottom", "30px");
  
/*linkeSpalte.append("h2").text("Teilnehmerzahl");
linkeSpalte.append("p")
  .text("sechs")
  .style("line-height", "0px");*/

var fig = rechteSpalte.append("figure");
var bildBeschreibung = "Ansicht der Pilotstudie. Quelle: Eigene Darstellung";

fig.append("img")
  .attr("alt", bildBeschreibung)
  .attr("src", "../images/pilotstudie-view.png")
  //.attr("width", "600px");
  .attr("width", function(){
    var sp = document.getElementById("rechteSpalte");
    var sizes = sp.getBoundingClientRect();
    return sizes.width;
  });
  
fig.append("figcaption")
  .text(bildBeschreibung);
  

//////////////// Footer //////////////////  
modifyFooter(me);
