const gesMeltingHullsDuration = 2000;
var numberOfHullsMelt = 4; // aktuelle Hüllenzahl
var highestIdOfNodesMelting = 0; // höchste vergebene Knoten-ID


function addNodes(n) {
  for (i=0; i <n; i++) {
    var newP = {x: getRandInt(0,100), y: getRandInt(0,100)};
    var winkel = getAngle({x:50, y:50}, newP);
    var clusterNr = Math.floor(winkel/Math.PI/2*numberOfHullsMelt);
    var node = {
      id: ++highestIdOfNodesMelting,
      x: newP.x,
      y: newP.y,
      cluster: clusterNr,
      //forschungsgebiet: forschungsgebiete[getRandInt(1,13)]
    };
    datasetMeltHulls.push(node);
  }
}

/////////////// fügt Daten hinzu /////////////////
var datasetMeltHulls = [];
addNodes(32);

var meltingGroups = d3.nest()
  // http://bl.ocks.org/donaldh/2920551
  // https://github.com/d3/d3-collection#nests
  .key(function(d) {return d.cluster;})
  .entries(datasetMeltHulls)
  .map(function(d){
    return {key: d.key, values: calculateHull(d.values)};
  });
  
function copyNest(nest) {
  return nest.map(function(e){
    return {key: e.key, values: e.values.map(function(v){
      return {x: v.x, y: v.y, id: v.id};
    })};
  });
}
  

function getKeysOfHulls() {
  return meltingGroups.map(function(d){return d.key;});
}

function getHighestIdOfNodes() {
  return d3.max(datasetMeltHulls.map(function(d){return d.id;}));
}
  


//////////////// SVG ////////////////////
var svg51 = new SVG("#svg51");

//////////////// Scaling ////////////////////
var scale51 = new Scale(datasetMeltHulls);

//////////////// Hülle ////////////////////
var hull51 = new HuellenGrau(meltingGroups, svg51.svg.select("g.hulls"), "class51", scale51, function(d){return d.key;}, tooltipCluster);

//////////////// Kreise ////////////////////
var circs51 = new Farbkreise(datasetMeltHulls, svg51.svg.select("g.circs"), "class51", scale51, function(d){return d.id;}, tooltipID, staggGroupsNumber);


//////////////// Funktionen ////////////////////

function meltHulls() {
  if (meltingGroups.length < 2)
    return null;
  // wählt 2 zufällige Cluster aus
  var idx1 = getRandInt(0, meltingGroups.length-1);
  var idx2 = getRandInt(0, meltingGroups.length-1);
  while (idx1 == idx2) // wiederholt, bis 2 verschiedene Cluster
    idx2 = getRandInt(0, meltingGroups.length-1);
  
  var oldNest = copyNest(meltingGroups);
  
  // Knoten von Cluster 1 werden zum Cluster 2 überschrieben
  var cluster1 = oldNest[idx1];
  var cluster2 = oldNest[idx2];
  var currNode;
  while (cluster1.values.length > 0)
    cluster2.values.push(cluster1.values.pop());
  oldNest = oldNest.splice(idx1, 1); // entfernt das leere Nest
  for (i=0; i < datasetMeltHulls.length; i++){
    currNode = datasetMeltHulls[i];
    if (currNode.cluster == cluster1)
      currNode.cluster = cluster2.key;
  }
  numberOfHullsMelt--;
  
  // erstelt neue Nester
  meltingGroups = d3.nest()
  // http://bl.ocks.org/donaldh/2920551
  // https://github.com/d3/d3-collection#nests
  .key(function(d) {return d.cluster;})
  .entries(datasetMeltHulls)
  .map(function(d){
    return {key: d.key, values: calculateHull(d.values)};
  });
  
  // passt die Pfade an
  var hull = svg51.svg.select("g.hulls").selectAll("path.class51")
    .data(oldNest, function(d){return d.key;});
  
  hull.exit().remove();
  hull.enter()
    .append("path")
    .attr("class", "class51")
    .attr('fill', "gray")
    .attr('stroke', "gray")
    .style("display", "initial")
    .on("mouseover", tooltipCluster.show)
    .on("mouseout", tooltipCluster.hide)
    .merge(hull)
    .attr("d", function(d){
      var hull1 = d.values.filter(function(e){return e.cluster == cluster1.key});
      var hull2 = d.values.filter(function(e){return e.cluster == cluster2.key});
      return makeHull2Path(hull1, scale51) + " " + makeHull2Path(hull2, scale51);
    });
  
  // Transition
  updateMeltHulls(oldNest, 0);// nest, delay
  
}

