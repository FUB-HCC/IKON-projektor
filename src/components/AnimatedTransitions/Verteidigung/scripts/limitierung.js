const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);
  
//////////////// Header //////////////////
modifyHeader(me);

//////////////// Content //////////////////
linkeSpalte.append("h2").text("Bisher ungelöste technische Probleme");

var auflistung = linkeSpalte.append("ul");
auflistung.append("li")
  .text("Reihenfolge: Keine Lösung");
auflistung.append("li")
  .text("Hüllenknoten mit unterschiedlichen IDs");
  
  
linkeSpalte.append("h2").text("Allgemeine Schwächen");

auflistung = linkeSpalte.append("ul");
auflistung.append("li")
  .text("Stark überlappende Cluster");
auflistung.append("li")
  .text("Starke Häufung / Überdeckung von Knoten");
auflistung.append("li")
  .text("Extreme Knotenbewegung");

//////////////// Datasets ////////////////
var pos, id, gerade, clusterNo, researchArea, year, keywords, title, alpha;
const gelb = d3.color("yellow").darker(1);
  
var datasetKnotenID = {
  vorher: [
    {id: 1, x: 4, y: 5, cl: 1},
    {id: 2, x: 4, y: 3, cl: 1},
    {id: 3, x: 3, y: 1, cl: 1},
    {id: 4, x: 2, y: 1, cl: 1},
    {id: 5, x: 0, y: 4, cl: 1},
    {id: 6, x: 0, y: 5, cl: 1},
    {id: 7, x: 2, y: 6, cl: 1},
    {id: 8, x: 3, y: 6, cl: 1},
    {id: 9, x: 1, y: 4.5, cl: 1},
    {id: 10, x: 2.5, y: 4, cl: 1}
  ],
  nachher: [
    {id: 10, x: 6, y: 2, cl: 1},
    {id: 11, x: 2, y: 0, cl: 1},
    {id: 12, x: 1, y: 4, cl: 1},
    {id: 13, x: 4, y: 4, cl: 1},
    {id: 14, x: 3, y: 3, cl: 1},
    {id: 8, x: 3.5, y: 1.5, cl: 1}
  ]
};
  fillDataset(datasetKnotenID.vorher);
  fillDataset(datasetKnotenID.nachher);
  
var datasetReihenfolge = {
  vorher: [
    {id: 1, x: 2, y: 2, cl: 1},
    {id: 2, x: 2, y: 0, cl: 1},
    {id: 3, x: 0, y: 0, cl: 1},
    {id: 4, x: 0, y: 2, cl: 1}
  ],
  nachher: [
    {id: 1, x: 2, y: 2, cl: 1},
    {id: 2, x: 2, y: 0, cl: 1},
    {id: 3, x: 0.2, y: 2, cl: 1},
    {id: 4, x: 0, y: 0, cl: 1}
  ]
};
  fillDataset(datasetReihenfolge.vorher);
  fillDataset(datasetReihenfolge.nachher);
  
var datasetVerdeckung = {
  vorher: [
//     {id: 1, x: 0, y: 0, cl: 1},
//     {id: 2, x: 3, y: 0, cl: 1},
//     {id: 3, x: 0, y: 3, cl: 1},
//     {id: 12, x: 0, y: 2, cl: 1},
//     {id: 13, x: 1.5, y: 0.5, cl: 1},
//     {id: 14, x: 2, y: 1, cl: 1},
//     {id: 15, x: 1, y: 2, cl: 1},
//     {id: 4, x: 1, y: 0, cl: 2},
//     {id: 5, x: 2, y: 0, cl: 2},
//     {id: 6, x: 1, y: 3, cl: 2},
//     {id: 7, x: 2, y: 3, cl: 2},
//     {id: 8, x: 1.5, y: 2, cl: 2},
//     {id: 9, x: 2, y: 0.5, cl: 2},
//     {id: 10, x: 1, y: 1.5, cl: 2},
//     {id: 11, x: 1.5, y: 3, cl: 2}
  ],
  nachher: [
//     {id: 1, x: 0, y: 0, cl: 1},
//     {id: 2, x: 3, y: 0, cl: 1},
//     {id: 3, x: 0, y: 3, cl: 1},
//     {id: 4, x: 1, y: 0, cl: 2},
//     {id: 5, x: 2, y: 0, cl: 2},
//     {id: 6, x: 1, y: 3, cl: 2},
//     {id: 7, x: 2, y: 3, cl: 2}
  ]
};
  fillRandomDataset(datasetVerdeckung.vorher, 64);
  fillRandomDataset(datasetVerdeckung.nachher, 64);

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

