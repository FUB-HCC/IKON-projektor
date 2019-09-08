/////////////// SVG //////////////
const margin = {top: 30, right: 30, bottom: 30, left: 30};
var width = 350 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;
  
class SVG {
  constructor (ort) {
    this.svg = ort.append("svg")
    .attr("id", "svg")
    .attr("width",  width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    this.svg.append("g").attr("class", "hulls");
    this.svg.append("g").attr("class", "polygonzug");
    this.svg.append("g").attr("class", "beschriftung");
    this.svg.append("g").attr("class", "circs");
  }
}

////////// Transdur /////////////
var durationSpan = [0, 3000];
var transDuration = 1750, schrittweite = 250;
var animationsart = "uberblendung";

/////// Hüllen ///////
const maxHullOpacity = 0.2, hullOffset = 29, hullColor = "#441", textSize = 12;
var currHullOpacity = 0.2;
var clusterzahl = 1;
var problemHullTrait = "anfangspunkt"; // knotenzahl, richtung
var showHullText = true, showPolygonzug = false;

/////// Knoten ///////
var projectColorBy = "cluster";// und "researchArea"
var projectPlot = "embpoint"; // und "mappoint" (raster), "hexgrid"
const projectOpacity = 0.3;
var checkResearchArea = {};
const forschungsgebiete = topicMapping.sort((a,b) => a.field - b.field).slice(0, topicMapping.length-1);
const yearSpan = [1980, 2019];
var currYearSpan = [yearSpan[0], yearSpan[1]];
var radius = 4;
const nodeOpacity = 0.5, strokeWidth = 1.2;
const overshoot = radius*1.2;
var showCircText = false;

function getColorByDisziplin(topic){// forschungsgebiet
  return d3.rgb(fieldsMapping.filter(f => f.field == topic.field)[0].color).brighter(1);
}

function getCircOpacity(c){
  if (isEmpty(c.researchArea))
    return c.alpha;// 1
  else {
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
}

//////////////// Choreo /////////////
var choreoArt = "3phase";//linear, staggered

//////////////// User-Interface Schieberegler ////////////////////
class DurationRegler {
  constructor(ort) {
    this.divTransDur = ort.append("div")
      .style("float", "left")
      //.style("min-width", "100%")
      //.style("max-width", "100px")
      .style("width", "220px")
      .style("text-align", "left");
    this.divTransDur.append("label")// von
      .attr("class", "reglerText")
      .append("text")
      .attr("id", "durVon")
      .style("margin-left", "10px")
      .style("white-space", "nowrap")
      .style("display", "inline-block")
      .text(DurationRegler.parseSec(durationSpan[0]));
    this.divTransDur.append("input")// Schieberegler
      .attr("type", "range")
      .attr("id", "transDurationIn")
      .style("width", "70%")
      .style("display", "inline-block")
      .attr("value", transDuration)
      .attr("min", durationSpan[0])
      .attr("max", durationSpan[1])
      .attr("step", schrittweite);
    this.divTransDur.append("label")// bis
      .attr("class", "reglerText")
      .append("text")
      .attr("id", "durBis")
      .style("white-space", "nowrap")// https://stackoverflow.com/questions/7300760/prevent-line-break-of-span-element/32941430
      .style("display", "inline-block")
      // https://www.computerhope.com/issues/ch001709.htm
      .text(function(){
        return DurationRegler.parseSec(durationSpan[1]);
      });
      
    document.getElementById("transDurationIn").value = transDuration;

    this.divTransDur.append("output")// wandernde Zahl
      .attr("id", "transDurationOut")
      .attr("value", DurationRegler.parseSec(transDuration))
      .text(DurationRegler.parseSec(transDuration))
      .style("text-align", "center")
      .style("position", "absolute")
      .style("left", function(){
        // elem.getBoundingClientRect() =>
        // DOMRect {x, y, width, height, top, right, bottom, left}
        // https://www.mediaevent.de/javascript/window-browserfenster.html
        var regler = document.getElementById("transDurationIn");
        var barKoordinates = regler.getBoundingClientRect();
        var scale = d3.scaleLinear()
          .domain([+regler.min, +regler.max])
          .range([barKoordinates.x +3, barKoordinates.x + barKoordinates.width -12]);
        return (scale(transDuration) -14) + "px";
      })
      .style("top", function(){
        var regler = document.getElementById("transDurationIn");
        var barKoordinates = regler.getBoundingClientRect();
        return (barKoordinates.top -12) + "px";
      });
      
    d3.select("#transDurationIn")
      .on("change", function(){// aktualisiert Variable 
        transDuration = parseInt(this.value);
      })
      .on("input", function(){// aktualisiert Zahl und Verschiebung
        var barKoordinates = this.getBoundingClientRect();
        var scale = d3.scaleLinear()
          .domain([+this.min, +this.max])
          .range([barKoordinates.x +3, barKoordinates.x + barKoordinates.width -12]);
        var barValue = +this.value;
        var textContent = DurationRegler.parseSec(barValue);
        // aktualisiert den text
        document.getElementById("transDurationOut").value = textContent;
        // aktualisiert die Position
        d3.select("#transDurationOut")
          .style("left", function(){
            return (scale(barValue) -14) + "px";
          });
      });
  }
  
  static parseSec(ms){
    return ((+ms)/1000).toString() + " s";
  }
  
  setDuration(num) {
    document.getElementById("transDurationIn").value = num;
    document.getElementById("transDurationOut")
      .value = DurationRegler.parseSec(num);
    d3.select("#transDurationOut")
      .style("left", function(){
        var regler = document.getElementById("transDurationIn");
        var barKoordinates = regler.getBoundingClientRect();
        var scale = d3.scaleLinear()
          .domain([+regler.min, +regler.max])
          .range([barKoordinates.x +3, barKoordinates.x + barKoordinates.width -12]);
        return (scale(num) -14) + "px";
      });
    transDuration = num;
  }
}

class DropdownList {
  // https://www.w3schools.com/CSS/css_dropdowns.asp
  constructor(ort, liste, text, onclickFkt){
    this.dropDownDiv = rechteSpalte.append("div")
      .attr("class", "dropdowndiv");
    this.btn = this.dropDownDiv.append("button")
      .attr("type", "button")
      .text(text)
      .attr("class", "dropbtn");
    this.dropDownList = this.dropDownDiv.append("div")
      .attr("class", "dropdown-content")
      .style("width", function(){
        return (liste.reduce(function(akk,c){
          return Math.max(c.text.length, akk);
        }, 0)*0.45+3) + "em";// anpassen
      });
    this.dropDownList.selectAll("p")
      .data(liste)
      .enter()
      .append("p")
      .text(d => d.text)
      //.style("width", "15em")
      //.style("overflow", "hidden")
      //.style("word-break", "keep-all")
      //.style("hyphens", "none")
      .on("click", function(d){onclickFkt(d)});
  }
}

///////////////////// Buttons //////////////////
class Button {
  constructor(ort, text, fkt){
    this.value = "play";
    this.btn = ort.append("button")
      .attr("class", "button")
      .attr("type", "button")// default: submit -> let's reload page
      // https://stackoverflow.com/questions/7803814/prevent-refresh-of-page-when-button-inside-form-clicked
      .text(text)
      .on("contextmenu", function(d) {
        d3.event.preventDefault();
      })
      .on("click", function(){
        fkt();
        //d3.select(this).text("↻");// Replay
      });
  }
}

//////////////// Scaling ////////////////////
function getObjectValues(obj){
  return obj._groups[0][0].getBoundingClientRect();
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
    this.xScale.range([0,width]);
    this.xScale.domain([
      d3.min(getFilteredData(vertices), d => d.pos.x), d3.max(getFilteredData(vertices), d => d.pos.x)
    ]);
    this.yScale.range([height, 0]);
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
var oldClusters = [], newClusters = [];// {id, color, keywords}

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
      var knoten = new Knoten(pos, d.id, d.cluster, subjectArea, year, d.words, d.title, d3.rgb(255,255,0), 1);
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
      init(svg, tooltipNode, oldDatas, newDatas, tooltipCluster, oldNests, newNests, scale);
    else// lieber update()?
      startTransition(svg, tooltipNode, oldDatas, newDatas, tooltipCluster, oldNests, newNests, scale);
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
function init(svg, tooltipNode, oldDatas, newDatas, tooltipCluster, oldNests, newNests, scale){
  ////// scaling
  scale.setDomain(newDatas);
  ////// circles
  var circSel = svg.select("g.circs").selectAll("circle.existent")
    .data(getFilteredData(newDatas), d => d.id);
  createCircs(circSel, tooltipNode, scale);
  svg.call(tooltipNode);
  ////// hulls
  var hullSel = svg.select("g.hulls").selectAll("path.existent")
    .data(newNests.nest, d => d.id);
  createHulls(hullSel, tooltipCluster, scale);
  svg.call(tooltipCluster);
  ////// Beschriftung
  if (showHullText) {
    var textSel = svg.select("g.beschriftung")
      .selectAll("text.existent").data(newNests.nest, d => d.id);
    createHullText(textSel, tooltipCluster, scale);
  }
  if (showCircText) {
    var circText = svg.select("g.beschriftung")
      .selectAll("text.existent")
      .data(newDatas, d => d.id);
    createCircText(circText, scale);
  }
  if (showPolygonzug) {
      var polygonzug = svg.select("g.polygonzug")
        .selectAll("path.existent")
        .data(newNests.nest, d => d.id);
      createPolygonzug(hullSel, scale);
  }
  oldDatas = newDatas;
  oldNests = newNests;
  oldClusters = newClusters;
}


/////////////////////// UPDATE /////////////////////////
function update() {
  oldDatas = copyDatas(newDatas);
  oldNests = newNests.copy();//new Nest(getFilteredData(oldDatas));
  oldClusters = newClusters;
  
  //newDatas bleiben gleich
  newNests = new Nest(getFilteredData(newDatas));///// NEU
  startTransition(svg, tooltipNode, oldDatas, newDatas, tooltipCluster, oldNests, newNests, scale);
}

/////////////////////// TRANSITIONS /////////////////////////
function startTransition(svg, tooltipNode, oldDatas, newDatas, tooltipCluster, oldNests, newNests, scale) {
  var fDatas = getFilteredData(newDatas);
  ////// neu setzen, wenn Zeitspanne erweitert wurde
  newNests = new Nest(fDatas);
  var transTable = oldNests.createTransitionNests(newNests);
  var transPolys = oldNests.createTransPolyNests(newNests);
  
  ////// Kreise
  var circles = svg.select("g.circs").selectAll("circle.existent")
    .data(fDatas, d => d.id);
    
  ////// Prüft, welche Änderungen es gibt
  esGibtExit  = circles.exit()._groups[0]
    .map(c => c != undefined).some(b => b) || oldClusters.some(c => newClusters.filter(d => d.id == c.id).length == 0) || oldNests.nest.some(c => newNests.nest.filter(d => d.id == c.id).length == 0);
  esGibtEnter = circles.enter()._groups[0]
    .map(c => c != undefined).some(b => b) || newClusters.some(c => oldClusters.filter(d => d.id == c.id).length == 0) || newNests.nest.some(c => oldNests.nest.filter(d => d.id == c.id).length == 0);
  
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
  esGibtAggregatOP = gibtEsAggregateOPs() || !esGibtExit && !esGibtEnter;// irgendeine Änderung gibt es ja schließlich
  
  console.log('taktzahl',getTakteGes());
  console.log('exit',esGibtExit, 'delay', getDelayOfExit(), 'dur', getDurationOfExit());
  console.log('agg',esGibtAggregatOP, 'delay', getDelayOfAggregate(), 'dur', getDurationOfAggregate());
  console.log('enter',esGibtEnter, 'delay', getDelayOfEnter(), 'dur', getDurationOfEnter());
  
  ////// Hüllen 
  var hullsOld = svg.select("g.hulls")
    .selectAll("path.existent")
    .data(transTable.old.nest, d => d.id);
  
  deleteHulls(hullsOld, scale);// sollte es nicht geben
  hullsOld.attr("d", d => d.makeHulls2Path(scale));
  
  ///// Polygonzug
  var polygonzugOld, polygonzugNeu;
  if (showPolygonzug) {
    polygonzugOld = svg.select("g.polygonzug")
      .selectAll("path.existent")
      .data(transPolys.old.nest, d => d.id);
    deletePolygonzugTrans(polygonzugOld, scale);
    polygonzugOld
      .attr("d", cl => cl.makeSimplePolygonzug2Path(scale));
  }   
  
  ///////// hier startet die Transition
  var hullsNew = svg.select("g.hulls")
    .selectAll("path.existent")
    .data(transTable.new.nest, d => d.id);
  
  deleteHullsTrans(hullsNew, scale);
  
  if (showHullText) {
    var hullsText = svg.select("g.beschriftung")
      .selectAll("text.existent")
      .data(newNests.nest, d => d.id);
    deleteHullTextTrans(hullsText, scale);
  }
    
  if (showPolygonzug) {
    polygonzugNeu = svg.select("g.polygonzug")
      .selectAll("path.existent")
      .data(transPolys.new.nest, d => d.id);
    deletePolygonzugTrans(polygonzugNeu, scale);
  }
  
  ///////// Scaling
  scale.setDomain(fDatas);
  
  morphHullsTrans(hullsNew, scale);
  createHullsTransTabNew(hullsNew, tooltipCluster, scale);
  
  if (showPolygonzug) {
    morphPolygonzugTrans(polygonzugNeu, scale);
    createPolygonzugTrans(polygonzugNeu, scale);
  }
  
  d3.transition()
    .delay(getDelayOfAggregate())
    .duration(getDurationOfAggregate())
    .on("end", function(){showNewHulls(svg, newNests, scale);});
  
  if (showHullText) {
    moveHullTextTrans(hullsText, scale);
    createHullTextTrans(hullsText, tooltipCluster, scale);
  }
  
  //////// Kreise
  deleteCircsTrans(circles, scale);
  moveCircsTrans(circles, scale);
  createCircsTrans(circles, tooltipNode, scale);
  
  if (showCircText) {
    var circText = svg.select("g.beschriftung")
      .selectAll("text.existent")
      .data(newDatas, d => d.id);
    deleteCircTextTrans(circText, scale);
    moveCircTextTrans(circText, scale);
    createCircTextTrans(circText, scale);
  }
}





function simpleTransition(svg, tooltipNode, oldDatas, newDatas, tooltipCluster, oldNests, newNests, scale) {  
  ////// Daten
  var circles = svg.select("g.circs").selectAll("circle.existent")
    .data(newDatas, d => d.id);
  var hulls = svg.select("g.hulls").selectAll("path.existent")
    .data(newNests.nest, d => d.id);
  if (showCircText)
    var circText = svg.select("g.beschriftung")
      .selectAll("text.existent")
      .data(newDatas, d => d.id);
  if (showHullText)
    var hullsText = svg.select("g.beschriftung")
      .selectAll("text.existent")
      .data(newNests.nest, d => d.id);
  if (showPolygonzug)
    var polygonzug = svg.select("g.polygonzug")
      .selectAll("path.existent")
      .data(newNests.nest, d => d.id);
    
  ////// Prüft, welche Änderungen es gibt
  esGibtExit  = circles.exit()._groups[0]
    .map(c => c != undefined).some(b => b) || oldNests.nest.some(c => newNests.nest.filter(d => d.id == c.id).length == 0);
  
  esGibtEnter = circles.enter()._groups[0]
    .map(c => c != undefined).some(b => b) || newNests.nest.some(c => oldNests.nest.filter(d => d.id == c.id).length == 0);
  
  function gibtEsAggregateOPs(){
    if (oldNests.nest.length != newNests.nest.length)
      return true;
    var ungleichheiten = false;
    oldNests.nest.forEach(function(c,i){
      var d = newNests.nest[i];
      if (c.id != d.id)
        ungleichheiten = true;
      if (c.makeSimplePolygonzug2Path(scale) != d.makeSimplePolygonzug2Path(scale))
        ungleichheiten = true;
    });
    return ungleichheiten;
  }
  esGibtAggregatOP = gibtEsAggregateOPs() || !esGibtExit && !esGibtEnter;// irgendeine Änderung gibt es ja schließlich
    
  console.log('taktzahl',getTakteGes());
  console.log('exit',esGibtExit, 'delay', getDelayOfExit(), 'dur', getDurationOfExit());
  console.log('agg',esGibtAggregatOP, 'delay', getDelayOfAggregate(), 'dur', getDurationOfAggregate());
  console.log('enter',esGibtEnter, 'delay', getDelayOfEnter(), 'dur', getDurationOfEnter());
  
  //// Exit
  deleteCircsTrans(circles, scale);
  deleteHullsTrans(hulls, scale);
  if (showHullText)
    deleteHullTextTrans(hullsText, scale);
  if (showCircText)
    deleteCircTextTrans(circText, scale);
  if (showPolygonzug)
    deletePolygonzugTrans(polygonzug, scale);
  
  ///////// Scaling + Update
  scale.setDomain(newDatas);
  moveCircsTrans(circles, scale);
  morphSimpleHullsTrans(hulls, scale);
  if (showHullText)
    moveHullTextTrans(hullsText, scale);
  if (showCircText)
    moveCircTextTrans(circText, scale);
  if (showPolygonzug)
    morphPolygonzugTrans(polygonzug, scale);
  
  //// Enter
  createCircsTrans(circles, tooltipNode, scale);
  createSimpleHullsTrans(hulls, tooltipCluster, scale);
  if (showHullText)
    createHullTextTrans(hullsText, tooltipCluster, scale);
  if (showCircText)
    createCircTextTrans(circText, scale);
  if (showPolygonzug)
    createPolygonzugTrans(polygonzug, scale);
}






function goToAusgangszustand(svg, tooltipNode, oldDatas, newDatas, tooltipCluster, oldNests, newNests, scale){
  var fDatas = getFilteredData(oldDatas);
  var tmp = newClusters;
  newClusters = oldClusters;
  var circles = svg.select("g.circs").selectAll("circle.existent")
    .data(fDatas, d => d.id);
    
  // scaling
  scale.setDomain(fDatas);
  // Projekte
  deleteCircs(circles, scale);
  moveCircs(circles, scale);
  createCircs(circles, tooltipNode, scale);
  
  if (showCircText) {
    var circText = svg.select("g.beschriftung")
      .selectAll("text.existent")
      .data(fDatas, d => d.id);
    deleteCircText(circText, scale);
    moveCircText(circText, scale);
    createCircText(circText, scale);
  }
  
  // Hüllen
  var hulls = svg.select("g.hulls").selectAll("path.existent")
    .data(oldNests.nest, d => d.id);
  deleteHulls(hulls, scale);
  morphHulls(hulls, scale);
  createHulls(hulls, tooltipCluster, scale);
  
  // Beschriftung
  if (showHullText) {
    var hullText = svg.select("g.beschriftung")
      .selectAll("text.existent")
      .data(oldNests.nest, d => d.id);
    deleteHullText(hullText, scale);
    moveHullText(hullText, scale);
    createHullText(hullText, tooltipCluster, scale);
  }
  if (showPolygonzug) {
    var polygonzug = svg.select("g.polygonzug")
      .selectAll("path.existent")
      .data(oldNests.nest, d => d.id);
    deletePolygonzug(polygonzug, scale);
    morphPolygonzug(polygonzug, scale);
    createPolygonzug(polygonzug, scale);
  }
  
  oldClusters = newClusters;
  newClusters = tmp;
}

function goToAusgangszustandSimpel(svg, tooltipNode, oldDatas, newDatas, tooltipCluster, oldNests, newNests, scale){
  console.log('old:',oldNests.nest,'new:',newNests.nest);
  var circles = svg.select("g.circs").selectAll("circle.existent")
    .data(oldDatas, d => d.id);
  var hulls = svg.select("g.hulls").selectAll("path.existent")
    .data(oldNests.nest, d => d.id);
  if (showCircText)
    var circText = svg.select("g.beschriftung")
      .selectAll("text.existent")
      .data(oldDatas, d => d.id);
  if (showHullText)
    var hullText = svg.select("g.beschriftung")
      .selectAll("text.existent")
      .data(oldNests.nest, d => d.id);
  if (showPolygonzug)
    var polygonzug = svg.select("g.polygonzug")
      .selectAll("path.existent")
      .data(oldNests.nest, d => d.id);
  
  ///// Exit
  deleteCircs(circles, scale);
  deleteHulls(hulls, scale);
  if (showHullText)
    deleteHullText(hullText, scale);
  if (showCircText)
    deleteCircText(circText, scale);
  if (showPolygonzug)
    deletePolygonzug(polygonzug, scale);
  
  ///// scaling + Update
  scale.setDomain(oldDatas);
  moveCircs(circles, scale);
  morphSimpleHulls(hulls, scale);
  if (showHullText)
    moveHullText(hullText, scale);
  if (showCircText)
    moveCircText(circText, scale);
  if (showPolygonzug)
    morphPolygonzug(polygonzug, scale);
  
  // Enter
  createCircs(circles, tooltipNode, scale);
  createSimpleHulls(hulls, tooltipCluster, scale);
  if (showHullText)
    createHullText(hullText, tooltipCluster, scale);
  if (showCircText)
    createCircText(circText, scale);
  if (showPolygonzug)
    createPolygonzug(polygonzug, scale);
}

function replay(svg, tooltipNode, oldDatas, newDatas, tooltipCluster, oldNests, newNests, scale) {
  var t0 = d3.transition()//.duration(500)
    .on("start", function(){goToAusgangszustand(svg, tooltipNode, oldDatas, newDatas, tooltipCluster, oldNests, newNests, scale)})
    .on("end", function(){startTransition(svg, tooltipNode, oldDatas, newDatas, tooltipCluster, oldNests, newNests, scale)});
}


//////////////// Projekte ////////////////////
function createCircs(selection, tooltip, scale){
  selection.enter()
    .append("circle")
    .attr("class", "existent")
    .attr("cx", d => scale.xScale(d.pos.x))
    .attr("cy", d => scale.yScale(d.pos.y))
    .attr("r", radius)
    .on("mouseover", tooltip.show)
    .on("mouseout", tooltip.hide)
    .style("fill", c => getNodeColor(c))
    .style("stroke", c => getNodeColor(c).darker(1))
    .style("stroke-width", strokeWidth + "px")
    .style("opacity", c => getCircOpacity(c))
    .style("pointer-events", "all");
}

function createCircsTrans(selection, tooltip, scale){
  selection.enter()
    .append("circle")
    .attr("class", "existent")
    .attr("cx", d => scale.xScale(d.pos.x))
    .attr("cy", d => scale.yScale(d.pos.y))
    .attr("r", 0)
    .on("mouseover", tooltip.show)// tooltipNode / tooltipNodeUniform
    .on("mouseout", tooltip.hide)
    // https://github.com/d3/d3-scale-chromatic
    .style("fill", c => getNodeColor(c))
    .style("stroke", c => getNodeColor(c).darker(1))
    .style("stroke-width", strokeWidth + "px")
    .style("opacity", c => getCircOpacity(c))
    .style("pointer-events", "all")
    .transition()
    .delay(getDelayOfEnter())
    .duration(getDurationOfEnter())
    .ease(d3.easeBackOut.overshoot(overshoot))
    .attr("r", radius);
}

function deleteCircs(selection, scale) {
  selection.exit()
    .attr("class", "remove")
    .remove();
}

function deleteCircsTrans(selection, scale) {
  selection.exit()
    .attr("class", "remove")
    .transition()
    .duration(getDurationOfExit())
    .ease(d3.easeBackIn.overshoot(overshoot))
    .attr("r", 0)
    .remove();
}

function moveCircsTrans(selection, scale){
  selection.transition()
    .delay(getDelayOfAggregate())
    .duration(getDurationOfAggregate())
    .ease(d3.easeQuadInOut)
    .attr("cx", d => scale.xScale(d.pos.x))
    .attr("cy", d => scale.yScale(d.pos.y))
    .style("fill", c => getNodeColor(c))
    .style("stroke", c => getNodeColor(c).darker(1))
    .style("opacity", c => getCircOpacity(c));
    //.style("pointer-events","visible");// https://stackoverflow.com/questions/34605916/d3-circle-onclick-event-not-firing
}

function moveCircs(selection, scale){
  selection.attr("cx", d => scale.xScale(d.pos.x))
    .attr("cy", d => scale.yScale(d.pos.y))
    .style("fill", c => getNodeColor(c))
    .style("stroke", c => getNodeColor(c).darker(1))
    .style("opacity", c => getCircOpacity(c));
    //.style("pointer-events","visible");// https://stackoverflow.com/questions/34605916/d3-circle-onclick-event-not-firing
}


function getNodeColor(node){
  if (isEmpty(node.researchArea))
    //return d3.color("yellow");
    return node.color.brighter(1);
  else {
    if (projectColorBy == "researchArea")
      return getColorByDisziplin(node.researchArea).brighter(1);
    else if (projectColorBy == "cluster")
      return d3.rgb(newClusters[node.clusterNo].color).brighter(1);
    else
      return node.color;// Testzwecke
  }
}

// http://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7
var tooltipNode = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) {
    return "<b>Projekt-ID: " + d.id + "</b><br>Cluster-Nr.: " + d.clusterNo + "<br>Jahr: " + d.year + "<br>Subject: " + d.researchArea.name.slice(0,25) + "..." + "<br>Titel: " + d.title.slice(0,25) + "...<br>Keywords: " + d.keywords.join(",<br>" + "&nbsp".repeat(20)) + "<br>Pos: (" + d3.format(",.2f")(d.pos.x) + " |  " + d3.format(",.2f")(d.pos.y) + ")";
  });
  
var tooltipNodeMinusThousand = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) {
    return "<b>Projekt-ID: " + (d.id-1000) + "</b><br>Cluster-Nr.: " + (d.clusterNo-1000) + "<br>Jahr: " + d.year + "<br>Pos: (" + d3.format(",.2f")(d.pos.x) + " |  " + d3.format(",.2f")(d.pos.y) + ")";
  });
  
