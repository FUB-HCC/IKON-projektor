//////////////// Datasets ////////////////
var idx = 0;
var randIDs = [1,2,3,4];

var oldDataset = [], newDataset = [];
var pos, id, gerade, clusterNo, researchArea, year, keywords;
var datas = [
  [[6,6,0], [8,6,0], [6,9,0], [7.8,9,0]]
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
  [[6,6,0], [8,6,0], [7.8,9,0], [6,8.5,0]]
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
var scale1 = new Scale(oldDataset);
  scale1.setDomain(oldDataset);

///////////// Seite ////////////////
d3.select("div.layout")
  .append("h1")
  .text("Limitierungen");
  
d3.select("div.layout")
  .append("p")
  .attr("name", "anweisung")
  .text("Hier sieht man, wie die Hülle sich nur unzureichend ändert.");
  
/////////////// Schieberegeler TransDuration ///////////
var schieberegler = new Schieberegler();
  schieberegler.editSchieberegler();

//////////// Buttons /////////////
var form = d3.select("div.layout").append("form")
  .attr("class", "formular");

var timeZeroBtn = new Button(form, function(){
  return callAusgangszustand();}, "⊲ Startzustand");

var bereitBtn = new Button(form, function(){
  update();
  }, "Bereit");

/////////////// SVG ///////////////  
var svg1 = new SVG("svg", d3.select("div.layout"));
var kreise1 = new Kreise (oldDataset, svg1, "projekt", scale1);
var pfade1 = new Pfade (oldNests, svg1, "huelle", scale1);


//////////// UPDATE /////////////
function update(){// nach einmaliger Betätigung erscheinen Buttons
  transitions([null,svg1], newDataset, newNests, transTable, [null, scale1]);
  
  var t0 = d3.transition()
    .delay(transDuration)
    .duration(1)
    .on("end", createForm);
    
  // Formular
  function createForm() {
    bereitBtn.btn
      .text("↻ Replay")
      .on("click", function(){
        replay();
      });
    // https://www.toptal.com/designers/htmlarrows/arrows/
    
  }
}

function callAusgangszustand(){
  ausgangszustand([null, svg1], oldDataset, oldNests, [null,scale1]);
}

function replay(){
//   var t0 = d3.transition().duration(250)
//     .on("start", function(){
      ausgangszustand([null, svg1], oldDataset, oldNests, [null,scale1]);
//     })
//     .on("end", function(){
      transitions([null, svg1], newDataset, newNests, transTable, [null, scale1]);
//    });
}
