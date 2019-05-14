//////////////// Variablen //////////////
var clusterzahl = 4;
var currID = 1;
var zeitspanne = [1980,2019];
var positionsRegler = 0;
var checkboxen = {};

//////////////// Dataset ////////////////
var dataset = [];

function fillDataset(anz){
  var pos, id, gerade, clusterNo, researchArea, year, keywords;
  for(i=0; i<anz; i++){
    pos = new Position(Float.getRandFloat(0,width), Float.getRandFloat(0,height));
    id = currID++;
    gerade = new Gerade(new Position(width/2, height/2), pos);
    clusterNo = Math.floor(gerade.getAngle() / (2*Math.PI) * clusterzahl);
    researchArea = forschungsgebiete[Index.getRandInt(0, forschungsgebiete.length-1)];
    keywords = [Keywords.getRandStr(researchArea, clusterNo), Keywords.getRandStr(researchArea, clusterNo), Keywords.getRandStr(researchArea, clusterNo)];;
    year = Index.getRandInt(zeitspanne[0], zeitspanne[1]);
    dataset.push(new Knoten(pos, id, clusterNo, researchArea, year, keywords));
  }
}

fillDataset(6);

function cloneDataset(){
  return dataset.map(function(d){return d.copy();});
}

function getFilteredData(datas){// https://stackoverflow.com/questions/39964570/how-to-filter-data-with-d3-js
  return datas.filter(function(node){
    return node.year >= zeitspanne[0] && node.year <= zeitspanne[1];
  });
}

//////////////// SVG ////////////////////
var svg = new SVG("#svg");

//////////////// Scaling ////////////////////
var scale = new Scale(dataset);
scale.setDomain(getFilteredData(dataset));

//////////////// Kreise ////////////////////
var circs = new Kreise(getFilteredData(dataset), svg, "class42", scale);

//////////////// Hüllen ////////////////////
var gruppen = new Nest(getFilteredData(dataset));
var pfade = new Pfade(gruppen, svg, "class42", scale);

/////////////// Forschungsgebiete ///////////
  // https://stackoverflow.com/questions/28433997/d3-how-to-create-input-elements-followed-by-label-text
var radios = d3.select('#checkboxen')
  .selectAll('input[name="forschungsgebiete"]')
  .data(forschungsgebiete);

var labels = radios.enter()
  .append("div")
  .append("label")
  .append("input")
  .attr("type", "checkbox")
  .attr("name", "forschungsgebiete")
  .attr("value", function(d) { return d.name; })
  .attr("checked", true)
  .each(function(d,i){checkboxen[i] = true;});
  
d3.selectAll("label")
  .append("text")
  .text(function(d) {return d.name;})
  .style("color", function(d){
    return d3.rgb(colorScheme[d.disziplin]).brighter(2);
  });

d3.selectAll('input[name="forschungsgebiete"]')
  .on('change', function(d,i) {
    var oldDatas = getFilteredData(cloneDataset());
    var oldNests = new Nest(oldDatas).nest;
    
    checkboxen[i] = this.checked;
    
    //console.log(checkboxen);
    update(oldDatas, oldNests);
  });
  
/////////////// Schieberegeler Zeitspanne ///////////
d3.select("#jahrRange")
  .on("change", function(){
    var oldDatas = getFilteredData(cloneDataset());
    var oldNests = new Nest(oldDatas).nest;
    
    // aktualisiert den Text und die Variable zeitspanne
    var min = document.getElementById("jahrRange")
      .value.split(",")[0];
    document.getElementById("leftRange").textContent = min;
    zeitspanne[0] = parseInt(min);
    
    var max = document.getElementById("jahrRange")
      .value.split(",")[1];
    document.getElementById("rightRange").textContent = max;
    zeitspanne[1] = parseInt(max);
    
    //console.log("zeitspanne: " + zeitspanne.join(", "));
    update(oldDatas, oldNests);
  });
  
