const gesStagingDuration = 2000;
const clusterNumber = 4;
const singleStagingDuration = gesStagingDuration/clusterNumber;

var datasetStaging = [];
for (i=0; i<32; i++) {
  var newP = {
    x: getRandInt(0,100),
    y: getRandInt(0,100)
  };
  datasetStaging.push(newP);
}

function groupingNodesStaging() {// verpasst ihnen eine ID
  var medianStaging = schwerpunkt(datasetStaging);
  var p, winkel, quadrant;
  for (i=0; i<datasetStaging.length; i++){
    p = datasetStaging[i];
    winkel = bewegungswinkel(medianStaging, p);
    quadrant = getQuadrant(winkel);
    datasetStaging[i] = {x: p.x, y: p.y, id: quadrant};
  }
}

groupingNodesStaging();

var stagingGroups = d3.nest()
  // http://bl.ocks.org/donaldh/2920551
  // https://github.com/d3/d3-collection#nests
  .key(function(d) {return d.id;})
  .entries(datasetStaging)
  .map(function(d){
    return {key: d.key , values: calculateHull(d.values)};
  });
  

function moveClusterCircles(){
  // kopiert das Nest stagingGroups, um später Hüllen abzugleichen
  var oldNest = stagingGroups.map(function(e){
    return {key: e.key, values: e.values.map(function(v){
      return {x: v.x, y: v.y, id: v.id};
    })};
  });
  var pos;
  for (i=0; i< datasetStaging.length; i++) {
    pos = datasetStaging[i];// pointer
    // verändert die Positionen
    pos.x = pos.x + getRandInt(-20, +20);
    pos.y = pos.y + getRandInt(-20, +20);
  }
  
  // erneuert auch die Nester
  stagingGroups = d3.nest()
    .key(function(d) {return d.id;})
    .entries(datasetStaging)
    .map(function(d){
      return {key: d.key , values: calculateHull(d.values)};
    });
  // ruft alle Funktionen der Testfälle auf
  moveClusterCirclesLinear(oldNest);
  moveClusterCirclesCluster(oldNest);
  moveClusterCirclesNoTrans(oldNest);
}
