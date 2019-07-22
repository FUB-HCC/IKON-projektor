function drawStackedBars() {
  d3.select("body").append("p")
    .text("Jedes Diagramm zeigt die totale Animationsdauer (y-Achse), welche die Person pro Aufgabe gewählt hat und die Zahl der abgespielten Animationen (Label auf den Stacked Bars).");
    
  var svgs = [], scales = [], circles = [], axen = [], beschr = [], graphen = [], gridLines = [];
  
  function createSVG(ort){
    var index = svgs.length;
    svgs.push(new SVG(Object.keys(favDuration)[index], ort));
    scales.push(new Scale(dataset));
      scales[index].setDomainMidBars(dataset);
    graphen.push(new Graph(dataset[index], svgs[index], scales[index], favDuration));
    circles.push(new Circles(dataset[index], svgs[index], scales[index], tooltipCirc, true));// true: proPerson
    axen.push(new Axen(svgs[index], scales[index], 'Aufgaben-Nr.', 'Durchschnittliche Transitionsdauer in s', 'Durchschnittl. Dauer pro Transition in s'));
    beschr.push(new Legende(svgs[index], scales[index], dataset[index], 'Transitionsdauer pro Aufgabe & favorisierte Dauer', true));// true: proPerson
    gridLines.push(new Gridlines(svgs[index], scales[index]));
  }
  
  var table = d3.select("body")
    .append("table");
    
  // 1. Zeile
  var zeile = table.append("tr");
  var zelle = zeile.append("td");
  createSVG(zelle);
  
  zelle = zeile.append("td");
  createSVG(zelle);
  
  zelle = zeile.append("td");
  createSVG(zelle);
  
  // 2. Zeile
  zeile = table.append("tr");
  zelle = zeile.append("td");
  createSVG(zelle);
  
  zelle = zeile.append("td");
  createSVG(zelle);
  
  zelle = zeile.append("td");
  createSVG(zelle);
}
