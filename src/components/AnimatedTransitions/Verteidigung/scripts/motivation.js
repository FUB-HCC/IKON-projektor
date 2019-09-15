const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);
  
//////////////// Header //////////////////
modifyHeader(me);

//////////////// Content //////////////////
linkeSpalte.append("h2").text("Vorteil visualisierter Hüllen");// h3
var auflistung = linkeSpalte.append("ul").attr("class", "plus");
auflistung.append("li")
  .text("Zugehörigkeitsbestimmung");
// auflistung = linkeSpalte.append("ul").attr("class", "minus");
// auflistung.append("li")
//   .text("Überdeckung der Cluster");

linkeSpalte.append("h2").text("Vor- und Nachteile animierter Transition");// h3
auflistung = linkeSpalte.append("ul").attr("class", "plus");
auflistung.append("li")
  .text("Verfolgen der Bewegung");
auflistung.append("li")
  .text("Erkennen der Clusteroperationen")
  .append("sup").text("1,2,3,4");
// auflistung.append("li")
//   .text("Vermeiden des direkten Vergleichs vom Ausgangs- & Zielzustand");
auflistung.append("li")
  .text("Visualisierung lebendiger & ansprechender")
  .append("sup").text("5");
  
//linkeSpalte.append("h2").text("Nachteile");// h3
auflistung = linkeSpalte.append("ul").attr("class", "minus");
auflistung.append("li")
  .text("Zu viele Änderungen")
  .append("sup").text("6");
auflistung.append("li")
  .text("Zu kurze oder lange Transitionsdauer")
  .append("sup").text("6");
auflistung.append("li")
  .text("Rechenleistung")
  .append("sup").text("6");
  
  
////////////// Trans. vs. Überblendung //////////
const dropDownSelections = [
  {text: "Überblendung", value: "uberblendung"},
  {text: "Zeige Hüllen", value: "showHulls"},
  {text: "Anim. Transition", value: "transition"}
];
const dropDownText = dropDownSelections.filter(d => d.value == animationsart)[0].text;
new DropdownList(rechteSpalte, dropDownSelections, dropDownText, function(d){
  goToAusgangszustand2(svg, tooltipNodeUniform, oldDatas, newDatas, tooltipClusterUniform, oldNests, newNests, scale);
  var notTrans = animationsart == "transition" || d.value == "transition";
  if (animationsart != d.value) {
    animationsart = d.value;
    if (notTrans)
      changeIDs();
  }
  d3.select(".dropbtn").text(d.text);
  if (d.value == "uberblendung") {
    showHulls = false;
    currHullOpacity = 0;
    schieberegler.setDuration(0);
  }
  else {
    showHulls = true;
    currHullOpacity = maxHullOpacity;
    if (d.value == "showHulls")
      schieberegler.setDuration(1250);
    else// transition
      schieberegler.setDuration(1250);
  }
  //d3.selectAll(".dropdown-content").style("display", "none");
  goToAusgangszustand2(svg, tooltipNodeUniform, oldDatas, newDatas, tooltipClusterUniform, oldNests, newNests, scale);
});

/////////// Buttons ///////////////
var buttons = rechteSpalte.append("div");
  //.style("float", "left");

new Button(buttons, "▶", function(){
  transDuration = document.getElementById("transDurationIn").value;
  replay2();
});