/////////////// Schieberegeler Perspektive ///////////
d3.select("#changePos")
  .on("change", function(){
    var oldDatas = getFilteredData(cloneDataset());
    var oldNests = new Nest(oldDatas).nest;
    
    // passt die Variable positionsRegler an
    var neuerStand = document.getElementById("changePos")
      .value;
    var differenz = neuerStand - positionsRegler;
    positionsRegler = neuerStand;
    
    // ändert die Positionen aller Knoten
    dataset.forEach(function(d){
      var richtungen = [-1,1];
      var rx = richtungen[Index.getRandInt(0,1)];
      d.pos.x += (rx*differenz*4);
      var ry = richtungen[Index.getRandInt(0,1)];
      d.pos.y += (ry*differenz*4);
    });
    //console.log(positionsRegler);
    
    // positioniert alle Cluster
    gruppen.nest.forEach(function(c){
      c.positioniereCluster(clusterzahl+1);
    });
    
    gruppen = new Nest(getFilteredData(dataset));
    update(oldDatas, oldNests);
  });
  
//////////////// Button: Clusterwechsel //////////
function nodeChangeCluster(){
  var oldDatas = getFilteredData(cloneDataset());
  var oldNests = new Nest(oldDatas).nest;
  
  // 8 zufällige Knoten aus dataset (!) wechseln die Hüllen
  // und bewegen sich auf diese zu, so sie existieren
  var currNode, currCluster;
  
  for (i=0; i<1; i++) {
    currNode = dataset[Index.getRandInt(0, dataset.length-1)];
    currNode.clusterNo = Index.getRandInt(0, clusterzahl);
    if (currNode.clusterNo < clusterzahl) {// bleibt innerhalb der existierenden Cluster
      currCluster = oldNests.filter(function(d){
        return d.id == currNode.clusterNo;
      })[0];
      var mid = currCluster.polygon.getSchwerpunkt();
      // bewegt Knoten in Richtung Clustermitte
      currNode.pos = currNode.pos.getMid(mid).getMid(mid);
    }
    else { // ein neues Cluster ist entstanden
      // der Knoten soll sich von allen alten Clustern entfernen
      var mid = new Position(0,0); // Mittelpunkt aller Cluster
      oldNests.forEach(function(cluster){
        mid = mid.add(cluster.polygon.getSchwerpunkt());
      });
      mid = mid.div(clusterzahl);
      var g = new Gerade(mid, currNode.pos);
      g.richtung = g.richtung.mul(1.5);
      currNode.pos = g.getPositionB();
    }
  }
  var newNest = new Nest(dataset);
  clusterzahl = newNest.getLength();
  
  gruppen = new Nest(getFilteredData(dataset));
  update(oldDatas, oldNests);
}


//////////////// MERGE CLUSTER ///////////////
function mergeCluster(){
  var oldDatas = getFilteredData(cloneDataset());
  var oldNests = new Nest(oldDatas).nest;
  
  if(oldNests.length > 1) {
  
    // sucht die 2 kleinsten Hüllen aus und fügt sie zusammen
    oldNests.sort(function(c1,c2){
      return c1.getLength() - c2.getLength();
    });
    var id1 = oldNests[0].id;
    var id2 = oldNests[1].id;
    
    // alle Knoten aus Cluster1 gehen zu Cluster2 über
    dataset.forEach(function(node){
      if (node.clusterNo == id1) // wechselt
        node.clusterNo = parseInt(id2);
    });
    
    // positioniert alle Cluster
    var newNests = new Nest(dataset).nest;
    newNests.forEach(function(c){
      c.positioniereCluster(clusterzahl+1);
    });
    // bewegt alle Punkte zu ihrem neuen Clustermittelp.
    newNests.filter(function(c){
      return c.id == id1 || c.id == id2;
    }).forEach(function(c){
      c.moveVertsCloserTogether(0.15);
    });
    
    clusterzahl--;
    
    gruppen = new Nest(getFilteredData(dataset));
    update(oldDatas, oldNests);
  }
  else
    console.log("Es existiert nur eine Hülle, arum kann nicht gemerged werden.");
}