var tooltipNodeUniform = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) {
    return "<b>Projekt-ID: " + d.id + "</b><br>Cluster-Nr.: " + d.clusterNo + "<br>Jahr: " + d.year + "<br>Pos: (" + d3.format(",.2f")(d.pos.x) + " |  " + d3.format(",.2f")(d.pos.y) + ")";
  });


////////////////////// Hüllen ////////////// 
function createHulls(selection, tooltip, scale){
  selection.enter()
    .append("path")
    .attr("class", "existent")
    .attr("d", c => c.makePolygons2Path(scale))// c={id, polygons}
    .attr('fill', hullColor)
    .attr('stroke', hullColor)
    .style("stroke-linejoin", "round")
    .style("stroke-width", hullOffset + "px")
    .style('opacity', currHullOpacity)
    .on("mouseover", tooltip.show)
    .on("mouseout", tooltip.hide);
}

function createSimpleHulls(selection, tooltip, scale){
  selection.enter()
    .append("path")
    .attr("class", "existent")
    .attr("d", c => c.makeSimpleHulls2Path(scale))
    .attr('fill', hullColor)
    .attr('stroke', hullColor)
    .on("mouseover", tooltip.show)
    .on("mouseout", tooltip.hide)
    .style("stroke-linejoin", "round")
    .style("stroke-width", hullOffset + "px")
    .style('opacity', currHullOpacity);
}

