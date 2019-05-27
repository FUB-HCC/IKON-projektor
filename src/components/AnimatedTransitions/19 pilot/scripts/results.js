const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);


/////////// Buttons ///////////////
new LinkButton(me, deleteDatas, -1, "zurück", null);
new LinkButton(me, deleteAllDatas, +1, "Startseite", null);

// d3.select("body")
//   .append("br");
d3.select("body")
  .append("button")
  .text("zeige Daten")
  .on("contextmenu", function(d) {
    d3.event.preventDefault();
  })
  .on("click", function(){
    d3.event.preventDefault();
    showDatas();
  });
