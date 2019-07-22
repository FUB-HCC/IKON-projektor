//////////////// Projekte ////////////////////
function createCircs(selection){
  selection.enter()
    .append("circle")
    .attr("class", "existent")
    .attr("cx", d => scale.xScale(d.pos.x))
    .attr("cy", d => scale.yScale(d.pos.y))
    .attr("r", radius)
    .on("mouseover", tooltipNode.show)
    .on("mouseout", tooltipNode.hide)
    .style("fill", c => getNodeColor(c))
    .style("stroke", c => getNodeColor(c).darker(1))
    .style("stroke-width", strokeWidth + "px")
    .style("opacity", c => getCircOpacity(c))
    .style("pointer-events", "all");
}

function createCircsTrans(selection){
  selection.enter()
    .append("circle")
    .attr("class", "existent")
    .attr("cx", d => scale.xScale(d.pos.x))
    .attr("cy", d => scale.yScale(d.pos.y))
    .attr("r", 0)
    .on("mouseover", tooltipNode.show)
    .on("mouseout", tooltipNode.hide)
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

function deleteCircs(selection) {
  selection.exit()
    .attr("class", "remove")
    .remove();
}

function deleteCircsTrans(selection) {
  selection.exit()
    .attr("class", "remove")
    .transition()
    .duration(getDurationOfExit())
    .ease(d3.easeBackIn.overshoot(overshoot))
    .attr("r", 0)
    .remove();
}

function moveCircsTrans(selection){
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

function moveCircs(selection){
  selection.attr("cx", d => scale.xScale(d.pos.x))
    .attr("cy", d => scale.yScale(d.pos.y))
    .style("fill", c => getNodeColor(c))
    .style("stroke", c => getNodeColor(c).darker(1))
    .style("opacity", c => getCircOpacity(c));
    //.style("pointer-events","visible");// https://stackoverflow.com/questions/34605916/d3-circle-onclick-event-not-firing
}


function getNodeColor(node){
  if (projectColorBy == "researchArea")
    return getColorByDisziplin(node.researchArea).brighter(1);
  else
    return d3.rgb(newClusters[node.clusterNo].color).brighter(1);
}

// http://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7
var tooltipNode = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) {
    return "<b>Projekt-ID: " + d.id + "</b><br>Cluster-Nr.: " + d.clusterNo + "<br>Jahr: " + d.year + "<br>Subject: " + d.researchArea.name.slice(0,25) + "..." + "<br>Titel: " + d.title.slice(0,25) + "...<br>Keywords: " + d.keywords.join(",<br>" + "&nbsp".repeat(20)) + "<br>Pos: (" + d3.format(",.2f")(d.pos.x) + " |  " + d3.format(",.2f")(d.pos.y) + ")";
  });


////////////////////// Hüllen ////////////// 
function createHulls(selection){
  selection.enter()
    .append("path")
    .attr("class", "existent")
    .attr("d", c => c.makePolygons2Path(scale))// c={id, polygons}
    .attr('fill', hullColor)
    .attr('stroke', hullColor)
    .style("stroke-linejoin", "round")
    .style("stroke-width", hullOffset + "px")
    .style('opacity', currHullOpacity)
    .on("mouseover", tooltipCluster.show)
    .on("mouseout", tooltipCluster.hide);
}

// function createHullsTransTabOld(selection){// sollte nicht vorkommen
//   selection.enter()
//     .append("path")
//     .attr("class", "existent")
//     //.attr("d", c => c.makeHulls2Path(scale))// makeHulls2Path
//     .attr("d", function(c){// c = Cluster{id, polygons}
//       // Hülle taucht aus ihrem Mittelpunkt aus
//       var pos = c.getSchwerpunkt();
//       var node = new Knoten(pos, 0, 0, {}, 2019, [""])
//       var poly = new Array(c.getLength()).fill(node);
//       return new Polygon(poly).makeHull2Path(scale);
//     })
//     .attr('fill', hullColor)
//     .attr('stroke', hullColor)
//     .style("stroke-linejoin", "round")
//     .style("stroke-width", hullOffset + "px")
//     .style('opacity', 0)
//     .on("mouseover", tooltipCluster.show)
//     .on("mouseout", tooltipCluster.hide);
// }

function createHullsTransTabNew(selection){// sollte nicht vorkommen,
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
    .on("mouseover", tooltipCluster.show)
    .on("mouseout", tooltipCluster.hide)
    .transition()
    .delay(getDelayOfEnter())
    .duration(getDurationOfEnter())
    .ease(d3.easeQuadOut)
    .style('opacity', currHullOpacity)
    .attr("d", c => c.makeHulls2Path(scale));// makeHulls2Path
}