function fillRandomDataset(dataset, anz) {
  var idx = 1;
  for (var i=1; i<= anz; i++) {
    pos = new Position(Float.getRandFloat(0,10), Float.getRandFloat(0,10));
    id = idx++;
    clusterNo = Index.getRandInt(1,3);
    researchArea = {};
    year = Index.getRandInt(yearSpan[0], yearSpan[1]);
    keywords = [""];
    title = "";
    color = gelb;//d[i].color;
    alpha = 1;//d[i].alpha;
    dataset.push(new Knoten(pos, id, clusterNo, researchArea, year, keywords, title, color, alpha));
  }
}

//////////////// SVG
width = Math.min(document.getElementById("rechteSpalte")
  .getBoundingClientRect().width, 300) - margin.left - margin.right,
height = 300 - margin.top - margin.bottom;

showCircText = true;
showHullText = false;
showPolygonzug = true;
transDuration = 1750;
oldDatas = datasetReihenfolge.vorher;
newDatas = datasetReihenfolge.nachher;
var oldNests = new Nest(oldDatas);
var newNests = new Nest(newDatas);

var scale = new Scale();
  scale.setDomain(oldDatas);

const dropDownSelections = [
  {text: "Reihenfolge", value: "reihenfolge"},
  {text: "Knoten-IDs", value: "knotenids"},
  {text: "allg. Schwächen", value: "verdeckung"}
];
problemHullTrait = "reihenfolge";
var dropDownText = dropDownSelections.filter(d => d.value == problemHullTrait)[0].text;

// ort, liste, text, onclickFkt
new DropdownList(rechteSpalte, dropDownSelections, dropDownText,
  function(d){
    problemHullTrait = d.value;
    d3.select(".dropbtn").text(d.text);
    if (problemHullTrait == "knotenids") {
      oldDatas = datasetKnotenID.vorher;
      newDatas = datasetKnotenID.nachher;
      schieberegler.setDuration(3000);
    }
    else if (problemHullTrait == "reihenfolge") {
      oldDatas = datasetReihenfolge.vorher;
      newDatas = datasetReihenfolge.nachher;
      schieberegler.setDuration(1750);
    }
    else if (problemHullTrait == "verdeckung") {
      oldDatas = datasetVerdeckung.vorher;
      newDatas = datasetVerdeckung.nachher;
      schieberegler.setDuration(1750);
    }
    // in jedem Fall
    oldNests = new Nest(oldDatas);
    newNests = new Nest(newDatas);
    if (problemHullTrait == "verdeckung" || problemHullTrait == "knotenids") {
      showPolygonzug = false;
      svg.select("g.polygonzug").selectAll("path").remove();
    }
    else
      showPolygonzug = true;
    scale.setDomain(oldDatas);
    goToAusgangszustand(svg, tooltipNodeUniform, oldDatas, newDatas, tooltipClusterUniform, oldNests, newNests, scale);
    playBtn.value = "play";
    playBtn.btn.text("▶");
  }
);

function togglePlayBtn(btn) {
  if (btn.value == "play") {
    btn.value = "replay";
    btn.btn.text("◀");
  }
  else {
    btn.value = "play";
    btn.btn.text("▶");
  }
}

var playBtn = new Button(rechteSpalte, "▶", function(){});
  playBtn.btn.on("click", function(){
    if (playBtn.value == "play")
      startTransition(svg, tooltipNodeUniform, oldDatas, newDatas, tooltipClusterUniform, oldNests, newNests, scale);
    else
      startTransition(svg, tooltipNodeUniform, newDatas, oldDatas, tooltipClusterUniform, newNests, oldNests, scale);
    togglePlayBtn(playBtn);
  });

rechteSpalte.append("br");
var svg = (new SVG(rechteSpalte)).svg;
  svg.call(tooltipNodeUniform);
  svg.call(tooltipClusterUniform);

  
/////////////// Init /////////////////
createCircs(svg.select("g.circs")
  .selectAll("circle.existent")
  .data(oldDatas, d => d.id), tooltipNodeUniform, scale);
createCircText(svg.select("g.beschriftung")
  .selectAll("text.existent").data(oldDatas, d => d.id), scale);
createHulls(svg.select("g.hulls")
  .selectAll("path.existent")
  .data(oldNests.nest, d => d.id), tooltipClusterUniform, scale);
if (showPolygonzug)
  createPolygonzug(svg.select("g.polygonzug")
    .selectAll("path.existent")
    .data(oldNests.nest, d => d.id), scale);

/////////// Schieberegler ///////////////
var durationDiv = rechteSpalte.append("div")
  .style("padding", "20px 0 4px 0");
durationDiv.append("text").text("Transitionsdauer:")
  .style("float", "left")
  .style("position", "relative")
  .style("top", "6px");
var schieberegler = new DurationRegler(durationDiv);