function createHullsTransTabNew(selection, tooltip, scale){// sollte nicht vorkommen,
  // da oldNests angepasst wurden
  selection.enter()
    .append("path")
    .attr("class", "existent")
    .attr("d", c => c.makeHulls2Path(scale))
    .attr('fill', hullColor)
    .attr('stroke', hullColor)
    .style("stroke-linejoin", "round")
    .style("stroke-width", hullOffset + "px")
    .style('opacity', 0)
    .on("mouseover", tooltip.show)
    .on("mouseout", tooltip.hide)
    .transition()
    .delay(getDelayOfEnter())
    .duration(getDurationOfEnter())
    .ease(d3.easeQuadOut)
    .style('opacity', currHullOpacity)
    .attr("d", c => c.makeHulls2Path(scale));
}

function createSimpleHullsTrans(selection, tooltip, scale){
  selection.enter()
    .append("path")
    .attr("class", "existent")
    .attr("d", c => c.makeSimpleHulls2Path(scale))
    .attr('fill', hullColor)
    .attr('stroke', hullColor)
    .style("stroke-linejoin", "round")
    .style("stroke-width", hullOffset + "px")
    .style('opacity', 0)
    .on("mouseover", tooltip.show)
    .on("mouseout", tooltip.hide)
    .transition()
    .delay(getDelayOfEnter())
    .duration(getDurationOfEnter())
    .ease(d3.easeQuadOut)
    .style('opacity', currHullOpacity)
    .attr("d", c => c.makeSimpleHulls2Path(scale));
}

