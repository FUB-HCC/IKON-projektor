//////////////// Datasets ////////////////
var idx = 0;
var randIDs = [1,2,3,4];

var oldDataset = [], newDataset = [];
var pos, id, gerade, clusterNo, researchArea, year, keywords;
var datas = [
  [[5,5,0,1], [3,4.8,0,2], [2.6,2.6,0,3], [4.3,1.7,0,4], [5.5,2,0,5]],
  [[6.5,3.6,1,6], [3.1,3.1,1,7], [5.1,6,1,8]]
];
for(var c in datas){
  for (var p in datas[c]) {
    pos = new Position(datas[c][p][0], datas[c][p][1]);
    id = datas[c][p][3];//randIDs[idx++];
    clusterNo = datas[c][p][2];
    oldDataset.push(new Knoten(pos, id, clusterNo, {}, 2019, ""));
  }
}

var oldNests = new Nest(oldDataset);
// ändert die Daten ab
var secondP = oldNests.nest[1].polygons[0];
secondP.vertices.forEach(function(k){k.clusterNo = 0;});
oldNests.nest.splice(1,1);
oldNests.nest[0].polygons.push(secondP);


idx = 0;
datas = [
  [[5,5,0,1], [3,4.8,0,2], [2.6,2.6,0,3], [4.3,1.7,0,4], [5.5,2,0,5]],
  [[6.5,3.6,1,6], [2.9,3.1,1,7], [5.1,6,1,8]]
];

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
pfade1.hull
  .attr('fill', "lightgray")
  .attr('stroke', "black")
  .style("stroke-linejoin", "round")
  .style("stroke-width", "0.5px")
  .style('opacity', 1);


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
