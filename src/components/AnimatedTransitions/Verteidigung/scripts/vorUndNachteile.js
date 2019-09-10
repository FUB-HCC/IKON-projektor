const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);
  
//////////////// Header //////////////////
modifyHeader(me);

//////////////// Content //////////////////
linkeSpalte.append("h2").text("Vorteile");

var auflistung = linkeSpalte.append("ul");
auflistung.append("li")
  .text("Verfolgen der Bewegung");
auflistung.append("li")
  .text("Erfassen & Interpretation von Clusteroperationen");
// auflistung.append("li")
//   .text("Vermeiden des direkten Vergleichs vom Ausgangs- & Zielzustand");
auflistung.append("li")
  .text("Änderung der Visualisierung lebendiger & ansprechender");
  
linkeSpalte.append("h2").text("Nachteile");
auflistung = linkeSpalte.append("ul");
auflistung.append("li")
  .text("Bei zu vielen Änderungen");
auflistung.append("li")
  .text("Zu kurze oder lange Transitionsdauer");
  
////////////// Trans. vs. Überblendung //////////
const dropDownSelections = [
  {text: "Überblendung", value: "uberblendung"},
  {text: "Transition", value: "transition"}
];
const dropDownText = dropDownSelections.filter(d => d.value == animationsart)[0].text;
new DropdownList(rechteSpalte, dropDownSelections, dropDownText, function(d){
  goToAusgangszustand(svg, tooltipNodeUniform, oldDatas, newDatas, tooltipClusterUniform, oldNests, newNests, scale);
  if (animationsart != d.value) {
    animationsart = d.value;
    changeIDs();
  }
  d3.select(".dropbtn").text(d.text);
  //d3.selectAll(".dropdown-content").style("display", "none");
  goToAusgangszustand(svg, tooltipNodeUniform, oldDatas, newDatas, tooltipClusterUniform, oldNests, newNests, scale);
});

/////////// Buttons ///////////////
var buttons = rechteSpalte.append("div");
  //.style("float", "left");

