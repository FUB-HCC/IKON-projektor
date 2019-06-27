const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);

var idx = 0;
var randIDs = [21,18,13,3,5,20,26,12,0,14,22,25,2,15,10,16,23,19,11,1,4,24,17,7,9,8,6,27];

//////////////// Datasets ////////////////
var oldDataset = [], newDataset = [];
var pos, id, gerade, clusterNo, researchArea, year, keywords;
var datas = [
  // cluster0
  [[0.5,7,0], [1.8,6.8,0], [1,5,0], [0.9,3.7,0], [1.5,2.5,0],// 1-5
  [2,3.6,0], [2,4.5,0], [2.3,4.2,0], [3,4.1,0], [3.9,3.3,0],// 6-10
  [4,4.7,0], [3.8,5,0], [4.2,6.2,0], [5.1,4.9,0]],// 11-14
  // cluster1
  [[3,1.2,1], [2.8,3,1], [2.4,0.2,1], [3.9,0.1,1], [4,2,1],//15-19 
  [4.3,2.1,1], [5.2,1,1], [6.2,1,1]], //20-22
  // cluster2
  [[9,3.7,2], [9,5.1,2], [7.5,5,2], [8,6.2,2], [9,6.8,2], [7,6.3,2]]
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
  // cluster0
  [[0.5,6,0], [2.8,8,0], [2.6,3.7,0], [2,2.7,0], [2.1,5.1,0],// 1-5
  [0.8,4.6,0], [8,7,0], [2.3,6.5,0], [6.3,3.2,0], [5.8,6.7,0],// 6-10
  [5.2,2.7,0], [3.8,6.6,0], [5.8,7.5,0], [6.2,4.5,0]],// 11-14
  // cluster1
  [[2.5,1,1], [3.9,1.5,1], [3.7,4.5,1], [1.7,1,1], [5,4.4,1],//15-19 
  [4.3,0.9,1], [6.2,2.5,1,1], [7.6,0.2,1]], //20-22
  // cluster2
  [[8.3,6,2], [7,3.9,2], [4,5.8,2], [6.3,7.5,2], [9.5,7.7,2], [7.8,7.4,2]]
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
  .text("Transition vs. Überblendung");
  
d3.select("div.layout")
  .append("p")
  .attr("name", "anweisung")
  .text("Du hast nun oft Transition und Überblendung gleichzeitig gesehen. Welche Animationsform bevorzugst du? Welche Gründe gibt es dafür?");
  
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
