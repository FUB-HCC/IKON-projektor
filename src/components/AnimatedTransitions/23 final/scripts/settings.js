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
    // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Functions/set
    this.xScale.domain([
      d3.min(getFilteredData(vertices), d => d.pos.x), d3.max(getFilteredData(vertices), d => d.pos.x)
    ]);
    this.yScale.domain([
      d3.min(getFilteredData(vertices), d => d.pos.y),
      d3.max(getFilteredData(vertices), d => d.pos.y)
    ]);
  }
}

//////////////// Projekte ////////////////////
function createCircs(selection){
  selection.enter()
    .append("circle")
    .attr("class", "enter")
    .attr("cx", d => scale.xScale(d.pos.x))
    .attr("cy", d => scale.yScale(d.pos.y))
    .attr("r", radius)
    .on("mouseover", tooltipNode.show)
    .on("mouseout", tooltipNode.hide)
    // https://github.com/d3/d3-scale-chromatic
    .style("fill", c => getNodeColor(c))
    .style("stroke", c => getNodeColor(c).darker(1))
    .style("stroke-width", "2px")
    .style("opacity", 1)
    .style("pointer-events", "all");
}

function deleteCircs(selection) {
  selection.exit()
    .attr("class", "remove")
    .duration(function(){
      if (esGibtAggregatOP)
        return transDuration/3;
      else
        return transDuration;
    })
    .ease(d3.easeBackIn.overshoot(6))
    .attr("r", 0)
    .remove();
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
    return "<b>Projekt-ID: " + d.id + "</b><br>Cluster-Nr.: " + d.clusterNo + "<br>Pos: (" + d3.format(",.2f")(d.pos.x) + " |  " + d3.format(",.2f")(d.pos.y) + ")" + "<br>Titel: " + d.title.slice(0,25) + "<br>Keywords: " + d.keywords.join(",<br>" + "&nbsp".repeat(20)) + "<br>Subject: " + d.researchArea.name.slice(0,25);
  });

var tooltipNodeMod = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) {
    return "<b>Projekt-ID: " + (d.id-1000) + "</b><br>Cluster-Nr.: " + (d.clusterNo-100) + "<br>Pos: (" + d3.format(",.2f")(d.pos.x) + " |  " + d3.format(",.2f")(d.pos.y) + ")";
  });


////////////////////// Hüllen ////////////// 
function createHulls(selection){
  selection.enter()
    .append("path")
    .attr("class", "enter")
    .attr("d", c => c.makePolygons2Path(scale))// c={id, polygons}
    .attr('fill', "#993")
    .attr('stroke', "#993")
    .style("stroke-linejoin", "round")
    .style("stroke-width", "29px")
    .style('opacity', currHullOpacity)
    .on("mouseover", tooltipCluster.show)
    .on("mouseout", tooltipCluster.hide);
}

function deleteHulls(selection) {
  selection.exit()
    .attr("class", "remove")
    .transition()
    .duration(transDuration/3)
    .style("opacity", 0)
    .remove();
}

var tooltipCluster = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) {
    return "<b>Cluster-ID: " + d.id + "</b><br>Knotenzahl: " + d.getLength() + "<br>Keywords: " + newClusters.filter(c => c.id == d.id)[0].keywords.join(",<br>" + "&nbsp".repeat(20));
  });
  
var tooltipClusterMod = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) {
    return "<b>Cluster-ID: " + (d.id -100) + "</b><br>Knotenzahl: " + d.getLength();
  });
