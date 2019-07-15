/////////////// SVG //////////////
const margin = {top: 30, right: 30, bottom: 30, left: 30};
var width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

////////// Transdur /////////////
const durationSpan = [0, 3000];
var transDuration = 1750, schrittweite = 250;

/////// Hüllen ///////
const maxHullOpacity = 0.3;
var currHullOpacity = 0.3;

/////// Knoten ///////
var projectColorBy = "cluster";// und "researchArea"
var projectPlot = "embpoint"; // und "mappoint" (raster), "hexgrid"
const projectOpacity = 0.3;
var checkResearchArea = {};
const forschungsgebiete = topicMapping.sort((a,b) => a.field - b.field).slice(0, topicMapping.length-1);
const yearSpan = [1980, 2019];
var currYearSpan = [yearSpan[0], yearSpan[1]];
const radius = 5, nodeOpacity = 0.5;
const overshoot = radius*1.2;

function getColorByDisziplin(topic){// forschungsgebiet
  return d3.rgb(fieldsMapping.filter(f => f.field == topic.field)[0].color).brighter(1);
}

function getCircOpacity(c){
  var idx = forschungsgebiete.map(f => f.num)
    .indexOf(c.researchArea.num);
  if (idx >= 0 && idx < Object.keys(checkResearchArea).length)
    if (checkResearchArea[idx])
      return 1;
    else
      return projectOpacity;
  else {
    console.log("Forschungsgebiet des Kreises " ,c, " nicht gefunden");
    return 0;
  }
}


//////////////// Scaling ////////////////////
class Scale {
  constructor(){
    this.xScale = d3.scaleLinear()
      .domain([0, width])
      .range([0, width]);
    this.yScale = d3.scaleLinear()
      .domain([0, height])
      .range([height, 0]);
  }
  
  setDomain(vertices) {
    // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Functions/set
    this.xScale.domain([
      d3.min(getFilteredData(vertices), d => d.pos.x), d3.max(getFilteredData(vertices), d => d.pos.x)
    ]);
    this.yScale.domain([
      d3.min(getFilteredData(vertices), d => d.pos.y),
      d3.max(getFilteredData(vertices), d => d.pos.y)
    ]);
  }
}

var scale = new Scale();

/////////// Timing ///////////
var esGibtAggregatOP = false;
var esGibtExit = false;
var esGibtEnter = false;

////////// Datas ///////////
var oldDatas = [], newDatas = [];
var oldNests, newNests, transitionTable;
var oldClusters, newClusters;// {id, color, keywords}

function parseJsonToKnoten(jsonFilename){
  var isInitial = false;
  if (newDatas.length > 0) {// Transition steht bevor
    oldDatas = newDatas; //copyDatas(newDatas);
    oldNests = newNests; //new Nest(getFilteredData(oldDatas));
    oldClusters = newClusters;/*.map(function(d){
      return {id: d.id, color: d.color, keywords: d.keywords};
    });*/
  }
  else
    isInitial = true;
    
  // befüllt neue Daten
  d3.json(jsonFilename).then(function(dataset){
    newDatas = dataset.project_data.map(function(d){
      // prüft die Art der Darstellung
      var grid;
      if (projectPlot == "hexgrid")
        grid = "mappoint";
      else
        grid = projectPlot;
      // liest die Knoten ein
      var pos = new Position(d[grid][0], d[grid][1]);
      var year = Index.getRandInt(yearSpan[0], yearSpan[1]);
      var subjectArea = findSubjectAreaByProjID(d.id);
      var knoten = new Knoten(pos, d.id, d.cluster, subjectArea, year, d.words, d.title);
      return knoten;
    });
    
    if (projectPlot == "hexgrid")
      makeMappointToHexpoint();
    
    newNests = new Nest(getFilteredData(newDatas));
    
    newClusters = dataset.cluster_data.cluster_colour
      .map(function(d,i){
        return {id: i, color: d, 
          keywords: dataset.cluster_data.cluster_words[i]};
      });
    // startet Ablauf  
    if (isInitial)
      init();
    else
      startTransition();
  });
}

function getFilteredData(dataset) {
  return dataset.filter(d => d.year >= currYearSpan[0] && d.year <= currYearSpan[1]);
}

function copyDatas(dataset) {
  return dataset.map(d => d.copy());
}

