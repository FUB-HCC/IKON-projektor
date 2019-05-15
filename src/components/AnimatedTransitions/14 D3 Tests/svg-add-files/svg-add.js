var datasetAdd = [];
for (i=0; i<50; i++) {
  var newP = {
    x: getRandInt(0,100),
    y: getRandInt(0,100)
  };
  datasetAdd.push(newP);
}

const transDurationAddCirc = 750;

function addCircle(){
  var newP = {x: getRandInt(0,100),
              y: getRandInt(0,100)};
  datasetAdd.push(newP);
  // ruft alle Funktionen der Testfälle auf
  addCircleAlpha();
  addCircleRadius();
  addCircleRadiusB();
  addCircleNoTrans();
}

function delCircle(){
  var delIdx = getRandInt(0,datasetAdd.length-1);
  var delElem = datasetAdd[delIdx];
  // löscht Element
  datasetAdd.splice(delIdx,1);
  // ruft alle Funktionen der Testfälle auf
  delCircleAlpha();
  delCircleRadius();
  delCircleRadiusB();
  delCircleNoTrans();
}
