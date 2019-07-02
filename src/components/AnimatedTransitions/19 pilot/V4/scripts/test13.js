const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);

var idx = 0;
var randIDs = [4,8,3,1,2,6,7,5,0];

//////////////// Datasets ////////////////
var oldDataset = [], newDataset = [];
var pos, id, gerade, clusterNo, researchArea, year, keywords;
var datas = [
  [[0.5,3,0], [1,4.5,0], [2,4,0]], // cluster 0
  [[4,3,1], [5,5,1], [5.5,3.5,1]],// cluster 1
  [[3.5,0.5,2], [4.3,2,2], [6,1.5,2]] // cluster 2
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
  [[1.7,0.7,2], [2.7,4.4,1], [4,3.5,1]], // cluster 0 aufgeteilt
  [[3,3,1], [4,5,1], [4.5,3.5,1]],// cluster 1
  [[0.7,0.5,2], [1.3,2,2], [2,1.5,2]] // cluster 2
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
  .text("Wenn man 0 s als Dauer einstellt, sieht man einen statischen Wechsel der Grafik. Ansonsten sieht man links eine Überblendung und rechts die animierte Transition. Welche Animationsform bevorzugst du?");
  
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
      .text(" Welche Gründe gibt es für deine Wahl?");
    
    var weiterBtn = new LinkButton(me, function(){}, +1, "Zur nächsten Aufgabe ⊳", "");
  }
}

function callAusgangszustand(){
  ausgangszustand([svg1, svg2], oldDataset, oldNests, [scale1,scale2]);
}

function replay(){
//   ausgangszustand([svg1, svg2], oldDataset, oldNests, [scale1,scale2]);
//   transitions([svg1, svg2], newDataset, newNests, transTable, [scale1, scale2]);
  var t0 = d3.transition().duration(250)
    .on("start", function(){
      ausgangszustand([svg1, svg2], oldDataset, oldNests, [scale1,scale2]);
    })
    .on("end", function(){
      transitions([svg1, svg2], newDataset, newNests, transTable, [scale1, scale2]);
    });
}

function whoAmI(){
  return me;
}
