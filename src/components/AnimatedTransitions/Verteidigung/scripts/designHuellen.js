const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);
  
//////////////// Header //////////////////
modifyHeader(me);

//////////////// Datasets ////////////////
var pos, id, gerade, clusterNo, researchArea, year, keywords, title, alpha;
const gelb = d3.color("yellow").darker(1);
radius = 7;
  
var datasAddSub = {
  vorher: [
    {x: 1, y: 6, id: 1, cl: 1, color: gelb, alpha: 1},
    {x: 2, y: 4, id: 2, cl: 1, color: gelb, alpha: 1},
    {x: 3, y: 5, id: 3, cl: 1, color: gelb, alpha: 1},
    {x: 6, y: 1, id: 4, cl: 2, color: gelb, alpha: 1},
    {x: 5, y: 2, id: 5, cl: 2, color: gelb, alpha: 1},
    {x: 8, y: 3, id: 6, cl: 2, color: gelb, alpha: 1},
    {x: 6, y: 5, id: 7, cl: 2, color: gelb, alpha: 1}
  ],
  nachher: [
    {x: 6, y: 1, id: 4, cl: 2, color: gelb, alpha: 1},
    {x: 5, y: 2, id: 5, cl: 2, color: gelb, alpha: 1},
    {x: 8, y: 3, id: 6, cl: 2, color: gelb, alpha: 1}
  ]
};
  fillDataset(datasAddSub.vorher);
  fillDataset(datasAddSub.nachher);
  
var datasMergeSplit = {
  vorher: [
    {x: 2, y: 4, id: 1, cl: 1, color: gelb, alpha: 1},
    {x: 2, y: 7, id: 2, cl: 1, color: gelb, alpha: 1},
    {x: 5, y: 6, id: 3, cl: 1, color: gelb, alpha: 1},
    {x: 3, y: 5, id: 4, cl: 1, color: gelb, alpha: 1},
    {x: 4, y: 1, id: 5, cl: 2, color: gelb, alpha: 1},
    {x: 6, y: 3, id: 6, cl: 2, color: gelb, alpha: 1},
    {x: 8, y: 1, id: 7, cl: 2, color: gelb, alpha: 1},
    {x: 8, y: 6, id: 8, cl: 3, color: gelb, alpha: 1},
    {x: 9, y: 7, id: 9, cl: 3, color: gelb, alpha: 1},
    {x: 10, y: 4, id: 10, cl: 3, color: gelb, alpha: 1}
  ],
  nachher: [
    {x: 2, y: 4, id: 1, cl: 1, color: gelb, alpha: 1},
    {x: 2, y: 7, id: 2, cl: 1, color: gelb, alpha: 1},
    {x: 5, y: 6, id: 3, cl: 1, color: gelb, alpha: 1},
    {x: 4.5, y: 3, id: 4, cl: 2, color: gelb, alpha: 1},
    {x: 4, y: 1, id: 5, cl: 2, color: gelb, alpha: 1},
    {x: 6, y: 4.5, id: 6, cl: 2, color: gelb, alpha: 1},
    {x: 9, y: 1, id: 7, cl: 2, color: gelb, alpha: 1},
    {x: 5.5, y: 1.5, id: 8, cl: 2, color: gelb, alpha: 1},
    {x: 7, y: 2.5, id: 9, cl: 2, color: gelb, alpha: 1},
    {x: 8, y: 1.5, id: 10, cl: 2, color: gelb, alpha: 1}
  ]
};
  fillDataset(datasMergeSplit.vorher);
  fillDataset(datasMergeSplit.nachher);

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

//////////////// Content //////////////////
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

width = Math.min(document.getElementById("rechteSpalte")
  .getBoundingClientRect().width, 350) - margin.left - margin.right,
height = 250 - margin.top - margin.bottom;