function divideHulls() {
  if (numberOfHullsMelt < 1)
    return null;
  // ermittelt Hülle mit den meisten Knoten
  var clusterOfMaxSize, divideHullNumber;
  var maxNodesPerHull = 0;
  for (i=0; i<meltingGroups.length; i++) {
    if (meltingGroups[i].values.length > maxNodesPerHull) {
      divideHullNumber = i;
      clusterOfMaxSize = meltingGroups[i].key;
      maxNodesPerHull = meltingGroups[i].values.length;
    }
  }
  // speichert alte Nester
  var oldNest = copyNest(meltingGroups);
  
  // teilt Knoten auf, indem sie anderen Clustern zugeordnet werden
  var divideHullNodes = meltingGroups[divideHullNumber].values;
  var highestHullID = parseInt(d3.max(getKeysOfHulls()), 10) +1;
  var midX = d3.median(divideHullNodes.map(function(d){return d.x}));
  var currNode;
  for (n=0; n<datasetMeltHulls.length; n++) {
    currNode = datasetMeltHulls[n];
    if (currNode.cluster == clusterOfMaxSize && currNode.x < midX) {
      currNode.cluster = highestHullID;
      //console.log(currNode);
    }
  }
  numberOfHullsMelt++;
  
  // verdoppelt eine Hülle mit neuem Key
  var alteHuelle = oldNest[divideHullNumber];
  oldNest.push({key: ""+highestHullID, values: copyPolygon(alteHuelle.values)});
  //console.log(oldNest);
  
  // erstelt neue Nester
  meltingGroups = d3.nest()
  // http://bl.ocks.org/donaldh/2920551
  // https://github.com/d3/d3-collection#nests
  .key(function(d) {return d.cluster;})
  .entries(datasetMeltHulls)
  .map(function(d){
    return {key: d.key, values: calculateHull(d.values)};
  });
  //console.log(meltingGroups);
  
  var hull = svg51.svg.select("g.hulls").selectAll("path.class51")
    .data(oldNest, function(d){return d.key;});
  
  hull.enter()
    .append("path")
    .attr("class", "class51")
    .attr('fill', "gray")
    .attr('stroke', "gray")
    .style("display", "initial")
    .on("mouseover", tooltipCluster.show)
    .on("mouseout", tooltipCluster.hide)
    .merge(hull)
    .attr("d", function(d){
      return makeHull2Path(d.values, scale51);}
    );
  
  // Transition
  updateMeltHulls(oldNest, 0);// nest, delay
}


function delHull(){
  var delIdx = 0;
  while (delIdx < datasetMeltHulls.length) {
    if (datasetMeltHulls[delIdx].cluster == numberOfHullsMelt-1)
      datasetMeltHulls.splice(delIdx, 1); // löscht den Knoten
    else
      delIdx++;
  }
  numberOfHullsMelt--;
  
  var oldNest = copyNest(meltingGroups);
  
  // erstelt neue Nester
  meltingGroups = d3.nest()
  // http://bl.ocks.org/donaldh/2920551
  // https://github.com/d3/d3-collection#nests
  .key(function(d) {return d.cluster;})
  .entries(datasetMeltHulls)
  .map(function(d){
    return {key: d.key, values: calculateHull(d.values)};
  });
  
  // bewegung
  var verbliebenes = updateMeltHulls(oldNest, 0);// nest, delay
  
  // skaliert neu
  scale51.domain(datasetMeltHulls);
  
  //svg51.svg.selectAll("circle.class51")
  verbliebenes.circs
    .transition().duration(gesMeltingHullsDuration)
    .delay(gesMeltingHullsDuration)
    .ease(d3.easeQuadInOut)
    .attr("cx", function(d) {return scale51.xScale(d.x);})
    .attr("cy", function(d) {return scale51.yScale(d.y);});
    
  //svg51.svg.selectAll("path.class51")
  verbliebenes.hulls
    .transition().duration(gesMeltingHullsDuration)
    .delay(gesMeltingHullsDuration)
    .ease(d3.easeQuadInOut)
    .attr("d", function(d){return makeHull2Path(d.values, scale51)});
}

