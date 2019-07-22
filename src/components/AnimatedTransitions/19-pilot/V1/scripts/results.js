const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);

  
/////////// Buttons ///////////////
new LinkButton(me, deleteDatas, -1, "zurück", null);

// d3.select("body")
//   .append("br");
d3.select("body")
  .append("button")
  .text("Ergebnisse")
  .on("contextmenu", function(d) {
    d3.event.preventDefault();
  })
  .on("click", function(){
    d3.event.preventDefault();
    showDatas();
  });
  

new LinkButton(me, deleteAllDatas, +1, "Startseite", null);

showResults();

function showResults(){
  var keys = Object.keys(localStorage).sort();
  var container = d3.select("body").append("div")
    .style("text-align", "left");
  
  ////////////// Name //////////////7
  container.append("h2").text(keys[0]);
  container.append("p").text(localStorage.getItem(keys[0]));
  
  //////////// Deutung ///////////
  container.append("h2").text("Deutung der Transitionen");  
  var tabelle = container.append("table");
  var head = tabelle.append("tr");
  head.append("td").append("b").text("Aufgabe");
  head.append("td").append("b").text("Deutung");
  head.append("td").append("b").text("Lösung");
  head.append("td").append("b").text("Bool");
  
  var richtige = 0;
  for (var i = 1; i < websites.length -5; i++) {
    var zeile = tabelle.append("tr");
    var deutung = localStorage.getItem(websites[i]).split(";")[1];
    var loesung = localStorage.getItem(websites[i]).split(";")[3];
    zeile.append("td").text(i)// websites[i]
    zeile.append("td").text(deutung);
    zeile.append("td").text(loesung);
    zeile.append("td").text(deutung == loesung);
    if (deutung == loesung) richtige++;
  }
  container.append("p").text("Die Anzahl der richtigen Antworten liegt bei " + richtige + "/" + (websites.length -4) + " ≈ " + d3.format(",.1f")(richtige*100/(websites.length -4)) + "%");
  
  //////////// Clusterzahl ///////////
  container.append("h2").text("Clusterzahl");
  var clusterzahl = localStorage.getItem(websites[11]).split(";");
  var clusterzahlen = [clusterzahl[1].split(",")[0], clusterzahl[1].split(",")[1], clusterzahl[3]];
  
  tabelle = container.append("table");
  head = tabelle.append("tr");
  head.append("td").append("b").text("Clusterzahlen");
  head.append("td").append("b").text("Geschätzt");
  head.append("td").append("b").text("Lösung");
  zeile = tabelle.append("tr");
  zeile.append("td").text("vorher");
  zeile.append("td").text(clusterzahlen[0]);
  zeile.append("td").text(clusterzahlen[2]);
  zeile = tabelle.append("tr");
  zeile.append("td").text("nachher");
  zeile.append("td").text(clusterzahlen[1]);
  zeile.append("td").text(clusterzahlen[2]);
  
  var abw = Math.abs(clusterzahlen[0]-clusterzahlen[2]) + Math.abs(clusterzahlen[1]-clusterzahlen[2]);
  container.append("p").text("Abweichung: " + (abw) + " ≈ " + d3.format(",.1f")(abw*100/clusterzahlen[2]) + "%");
  
  //////////// Animation ///////////
  container.append("h2").text("Animationsart");
  var animation = localStorage.getItem(websites[12]).split(";");
  
  container.append("p").text("Bevorzugte Animationsart: " + animation[1]);  
  
  //////////// Duration ///////////
  container.append("h2").text("Transitionsdauer");
  var prefDuration = localStorage.getItem(websites[13]).split(";");
  
  container.append("p").text("Bevorzugte Transitionsdauer: " + parseInt(prefDuration[1])/1000 + " s");
}
