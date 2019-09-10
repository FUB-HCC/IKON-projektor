const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);
  
//////////////// Header //////////////////
modifyHeader(me);

//////////////// Datasets ////////////////
var pos, id, gerade, clusterNo, researchArea, year, keywords, title, alpha;
const gelb = d3.color("yellow").darker(1);
  
var dataset = {
  vorher: [
    {id: 1, x: 0, y: 15, cl: 1},
    {id: 2, x: 2, y: 15, cl: 1},
    {id: 3, x: 3.5, y: 18, cl: 1},
    {id: 4, x: 5, y: 20, cl: 1},
    {id: 5, x: 6, y: 20.5, cl: 1},
    {id: 6, x: 11, y: 19, cl: 1},
    //{id: 7, x: 8, y: 18, cl: 1},
    {id: 8, x: 4, y: 14, cl: 1},
    {id:  9, x: 3, y: 5, cl: 2},
    //{id: 10, x: 5, y: 7, cl: 2},
    {id: 11, x: 6, y: 7.5, cl: 2},
    {id: 12, x: 5, y: 11.5, cl: 2},
    //{id: 13, x: 8, y: 11, cl: 2},
    {id: 14, x: 9.5, y: 12.2, cl: 2},
    {id: 15, x: 12, y: 11, cl: 2},
    {id: 16, x: 10, y: 5, cl: 2},
    {id: 17, x: 11, y: 8, cl: 3},
    {id: 18, x: 15, y: 8, cl: 3},
    {id: 19, x: 18, y: 14, cl: 3},
    {id: 20, x: 16, y: 16, cl: 3},
    //{id: 21, x: 14, y: 14, cl: 3},
    {id: 22, x: 11, y: 14, cl: 3},
    {id: 23, x: 7, y: 16, cl: 3},
    {id: 24, x: 14, y: 6, cl: 4},
    {id: 25, x: 16, y: 4, cl: 4},
    //{id: 26, x: 0, y: 10, cl: 5}
  ],
  nachher: [
    {id: 1, x: 0, y: 14, cl: 1},
    //{id: 2, x: 2, y: 15, cl: 1},
    {id: 3, x: 6, y: 15, cl: 1},
    {id: 4, x: 2, y: 20, cl: 1},
    //{id: 5, x: 6, y: 21, cl: 1},
    {id: 6, x: 12, y: 21, cl: 1},
    {id: 7, x: 8, y: 18, cl: 1},//neu
    {id: 8, x: 6, y: 15, cl: 1},
    {id:  9, x: 2, y: 12, cl: 1},//clusterwechsel
    {id: 10, x: 5, y: 5, cl: 2},//neu
    {id: 11, x: 15, y: 11, cl: 3},//clusterwechsel
    {id: 12, x: 6, y: 10, cl: 2},
    {id: 13, x: 8, y: 11, cl: 2},//neu
    //{id: 14, x: 9.5, y: 13, cl: 2},
    {id: 15, x: 13, y: 11, cl: 2},
    {id: 16, x: 12, y: 4, cl: 2},
    {id: 17, x: 14, y: 8, cl: 3},
    {id: 18, x: 13, y: 7, cl: 3},
    {id: 19, x: 22, y: 13, cl: 3},
    {id: 20, x: 16, y: 15, cl: 3},
    {id: 21, x: 14, y: 14, cl: 3},//neu
    {id: 22, x: 15, y: 19, cl: 6},//clusterwechsel
    {id: 23, x: 8, y: 17, cl: 3},
    //{id: 24, x: 14, y: 6, cl: 4},
    //{id: 25, x: 16, y: 4, cl: 4},
    {id: 26, x: 0, y: 10, cl: 5}//neu
  ]
};
  fillDataset(dataset.vorher);
  fillDataset(dataset.nachher);

function fillDataset(d) {
  for (var i in d) {
    pos = new Position(d[i].x, d[i].y);
    id = d[i].id;
    clusterNo = d[i].cl;
    researchArea = {};
    year = Index.getRandInt(yearSpan[0], yearSpan[1]);
    keywords = [""];
    title = "";
    color = gelb;//d[i].color;
    alpha = 1;//d[i].alpha;
    d[i] = new Knoten(pos, id, clusterNo, researchArea, year, keywords, title, color, alpha);
  }
}

/////////////// Linke Spalte
linkeSpalte.append("h2").text("Gleichzeitige/sequentielle Ausführung:");

var auflistung = linkeSpalte.append("ul");
auflistung.append("li").text("Lineare Transition");
auflistung.append("li").text("Drei-Phasen-Transition: Collapse (Exit), Move (Update), Expanding (Enter)");
auflistung.append("li").text("Staggered Transition: z.B. per Cluster");
auflistung.append("li").text("Hybrid Transition");

//////////////// SVG

// width = Math.min(document.getElementById("rechteSpalte")
//   .getBoundingClientRect().width, 350) - margin.left - margin.right,
// height = 250 - margin.top - margin.bottom;
transDuration = 3000;
durationSpan = [0, 6000];

const dropDownSelections = [
  {text: "Lineare Transition", value: "linear"},
  {text: "3-Phasen-Transition", value: "3phase"},
  {text: "Staggered Transition", value: "staggered"}
];
choreoArt = "linear";
var dropDownText = dropDownSelections.filter(d => d.value == choreoArt)[0].text;

