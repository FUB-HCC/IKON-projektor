const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);

var idx = 0;
var randIDs = [1,4,8,2,3,6,7,0,5];

//////////////// Datasets ////////////////
var oldDataset = [], newDataset = [];
var pos, id, gerade, clusterNo, researchArea, year, keywords;
var datas = [
  [[0,7,0], [3,2,0], [4,11,0]], // cluster0
  [[9,13,1], [12,11.5,1]], // cluster1
  [[12,8,2], [10,7.2,2], [9,2,2], [3.4,4.5,2]] // cluster2
];
for(var c in datas){
  for (var p in datas[c]) {
    pos = new Position(datas[c][p][0], datas[c][p][1]);
    id = randIDs[idx++]; // 10 * parseInt(c) + parseInt(p);
    clusterNo = datas[c][p][2];
    oldDataset.push(new Knoten(pos, id, clusterNo, {}, 2019, ""));
  }
}

var oldNests = new Nest(oldDataset);

idx = 0;
datas = [
  [[9,5,1], [11,6,1], [8.8,8.1,1]], // cluster0
  [[3.5,9,1], [12,11.5,1]], // cluster1
  [[12,10,1], [8,12,1], [5,8,1], [1,5,2]] // cluster2
];

for(var c in datas){
  for (var p in datas[c]) {
    pos = new Position(datas[c][p][0], datas[c][p][1]);
    id = randIDs[idx++]; // 10 * parseInt(c) + parseInt(p);
    clusterNo = datas[c][p][2];
    newDataset.push(new Knoten(pos, id, clusterNo, {}, 2019, ""));
  }
}

var newNests = new Nest(newDataset);
  
var transTable = oldNests.createTransitionNests(newNests);
  
//////////////// Scaling ////////////////////
var scale1 = new Scale(oldDataset);
  scale1.setDomain(oldDataset);
var scale2 = new Scale(oldDataset);
  scale2.setDomain(oldDataset);

///////////// Seite ////////////////
d3.select("div.layout")
  .append("p")
  .attr("name", "nummer")
  .text(aufgabenCounter(me))
  .style("text-align", "center");

d3.select("div.layout")
  .append("h1")
  .text("Deutung der Transition " + romanize(aufgabenNr(me)));
  
d3.select("div.layout")
  .append("p")
  .attr("name", "anweisung")
  .text("Schaue dir folgende Transition an! Was passiert hier? Beschreibe es in Worten.");
  
/////////////// Schieberegeler TransDuration ///////////
var schieberegler = new Schieberegler();
  schieberegler.editSchieberegler();

//////////// Buttons /////////////
var form = d3.select("div.layout").append("form")
  .attr("class", "formular");

var timeZeroBtn = new Button(form, function(){
  return callAusgangszustand();}, "⊲ Startzustand");

var bereitBtn = new Button(form, function(){
  setStorageContent(me, transDuration);
  update();
  }, "Bereit");

/////////////// Spalten & SVG ///////////////
var links = d3.select("div.layout")
  .append("div")
  .attr("class", "spalte")
  .attr("id", "links")
  .append("p")
  .style("text-align", "center")
  .style("font-weight", "bold")
  .text("Überblendung");
  
var svg1 = new SVG("svg", d3.select("div#links"));
var kreise1 = new Kreise (oldDataset, svg1, "projekt", scale1);
var pfade1 = new Pfade (oldNests, svg1, "huelle", scale1);
  
var rechts = d3.select("div.layout")
  .append("div")
  .attr("class", "spalte")
  .attr("id", "rechts")
  .append("p")
  .style("text-align", "center")
  .style("font-weight", "bold")
  .text("Transition");

var svg2 = new SVG("svg", d3.select("div#rechts"));
var kreise2 = new Kreise (oldDataset, svg2, "projekt", scale2);
var pfade2 = new Pfade (oldNests, svg2, "huelle", scale2);


//////////// UPDATE /////////////
function update(){// nach einmaliger Betätigung erscheinen Buttons
  transitions([svg1, svg2], newDataset, newNests, transTable, [scale1, scale2]);
  
  var t0 = d3.transition()
    .delay(transDuration)
    .duration(1)
    .on("end", createForm);
    
  // Formular
  function createForm() {
    bereitBtn.btn
      .text("↻ Replay")
      .on("click", function(){
        updateStorageContent(me, transDuration);
        replay();
      });
    // https://www.toptal.com/designers/htmlarrows/arrows/
      
    d3.select("div.layout")
      .append("p")
      .attr("name", "anweisung")
      .text("Wie findest du die Animation? Was könnte man besser machen?");
    
    var weiterBtn = new LinkButton(me, function(){}, +1, "Zur nächsten Aufgabe ⊳", "");
  }
}

function callAusgangszustand(){
  ausgangszustand([svg1, svg2], oldDataset, oldNests, [scale1,scale2]);
}

function replay(){
  ausgangszustand([svg1, svg2], oldDataset, oldNests, [scale1,scale2]);
  transitions([svg1, svg2], newDataset, newNests, transTable, [scale1, scale2]);
//   var t0 = d3.transition().duration(0).on("end", transitions);
}