//////////////// SPLIT CLUSTER ///////////////
function splitCluster(){
  var oldDatas = getFilteredData(cloneDataset());
  var oldNests = new Nest(oldDatas).nest;
  
  if(oldNests.length > 0) {
  
    // sucht die größte Hüllen aus und teilt diese auf
    oldNests.sort(function(c1,c2){
      return c2.getLength() - c1.getLength();
    });
    var biggestCluster = oldNests[0];
    var idx = biggestCluster.id;
    
    if (biggestCluster.getLength() > 1) {
      // findet unbenutzte clusterNo
      var set = d3.set(gruppen.nest.map(function(d){return d.id;}));
      console.log("set",set);
      var lowestKey = 0;
      for (k=0; k <= clusterzahl; k++)
        if (! set.has(k)) {
          lowestKey = parseInt(k);
          break;
        }
      //console.log("lowestKey",lowestKey);
      
      // teilt die Knoten nach Index auf
      var cluster = gruppen.nest.filter(function(d){
        return d.id == idx;
      })[0].polygon;
      cluster.vertices.forEach(function(node,i){
        if (node.clusterNo == idx && Math.random() < 0.5){// WKT 1/2
          node.clusterNo = lowestKey; // wechselt Cluster
        }
      });
      
      // positioniert alle Cluster
      var newNests = new Nest(dataset).nest;
      newNests.forEach(function(c){
        c.positioniereCluster(clusterzahl+1);
      });
      // bewegt alle Punkte zu ihrem neuen Clustermittelp.
      newNests.filter(function(c){
        return c.id == idx || c.id == lowestKey;
      }).forEach(function(c){
        c.moveVertsCloserTogether(0.15);
      });
      
      clusterzahl++;
      gruppen = new Nest(getFilteredData(dataset));
      update(oldDatas, oldNests);
    }
    else
      console.log("Es gibt pro Cluster nur ein Knoten, darum kann nicht gesplittet werden.");
  }
  else
    console.log("Es gibt kein Cluster, darum kann nicht gesplittet werden.");
}
  
