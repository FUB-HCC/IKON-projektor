const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);
  
//////////////// Header //////////////////
modifyHeader(me);

//////////////// Content //////////////////

linkeSpalte.append("h2").text("Eigenschaften animierter Transitionen");
var auflistung = linkeSpalte.append("ul");
var listChor = auflistung.append("li").text("Choreographie");
  listChor.append("sup").text("1,3,4");
  /*var listChorlist = listChor.append("ul");
  listChorlist.append("li").text("Lineare Transition");
  listChorlist.append("li").text("Drei-Phasen-Transition: Collapse (Exit), Move (Update), Expanding (Enter)");
  listChorlist.append("li").text("Staggered Transition");*/
  //listTransD.append("p").text("1s pro Staging");
var listVerz = auflistung.append("li").text("Zeitliche Verzerrung");
  listVerz.append("sup").text("2");
var listCompl = auflistung.append("li").text("Komplexität");
  listCompl.append("sup").text("4");
  //var listCompllist = listCompl.append("p").text("Objektverfolgung bei Scatterplots");
var listTransD = auflistung.append("li").text("Transitionsdauer");
  listTransD.append("sup").text("1");
  
rechteSpalte.append("h2").text("Transitionen in der Anwendung");
auflistung = rechteSpalte.append("ul");
  auflistung.append("li").text("Wahrnehmung von Ausreißern")
    .append("sup").text("5");
auflistung = rechteSpalte.append("ul");
  auflistung.append("li").text("Zooming")
    .append("sup").text("6");
  
rechteSpalte.append("h2").text("Herausforderung");
rechteSpalte.append("p").text("Unkonkrete bzw. fehlende Empfehlungen für Clustertransitionen");
  
/*
//////////////// Variablen & Funktionen ////////////////
var pos, id, gerade, clusterNo, researchArea, year, keywords, title, color, alpha;
radius = 6, transDuration = 750;
showHulls = false;
currHullOpacity = 0;

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

function fillDataset(d) {
  for (var i in d) {
    pos = new Position(d[i].x, d[i].y);
    id = d[i].id;
    clusterNo = d[i].cl;
    researchArea = {};
    year = Index.getRandInt(yearSpan[0], yearSpan[1]);
    keywords = [""];
    title = "";
    color = d[i].color;
    alpha = d[i].alpha;
    d[i] = new Knoten(pos, id, clusterNo, researchArea, year, keywords, title, color, alpha);
  }
}

const dropDownSelections = [
  {text: "Zeitliche Verzerrung", value: "verzerrung"},
  {text: "Choreographie", value: "choreographie"},
  {text: "Zeige Hüllen", value: "showHulls"}
];
var animationsart = "verzerrung";
const dropDownText = dropDownSelections.filter(d => d.value == animationsart)[0].text;
new DropdownList(rechteSpalte, dropDownSelections, dropDownText, function(d){
  if (d.value == "verzerrung") {
    transdur = 750;
    showHullText = false;
    currHullOpacity = 0;
  }
  else if (d.value == "choreographie") {
    transdur = 3000;
    showHullText = true;
    currHullOpacity = maxHullOpacity;
  }
  // in jedem Fall
  goToAusgangszustand(svg, tooltipNodeUniform, oldDatas, newDatas, tooltipClusterUniform, oldNests, newNests, scale);
});

/////////// Buttons ///////////////
var buttons = rechteSpalte.append("div");
  //.style("float", "left");

new Button(buttons, "▶", function(){
  transDuration = document.getElementById("transDurationIn").value;
  replay(svg, tooltipNodeUniform, oldDatas, newDatas, tooltipClusterUniform, oldNests, newNests, scale);
});

new Button(buttons, "|◀", function(){
  goToAusgangszustand(svg, tooltipNodeUniform, oldDatas, newDatas, tooltipClusterUniform, oldNests, newNests, scale);
});

//////////////// SVG ////////////////
width = Math.min(document.getElementById("rechteSpalte")
  .getBoundingClientRect().width, 350) - margin.left - margin.right,
height = 300 - margin.top - margin.bottom;
var svg = (new SVG(rechteSpalte)).svg;
  svg.call(tooltipNodeUniform);
  svg.call(tooltipClusterUniform);

/////////// Schieberegler ///////////////
var durationDiv = rechteSpalte.append("div")
  .style("padding", "4px 0 4px 0");
durationDiv.append("text").text("Transitionsdauer:")
  .style("float", "left")
  .style("position", "relative")
  .style("top", "6px");
var schieberegler = new DurationRegler(durationDiv);

///////////////////// Datasets /////////////  
var datasZeitlVerz = {
  vorher: [
    {x: 0, y: 1, id: 1, cl: 1, color: d3.color("#1f77b4"), alpha: 1},
    {x: 1, y: 1, id: 2, cl: 1, color: d3.color("#1f77b4"), alpha: 1},
    {x: 9, y: 1, id: 3, cl: 1, color: d3.color("#1f77b4"), alpha: 1}
  ],
  nachher: [
    {x: 0, y: 1, id: 1, cl: 1, color: d3.color("#1f77b4"), alpha: 1},
    {x: 8, y: 1, id: 2, cl: 1, color: d3.color("#1f77b4"), alpha: 1},
    {x: 9, y: 1, id: 3, cl: 1, color: d3.color("#1f77b4"), alpha: 1}
  ]
};
  fillDataset(datasZeitlVerz.vorher);
  fillDataset(datasZeitlVerz.nachher);

oldDatas = datasZeitlVerz.vorher;
newDatas = datasZeitlVerz.nachher;
scale.setDomain(oldDatas);
oldNests = new Nest(oldDatas);
newNests = new Nest(newDatas);
transTable = oldNests.createTransitionNests(newNests);

/////////////// Init /////////////////
var circles = svg.select("g.circs").selectAll("circle.existent")
  .data(oldDatas, c => c.id);
  createCircs(circles, tooltipNodeUniform, scale);
  */

