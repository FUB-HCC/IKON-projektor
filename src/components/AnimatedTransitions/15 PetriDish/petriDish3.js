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

fillDataset(32);

function cloneDataset(){
  return dataset.map(function(d){return d.copy();});
}

function getFilteredData(datas){// https://stackoverflow.com/questions/39964570/how-to-filter-data-with-d3-js
  return datas.filter(function(node){
    return node.year >= zeitspanne[0] && node.year <= zeitspanne[1];
  });
}


//////////////////////// TESTUMGEBUNG
/*
var toggle = 0;
function fillDataset2(){
  dataset = [];
  var pos = {
    even: [[[4,0],[4,4],[0,6]], [[10,3],[5,3],[7,9]]],
    odd: [[[2,8],[2,10],[0,10],[0,7]], [[7,3],[7,8],[12,5]]]
  };
  var id = 0, p, fach;
  const keys = ["uhu", "wal", "hai"];
  var x;
  if (toggle%2==0) x = pos.even;
  else x = pos.odd;
  for (j in x) {
    for (k in x[j]) {
      p = new Position(x[j][k][0], x[j][k][1]);
      fach = forschungsgebiete[Index.getRandInt(0, forschungsgebiete.length-1)];
      dataset.push(new Knoten(p, id, j, fach, 2010, [keys[j]]));
      id++;
    }
  }
  //dataset.push(new Knoten(pos, id, clusterNo, researchArea, year, keywords));
}
fillDataset2();

function manuellUpdate(){
  var oldDatas = getFilteredData(cloneDataset());
  var oldNests = new Nest(oldDatas);
  
  toggle = (toggle+1)%2;
  fillDataset2();
  console.log(dataset);
  update(oldDatas, oldNests);
}*/
//////////////////////// ENDE: TESTUMGEBUNG


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
  .attr("value", function(d) {return d.name;})
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
    var oldNests = new Nest(oldDatas);
    
    checkboxen[i] = this.checked;
    
    //console.log(checkboxen);
    update(oldDatas, oldNests);
  });
  
