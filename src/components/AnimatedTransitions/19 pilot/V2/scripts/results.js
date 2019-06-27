const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);


///////////// Seite ////////////////
// d3.select("div.layout")
//   .append("p")
//   .attr("name", "nummer")
//   .text(aufgabenCounter(me))
//   .style("text-align", "center");

d3.select("div.layout")
  .append("h1")
  .text("Vielen Dank für die Teilnahme");
  
// d3.select("div.layout")
//   .append("p")
//   .attr("name", "anweisung")
//   .text("Schaue dir folgende Transition an! Was passiert hier? Beschreibe es in Worten. Wie findest du die Animation? Was könnte man besser machen?");

  
/////////// Buttons ///////////////
//new LinkButton(me, deleteDatas, -1, "zurück", null);

d3.select("div.layout")
  .append("button")
  .text("Ergebnisse")
  .on("contextmenu", function(d) {
    d3.event.preventDefault();
  })
  .on("click", function(){
    d3.event.preventDefault();
    showDatas();
  });
  

//new LinkButton(me, deleteAllDatas, +1, "Startseite", null);