////////////////// UPDATE //////////////
function update(oldDatas, oldNests){// (oldDatas, oldNests, delay)
  var delay = 0;
  var t0 = svg.svg.transition()
    .duration(1000)
    .ease(d3.easeQuadInOut);
    
  var newDatas = getFilteredData(dataset);
  var newNests = new Nest(getFilteredData(dataset)).nest;
  var filteredData = getFilteredData(dataset);
    
  var transTable = new Polygon(oldDatas).createTransTable(newDatas);
  
  console.log("transTable",transTable);
  console.log("old",Polygon.filterTransTable(transTable, "old"));
  
  var hulls = svg.svg.select("g.hulls").selectAll("path.class42")
    .data(Polygon.filterTransTable(transTable, "old"), function(d){
      return d.id;
    });
    
  console.log("hulls",hulls);
   
  hulls.enter()
    .append("path")
    .attr("class", "class42")
    .attr("d", function(d){// neue Pfade kommen hinzu
      var path = d.makeHull2Path(scale);
      return path;}
    )
    .style("opacity", 0)
    .attr('fill', "gray")
    .attr('stroke', "gray")
    .on("mouseover", tooltipCluster.show)
    .on("mouseout", tooltipCluster.hide)
    .merge(hulls)
    .attr("d", function(d){// neue Pfade kommen hinzu
      var path = d.makeHull2Path(scale);
      return path;}
    ).attr('fill', "gray");
    
  var hulls2 = svg.svg.select("g.hulls").selectAll("path.class42")
    .data(Polygon.filterTransTable(transTable, "new"), function(d){
      return d.id;
    });
    
  console.log("new",Polygon.filterTransTable(transTable, "new"));
  console.log("hulls2",hulls2);
    
  scale.setDomain(filteredData);
  
  hulls2.enter()
    .append("path")
    .attr("class", "class42")
    .attr("d", function(d){// neue Pfade kommen hinzu
      var path = d.makeHull2Path(scale);
      return path;}
    )
    .style("opacity", 0)
    .attr('fill', "green")
    .attr('stroke', "gray")
    .on("mouseover", tooltipCluster.show)
    .on("mouseout", tooltipCluster.hide)
    .merge(hulls2)
    .transition()
    .delay(delay+1000)
    .duration(2000)
    .ease(d3.easeQuadInOut)
    .attr("d", function(d){// Pfade werden geändert
      var path = d.makeHull2Path(scale);
      return path;}
    )
    .style("opacity", 0.3);
  
  ////////////////////// Hüllen //////////////////////
//   var newNests = new Nest(getFilteredData(dataset));
//   
//   //console.log("neueNester",neueNester);
//   
//   var filteredData = getFilteredData(dataset);
// 
//   
//   var hulls = svg.svg.select("g.hulls").selectAll("path.class42")
//     .data(newNests, function(d){return d.id;});
//   
//   hulls.enter()
//     .append("path")
//     .attr("class", "class42")
//     .attr("d", function(d){// neue Pfade kommen hinzu
//       return d.getHullVertices().makeHull2Path(scale);}
//     )
//     .style("opacity", 0)
//     .attr('fill', "gray")
//     .attr('stroke', "gray")
//     .on("mouseover", tooltipCluster.show)
//     .on("mouseout", tooltipCluster.hide)
//     .merge(hulls)
//       .each(function(c){// füllt ggf. mit interpolierten Knoten auf
//         var oldHull, newHull;
//         newHull = c.copy().getHullVertices();
//         var nestX = oldNests.find(function(d){return d.id == c.id});
//         if (nestX != undefined) {// es gab eine alte Hülle gleicher ID
//           oldHull = nestX.getHullVertices(); // sind Polygone
//           var huellen = oldHull.huellenAbgleichen(newHull);
//           oldHull = huellen[0];
//           newHull = huellen[1];
//           d3.select(this)
//             .attr("d", oldHull.makeHull2Path(scale))
//             .transition().delay(delay+1000)
//             .duration(1000).ease(d3.easeQuadInOut)
//             .on("start", function(){
//               scale.setDomain(filteredData);
//             })
//             .style("opacity", 0.3)
//             //.attr("fill", "red")
//             .attr("d", newHull.makeHull2Path(scale))
//             //.attr("fill", "yellow")
//             .on('end', function() {
//               d3.select(this)
//               .attr("d", newHull.copy()
//                 .delUnneccessaryNodes()
//                 .makeHull2Path(scale));
//               //.attr("fill", "cyan");
//               }
//             );
//         }
//         else
//           d3.select(this)
//             .transition().delay(delay+1000)
//             .on("start", function(){
//               scale.setDomain(filteredData);
//             })
//             .duration(1000).ease(d3.easeQuadInOut)
//             .attr("d", newHull.makeHull2Path(scale))
//             //.attr("fill", "green")
//             .style("opacity", 0.3);
//       });
  /*
  hulls2.exit()
    .transition().delay(delay+2000)
    .duration(1001)
    .style("opacity", 0)
    .remove();*/
    
  ////////////////////// Kreise //////////////////////
  var circles = svg.svg.select("g.circs")
    .selectAll("circle.class42")
    .data(getFilteredData(dataset), function(d){return d.id;});
  
  circles.enter()
    .append("circle").attr("class", "class42")
    .attr("cx", function(d){return scale.xScale(d.pos.x);})
    .attr("cy", function(d){return scale.yScale(d.pos.y);})
    .attr("r", 0)
    .on("mouseover", tooltipNode.show)
    .on("mouseout", tooltipNode.hide)
    .style("stroke", function(d){
      return d3.rgb(colorScheme[d.researchArea.disziplin]).brighter(2);
    })// .darker(2)
    .style("fill", function(d){
      return d3.rgb(colorScheme[d.researchArea.disziplin]);
    })
    .style("opacity", 1)
    .merge(circles)
      .each(function(d){
        var obj = this;// svg-Element "circle"
        // d3.select(this) ist der dataset-Eintrag
        if (d.year < zeitspanne[0] || d.year > zeitspanne[1]) {
          d3.select(this).transition()
          .duration(1000)
          .ease(d3.easeBackIn.overshoot(5))
          .attr("r", 0)
          .style('pointer-events', 'none');
        }
        else {
          d3.select(this).transition()
          .duration(1000)
          .ease(d3.easeBackOut.overshoot(5))
          .attr("r", 5)
          .style('pointer-events', 'all');
        }
      })
      .transition().duration(1000).delay(1000).ease(d3.easeQuadInOut)
      .attr("cx", function(d){return scale.xScale(d.pos.x);})
      .attr("cy", function(d){return scale.yScale(d.pos.y);})
      .style("opacity", function(d){
        if (! checkboxen[d.researchArea.id])
          return 0.3;
        else
          return 1;
      });
      
  circles.exit()
    .transition().delay(delay).duration(1000)
    .ease(d3.easeBackIn.overshoot(3))
    .attr("r", 0)
    .remove();
    
} // Ende: Funktion update