/////////////// ADD/SUB
linkeSpalte.append("h2").text("Hinzufügen/Entfernen:");
  var addsubBtn = new Button(linkeSpalte, "▶", function(){});
    addsubBtn.btn.on("click", function(){
      if (addsubBtn.value == "play") {
        startTransition(addsubSVG, tooltipNodeUniform, datasAddSub.vorher, datasAddSub.nachher, tooltipClusterUniform, oldNestsAddSub, newNestsAddSub, scaleAddSub);
      }
      else {//goToAusgangszustand();
        startTransition(addsubSVG, tooltipNodeUniform, datasAddSub.nachher, datasAddSub.vorher, tooltipClusterUniform, newNestsAddSub, oldNestsAddSub, scaleAddSub);
      }
      togglePlayBtn(addsubBtn);
    });
  linkeSpalte.append("br");
  var addsubSVG = (new SVG(linkeSpalte)).svg;
    addsubSVG.call(tooltipNodeUniform);
    addsubSVG.call(tooltipClusterUniform);

//////////////// MERGE/SPLIT
rechteSpalte.append("h2").text("Verschmelzen/Aufteilen & Clusterwechsel:");
    var mergesplitBtn = new Button(rechteSpalte, "▶", function(){});
    mergesplitBtn.btn.on("click", function(){
      if (mergesplitBtn.value == "play") {
        startTransition(mergesplitSVG, tooltipNodeUniform, datasMergeSplit.vorher, datasMergeSplit.nachher, tooltipClusterUniform, oldNestsMergeSplit, newNestsMergeSplit, scaleMergeSplit);
      }
      else {//goToAusgangszustand();
        startTransition(mergesplitSVG, tooltipNodeUniform, datasMergeSplit.nachher, datasMergeSplit.vorher, tooltipClusterUniform, newNestsMergeSplit, oldNestsMergeSplit, scaleMergeSplit);
      }
      togglePlayBtn(mergesplitBtn);
    });
  rechteSpalte.append("br");
  var mergesplitSVG = (new SVG(rechteSpalte)).svg;
    mergesplitSVG.call(tooltipNodeUniform);
    mergesplitSVG.call(tooltipClusterUniform);

/////////// Schieberegler ///////////////
var durationDiv = linkeSpalte.append("div")
  .style("padding", "20px 0 4px 0");
durationDiv.append("text").text("Transitionsdauer:")
  .style("float", "left")
  .style("position", "relative")
  .style("top", "6px");
new DurationRegler(durationDiv);

  
/////////////// Init /////////////////
var oldNestsAddSub = new Nest(datasAddSub.vorher);
var newNestsAddSub = new Nest(datasAddSub.nachher);
var scaleAddSub = new Scale();
scaleAddSub.setDomain(datasAddSub.vorher);
createCircs(addsubSVG.select("g.circs").selectAll("circle.existent")
  .data(datasAddSub.vorher, d => d.id), tooltipNodeUniform, scaleAddSub);
createHulls(addsubSVG.select("g.hulls").selectAll("path.existent")
  .data(oldNestsAddSub.nest, d => d.id), tooltipClusterUniform, scaleAddSub);
createHullText(addsubSVG.select("g.beschriftung")
  .selectAll("text.existent")
  .data(oldNestsAddSub.nest, d => d.id), tooltipClusterUniform, scaleAddSub);

var oldNestsMergeSplit = new Nest(datasMergeSplit.vorher);
var newNestsMergeSplit = new Nest(datasMergeSplit.nachher);
var scaleMergeSplit = new Scale();
scaleMergeSplit.setDomain(datasMergeSplit.vorher);
createCircs(mergesplitSVG.select("g.circs")
  .selectAll("circle.existent")
  .data(datasMergeSplit.vorher, d => d.id), tooltipNodeUniform, scaleMergeSplit);
createHulls(mergesplitSVG.select("g.hulls")
  .selectAll("path.existent")
  .data(oldNestsMergeSplit.nest, d => d.id), tooltipClusterUniform, scaleMergeSplit);
createHullText(mergesplitSVG.select("g.beschriftung")
  .selectAll("text.existent")
  .data(oldNestsMergeSplit.nest, d => d.id), tooltipClusterUniform, scaleMergeSplit);



//////////////// Footer //////////////////  
modifyFooter(me);