/*  

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

function cloneDataset(dataset){
  return dataset.map(function(d){return d.copy();});
}

function getFilteredData(datas){// https://stackoverflow.com/questions/39964570/how-to-filter-data-with-d3-js
  return datas.filter(function(node){
    return node.year >= zeitspanne[0] && node.year <= zeitspanne[1];
  });
}


////////////////// TRANSITIONEN //////////////////


//////////////// Ausgangszustand ////////////////////
function ausgangszustand(svgs, oldDataset, oldNests, scales){
  //////////////// Scaling ////////////////////
  var scale1 = scales[0];// beide sind identisch
  var scale2 = scales[1];
  var scale;
  if (scale1 != null)
    scale = scale1;
  if (scale2 != null)
    scale = scale2;
  scale.setDomain(oldDataset);
  
  for (var i in svgs) {
    var svg = svgs[i];
    if (svg != null) {
      //////////////// Kreise ////////////////////
      var circs = svg.svg.select("g.circs")
        .selectAll("circle.projekt")
        .data(oldDataset, function(d){return d.id;});
        
      circs.exit()
        .attr("class", "remove")
        .remove();
        
      circs.enter()
        .append("circle")
        .attr("class", "projekt")
        .attr("cx", function(d) {return scale.xScale(d.pos.x);})
        .attr("cy", function(d) {return scale.yScale(d.pos.y);})
        .attr("r", radius)
        .on("mouseover", tooltipNode.show)
        .on("mouseout", tooltipNode.hide)
        .style("fill", "yellow")
        .style("stroke", "orange")
        .style("stroke-width", "2px")
        .style("opacity", 1)
        .style("pointer-events", "all");
      
      svg.svg.select("g.circs")
        .selectAll("circle.projekt")
        .attr("cx", function(d) {return scale.xScale(d.pos.x);})
        .attr("cy", function(d) {return scale.yScale(d.pos.y);});
        
      //////////////// Hüllen ////////////////////
      var hulls = svg.svg.select("g.hulls")
        .selectAll("path.huelle")
        .data(oldNests.nest, function(d){return d.id;});
        
      hulls.exit()
        .attr("class", "remove")
        .remove();
        
      svg.svg.select("g.hulls")
        .selectAll("path.huelle")
        .attr("d", function(c){// c = Cluster{id, polygons}
          return c.makePolygons2Path(scale);}
        );
        
      hulls.enter()
        .append("path")
        .attr("class", "huelle")
        .attr("d", function(c){// c = Cluster{id, polygons}
          return c.makePolygons2Path(scale);}
        )
        .style('opacity', hullOpacity)
        .on("mouseover", tooltipCluster.show)
        .on("mouseout", tooltipCluster.hide)
        .attr('fill', "#993")
        .attr('stroke', "#993")
        .style("stroke-linejoin", "round")
        .style("stroke-width", "29px");
        
      //////////////// Labels ////////////////////
      var labelsCirc = svg.svg.select("g.beschriftung")
        .selectAll("text.projekt")
        .data(oldDataset, function(d){return d.id;});
        
      labelsCirc.exit()
        .attr("class", "remove")
        .remove();
      
      svg.svg.select("g.beschriftung")
        .selectAll("text.projekt")
        .attr("x", function(d) {return scale.xScale(d.pos.x);})
        .attr("y", function(d) {return scale.yScale(d.pos.y);});
        
      labelsCirc.enter()
        .append("text")
        .attr("class", "projekt")
        .attr("x", function(d) {return scale.xScale(d.pos.x);})
        .attr("y", function(d) {return scale.yScale(d.pos.y);})
        .style("font-size", "10px")
        .style("text-anchor", "middle")
        .attr("dy", "0.7ex")
        .text(function(d){return d.id;})
        .on("mouseover", tooltipNode.show)
        .on("mouseout", tooltipNode.hide);
        
      var labelsHull = svg.svg.select("g.beschriftung")
        .selectAll("text.huelle")
        .data(oldNests.nest, function(d){return d.id;});
        
      labelsHull.exit()
        .attr("class", "remove")
        .remove();
      
      svg.svg.select("g.beschriftung")
        .selectAll("text.huelle")
        .attr("x", function(c) {
          return getClusterLabelPos(c, scale).x;
        })
        .attr("y", function(c) {
          return getClusterLabelPos(c, scale).y;
        });
        
      labelsHull.enter()
        .append("text")
        .attr("class", "huelle")
        .attr("x", function(c) {
          return getClusterLabelPos(c, scale).x;
        })
        .attr("y", function(c) {
          return getClusterLabelPos(c, scale).y;
        })
        .style("font-size", "10px")
        .style("text-anchor", "middle")
        .attr("dy", "0.7ex")
        .text(function(d){return "Cluster " + d.id;})
        .on("mouseover", tooltipCluster.show)
        .on("mouseout", tooltipCluster.hide);
    } // Ende if != null Abfrage
  } // Ende der Schleife
}// Ende Funktion ausgangszustand


/////////// Transition ////////////
function transitions(svgs, newDataset, newNests, transTable, scales){
  var svg1 = svgs[0], svg2 = svgs[1];
  var scale1 = scales[0], scale2 = scales[1];
  // transTable enthält bereits Hüllen
  if (svg2 != null) {//---------"Transition"----------
    var circles = svg2.svg.select("g.circs")
      .selectAll("circle.projekt")
      .data(newDataset, function(d){return d.id;});
      
    var esGibtExit  = circles.exit()._groups[0]
      .map(c => c != undefined).some(b => b);
    var esGibtEnter = circles.enter()._groups[0]
      .map(c => c != undefined).some(b => b);
    //console.log('esGibtExit',esGibtExit, 'esGibtEnter',esGibtEnter);
    
    function gibtEsAggregateOPs(){
      if (transTable.old.nest.length != transTable.new.nest.length)
        return true;
      var ungleichheiten = false;
      transTable.old.nest.forEach(function(c,i){
        var d = transTable.new.nest[i];
        if (c.id != d.id)
          ungleichheiten = true;
        if (c.makeHulls2Path(scale2) != d.makeHulls2Path(scale2))
          ungleichheiten = true;
      });
      return ungleichheiten;
    }
    var esGibtAggregatOP = gibtEsAggregateOPs();
    //console.log('esGibtAggregatOP', esGibtAggregatOP);
      
    ///////// Hüllen 
    var hullsOld = svg2.svg.select("g.hulls")
      .selectAll("path.huelle")
      .data(transTable.old.nest, function(d){return d.id;});
      
    hullsOld.exit()// sollte es nicht geben
      .attr("class", "remove")
      .style("opacity", 0)
      .remove();
      
    hullsOld.attr("d", function(d){
      return d.makeHulls2Path(scale2);
    });
    
    hullsOld.enter()
      .append("path")
      .attr("class", "huelle")
      .attr("d", function(c){// c = Cluster{id, polygons}
        return c.makeHulls2Path(scale2);
      })
      .style('opacity', 0.1)// 0
      .on("mouseover", tooltipCluster.show)
      .on("mouseout", tooltipCluster.hide)
      .attr('fill', "#993")
      .attr('stroke', "#993")
      .style("stroke-linejoin", "round")
      .style("stroke-width", "29px");
      
    if (scale2 != null)
      scale2.setDomain(newDataset);
    
    // hier startet die Transition
    var hullsNew = svg2.svg.select("g.hulls")
      .selectAll("path.huelle")
      .data(transTable.new.nest, function(d){return d.id;});
      
    hullsNew.exit()
      .attr("class", "remove")
      .transition()
      .duration(transDuration/3)
      .style("opacity", 0)
      .remove();
      
    hullsNew.transition().ease(d3.easeQuadInOut)
      .delay(function(){
        if (esGibtExit)
          return transDuration/3;
        else
          return 0;
      })
      .duration(function(){
        if (esGibtExit || esGibtEnter)
          return transDuration*2/3;
        else
          return transDuration;
      })
      .style('opacity', hullOpacity)
      .attr("d", function(d){
        return d.makeHulls2Path(scale2);
      });
    
    hullsNew.enter()// sollte es nicht geben
      .append("path")
      .attr("class", "huelle")
      .attr("d", function(c){// c = Cluster{id, polygons}
        // Hülle taucht aus ihrem Mittelpunkt aus
        var pos = c.getSchwerpunkt();
        var node = new Knoten(pos, 0, 0, {}, 2019, [""])
        var poly = new Array(c.getLength()).fill(node);
        return new Polygon(poly).makeHulls2Path(scale2);
        //return c.makeHulls2Path(scale2);
      })
      .style('opacity', hullOpacity)// 0
      .on("mouseover", tooltipCluster.show)
      .on("mouseout", tooltipCluster.hide)
      .attr('fill', "#993")
      .attr('stroke', "#993")
      .style("stroke-linejoin", "round")
      .style("stroke-width", "29px")
      .transition()
      .delay(function(){
        if (esGibtExit)
          return transDuration/3;
        else
          return 0;
      })
      .duration(function(){
        if (esGibtExit || esGibtEnter)
          return transDuration*2/3;
        else
          return transDuration;
      })
      .style('opacity', hullOpacity)
      .attr("d", function(c){// c = Cluster{id, polygons}
        return c.makeHulls2Path(scale2);
      });
    
    d3.transition().duration(transDuration)
      .on("end", showNewDatas);
    
    function showNewDatas(){
      //console.log('Transition', ((new Date()-startTime)/1000) + " s");
      svg2.svg.select("g.hulls").selectAll("path.huelle")
        .data(new Nest(newDataset).nest, function(d){return d.id;})
        .attr("d", function(d){
          return d.makePolygons2Path(scale2);
        });
    }
    
    ////////// Kreise //////////////      
    circles.exit()
      .attr("class", "remove")
      .transition()
      .duration(function(){
        if (esGibtAggregatOP)
          return transDuration/3;
        else
          return transDuration;
      })
      .ease(d3.easeBackIn.overshoot(6))
      .attr("r", 0)
      .remove();
      
    svg2.svg.select("g.circs")
      .selectAll("circle.projekt")
      .transition()
      .delay(function(){
        if (esGibtExit)
          return transDuration/3;
        else
          return 0;
      })
      .duration(function(){
        if (esGibtExit || esGibtEnter)
          return transDuration*2/3;
        else
          return transDuration;
      })
      .ease(d3.easeQuadInOut)
      .attr("cx", function(d) {return scale2.xScale(d.pos.x);})
      .attr("cy", function(d) {return scale2.yScale(d.pos.y);})
      .style("pointer-events","visible");// https://stackoverflow.com/questions/34605916/d3-circle-onclick-event-not-firing
      
    circles.enter()
      .append("circle")
      .attr("class", "projekt")
      .attr("cx", function(d) {return scale2.xScale(d.pos.x);})
      .attr("cy", function(d) {return scale2.yScale(d.pos.y);})
      .attr("r", 0)
      .on("mouseover", tooltipNode.show)
      .on("mouseout", tooltipNode.hide)
      .style("fill", "yellow")
      .style("stroke", "orange")
      .style("stroke-width", "2px")
      .style("opacity", 1)
      .style("pointer-events", "all")
      .transition()
      .delay(function(){
        if (esGibtAggregatOP)
          return transDuration*2/3;
        else
          return 0;
      })
      .duration(function(){
        if (esGibtAggregatOP)
          return transDuration/3;
        else
          return transDuration;
      })
      .ease(d3.easeBackOut.overshoot(6))
      .attr("r", radius);
      
    ////////// Labels ////////////// 
    var labelsCircs = svg2.svg.select("g.beschriftung")
      .selectAll("text.projekt")
      .data(newDataset, function(d){return d.id;});
      
    labelsCircs.exit()
      .attr("class", "remove")
      .transition()
      .duration(function(){
        if (esGibtAggregatOP)
          return transDuration/3;
        else
          return transDuration;
      })
      .ease(d3.easeBackIn.overshoot(6))
      .style("font-size", "0px")
      //.style("opacity", 0)
      .remove();
      
    svg2.svg.select("g.beschriftung")
      .selectAll("text.projekt")
      .transition()
      .ease(d3.easeQuadInOut)
      .delay(function(){
        if (esGibtExit)
          return transDuration/3;
        else
          return 0;
      })
      .duration(function(){
        if (esGibtExit || esGibtEnter)
          return transDuration*2/3;
        else
          return transDuration;
      })
      .attr("x", function(d) {return scale2.xScale(d.pos.x);})
      .attr("y", function(d) {return scale2.yScale(d.pos.y);});
      
    labelsCircs.enter()
      .append("text")
      .attr("class", "projekt")
      .attr("x", function(d) {return scale2.xScale(d.pos.x);})
      .attr("y", function(d) {return scale2.yScale(d.pos.y);})
      .style("font-size", "0px")
      .style("text-anchor", "middle")
      .attr("dy", "0.7ex")
      //.style("opacity", 0)
      .text(function(d){return d.id;})
      .on("mouseover", tooltipNode.show)
      .on("mouseout", tooltipNode.hide)
      .transition()
      .delay(function(){
        if (esGibtAggregatOP)
          return transDuration*2/3;
        else
          return 0;
      })
      .duration(function(){
        if (esGibtAggregatOP)
          return transDuration/3;
        else
          return transDuration;
      })
      .ease(d3.easeBackOut.overshoot(6))
      //.style("opacity", 1)
      .style("font-size", "10px");
      
    var labelsHulls = svg2.svg.select("g.beschriftung")
      .selectAll("text.huelle")
      .data(newNests.nest, function(d){return d.id;});
      
    labelsHulls.exit()
      .attr("class", "remove")
      .transition()
      .duration(transDuration)
      .style("opacity", 0)
      .remove();
      
    svg2.svg.select("g.beschriftung")
      .selectAll("text.huelle")
      .transition()
      .ease(d3.easeQuadInOut)
      .delay(function(){
        if (esGibtExit)
          return transDuration/3;
        else
          return 0;
      })
      .duration(function(){
        if (esGibtExit || esGibtEnter)
          return transDuration*2/3;
        else
          return transDuration;
      })
      .attr("x", function(c) {
        return getClusterLabelPos(c, scale2).x;
      })
      .attr("y", function(c) {
        return getClusterLabelPos(c, scale2).y;
      });
      
    labelsHulls.enter()
      .append("text")
      .attr("class", "huelle")
      .attr("x", function(c) {
        return getClusterLabelPos(c, scale2).x;
      })
      .attr("y", function(c) {
        return getClusterLabelPos(c, scale2).y;
      })
      .style("font-size", "10px")
      .style("text-anchor", "middle")
      .attr("dy", "0.7ex")
      .style("opacity", 0)
      .text(function(d){return "Cluster " + d.id;})
      .on("mouseover", tooltipCluster.show)
      .on("mouseout", tooltipCluster.hide)
      .transition()
      .delay(transDuration*2/3)
      .duration(transDuration/3)
      .style("opacity", 1);
  }// Ende if != null (Transition)
}// Ende Funktion transition


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
    callAusgangszustand();
    var aufgabe = whoAmI();
    var inhalt, fileNr;
    var counter = 1;//var date = new Date();
    var n = 10;
    inhalt = createSVGcontent();
    zip.file(aufgabe +"-"+ "01.svg", inhalt);
    replay();
    // https://stackoverflow.com/questions/2170923/whats-the-easiest-way-to-call-a-function-every-5-seconds-in-jquery
    var interval = setInterval(function(){// hat eine leichte Verschiebung : 170 ms
      if (++counter <= n+1) {
        inhalt = createSVGcontent();
        fileNr = "0".slice(0, 2-counter.toString().length) +counter;
        zip.file((aufgabe +"-"+ fileNr +".svg"), inhalt);
      }
      else {
        clearInterval(interval);
        zip.generateAsync({type:"blob"}).then(function(blob) {
          saveAs(blob, aufgabe + ".zip" );
        });
      }
    }, transDuration/n);
  }
}

function createSVGcontent(){
  // https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
  var svgElem;
  var svgElements = document.getElementsByClassName("svg");
  if (svgElements.length > 1)
    svgElem = document.getElementsByClassName("svg")[1];
  else
    svgElem = document.getElementsByClassName("svg")[0];
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
  downloadLink.download = "test14-final.svg";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
*/