new Button(buttons, "|◀", function(){
  goToAusgangszustand2(svg, tooltipNodeUniform, oldDatas, newDatas, tooltipClusterUniform, oldNests, newNests, scale);
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

showHulls = false;
currHullOpacity = 0; 
transDuration = 0;

/////////// Schieberegler ///////////////
var durationDiv = rechteSpalte.append("div")
  .style("padding", "4px 0 4px 0");
durationDiv.append("text").text("Transitionsdauer:")
  .style("float", "left")
  .style("position", "relative")
  .style("top", "6px");
var schieberegler = new DurationRegler(durationDiv);
  
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
    color = d3.color(["gold","green","red"][id%3]).darker(1);
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
    color = d3.color(["gold","green","red"][id%3]).darker(1);
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
/*var hulls = svg.select("g.hulls").selectAll("path")
  .data(oldNests.nest, c => c.id);
  createHulls(hulls, tooltipClusterUniform, scale);
var hullText = svg.select("g.beschriftung")
  .selectAll("text.existent")
  .data(oldNests.nest, d => d.id);
  createHullText(hullText, tooltipClusterUniform, scale);*/


////////////// Extras ////////////////
function replay2() {
  var t0 = d3.transition()//.duration(500)
    .on("start", function(){goToAusgangszustand2(svg, tooltipNodeUniform, oldDatas, newDatas, tooltipClusterUniform, oldNests, newNests, scale)})
    .on("end", function(){startTransition2()});
}

function changeIDs(){
  // muss alle IDs modifizieren
  if (animationsart == "uberblendung" || animationsart == "showHulls") {
    newDatas.forEach(function(d){
      d.id += 1000;
      d.clusterNo += 1000;
    });
    newClusters.forEach(function(c){
      c.id += 1000;
    });
    //schieberegler.setDuration(0);
  }
  else {// anim. Trans.
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
  if (animationsart == "uberblendung" || animationsart == "showHulls") {
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
    if (currHullOpacity > 0) {
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
    }
    hullText2.exit()
      .attr("class", "exit")
      .transition().delay(0)
      .duration(transDuration)
      .style("opacity", 0)
      .remove();
    if (currHullOpacity > 0) {
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
    }
  } else {// Transition
    startTransition(svg, tooltipNodeUniform, oldDatas, newDatas, tooltipClusterUniform, oldNests, newNests, scale);
  }
}

function goToAusgangszustand2(svg, tooltipNode, oldDatas, newDatas, tooltipCluster, oldNests, newNests, scale){
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
  else
    svg.select("g.beschriftung").selectAll("text.existent").remove();
  
  // Hüllen
  if (currHullOpacity > 0) {
    var hulls = svg.select("g.hulls").selectAll("path.existent")
      .data(oldNests.nest, d => d.id);
    deleteHulls(hulls, scale);
    morphHulls(hulls, scale);
    createHulls(hulls, tooltipCluster, scale);
  } 
  else
    svg.select("g.hulls").selectAll("path.existent").remove();
  
  // Beschriftung
  if (showHullText) {
    var hullText = svg.select("g.beschriftung")
      .selectAll("text.existent")
      .data(oldNests.nest, d => d.id);
    deleteHullText(hullText, scale);
    moveHullText(hullText, scale);
    createHullText(hullText, tooltipCluster, scale);
  }
  else
    svg.select("g.beschriftung").selectAll("text.existent").remove();
  
  if (showPolygonzug) {
    var polygonzug = svg.select("g.polygonzug")
      .selectAll("path.existent")
      .data(oldNests.nest, d => d.id);
    deletePolygonzug(polygonzug, scale);
    morphPolygonzug(polygonzug, scale);
    createPolygonzug(polygonzug, scale);
  }
  else
    svg.select("g.polygonzug").selectAll("path.existent").remove();
  
  oldClusters = newClusters;
  newClusters = tmp;
}

//////////// Footnotes ////////////////
var footnotes = layout.append("div").attr("id", "footnote")
  .append("ol").attr("id", "footnote");
footnotes.append("li")// 1
  .text("The Effect of Animated Transitions in Zooming Interfaces")
  .append("a")
    .attr("href", "http://doi.acm.org/10.1145/1385569.1385642")
    .text(" (Shanmugasundaram und Irani, 2008)")
    .attr("target", "_blank");
footnotes.append("li")// 2
  .text("Hierarchically Animated Transitions in Visualizations of Tree Structures")
  .append("a")
    .attr("href", "http://doi.acm.org/10.1145/2254556.2254653")
    .text(" (Guilmain u. Kollegen, 2012)")
    .attr("target", "_blank");
footnotes.append("li")// 3
  .text("The Not-so-Staggering Effect of Staggered Animated Transitions on Visual Tracking")
  .append("a")
    .attr("href", "https://doi.org/10.1109/TVCG.2014.2346424")
    .text(" (Chevalier u. Kollegen 2014)")
    .attr("target", "_blank");
footnotes.append("li")// 4
  .text("Designing Animated Transitions to Convey Aggregate Operations")
  .append("a")
    .attr("href", "http://idl.cs.washington.edu/files/2019-AnimatedAggregates-EuroVis.pdf")
    .text(" (Kim und Kollegen, 2019)")
    .attr("target", "_blank");
footnotes.append("li")// 5
  .text("Temporal Distortion for Animated Transitions")
  .append("a")
    .attr("href", "http://doi.acm.org/10.1145/1978942.1979233")
    .text(" (Dragicevic u. Kollegen, 2011)")
    .attr("target", "_blank");
footnotes.append("li")// 6
  .text("Animated Transitions in Statistical Data Graphics")
  .append("a")
    .attr("href", "https://doi.org/10.1109/TVCG.2007.70539")
    .text(" (Heer u. Robertson 2007)")
    .attr("target", "_blank");

//////////////// Footer //////////////////  
modifyFooter(me);
