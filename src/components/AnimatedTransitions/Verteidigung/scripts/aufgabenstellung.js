const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);
  
//////////////// Header //////////////////
modifyHeader(me);

//////////////// Content //////////////////
linkeSpalte.append("h2").text("Hintergrund");

var auflistung = linkeSpalte.append("ul");
auflistung.append("li")
  .text("Forschungsprojekt IKON des HCC und Museums für Naturkunde Berlin");
auflistung.append("li")
  .text("Prototyp ohne animierte Transitionen");
auflistung.append("li")
  .text("Projekt (Knoten) als farbiger Punkt");
auflistung.append("li")
  .text("Cluster als konvexe Hülle");
auflistung.append("li")
  .text("Zeitspanne ändern, Forschungegebiete auswählen und Clusterparameter ändern");
  
linkeSpalte.append("h2").text("Aufgabe");
auflistung = linkeSpalte.append("ul");
auflistung.append("li")
  .text("Entwurf und Implementierung animierter Transitionen");
auflistung.append("li")
  .text("Evaluation in einer Pilotstudie");
  
var fig = rechteSpalte.append("figure");
var bildBeschreibung = "Ansicht des Prototypen: Clustering der Projektthemen des Museums für Naturkunde Berlin";

fig.append("a")
  .attr("href", "http://ikon-d3.s3-website.us-east-2.amazonaws.com/")
  .append("img")
  .attr("alt", bildBeschreibung)
  .attr("src", "../images/prototype-clustering.png")
  .attr("width", function(){
    var sp = document.getElementById("rechteSpalte");
    var sizes = sp.getBoundingClientRect();
    return sizes.width;
  });
  
fig.append("figcaption")
  .text(bildBeschreibung);


//////////////// Footer //////////////////  
modifyFooter(me);