/////////////// Schieberegeler Zeitspanne ///////////
d3.select("#jahrRange")
  .on("change", function(){
    var oldDatas = getFilteredData(cloneDataset());
    var oldNests = new Nest(oldDatas);
    
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
    var oldNests = new Nest(oldDatas);
    
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
  var oldNests = new Nest(oldDatas);
  
  // 8 zufällige Knoten aus dataset (!) wechseln die Hüllen
  // und bewegen sich auf diese zu, so sie existieren
  var currNode, currCluster;
  
  for (i=0; i<1; i++) {
    currNode = dataset[Index.getRandInt(0, dataset.length-1)];
    currNode.clusterNo = Index.getRandInt(0, clusterzahl);
    if (currNode.clusterNo < clusterzahl) {// bleibt innerhalb der existierenden Cluster
      currCluster = oldNests.nest.filter(function(d){
        return d.id == currNode.clusterNo;
      })[0];
      var mid = currCluster.getSchwerpunkt();
      // bewegt Knoten in Richtung Clustermitte
      currNode.pos = currNode.pos.getMid(mid).getMid(mid);
    }
    else { // ein neues Cluster ist entstanden
      // der Knoten soll sich von allen alten Clustern entfernen
      var mid = new Position(0,0); // Mittelpunkt aller Cluster
      oldNests.nest.forEach(function(cluster){
        mid = mid.add(cluster.getSchwerpunkt());
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
  var oldNests = new Nest(oldDatas);
  
  if(oldNests.nest.length > 1) {
  
    // sucht die 2 kleinsten Hüllen aus und fügt sie zusammen
    oldNests.nest.sort(function(c1,c2){
      return c1.getLength() - c2.getLength();
    });
    var id1 = oldNests.nest[0].id;
    var id2 = oldNests.nest[1].id;
    
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
    console.log("Es existiert nur eine Hülle, darum kann nicht gemerged werden.");
}

//////////////// SPLIT CLUSTER ///////////////
function splitCluster(){
  var oldDatas = getFilteredData(cloneDataset());
  var oldNests = new Nest(oldDatas);
  
  if(oldNests.getLength() > 0) {
  
    // sucht die größte Hüllen aus und teilt diese auf
    oldNests.nest.sort(function(c1,c2){
      return c2.getLength() - c1.getLength();
    });
    var biggestCluster = oldNests.nest[0];
    var idx = biggestCluster.id;
    
    if (biggestCluster.getLength() > 1) {
      // findet unbenutzte clusterNo
      var set = d3.set(gruppen.nest.map(function(d){return d.id;}));
      //console.log("set",set);
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
      })[0];
      cluster.mapToPolygons(function(p){
        p.mapToNodes(function(n){
          if (n.clusterNo == idx && Math.random() < 0.5)// WKT 1/2
            n.clusterNo = lowestKey; // wechselt Cluster
        });
      });
      /*
      cluster.polygons.forEach(function(p){
        return p.vertices.forEach(function(node,i){
          if (node.clusterNo == idx && Math.random() < 0.5){// WKT 1/2
            node.clusterNo = lowestKey; // wechselt Cluster
          }
        });
      });*/
      
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
  
  var newDatas = getFilteredData(dataset);
  var newNests = new Nest(getFilteredData(dataset));
  var filteredData = getFilteredData(dataset);
  var transTable = oldNests.createTransitionNests(newNests);
  
  var hulls = svg.svg.select("g.hulls").selectAll("path.class42")
    .data(transTable[0].nest, function(d){return d.id;});
  
  console.log("transTable[0]",transTable[0].nest);
  
  hulls.enter()
    .append("path")
    .attr("class", "class42")
    .attr("d", function(d){// neue Pfade kommen hinzu
      return d.makeHulls2Path(scale);
    })
    .attr("opacity", 0)
    .attr('fill', "gray")
    .attr('stroke', "gray")
    .on("mouseover", tooltipCluster.show)
    .on("mouseout", tooltipCluster.hide)
  .merge(hulls)
    .attr("d", function(d){// neue Pfade kommen hinzu, läuft
      //console.log("vertices v",d);
      //console.log("path vorher",d.makeHulls2Path(scale));
      return d.makeHulls2Path(scale);
    })
    //.attr('fill', "green")
    .attr("opacity", 0.3);
  
  var hulls2 = svg.svg.select("g.hulls").selectAll("path.class42")
    .data(transTable[1].nest, function(d){return d.id;});
  
  console.log("transTable[1]",transTable[1].nest);
  
  scale.setDomain(filteredData);
  
  hulls2.enter()
    .append("path")
    .attr("class", "class42")
    .attr("d", function(d){// neue Pfade kommen hinzu, sollte hier nicht sein
      return d.makeHull2Path(scale);
    })
    .attr("opacity", 0)
    .attr('fill', "gray")
    .attr('stroke', "gray")
    .on("mouseover", tooltipCluster.show)
    .on("mouseout", tooltipCluster.hide)
  .merge(hulls2)
    .transition() // Transition
    .delay(delay+1000)
    .duration(1000)
    .ease(d3.easeQuadInOut)
    .attr("d", function(d){// Pfade werden geändert, hier entsteht Müll
      //console.log("vertices n",d);
      //console.log("path nachher",d.makeHulls2Path(scale));
      return d.makeHulls2Path(scale);
    })
    //.attr('fill', "blue")
    .attr("opacity", 0.3)
    .on("end", showNewDatas);
  
  hulls2.exit()// bei verschmelzen: einer im exit() drin
    .transition().delay(delay+1000)
    .duration(1000)
    .on("end", showNewDatas)
    .attr("opacity", 0)
    .remove();
  
  function showNewDatas(){
    var hulls3 = svg.svg.select("g.hulls").selectAll("path.class42")
      .data(new Nest(filteredData).nest, function(d){return d.id;});
    
    hulls3.enter()
      .append("path")
      .attr("class", "class42")
      .attr("d", function(d){// neue Pfade kommen hinzu, sollte eigentlich nicht sein
        return d.makeHull2Path(scale);
      })
      .attr("opacity", 0)
      .attr('fill', "gray")
      .attr('stroke', "gray")
      .on("mouseover", tooltipCluster.show)
      .on("mouseout", tooltipCluster.hide)
    .merge(hulls2)
      .attr("d", function(d){// Pfade werden geändert
        return d.makePolygons2Path(scale);
      })
      //.attr('fill', "red")
      .attr("opacity", 0.3);
      
    hulls3.exit().remove();
  }
  
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
