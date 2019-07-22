const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);


///////////// Seite ////////////////
d3.select("div.layout")
  .append("h1")
  .text("Vielen Dank für die Teilnahme");
  
d3.select("div.layout")
  .append("p")
  .attr("name", "anweisung")
  .text("Bei den Aufgaben wurden Daten über die gewählte Animationsdauer gesammelt. Diese steht nun zum Download bereit.");

  
/////////// Buttons ///////////////
//new LinkButton(me, deleteDatas, -1, "zurück", null);

d3.select("div.layout")
  .append("button")
  .text("Daten speichern")
  .on("contextmenu", function(d) {
    d3.event.preventDefault();
  })
  .on("click", function(){
    d3.event.preventDefault();
    saveDatas();
  });
  

//new LinkButton(me, deleteAllDatas, +1, "Startseite", null);