function makeMappointToHexpoint(){
  // newDatas enthält die Daten
  var minHoriDist, minVertDist, uppestRow;
  var currVertDist, currHoriDist, currObersteReihe;
  // ermittelt den minimalen vertikalen und horizontalen Abstand, sowie die oberste Reihe
  for (var i=0; i < newDatas.length; i++) {// alle Knoten müssen betrachtet werden
    if (uppestRow == undefined || uppestRow < newDatas[i].pos.y)
      uppestRow = newDatas[i].pos.y;
    var j = i+1;
    while (j < newDatas.length) {
      currVertDist = Math.abs(newDatas[i].pos.y - newDatas[j].pos.y);
      //console.log('currVertDist',currVertDist,'minVertDist',minVertDist);
      if ((minVertDist == undefined || minVertDist > currVertDist) && ! Float.equal(currVertDist,0))
        minVertDist = currVertDist;
      currHoriDist = Math.abs(newDatas[i].pos.x - newDatas[j].pos.x);
      if ((minHoriDist == undefined || minHoriDist > currHoriDist) && ! Float.equal(currHoriDist,0))
        minHoriDist = currHoriDist;
      j++;
    }
  }// ende der Ermittlung
  console.log("uppestRow", uppestRow, "minVertDist", minVertDist, "minHoriDist", minHoriDist);
  // verschiebt die Knoten jeder 2. Reihe
  for (var i=0; i < newDatas.length; i++){
    var dist = uppestRow - newDatas[i].pos.y;
    if (Float.equal((dist / minVertDist) % 2, 1)) {
      newDatas[i].pos.x += minHoriDist/2;
    }
  }
}


///////////////// Zeichnet Elemente ////////////
function init(){
  ////// scaling
  scale.setDomain(newDatas);
  ////// circles
  var circSel = svg.select("g.circs").selectAll("circle.existent")
    .data(getFilteredData(newDatas), d => d.id);
  createCircs(circSel);
  svg.call(tooltipNode);
  ////// hulls
  var hullSel = svg.select("g.hulls").selectAll("path.existent")
    .data(newNests.nest, d => d.id);
  createHulls(hullSel);
  svg.call(tooltipCluster);
}


/////////////////////// UPDATE /////////////////////////
function update() {
  oldDatas = copyDatas(newDatas);
  oldNests = newNests.copy();//new Nest(getFilteredData(oldDatas));
  oldClusters = newClusters;
  
  //newDatas bleiben gleich
  newNests = new Nest(getFilteredData(newDatas));
  startTransition();
}

function startTransition() {
  var fDatas = getFilteredData(newDatas);
  ////// neu setzen, wenn Zeitspanne erweitert wurde
  newNests = new Nest(fDatas);
  var transTable = oldNests.createTransitionNests(newNests);
  
  ////// Kreise
  var circles = svg.select("g.circs").selectAll("circle.existent")
    .data(fDatas, d => d.id);
    
  ////// Prüft, welche Änderungen es gibt
  esGibtExit  = circles.exit()._groups[0]
    .map(c => c != undefined).some(b => b);
  esGibtEnter = circles.enter()._groups[0]
    .map(c => c != undefined).some(b => b);
  function gibtEsAggregateOPs(){
    if (transTable.old.nest.length != transTable.new.nest.length)
      return true;
    var ungleichheiten = false;
    transTable.old.nest.forEach(function(c,i){
      var d = transTable.new.nest[i];
      if (c.id != d.id)
        ungleichheiten = true;
      if (c.makeHulls2Path(scale) != d.makeHulls2Path(scale))
        ungleichheiten = true;
    });
    return ungleichheiten;
  }
  esGibtAggregatOP = gibtEsAggregateOPs() || !(esGibtExit && esGibtEnter);// irgendeine Änderung gibt es ja schließlich
  
  ////// Hüllen 
  var hullsOld = svg.select("g.hulls")
    .selectAll("path.existent")
    .data(transTable.old.nest, d => d.id);
    
  hullsOld.exit()// sollte es nicht geben
    .attr("class", "remove")
    .style("opacity", 0)
    .remove();
    
  hullsOld.attr("d", function(d){
    return d.makeHulls2Path(scale);
  });
  
  createHullsTransTabOld(hullsOld);
    
  ///////// Scaling
  scale.setDomain(fDatas);
  
  ///////// hier startet die Transition
  var hullsNew = svg.select("g.hulls")
    .selectAll("path.existent")
    .data(transTable.new.nest, d => d.id);
    
  deleteHullsTrans(hullsNew);
  morphHullsTrans(hullsNew);
  createHullsTransTabNew(hullsNew);
  
  d3.transition()
    .duration(getDurationOfAggregate())
    .on("end", showNewHulls);
    
  //////// Kreise
  deleteCircsTrans(circles);
  moveCircsTrans(circles);
  createCircsTrans(circles);
}

function goToAusgangszustand(){
  var fDatas = getFilteredData(oldDatas);
  var circles = svg.select("g.circs").selectAll("circle.existent")
    .data(fDatas, d => d.id);
  // scaling
  scale.setDomain(fDatas);
  // Projekte
  deleteCircs(circles);
  moveCircs(circles);
  createCircs(circles);
  // Hüllen
  var hulls = svg.select("g.hulls").selectAll("path.existent")
    .data(oldNests.nest, d => d.id);
  deleteHulls(hulls);
  morphHulls(hulls);
  createHulls(hulls);
}

function replay() {
  var t0 = d3.transition().duration(500)
    .on("start", goToAusgangszustand())
    .on("end", startTransition());
}
