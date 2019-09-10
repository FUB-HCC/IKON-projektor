const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);
  
//////////////// Header //////////////////
modifyHeader(me);

//////////////// Content //////////////////  
linkeSpalte.append("h2").text("Ergebnisse");
var auflistung = linkeSpalte.append("ul");
auflistung.append("li")
  .text("Anim. Transition wird bevorzugt.");
auflistung.append("li")
  .text("Bevorzugte Transitionsdauer: 1.5 – 3s. Durchschnitt: 2.1s");
auflistung.append("li")
  .text("Steigende Komplexität führte zu weniger präzise Deutung.");
auflistung.append("li")
  .text("Hüllensichtbarkeit ist notwendig.");
auflistung.append("li")
  .text("Staging");
auflistung.append("li")
  .text("Animation vom Clusterwechsel verwirrend (siehe rechts)");

//////////////// Datasets ////////////////
var pos, id, gerade, clusterNo, researchArea, year, keywords, title, alpha;
const gelb = d3.color("yellow").darker(1);
clusterzahl = 3;
  
var dataset = {
  vorher: [],
  nachher: []
};
  fillRandomDataset(dataset.vorher, 20);
  fillRandomDataset(dataset.nachher, 20);

/*function fillDataset(d) {
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
}*/

function fillRandomDataset(dataset, anz) {
  var idx = 1;
  for (var i=1; i<= anz; i++) {
    pos = new Position(Float.getRandFloat(0,10), Float.getRandFloat(0,10));
    id = idx++;
    clusterNo = Index.getRandInt(1,clusterzahl);
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
// width = Math.min(document.getElementById("rechteSpalte")
//   .getBoundingClientRect().width, 300) - margin.left - margin.right,
// height = 300 - margin.top - margin.bottom;

transDuration = 2000;
oldDatas = dataset.vorher;
newDatas = dataset.nachher;
var oldNests = new Nest(oldDatas);
var newNests = new Nest(newDatas);

oldNests.nest.forEach(function(c){
  c.moveVertsCloserTogether(0.8);
});
newNests.nest.forEach(function(c){
  c.moveVertsCloserTogether(0.8);
});

var scale = new Scale();
  scale.setDomain(oldDatas);

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
      startTransitionOld(svg, tooltipNodeUniform, oldDatas, newDatas, tooltipClusterUniform, oldNests, newNests, scale);
    else
      startTransitionOld(svg, tooltipNodeUniform, newDatas, oldDatas, tooltipClusterUniform, newNests, oldNests, scale);
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
// createCircText(svg.select("g.beschriftung")
//   .selectAll("text.existent").data(oldDatas, d => d.id), scale);
createHulls(svg.select("g.hulls")
  .selectAll("path.existent")
  .data(oldNests.nest, d => d.id), tooltipClusterUniform, scale);
createHullText(svg.select("g.beschriftung")
  .selectAll("text.existent")
  .data(oldNests.nest, d => d.id), tooltipClusterUniform, scale);
// if (showPolygonzug)
//   createPolygonzug(svg.select("g.polygonzug")
//     .selectAll("path.existent")
//     .data(oldNests.nest, d => d.id), scale);

/////////// Schieberegler ///////////////
var durationDiv = rechteSpalte.append("div")
  .style("padding", "20px 0 4px 0");
durationDiv.append("text").text("Transitionsdauer:")
  .style("float", "left")
  .style("position", "relative")
  .style("top", "6px");
var schieberegler = new DurationRegler(durationDiv);