function deleteHullsTrans(selection, scale) {
  selection.exit()
    .attr("class", "remove")
    .transition()
    .delay(getDelayOfExit())
    .duration(getDurationOfExit())
    .ease(d3.easeQuadIn)
    .style("opacity", 0)
    .remove();
}

function deleteHulls(selection, scale) {
  selection.exit()
    .attr("class", "remove")
    .remove();
}

function morphHullsTrans(selection, scale){
  selection.transition()
    .ease(d3.easeQuadInOut)
    .delay(getDelayOfAggregate())
    .duration(getDurationOfAggregate())
    .style('opacity', currHullOpacity)
    .attr("d", d => d.makeHulls2Path(scale));
}

function morphSimpleHullsTrans(selection, scale){
  selection.transition()
    .ease(d3.easeQuadInOut)
    .delay(getDelayOfAggregate())
    .duration(getDurationOfAggregate())
    .style('opacity', currHullOpacity)
    .attr("d", cl => cl.makeSimpleHulls2Path(scale));
}

function morphHulls(selection, scale){
  selection.style('opacity', currHullOpacity)
    .attr("d", d => d.makePolygons2Path(scale));
}

function morphSimpleHulls(selection, scale){
  selection.style('opacity', currHullOpacity)
    .attr("d", d => d.makeSimpleHulls2Path(scale));
}

