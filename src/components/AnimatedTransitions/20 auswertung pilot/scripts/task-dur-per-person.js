function drawStackedBars() {
  d3.select("body").append("p")
    .text("Jedes Diagramm zeigt die totale Animationsdauer (y-Achse), welche die Person pro Aufgabe gewählt hat und die Zahl der abgespielten Animationen (Label auf den Stacked Bars).");
    
  var svgs = [], scales = [], bars = [], axen = [], beschr = [], graphen = [];
  
  
  function createSVG(ort){
    var index = svgs.length;
    svgs.push(new SVG(Object.keys(favDuration)[index], ort));
    scales.push(new Scale(dataset[index]));
      scales[index].setDomainStackedBars(dataset[index]);
    bars.push(new MyStackedBars(dataset[index], svgs[index], scales[index], tooltipBar, true));// true: proPerson
    axen.push(new Axen(svgs[index], scales[index], 'Aufgaben-Nr.', 'Totale Dauer in sec', 'Durchschnittl. Dauer pro Transition in sec'));
    beschr.push(new Legende(svgs[index], scales[index], dataset[index], 'Totale Dauer & Animationszahl pro Aufgabe', true));// true: proPerson
    graphen.push(new Graph(dataset[index], svgs[index], scales[index], favDuration));
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
