const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);
  
//////////////// Header //////////////////
modifyHeader(me);

//////////////// Content //////////////////
  
var fig = layout.append("figure");
var bildBeschreibung = "Mögliche Auswirkungen der Benutzerinteraktionen auf die Clusteroperationen. Quelle: Eigene Darstellung";

fig.append("img")
  .attr("alt", bildBeschreibung)
  .attr("src", "../images/komplexitaet.png")
  .attr("height", "400px");
//   .attr("width", function(){
//     var sp = document.getElementById("rechteSpalte");
//     var sizes = sp.getBoundingClientRect();
//     return sizes.width;
//   });
  
fig.append("figcaption")
  .text(bildBeschreibung);

//////////////// Footer //////////////////  
modifyFooter(me);