function showNewHulls(svg, newNests, scale){
  svg.select("g.hulls").selectAll("path.existent")
    .data(newNests.nest, d => d.id)
    .attr("d", d => d.makePolygons2Path(scale));
  if (showPolygonzug) {
    svg.select("g.polygonzug").selectAll("path.existent")
      .data(newNests.nest, d => d.id)
      .attr("d", d => d.makeSimplePolygonzug2Path(scale));
  }
}

var tooltipCluster = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(c) {
    return "<b>Cluster-ID: " + c.id + "</b><br>Knotenzahl: " + c.getLength() + "<br>Jahre: " + c.getYears() + "<br>Keywords: " + newClusters.filter(d => d.id == c.id)[0].keywords.join(",<br>" + "&nbsp".repeat(20));
  });
  
var tooltipClusterMinusThousand = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(c) {
    return "<b>Cluster-ID: " + (c.id-1000) + "</b><br>Knotenzahl: " + c.getLength() + "<br>Jahre: " + c.getYears();
  });
  
var tooltipClusterUniform = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(c) {
    return "<b>Cluster-ID: " + c.id + "</b><br>Knotenzahl: " + c.getLength() + "<br>Jahre: " + c.getYears();
  });
  
////////////////////// Beschriftung ////////////// 
function createHullText(selection, tooltip, scale){
  selection.enter()
    .append("text")
    .attr("class", "existent")
    .attr("x", c => getClusterLabelPos(c, scale).x)
    .attr("y", c => getClusterLabelPos(c, scale).y)
    .style("font-size", textSize + "px")
    .style("text-anchor", "middle")
    .attr("dy", "0.7ex")
    .text(c => "Cluster " + c.id)
    .style('opacity', getHullTextOpacity())
    .on("mouseover", tooltip.show)
    .on("mouseout", tooltip.hide);
}

