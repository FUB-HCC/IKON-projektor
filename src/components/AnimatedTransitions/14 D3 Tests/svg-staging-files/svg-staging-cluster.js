//////////////// SVG ////////////////////
var svg42 = new SVG("#svg42");

//////////////// Scaling ////////////////////
var scale42 = new Scale(datasetStaging);

//////////////// Hülle ////////////////////
var hull42 = new Huellen(stagingGroups, svg42.svg, "class42", scale42);
//console.log(hull42.hullVertices);

//////////////// Kreise ////////////////////
var circs42 = new Farbkreise(datasetStaging, svg42.svg, "class42", scale42, function(d){return d.id;}, tooltipIdx, staggGroupsNumber);


///////////////////// BEWEGUNG //////////////////
function moveClusterCirclesCluster(oldNest) {
  // aktualisiert die Daten
  var circles = svg42.svg.selectAll("circle.class42")
    .data(datasetStaging, function(d){return d.id;});
  
  var hull = svg42.svg.selectAll("path.class42")
    .data(stagingGroups);
  
  scale42.domain(datasetStaging);
  
  // führt Transitionen aus
  svg42.svg.selectAll("circle.class42")
    .transition()
    .duration(singleStagingDuration)// gesStagingDuration
    .delay(function(d){return (d.id-1) * singleStagingDuration;})
    .ease(d3.easeQuadInOut)// d3.easeQuadInOut, d3.easeLinear, d3.easePolyInOut.exponent(3)
    .attr("cx", function(d) {return scale42.xScale(d.x);})
    .attr("cy", function(d) {return scale42.yScale(d.y);});

  svg42.svg.selectAll("path.class42")
    .transition()
    .duration(singleStagingDuration)// gesStagingDuration
    .delay(function(d){return (d.key-1) * singleStagingDuration;})
    .ease(d3.easeQuadInOut)
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
      return makeHull2Path(newHull, scale42);//d.values
    });
}
