var datasetMove = [];
for (i=0; i<50; i++) {
  var newP = {
    x: getRandInt(0,100),
    y: getRandInt(0,100)
  };
  datasetMove.push(newP);
}
const transDurationMoveCircles = 1000;

function moveCircles(){
  var randIdx, pos;
  for (i=0; i< Math.floor(Math.random()*4)+3; i++) {
    randIdx = getRandInt(0, datasetMove.length-1);
    pos = datasetMove[randIdx];// pointer
    //console.log("Punkt ["+pos.x+", "+pos.y+"] geht nach");
    // verändert die Positionen
    pos.x = getRandInt(0, 100);
    pos.y = getRandInt(0, 100);
    // normiert Positionen, damit sie nicht aus dem Feld gehen
//     pos.x = Math.min(100, Math.max(0, pos.x));
//     pos.y = Math.min(100, Math.max(0, pos.y));
  }
  // ruft alle Funktionen der Testfälle auf
  moveCirclesLinear();
  moveCirclesSISO();
  moveCirclesNoTrans();
}