function createHullTextTrans(selection, tooltip, scale){
  selection.enter()
    .append("text")
    .attr("class", "existent")
    .attr("x", c => getClusterLabelPos(c, scale).x)
    .attr("y", c => getClusterLabelPos(c, scale).y)
    .style("font-size", textSize + "px")
    .style("text-anchor", "middle")
    .attr("dy", "0.7ex")
    .text(c => "Cluster " + c.id)
    .style('opacity', 0)
    .on("mouseover", tooltip.show)
    .on("mouseout", tooltip.hide)
    .transition()
    .delay(getDelayOfEnter())
    .duration(getDurationOfEnter())
    .ease(d3.easeQuadOut)
    .style('opacity', getHullTextOpacity());
}

function moveHullTextTrans(selection, scale){
  selection.transition()
    .ease(d3.easeQuadInOut)
    .delay(getDelayOfAggregate())
    .duration(getDurationOfAggregate())
    .style('opacity', getHullTextOpacity())
    .attr("x", c => getClusterLabelPos(c, scale).x)
    .attr("y", c => getClusterLabelPos(c, scale).y);
}

function moveHullText(selection, scale){
  selection.attr("x", c => getClusterLabelPos(c, scale).x)
    .attr("y", c => getClusterLabelPos(c, scale).y);
}

