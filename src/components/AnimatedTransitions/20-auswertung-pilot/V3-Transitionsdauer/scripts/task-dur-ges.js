function drawStackedBarsGes(){
  quartilList = [];
  rangeList = [];
  
  // zeichnet eine Grafik für alle
  table = d3.select("body")
    .append("table");
  // 1. Zeile
  zeile = table.append("tr");
  zelle = zeile.append("td");
  
  // Auflistung der Einzelnen Dauern pro Aufgabe
  var svgGes = new SVG('Gesamt', zelle);
  var scaleGes = new Scale(datasetAll);
      scaleGes.setDomainMidBars(datasetAll);
  var barsGes = new Circles(datasetAll[0], svgGes, scaleGes, tooltipCirc, false);// false: nicht proPerson
  var axenGes = new Axen(svgGes, scaleGes, 'Aufgaben-Nr.', 'Durchschnittliche Transitionsdauer in s', 'Durchschnittl. Dauer pro Transition in s');
  var beschrGes = new Legende(svgGes, scaleGes, datasetAll[0], 'Transitionsdauer pro Aufgabe & favorisierte Dauer', false);// false: nicht proPerson
  var graphenGes = new Graph(datasetAll[0], svgGes, scaleGes, favDuration);
  var gridLines = new Gridlines(svgGes, scaleGes);  
}