new Button(buttons, "▶", function(){
  transDuration = document.getElementById("transDurationIn").value;
  replay2();
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
  svg.call(tooltipNodeMinusThousand);
  svg.call(tooltipClusterMinusThousand);
  
//////////////// Datasets ////////////////
var idx = 0;
var randIDs = [1,0,14,8,10,7,11,6,16,3,13,15,12,2,9,4,19,5,20,18,17];
var pos, id, gerade, clusterNo, researchArea, year, keywords, title, color, alpha;
var datas = [
  [[2,8,0], [2.5,10,0], [4.5,7,0], [5,9,0]], // cluster0
  [[2.5,2,1], [3,5,1], [5.5,2,1]], // cluster1
  [[8,7,2], [8.2,5,2], [9.3,5.5,2], [10.5,4,2], [10,8,2]] // cluster2
];
for(var c in datas){
  for (var p in datas[c]) {
    pos = new Position(datas[c][p][0], datas[c][p][1]);
    id = randIDs[idx++]; // 10 * parseInt(c) + parseInt(p);
    clusterNo = datas[c][p][2];
    year = Index.getRandInt(yearSpan[0], yearSpan[1]);
    keywords = [""];
    title = "";
    color = d3.color("yellow").darker(1);
    alpha = 1;
    // pos, id, clusterNo, researchArea, year, keywords, title
    oldDatas.push(new Knoten(pos, id, clusterNo, {}, year, keywords, title, color, alpha));
  }
  oldClusters.push({id: +c, color: d3.color("yellow"), keywords: [""]});
}

scale.setDomain(oldDatas);
oldNests = new Nest(oldDatas);

idx = 0;
datas = [
  [[1,9,0], [2,12,0], [5,6,0], [5.5,9.5,0]], // cluster0
  [[2,1,1], [3.8,7.7,0], [11,6,2]], // cluster1, 2 Knoten gehen
  [[8.4,7.2,2], [8,4.5,2], [9,5,2], [10,5,2], [10.7,9,2]] // cluster2
];

for(var c in datas){
  for (var p in datas[c]) {
    pos = new Position(datas[c][p][0], datas[c][p][1]);
    id = randIDs[idx++]; // 10 * parseInt(c) + parseInt(p);
    clusterNo = datas[c][p][2];
    year = Index.getRandInt(yearSpan[0], yearSpan[1]);
    keywords = [""];
    title = "";
    color = d3.color("yellow").darker(1);
    alpha = 1;
    // pos, id, clusterNo, researchArea, year, keywords, title
    newDatas.push(new Knoten(pos, id, clusterNo, {}, year, keywords, title, color, alpha));
  }
  newClusters.push({id: +c, color: d3.color("yellow"), keywords: [""]});
}
changeIDs();
newNests = new Nest(newDatas);
transTable = oldNests.createTransitionNests(newNests);

/////////// init ///////////////
var circles = svg.select("g.circs").selectAll("circle")
  .data(oldDatas, c => c.id);
  createCircs(circles, tooltipNodeUniform, scale);
var hulls = svg.select("g.hulls").selectAll("path")
  .data(oldNests.nest, c => c.id);
  createHulls(hulls, tooltipClusterUniform, scale);
var hullText = svg.select("g.beschriftung")
  .selectAll("text.existent")
  .data(oldNests.nest, d => d.id);
  createHullText(hullText, tooltipClusterUniform, scale);

/////////// Schieberegler ///////////////
var durationDiv = rechteSpalte.append("div")
  .style("padding", "4px 0 4px 0");
durationDiv.append("text").text("Transitionsdauer:")
  .style("float", "left")
  .style("position", "relative")
  .style("top", "6px");
new DurationRegler(durationDiv);

//////////////// Footer //////////////////  
modifyFooter(me);


////////////// Extras ////////////////
function replay2() {
  var t0 = d3.transition()//.duration(500)
    .on("start", function(){goToAusgangszustand(svg, tooltipNodeUniform, oldDatas, newDatas, tooltipClusterUniform, oldNests, newNests, scale)})
    .on("end", function(){startTransition2()});
}

function changeIDs(){
  // muss alle IDs modifizieren
  if (animationsart == "uberblendung") {
    newDatas.forEach(function(d){
      d.id += 1000;
      d.clusterNo += 1000;
    });
    newClusters.forEach(function(c){
      c.id += 1000;
    });
  }
  else {
    newDatas.forEach(function(d){
      d.id -= 1000;
      d.clusterNo -= 1000;
    });
    newClusters.forEach(function(c){
      c.id -= 1000;
    });
  }
  newNests = new Nest(newDatas);
  transTable = oldNests.createTransitionNests(newNests);
}

function startTransition2() {
  if (animationsart == "uberblendung") {
    var circles2 = svg.select("g.circs").selectAll("circle.existent")
      .data(newDatas, d => d.id);
    scale.setDomain(newDatas);
    var hulls2 = svg.select("g.hulls")
      .selectAll("path.existent")
      .data(newNests.nest, d => d.id);
    var hullText2 = svg.select("g.beschriftung")
      .selectAll("text.existent")
      .data(newNests.nest, d => d.id);
    circles2.exit()
      .attr("class", "remove")
      .transition().delay(0)
      .duration(transDuration)
      .style("opacity", 0)
      .remove();
    circles2.enter()
      .append("circle")
      .attr("class", "existent")
      .attr("cx", d => scale.xScale(d.pos.x))
      .attr("cy", d => scale.yScale(d.pos.y))
      .attr("r", radius)
      .style("opacity", 0)
      .on("mouseover", tooltipNodeMinusThousand.show)
      .on("mouseout", tooltipNodeMinusThousand.hide)
      .style("fill", c => getNodeColor(c))
      .style("stroke", c => getNodeColor(c).darker(1))
      .style("stroke-width", strokeWidth + "px")
      .style("pointer-events", "all")
      .transition().delay(0)
      .duration(transDuration)
      .style("opacity", 1);
    hulls2.exit()
      .attr("class", "remove")
      .transition().delay(0)
      .duration(transDuration)
      .style("opacity", 0)
      .remove();
    hulls2.enter()
      .append("path")
      .attr("class", "existent")
      .attr("d", c => c.makePolygons2Path(scale))
      .attr('fill', hullColor)
      .attr('stroke', hullColor)
      .style("stroke-linejoin", "round")
      .style("stroke-width", hullOffset + "px")
      .style("opacity", 0)
      .on("mouseover", tooltipClusterMinusThousand.show)
      .on("mouseout", tooltipClusterMinusThousand.hide)
      .transition().delay(0)
      .duration(transDuration)
      .style('opacity', currHullOpacity);
    hullText2.exit()
      .attr("class", "exit")
      .transition().delay(0)
      .duration(transDuration)
      .style("opacity", 0)
      .remove();
    hullText2.enter()
      .append("text")
      .attr("class", "existent")
      .attr("x", c => getClusterLabelPos(c, scale).x)
      .attr("y", c => getClusterLabelPos(c, scale).y)
      .style("font-size", textSize + "px")
      .style("text-anchor", "middle")
      .attr("dy", "0.7ex")
      .text(c => "Cluster " + (c.id-1000))
      .style("opacity", 0)
      .on("mouseover", tooltipClusterMinusThousand.show)
      .on("mouseout", tooltipClusterMinusThousand.hide)
      .transition().delay(0)
      .duration(transDuration)
      .style('opacity', getHullTextOpacity());
  } else {// Transition
    startTransition(svg, tooltipNodeUniform, oldDatas, newDatas, tooltipClusterUniform, oldNests, newNests, scale);
  }
}
