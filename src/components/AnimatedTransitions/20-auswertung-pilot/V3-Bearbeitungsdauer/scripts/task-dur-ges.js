function drawStackedBarsGes(){
  // zeichnet eine Grafik für alle
  table = d3.select("body")
    .append("table");
  // 1. Zeile
  zeile = table.append("tr");
  zelle = zeile.append("td");
  
  // Auflistung der Einzelnen Dauern pro Aufgabe
  var svgGes = new SVG('Gesamt', zelle);
  var scaleGes = new Scale(datasetAll[0]);
      scaleGes.setDomainMidBars(datasetAll[0], personenzahl);
  var barsGes = new MyStackedBars(datasetAll[0], svgGes, scaleGes, tooltipBar, false);// false: nicht proPerson
  var axenGes = new Axen(svgGes, scaleGes, 'Aufgaben-Nr.', 'Dauer der Bearbeitung pro Person in s', 'Durchschnittl. Dauer pro Transition in s');
  var beschrGes = new Legende(svgGes, scaleGes, datasetAll[0], 'Dauer der Bearbeitung & Versuchszahl pro Aufgabe', false);// false: nicht proPerson
  //var graphenGes = new Graph(datasetAll[0], svgGes, scaleGes, favDuration);
  var gridLines = new Gridlines(svgGes, scaleGes);
    gridLines.xGrid.remove();
  
}