function deleteHullTextTrans(selection, scale){
  selection.exit()
    .attr("class", "exit")
    .transition()
    .delay(getDelayOfExit())
    .duration(getDurationOfExit())
    .ease(d3.easeQuadIn)
    .style("opacity", 0)
    .remove();
}

function deleteHullText(selection, scale){
  selection.exit()
    .attr("class", "exit")
    .remove();
}

function getHullTextOpacity(){
  return (currHullOpacity != 0) * 1;
}

///////////// Knotenbeschriftung //////////////
function createCircText(selection, scale){
  selection.enter()
    .append("text")
    .attr("class", "existent")
    .attr("x", d => scale.xScale(d.pos.x) + radius)
    .attr("y", d => scale.yScale(d.pos.y) - 2*radius)
    .style("font-size", "10px")
    .style("text-anchor", "left")
    .attr("dy", "0.7ex")
    .text(function(d){return d.id;})
    .style("opacity", 1);
}

function createCircTextTrans(selection, scale){
  selection.enter()
    .append("text")
    .attr("class", "existent")
    .attr("x", d => scale.xScale(d.pos.x) + radius)
    .attr("y", d => scale.yScale(d.pos.y) - 2*radius)
    .style("font-size", "10px")
    .style("text-anchor", "left")
    .attr("dy", "0.7ex")
    .text(function(d){return d.id;})
    .style("opacity", 0)
    .transition()
    .delay(getDelayOfEnter())
    .duration(getDurationOfEnter())
    .ease(d3.easeBackOut.overshoot(overshoot))
    .style("opacity", 1);
}

function moveCircTextTrans(selection, scale){
  selection.transition()
    .ease(d3.easeQuadInOut)
    .delay(getDelayOfAggregate())
    .duration(getDurationOfAggregate())
    .attr("x", d => scale.xScale(d.pos.x) + radius)
    .attr("y", d => scale.yScale(d.pos.y) - 2*radius);
}

function moveCircText(selection, scale){
  selection.attr("x", d => scale.xScale(d.pos.x) + radius)
    .attr("y", d => scale.yScale(d.pos.y) - 2*radius);
}

function deleteCircTextTrans(selection, scale){
  selection.exit()
    .attr("class", "exit")
    .transition()
    .delay(getDelayOfExit())
    .duration(getDurationOfExit())
    .ease(d3.easeQuadIn)
    .style("opacity", 0)
    .remove();
}

function deleteCircText(selection, scale){
  selection.exit()
    .attr("class", "exit")
    .remove();
}


////////////// Polygonzug anzeigen //////////////
function createPolygonzug(selection, scale){
  selection.enter()
    .append("path")
    .attr("class", "existent")// c={id, polygons}
    .attr("d", c => c.makeSimplePolygonzug2Path(scale))
    .attr('fill', "none")
    .attr('stroke', "black")
    .attr("stroke-width", "0.5px")
    .style('opacity', 1);
}

function createPolygonzugTrans(selection, scale){
  selection.enter()
    .append("path")
    .attr("class", "existent")
    .attr("d", c => c.makeSimplePolygonzug2Path(scale))
    .attr('fill', "none")
    .attr('stroke', "black")
    .attr("stroke-width", "0.5px")
    .style('opacity', 0)
    .transition()
    .delay(getDelayOfEnter())
    .duration(getDurationOfEnter())
    .ease(d3.easeQuadOut)
    .style('opacity', 1);
}