// ort, liste, text, onclickFkt
new DropdownList(rechteSpalte, dropDownSelections, dropDownText,
  function(d){
    goToAusgangszustand(svg, tooltipNodeUniform, dataset.vorher, dataset.nachher, tooltipClusterUniform, oldNests, newNests, scale);
    choreoArt = d.value;
    d3.select(".dropbtn").text(d.text);
  }
);

var playBtn = new Button(rechteSpalte, "▶", function(){
  goToAusgangszustand(svg, tooltipNodeUniform, dataset.vorher, dataset.nachher, tooltipClusterUniform, oldNests, newNests, scale);
  if (choreoArt == "3phase")
    startTransition(svg, tooltipNodeUniform, dataset.vorher, dataset.nachher, tooltipClusterUniform, oldNests, newNests, scale);
  else if (choreoArt == "linear") {
    startTransition(svg, tooltipNodeUniform, dataset.vorher, dataset.nachher, tooltipClusterUniform, oldNests, newNests, scale);
  }
  else {// staggered
    var clusterVorher = oldNests.nest.map(c => c.id);
    var clusterNachher = newNests.nest.map(c => c.id);
    var clusterGes = clusterVorher.slice(0,);
    clusterNachher.forEach(function(d){
      if (! clusterGes.includes(d))
        clusterGes.push(d);
    });
    var idx = 0;
    clusterzahl = clusterGes.length;
    var t = d3.interval(function(elapsed){// https://github.com/d3/d3-timer
      if (elapsed > transDuration)
        t.stop();
      startTransitionStagg(clusterGes[idx++]);	
    }, transDuration/clusterzahl);
  }
});
var backBtn = new Button(rechteSpalte, "|◀", function(){
  goToAusgangszustand(svg, tooltipNodeUniform, dataset.vorher, dataset.nachher, tooltipClusterUniform, oldNests, newNests, scale);
});

rechteSpalte.append("br");
var svg = (new SVG(rechteSpalte)).svg;
  svg.call(tooltipNodeUniform);
  svg.call(tooltipClusterUniform);

  
/////////////// Init /////////////////
var oldNests = new Nest(dataset.vorher);
var newNests = new Nest(dataset.nachher);
var scale = new Scale();
scale.setDomain(dataset.vorher);
createCircs(svg.select("g.circs")
  .selectAll("circle.existent")
  .data(dataset.vorher, d => d.id), tooltipNodeUniform, scale);
createHulls(svg.select("g.hulls")
  .selectAll("path.existent")
  .data(oldNests.nest, d => d.id), tooltipClusterUniform, scale);
createHullText(svg.select("g.beschriftung")
  .selectAll("text.existent")
  .data(oldNests.nest, d => d.id), tooltipClusterUniform, scale);


/////////// Schieberegler ///////////////
var durationDiv = rechteSpalte.append("div")
  .style("padding", "20px 0 4px 0");
durationDiv.append("text").text("Transitionsdauer:")
  .style("float", "left")
  .style("position", "relative")
  .style("top", "6px");
new DurationRegler(durationDiv);

///////////////// Funktion //////////////
function startTransitionStagg(clID) {
  var circsV = dataset.vorher.filter(k => k.clusterNo >= clID)
    .concat(dataset.nachher.filter(k => k.clusterNo < clID));
  var circsN = dataset.vorher.filter(k => k.clusterNo > clID)
    .concat(dataset.nachher.filter(k => k.clusterNo <= clID));
  var clusterV = new Nest(circsV);
  var clusterN = new Nest(circsN);
  var transTable = clusterV.createTransitionNests(clusterN);
  
  ////// Kreise
  var circles = svg.select("g.circs").selectAll("circle.existent")
    .data(circsN, d => d.id);
    
  ////// Prüft, welche Änderungen es gibt
  esGibtExit  = circles.exit()._groups[0]
    .map(c => c != undefined).some(b => b) || oldClusters.some(c => newClusters.filter(d => d.id == c.id).length == 0) || clusterV.nest.some(c => clusterN.nest.filter(d => d.id == c.id).length == 0);
  esGibtEnter = circles.enter()._groups[0]
    .map(c => c != undefined).some(b => b) || newClusters.some(c => oldClusters.filter(d => d.id == c.id).length == 0) || clusterN.nest.some(c => clusterV.nest.filter(d => d.id == c.id).length == 0);
  
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
  
  ///////// hier startet die Transition
  var hullsNew = svg.select("g.hulls")
    .selectAll("path.existent")
    .data(transTable.new.nest, d => d.id);
  
  var hullsText = svg.select("g.beschriftung")
    .selectAll("text.existent")
    .data(clusterN.nest, d => d.id);
  
  deleteHullsTrans(hullsNew, scale);
  deleteHullTextTrans(hullsText, scale);
  
  ///////// Scaling
  scale.setDomain(circsN);
  
  morphHullsTrans(hullsNew, scale);
  createHullsTransTabNew(hullsNew, tooltipClusterUniform, scale);
  
  d3.transition()
    .delay(getDelayOfAggregate())
    .duration(getDurationOfAggregate())
    .on("end", function(){showNewHulls(svg, clusterN, scale);});
  
  moveHullTextTrans(hullsText, scale);
  createHullTextTrans(hullsText, tooltipClusterUniform, scale);
  
  //////// Kreise
  deleteCircsTrans(circles, scale);
  moveCircsTrans(circles, scale);
  createCircsTrans(circles, tooltipNodeUniform, scale);
}


//////////////// Footer //////////////////  
modifyFooter(me);
