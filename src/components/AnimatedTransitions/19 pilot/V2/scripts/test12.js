const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);

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

//////////// Animationsart /////////////  
var selection = new DropDown(d3.select("div.layout"), animCases);

//////////// Buttons /////////////
var form = d3.select("div.layout").append("form")
  .attr("class", "formular");

var timeZeroBtn = new Button(form, function(){return callAusgangszustand();}, "⊲ Startzustand");
//new LinkButton(me, deleteDatas, -1, "zurück", null);
var bereitBtn = new Button(form, function(){
  animDatas.push({animArt: animArt, dauer: transDuration});
  update();
  }, "Bereit");

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
    id = parseInt(c) * 10 + parseInt(p);
    clusterNo = datas[c][p][2];
    oldDataset.push(new Knoten(pos, id, clusterNo, {}, 2019, ""));
  }
}

var oldNests = new Nest(oldDataset);

datas = [
  [[1,9,0], [2,12,0], [5,6,0], [5.5,9.5,0]], // cluster0
  [[2,1,1], [3.8,7.7,0], [11,6,2]], // cluster1, 2 Knoten gehen
  [[8.4,7.2,2], [8,4.5,2], [9,5,2], [10,5,2], [10.7,9,2]] // cluster2
];

for(var c in datas){
  for (var p in datas[c]) {
    pos = new Position(datas[c][p][0], datas[c][p][1]);
    id = parseInt(c) * 10 + parseInt(p);
    clusterNo = datas[c][p][2];
    newDataset.push(new Knoten(pos, id, clusterNo, {}, 2019, ""));
  }
}

var newNests = new Nest(newDataset);

//////////////// Scaling ////////////////////
var scale = new Scale(oldDataset);
  scale.setDomain(oldDataset);
  
var transTable = oldNests.createTransitionNests(newNests);
  
//////////////// SVG //////////////////// 
var svg = new SVG("svg");
new Kreise (oldDataset, svg, "projekt", scale);
new Pfade (oldNests, svg, "huelle", scale)


//////////// UPDATE /////////////
function update(){// nach einmaliger Betätigung erscheinen Buttons
  transitions(svg, newDataset, newNests, transTable, scale);
  
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
    
    var result = animDatas.map(d => d.animArt + ';' + d.dauer)
      .join(';');
    var weiterBtn = new LinkButton(me, storeDatas, +1, "Zur nächsten Aufgabe ⊳", result);
  }
}

function callAusgangszustand(){
  ausgangszustand(svg, oldDataset, oldNests, scale);
}

function replay(){
  ausgangszustand(svg, oldDataset, oldNests, scale);
  transitions(svg, newDataset, newNests, transTable, scale);
//   var t0 = d3.transition().duration(0)
//     .on("end", transitions);
}
