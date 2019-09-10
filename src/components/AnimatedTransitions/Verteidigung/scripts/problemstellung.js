
const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);
  
//////////////// Header //////////////////
modifyHeader(me);

//////////////// Content //////////////////
linkeSpalte.append("h2").text("Erstellung der Hüllen");

var auflistung = linkeSpalte.append("ul");
auflistung.append("li")
  .text("Berechnung einer konvexen Hülle mittels")
  .append("span")
  .style("font-weight", "600")
  .text(" d3.polygonHull()");
auflistung.append("li")
  .text("Darstellung durch einen Pfad als String der Form: ")
  .append("p")
  .style("color", "red")
  .style("line-height", "0px")
  .style("margin-bottom", "30px")
  .text("M 0 0 L 10 0 L 5 10 Z");

linkeSpalte.append("h2").text("Interpolation des Pfades");

auflistung = linkeSpalte.append("ul");
auflistung.append("li")
  .text("Anfangspunkt müssen,");
auflistung.append("li")
  .text("Knotenzahlen müssen und");
auflistung.append("li")
  .text("Reihenfolgen sollten übereinstimmen.");


//////////////// Datasets ////////////////
var pos, id, gerade, clusterNo, researchArea, year, keywords, title, alpha;
const gelb = d3.color("yellow").darker(1);
  
// var datasetAnfang = {
//   vorher: [
//     {id: 1, x: 20.505, y: 38.665, cl: 1},
//     {id: 2, x: 23.559, y: 21.779, cl: 1},
//     {id: 3, x: 40.581, y: 23.943, cl: 1},
//     {id: 4, x: 25.466, y: 15.821, cl: 1},
//     {id: 5, x: 32.784, y: 0.300, cl: 1},
//     {id: 6, x: 20.388, y: 12.166, cl: 1},
//     {id: 7, x: 7.889, y: 0.409, cl: 1},
//     {id: 8, x: 15.343, y: 15.865, cl: 1},
//     {id: 9, x: 0.300, y: 24.120, cl: 1},
//     {id: 10, x: 17.303, y: 21.806, cl: 1}
//   ],
//   nachher: [
//     {id: 9, x: 20.505, y: 38.665, cl: 1},
//     {id: 10, x: 23.559, y: 21.779, cl: 1},
//     {id: 1, x: 40.581, y: 23.943, cl: 1},
//     {id: 2, x: 25.466, y: 15.821, cl: 1},
//     {id: 3, x: 32.784, y: 0.300, cl: 1},
//     {id: 4, x: 20.388, y: 12.166, cl: 1},
//     {id: 5, x: 7.889, y: 0.409, cl: 1},
//     {id: 6, x: 15.343, y: 15.865, cl: 1},
//     {id: 7, x: 0.300, y: 24.120, cl: 1},
//     {id: 8, x: 17.303, y: 21.806, cl: 1}
//   ]
// };
var datasetAnfang = {
  vorher: [
    {id: 1, x: 6, y: 5, cl: 1},
    {id: 2, x: 4, y: 3, cl: 1},
    {id: 3, x: 5, y: 1, cl: 1},
    {id: 4, x: 1, y: 1, cl: 1},
    {id: 5, x: 1, y: 5, cl: 1}
  ],
  nachher: [
    {id: 1, x: 5, y: 5, cl: 1},
    {id: 2, x: 4, y: 3, cl: 1},
    {id: 3, x: 6, y: 1, cl: 1},
    {id: 4, x: 1, y: 1, cl: 1},
    {id: 5, x: 1, y: 5, cl: 1}
  ]
};
  fillDataset(datasetAnfang.vorher);
  fillDataset(datasetAnfang.nachher);

var datasetReihenfolge = {
  vorher: [
    {id: 1, x: 2, y: 2, cl: 1},
    {id: 2, x: 0, y: 2, cl: 1},
    {id: 3, x: 1, y: 0, cl: 1}
  ],
  nachher: [
    {id: 1, x: 2, y: 0, cl: 1},
    {id: 2, x: 0, y: 0, cl: 1},
    {id: 3, x: 1, y: 1.5, cl: 1}
  ]
};
  fillDataset(datasetReihenfolge.vorher);
  fillDataset(datasetReihenfolge.nachher);
  