function addHull() {
  var node, newP, winkel, clusterNr;
  for (i=0; i< getRandInt(3,8); i++) {
    // fügt zwischen 3 und 8 neue Punkte hinzu
    newP = {x: getRandInt(100,200), y: getRandInt(100,200)};
    winkel = getAngle({x:50, y:50}, newP);
    //clusterNr = Math.floor(winkel/Math.PI/2*numberOfHullsMelt);
    node = {
      x: newP.x,
      y: newP.y, 
      id: ++highestIdOfNodesMelting, 
      cluster: numberOfHullsMelt
    };
    datasetMeltHulls.push(node);
  }
  numberOfHullsMelt++;
  
  var oldNest = copyNest(meltingGroups);
  
  // skaliert neu
  scale51.domain(datasetMeltHulls);
  svg51.svg.selectAll("circle.class51")
    .transition().duration(gesMeltingHullsDuration)
    .ease(d3.easeQuadInOut)
    .attr("cx", function(d) {return scale51.xScale(d.x);})
    .attr("cy", function(d) {return scale51.yScale(d.y);});
  svg51.svg.selectAll("path.class51")
    .transition().duration(gesMeltingHullsDuration)
    .ease(d3.easeQuadInOut)
    .attr("d", function(d){return makeHull2Path(d.values, scale51)});
  
  // erstelt neue Nester
  meltingGroups = d3.nest()
  .key(function(d) {return d.cluster;})
  .entries(datasetMeltHulls)
  .map(function(d){
    return {key: d.key, values: calculateHull(d.values)};
  });
  // bewegung
  updateMeltHulls(oldNest, gesMeltingHullsDuration);// nest, delay
}

///////////////////// BEWEGUNG //////////////////
function updateMeltHulls(oldNest, delay) {
  // aktualisiert die Daten
  var circles = svg51.svg.select("g.circs").selectAll("circle.class51")
    .data(datasetMeltHulls, function(d){return d.id;});
  
  circles.enter()
    .append("circle")
    .attr("class", "class51")
    .attr("cx", function(d) {return scale51.xScale(d.x);})
    .attr("cy", function(d) {return scale51.yScale(d.y);})
    .attr("r", 0)
    .on("mouseover", tooltipID.show)
    .on("mouseout", tooltipID.hide)
    // https://github.com/d3/d3-scale-chromatic
    .style("stroke", function(d){return d3.rgb(colorScheme[d.id%staggGroupsNumber]).brighter(2);})// .darker(2)
    .style("fill", function(d,i){return d3.rgb(colorScheme[d.id%staggGroupsNumber]);})
    .style("opacity", 1)
    .merge(circles)
      .transition().delay(delay)
      .duration(gesMeltingHullsDuration/2)
      .ease(d3.easeBackOut.overshoot(3))
      .attr("cx", function(d) {return scale51.xScale(d.x);})
      .attr("cy", function(d) {return scale51.yScale(d.y);})
      .attr("r", radius);
      
  circles.exit()
    .transition().delay(0)
    .duration(gesMeltingHullsDuration/2)
    .ease(d3.easeBackIn.overshoot(3))
    .attr("r", 0)
    .remove();
  
  var hull = svg51.svg.select("g.hulls").selectAll("path.class51")
    .data(meltingGroups, function(d){return d.key;});
  
  hull.enter()
    .append("path")
    .attr("class", "class51")
//     .attr("d", function(d){
//       return makeHull2Path(d.values, scale51);}
//     )
    .attr('fill', "gray")
    .attr('stroke', "gray")
    .style("display", "none")//.style("opacity", 0) .style("visibility", "hidden")
    .on("mouseover", tooltipCluster.show)
    .on("mouseout", tooltipCluster.hide)
    .merge(hull)
      .transition().delay(delay)
      .duration(gesMeltingHullsDuration)
      .ease(d3.easeQuadInOut)
      .style("display", "initial")//.style("opacity", 1) .style("visibility", "initial")
      .attr("d", function(d){// d={key, values}
        var newHull = copyPolygon(d.values);
        var oldHull = oldNest.filter(function(e){
          return e.key == d.key;
        });
        if (oldHull != null && oldHull.length > 0) {
          oldHull = oldHull[0].values;
          var huellen = huellenAbgleichen(oldHull, newHull);
          if (huellen[1].length > 2)
            newHull = delUnneccessaryNodes(huellen[1]);
          else
            newHull = huellen[1];
        }
        return makeHull2Path(newHull, scale51);//d.values
      });
    
  hull.exit()
    .transition().delay(0)
    .duration(gesMeltingHullsDuration)
    .ease(d3.easeQuadInOut)
    .style("opacity", 0)// .style("display", "none")
    .remove();
  
  return {circs: circles.enter().merge(circles), hulls: hull.enter().merge(hull)};
}