function deleteHullsTrans(selection) {
  selection.exit()
    .attr("class", "remove")
    .transition()
    .delay(getDelayOfExit())
    .duration(getDurationOfExit())
    .ease(d3.easeQuadIn)
    //.attr("d", c => c.makeHulls2Path(scale))
//     .attr("d", function(c){// c = Cluster{id, polygons}
//       // Hülle verschwindet in ihrem Mittelpunkt
//       var pos = c.getSchwerpunkt();
//       var node = new Knoten(pos, 0, 0, {}, 2019, [""])
//       var poly = new Array(c.getLength()).fill(node);
//       return new Polygon(poly).makeHull2Path(scale);
//     })
    .style("opacity", 0)
    .remove();
}

function deleteHulls(selection) {
  selection.exit()
    .attr("class", "remove")
    .remove();
}

function morphHullsTrans(selection){
  selection.transition()
    .ease(d3.easeQuadInOut)
    .delay(getDelayOfAggregate())
    .duration(getDurationOfAggregate())
    .style('opacity', currHullOpacity)
    .attr("d", d => d.makeHulls2Path(scale));// makeHulls2Path
}

function morphHulls(selection){
  selection.style('opacity', currHullOpacity)
    .attr("d", d => d.makePolygons2Path(scale));
}

function showNewHulls(){
  svg.select("g.hulls").selectAll("path.existent")
    .data(newNests.nest, d => d.id)
    .attr("d", d => d.makePolygons2Path(scale));
}

var tooltipCluster = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(c) {
    return "<b>Cluster-ID: " + c.id + "</b><br>Knotenzahl: " + c.getLength() + "<br>Jahre: " + c.getYears() + "<br>Keywords: " + newClusters.filter(d => d.id == c.id)[0].keywords.join(",<br>" + "&nbsp".repeat(20));
  });
  
////////////////////// Beschriftung ////////////// 
function createHullText(selection){
  selection.enter()
    .append("text")
    .attr("class", "existent")
    .attr("x", c => getClusterLabelPos(c).x)
    .attr("y", c => getClusterLabelPos(c).y)
    .style("font-size", textSize + "px")
    .style("text-anchor", "middle")
    .attr("dy", "0.7ex")
    .text(c => "Cluster " + c.id)
    .style('opacity', getHullTextOpacity())
    .on("mouseover", tooltipCluster.show)
    .on("mouseout", tooltipCluster.hide);
}

function createHullTextTrans(selection){
  selection.enter()
    .append("text")
    .attr("class", "existent")
    .attr("x", c => getClusterLabelPos(c).x)
    .attr("y", c => getClusterLabelPos(c).y)
    .style("font-size", textSize + "px")
    .style("text-anchor", "middle")
    .attr("dy", "0.7ex")
    .text(c => "Cluster " + c.id)
    .style('opacity', 0)
    .on("mouseover", tooltipCluster.show)
    .on("mouseout", tooltipCluster.hide)
    .transition()
    .delay(getDelayOfEnter())
    .duration(getDurationOfEnter())
    .ease(d3.easeQuadOut)
    .style('opacity', getHullTextOpacity());
}

function moveHullTextTrans(selection){
  selection.transition()
    .ease(d3.easeQuadInOut)
    .delay(getDelayOfAggregate())
    .duration(getDurationOfAggregate())
    .style('opacity', getHullTextOpacity())
    .attr("x", c => getClusterLabelPos(c).x)
    .attr("y", c => getClusterLabelPos(c).y);
}

function moveHullText(selection){
  selection.attr("x", c => getClusterLabelPos(c).x)
    .attr("y", c => getClusterLabelPos(c).y);
}

function deleteHullTextTrans(selection){
  selection.exit()
    .attr("class", "exit")
    .transition()
    .delay(getDelayOfExit())
    .duration(getDurationOfExit())
    .ease(d3.easeQuadIn)
    .style("opacity", 0)
    .remove();
}

function deleteHullText(selection){
  selection.exit()
    .attr("class", "exit")
    .remove();
}

function getHullTextOpacity(){
  return (currHullOpacity != 0) * 1;
}


////////////////////// Funktionen ////////////// 
function getClusterLabelPos(cluster){
  var s = cluster.getSchwerpunkt();
  var xPos = scale.xScale(s.x);
  var yPos = scale.yScale(s.y);
  var verschiebung = (cluster.getLength() < 2)*3*radius
  return {x: xPos, y: yPos - verschiebung};
}

function getTakteGes() {
  return d3.max([1, 1*esGibtExit + 2*esGibtAggregatOP + 1*esGibtEnter]);
}
  
function getDurationOfAggregate(){
  return transDuration * 2*esGibtAggregatOP / getTakteGes();
}

function getDurationOfEnter(){
  return transDuration * esGibtEnter / getTakteGes();
}

function getDurationOfExit(){
  return transDuration * esGibtExit / getTakteGes();
}

function getDelayOfAggregate(){
  return getDurationOfExit();// transDuration * esGibtExit / getTakteGes();
}

function getDelayOfEnter(){
  return transDuration * (esGibtExit + 2*esGibtAggregatOP) / getTakteGes();
}

function getDelayOfExit(){// sollte eig. nicht benötigt werden
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