var datasetKnotenzahl = {
  vorher: [
    {id: 1, x: 3, y: 0, cl: 1},
    {id: 2, x: 1, y: 0, cl: 1},
    {id: 3, x: 2, y: 2, cl: 1}
  ],
  nachher: [
    {id: 1, x: 3, y: 0, cl: 1},
    {id: 2, x: 1, y: 0, cl: 1},
    {id: 3, x: 1, y: 2, cl: 1},
    {id: 4, x: 2.8, y: 2, cl: 1}
  ]
};
  fillDataset(datasetKnotenzahl.vorher);
  fillDataset(datasetKnotenzahl.nachher);

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

//////////////// SVG
width = Math.min(document.getElementById("rechteSpalte")
  .getBoundingClientRect().width, 300) - margin.left - margin.right,
height = 300 - margin.top - margin.bottom;

showCircText = true;
showHullText = false;
showPolygonzug = true;
transDuration = 2000;
oldDatas = datasetAnfang.vorher.sort((a,b) => a.id - b.id);
newDatas = datasetAnfang.nachher.sort((a,b) => a.id - b.id);
var oldNests = new SimpleNest(oldDatas);
var newNests = new SimpleNest(newDatas);
//console.log('old:',oldNests.nest.map(c => c.polygons[0].vertices.sort((a,b) => a.id-b.id)), 'new:',newNests.nest.map(c => c.polygons[0].vertices.sort((a,b) => a.id-b.id)));
var scale = new Scale();
  scale.setDomain(oldDatas);

const dropDownSelections = [
  {text: "Anfangspunkt", value: "anfangspunkt"},
  {text: "Knotenzahl", value: "knotenzahl"},
  {text: "Reihenfolge", value: "reihenfolge"}
];
//problemHullTrait = "linear";
var dropDownText = dropDownSelections.filter(d => d.value == problemHullTrait)[0].text;

// ort, liste, text, onclickFkt
new DropdownList(rechteSpalte, dropDownSelections, dropDownText,
  function(d){
    problemHullTrait = d.value;
    d3.select(".dropbtn").text(d.text);
    if (problemHullTrait == "anfangspunkt") {
      oldDatas = datasetAnfang.vorher.sort((a,b) => a.id - b.id);
      newDatas = datasetAnfang.nachher.sort((a,b) => a.id - b.id);
    }
    else if (problemHullTrait == "reihenfolge") {
      oldDatas = datasetReihenfolge.vorher;
      newDatas = datasetReihenfolge.nachher;
    }
    else {// knotenzahl
      oldDatas = datasetKnotenzahl.vorher;
      newDatas = datasetKnotenzahl.nachher;
    }
    // in jedem Fall
    oldNests = new SimpleNest(oldDatas);
    newNests = new SimpleNest(newDatas);
    //scale.setDomain(oldDatas);
    goToAusgangszustandSimpel(svg, tooltipNodeUniform, oldDatas, newDatas, tooltipClusterUniform, oldNests, newNests, scale);
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
      simpleTransition(svg, tooltipNodeUniform, oldDatas, newDatas, tooltipClusterUniform, oldNests, newNests, scale);
    else
      simpleTransition(svg, tooltipNodeUniform, newDatas, oldDatas, tooltipClusterUniform, newNests, oldNests, scale);
    togglePlayBtn(playBtn);
  });
  // d3.selectAll("g.hulls").select("path.existent")._groups[0][0]
  // d3.selectAll("g.polygonzug").select("path.existent")._groups[0][0]

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
createSimpleHulls(svg.select("g.hulls")
  .selectAll("path.existent")
  .data(oldNests.nest, d => d.id), tooltipClusterUniform, scale);
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
new DurationRegler(durationDiv);
