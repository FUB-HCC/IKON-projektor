const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);
  
//////////////// Header //////////////////
modifyHeader(me);

//////////////// Content //////////////////  
linkeSpalte.append("h2").text("Simple Aufgaben");
linkeSpalte.append("p").text("Eine Knoten-OP & ggf. eine Hüllen-OP");
/*var auflistung = linkeSpalte.append("ul");
auflistung.append("li")
  .text("Knoten hinzufügen/entfernen");
auflistung.append("li")
  .text("Cluster hinzufügen/entfernen");
auflistung.append("li")
  .text("Bewegung inkl. Verformung");
auflistung.append("li")
  .text("Clusterwechsel inkl. Hülleninteraktion");*/
  
linkeSpalte.append("h2").text("Komplexe Aufgaben");
linkeSpalte.append("p").text("Clusterwechsel & Bewegung (2 – 3 Hüllen-OPs & ggf. Skalierung)");
/*auflistung = linkeSpalte.append("ul");
auflistung.append("li")
  .text("Cluster hinzufügen/entfernen, Verformung & Skalierung");
auflistung.append("li")
  .text("Cluster hinzufügen/entfernen, Hülleninteraktion, Verformung & ggf. Skalierung");
auflistung.append("li")
  .text("Hülleninteraktion, Verformung & Skalierung");*/

var fig = rechteSpalte.append("figure");
var bildBeschreibung = "Mögliche Auswirkungen der Benutzerinteraktionen auf die Clusteroperationen. Quelle: Eigene Darstellung";

fig.append("img")
  .attr("alt", bildBeschreibung)
  .attr("src", "../images/komplexitaet.png")
  .attr("width", "85%");
//   .attr("width", function(){
//     var sp = document.getElementById("rechteSpalte");
//     var sizes = sp.getBoundingClientRect();
//     return sizes.width;
//   });
  
fig.append("figcaption")
  .text(bildBeschreibung);
  

//////////////// Footer //////////////////  
modifyFooter(me);
