//////////////// SVG ////////////////////
var svg43 = new SVG("#svg43");

//////////////// Scaling ////////////////////
var scale43 = new Scale(datasetStaging);

//////////////// Hülle ////////////////////
var hull43 = new Huellen(stagingGroups, svg43.svg, "class43", scale43);
//console.log(hull43.hullVertices);

//////////////// Kreise ////////////////////
var circs43 = new Farbkreise(datasetStaging, svg43.svg, "class43", scale43, function(d){return d.id;}, tooltipIdx, staggGroupsNumber);


///////////////////// BEWEGUNG //////////////////
function moveClusterCirclesNoTrans(oldNest) {
  // aktualisiert die Daten
  var circles = svg43.svg.selectAll("circle.class43")
    .data(datasetStaging, function(d){return d.id;});
  
  var hull = svg43.svg.selectAll("path.class43")
    .data(stagingGroups);
  
  scale43.domain(datasetStaging);
  // huellenAbgleichen(p1,p2)
  
//   console.log(oldNest);
//   console.log(stagingGroups);
  
  // führt Transitionen aus
  svg43.svg.selectAll("circle.class43")
    .transition()
    .duration(1)
    .delay(gesStagingDuration-1)
    .attr("cx", function(d) {return scale43.xScale(d.x);})
    .attr("cy", function(d) {return scale43.yScale(d.y);});

  svg43.svg.selectAll("path.class43")
    .transition()
    .duration(1)
    .delay(gesStagingDuration-1)
    .attr("d", function(d){// d={key, values}
      var newHull = copyPolygon(d.values);
      var oldHull = oldNest.filter(function(e){
        return e.key == d.key;
      })[0].values;
      var huellen = huellenAbgleichen(oldHull, newHull);
      if (huellen[1].length > 2)
        newHull = delUnneccessaryNodes(huellen[1]);
      else
        newHull = huellen[1];
      return makeHull2Path(newHull, scale43);//d.values
    });
}
