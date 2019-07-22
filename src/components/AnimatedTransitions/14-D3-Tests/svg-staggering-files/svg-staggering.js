var datasetStaggering = [];
for (i=0; i<32; i++) {
  var newP = {
    id: i,
    x: getRandInt(0,100),
    y: getRandInt(0,100)
  };
  datasetStaggering.push(newP);
}
//console.log(datasetStaggering);
const transDurationStaggCircles = 3200;
const staggGroupsNumber = 4;

var transUberdeckung = 1 / (staggGroupsNumber*2);
var singleTransDuration = transDurationStaggCircles / (1+4*(1-transUberdeckung));
var transUberdeckungsZeit = transUberdeckung * singleTransDuration;

document.getElementById("staggeringRange")
  .value = Math.floor(transUberdeckung*100);

d3.select("#staggeringRange")
  .on("change", function(){
    transUberdeckung = this.value / 100;// [0,100] -> [0,1]
    singleTransDuration = transDurationStaggCircles / (1+4*(1-transUberdeckung));
    transUberdeckungsZeit = transUberdeckung * singleTransDuration;
  });

function moveColCircles(){
  var randIdx, pos;
  for (i=0; i< datasetStaggering.length; i++) {
    pos = datasetStaggering[i];// pointer
    // verändert die Positionen
    pos.x = getRandInt(0, 100);
    pos.y = getRandInt(0, 100);
  }
  // ruft alle Funktionen der Testfälle auf
  moveColCirclesLinear();
  moveColCirclesFarbe();
  moveColCirclesRichtung();
}