///////////// Footnotes //////////////////
var footnotes = layout.append("div").attr("id", "footnote")
  .append("ol").attr("id", "footnote");
footnotes.append("li")// 1
  .text("Animated Transitions in Statistical Data Graphics")
  .append("a")
    .attr("href", "https://doi.org/10.1109/TVCG.2007.70539")
    .text(" (Heer u. Robertson, 2007)")
    .attr("target", "_blank");
footnotes.append("li")// 2
  .text("Temporal Distortion for Animated Transitions")
  .append("a")
    .attr("href", "http://doi.acm.org/10.1145/1978942.1979233")
    .text(" (Dragicevic u. Kollegen, 2011)")
    .attr("target", "_blank");
footnotes.append("li")// 3
  .text("Hierarchically Animated Transitions in Visualizations of Tree Structures")
  .append("a")
    .attr("href", "http://doi.acm.org/10.1145/2254556.2254653")
    .text(" (Guilmain u. Kollegen, 2012)")
    .attr("target", "_blank");
footnotes.append("li")// 4
  .text("The Not-so-Staggering Effect of Staggered Animated Transitions on Visual Tracking")
  .append("a")
    .attr("href", "https://doi.org/10.1109/TVCG.2014.2346424")
    .text(" (Chevalier u. Kollegen, 2014)")
    .attr("target", "_blank");
footnotes.append("li")// 5
  .text("Saliency Deficit and Motion Outlier Detection in Animated Scatterplots")
  .append("a")
    .attr("href", "http://doi.acm.org/10.1145/3290605.3300771")
    .text(" (Veras und Collins, 2019)")
    .attr("target", "_blank");
footnotes.append("li")// 6
  .text("The Effect of Animated Transitions in Zooming Interfaces")
  .append("a")
    .attr("href", "http://doi.acm.org/10.1145/1385569.1385642")
    .text(" (Shanmugasundaram und Irani, 2008)")
    .attr("target", "_blank");

//////////////// Footer //////////////////  
modifyFooter(me);
