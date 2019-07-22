//////////////// Datasets ////////////////
var idx = 0;
var randIDs = [1,2,3,4,5,6,7,8,9,10,11,12];

var oldDataset = [], newDataset = [];
var pos, id, gerade, clusterNo, researchArea, year, keywords;
var datas = [
  [[5.15,1.53,1,7], [5.15,-1.44,1,8], [5.15,-4.41,1,9], [4.49,-8.87,1,10], [3.18,-8.87,1,11], [3.84,-7.38,1,6], [2.53,-4.41,1,5], [1.22,-1.44,1,12], [1.22,1.53,1,13], [3.18,0.05,1,14], [3.18,3.06,1,15], [4.49,3.06,1,16]]
];
// var datas = [
//   [[4,4,1,1],[1,4,1,4],[4,1,1,2],[1,1,1,3], [2.5,5,1,5], [2.5,0,1,6]]
// ];
var idx = 0;
for(var c in datas){
  for (var p in datas[c]) {
    pos = new Position(datas[c][p][0], datas[c][p][1]);
    id = datas[c][p][3];//randIDs[idx++];
    clusterNo = datas[c][p][2];
    oldDataset.push(new Knoten(pos, id, clusterNo, {}, 2019, ""));
  }
}
var oldNests = new Nest(oldDataset);

idx = 0;
datas = [
  [[3.22,2.75,1,1], [-4.39,0.74,1,6], [-2.11,3.76,1,2], [-5.91,4.77,1,3], [-2.87,4.77,1,5], [-1.35,4.77,1,4]]
];
// datas = [
//   [[2,1,1,2], [4,3,1,1], [0,3,1,3], [2,5,1,4], [0.5,1.5,1,6], [3.5,4.5,1,5]]
// ];

for(var c in datas){
  for (var p in datas[c]) {
    pos = new Position(datas[c][p][0], datas[c][p][1]);
    id = datas[c][p][3];//randIDs[idx++];
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
