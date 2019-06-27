const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);

var idx = 0;
var randIDs = [6,1,8,5,2,10,4,0,7,3,11,9];

//////////////// Datasets ////////////////
var oldDataset = [], newDataset = [];
var pos, id, gerade, clusterNo, researchArea, year, keywords;
var datas = [
  [[2,8,0], [2.5,10,0], [4.5,7,0], [5,9,0]], // cluster0
  [[2.5,2,1], [3,5,1], [5.5,2,1]], // cluster1
  [[8,7,2], [8.2,5,2], [9.3,5.5,2], [10.5,4,2], [10,8,2]] // cluster2
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
  [[1,9,0], [2,12,0], [5,6,0], [5.5,9.5,0]], // cluster0
  [[2,1,1], [3.8,7.7,0], [11,6,2]], // cluster1, 2 Knoten gehen
  [[8.4,7.2,2], [8,4.5,2], [9,5,2], [10,5,2], [10.7,9,2]] // cluster2
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
  .text("Schaue dir folgende Transition an! Was passiert hier? Beschreibe es in Worten. Wie findest du die Animation? Was könnte man besser machen?");
  
/////////////// Schieberegeler TransDuration ///////////
var schieberegler = new Schieberegler();
  schieberegler.editSchieberegler();

//////////// Buttons /////////////
var form = d3.select("div.layout").append("form")
  .attr("class", "formular");

var timeZeroBtn = new Button(form, function(){
  return callAusgangszustand();}, "⊲ Startzustand");

var bereitBtn = new Button(form, function(){
  animDatas.push(transDuration);
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
        animDatas.push({animArt: animArt, dauer: transDuration});
        replay();
      });
    // https://www.toptal.com/designers/htmlarrows/arrows/
    
    var result = animDatas.join(';');
    var weiterBtn = new LinkButton(me, storeDatas, +1, "Zur nächsten Aufgabe ⊳", result);
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