function deletePolygonzugTrans(selection, scale) {
  selection.exit()
    .attr("class", "remove")
    .transition()
    .delay(getDelayOfExit())
    .duration(getDurationOfExit())
    .ease(d3.easeQuadIn)
    .style("opacity", 0)
    .remove();
}

function deletePolygonzug(selection, scale) {
  selection.exit()
    .attr("class", "remove")
    .remove();
}

function morphPolygonzugTrans(selection, scale){
  selection.transition()
    .ease(d3.easeQuadInOut)
    .delay(getDelayOfAggregate())
    .duration(getDurationOfAggregate())
    .attr("d", cl => cl.makeSimplePolygonzug2Path(scale));
}

function morphPolygonzug(selection, scale){
  selection.attr("d", cl => cl.makeSimplePolygonzug2Path(scale));
}

////////////////////// Funktionen ////////////// 
function getClusterLabelPos(cluster, scale){
  var s = cluster.getSchwerpunkt();
  var xPos = scale.xScale(s.x);
  var yPos = scale.yScale(s.y);
  var verschiebung = (cluster.getLength() < 2)*3*radius
  return {x: xPos, y: yPos - verschiebung};
}

function getTakteGes() {
  if (choreoArt == "3phase")
    return d3.max([1, 1*esGibtExit + 2*esGibtAggregatOP + 1*esGibtEnter]);
  else if (choreoArt == "linear")
    return 1;
  else
    return clusterzahl;
}
  
function getDurationOfAggregate(){
  if (choreoArt == "3phase")
    return transDuration * 2*esGibtAggregatOP / getTakteGes();
  else if (choreoArt == "linear")
    return transDuration;
  else
    return transDuration/clusterzahl;
}

function getDurationOfEnter(){
  if (choreoArt == "3phase")
    return transDuration * esGibtEnter / getTakteGes();
  else if (choreoArt == "linear")
    return transDuration/2;
  else
    return transDuration/clusterzahl/2;
}

function getDurationOfExit(){
  if (choreoArt == "3phase")
    return transDuration * esGibtExit / getTakteGes();
  else if (choreoArt == "linear")
    return transDuration/2;
  else
    return transDuration/clusterzahl/2;
}

function getDelayOfAggregate(){
  if (choreoArt == "3phase")
    return getDurationOfExit();// transDuration * esGibtExit / getTakteGes();
  else if (choreoArt == "linear")
    return 0;
  else
    return 0;
}

function getDelayOfEnter(){
  if (choreoArt == "3phase")
    return transDuration * (esGibtExit + 2*esGibtAggregatOP) / getTakteGes();
  else if (choreoArt == "linear")
    return 0;
  else
    return 0;
}

function getDelayOfExit(){// sollte eig. nicht benötigt werden
  if (choreoArt == "3phase")
    return 0;
  else if (choreoArt == "linear")
    return 0;
  else
    return 0;
}

//////////// Event Listener zum Speichern der SVG ////////////
document.addEventListener('keypress', changeView);
// https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
function changeView(keypress) {
  console.log(keypress);
  if (keypress.key == "p"){// speichert das rechte SVG
    saveImage();
  }
  else if (keypress.key == "Enter") {
    var zip = new JSZip();// https://jalara-studio.de/mit-javascript-eine-zip-datei-erstellen
    if ( JSZip.support.arraybuffer )
      console.log( "ArrayBuffer wird unterstützt." );
    else
      console.log( "ArrayBuffer wird nicht unterstützt." );
    if ( JSZip.support.uint8array )
      console.log( "Uint8Array wird unterstützt." );
    else
      console.log( "Uint8Array wird nicht unterstützt." );
    if ( JSZip.support.blob )
      console.log( "Blob wird unterstützt." );
    else
      console.log( "Blob wird nicht unterstützt." );
    //callAusgangszustand();
    var inhalt, fileNr;
    var counter = 0;// 1
    var n = 60;// 10
    /*inhalt = createSVGcontent();
    zip.file("PetriDish-"+ "01.svg", inhalt);
    replay();*/
    // https://stackoverflow.com/questions/2170923/whats-the-easiest-way-to-call-a-function-every-5-seconds-in-jquery
    var interval = setInterval(function(){// hat eine leichte Verschiebung : 170 ms
      if (++counter <= n+1) {
        inhalt = createSVGcontent();
        fileNr = "0".slice(0, 2-counter.toString().length) +counter;
        zip.file(("PetriDish-"+ fileNr +".svg"), inhalt);
      }
      else {
        clearInterval(interval);
        zip.generateAsync({type:"blob"}).then(function(blob) {
          saveAs(blob, "PetriDish.zip" );
        });
      }
    }, 250);// transDuration/n
  }
}

function createSVGcontent(){
  // https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
  var svgElem;
  var svgElements = document.getElementsByClassName("svg");
  svgElem = document.getElementById("svg");
  svgElem.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  var svgData = svgElem.outerHTML;
  var preface = '<?xml version="1.0" standalone="no"?>\r\n';
  return preface + svgData;
}

function saveImage(){// speichert ein einzelnes SVG
  // https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
  var svgElem = document.getElementsByClassName("svg")[0];
  //var svgElem = document.getElementById("rechts").lastChild;
  svgElem.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  var svgData = svgElem.outerHTML;
  var preface = '<?xml version="1.0" standalone="no"?>\r\n';
  var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
  var svgUrl = URL.createObjectURL(svgBlob);
  var downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = "PetriDish.svg";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
