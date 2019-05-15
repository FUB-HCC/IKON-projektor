//////////////// SVG ////////////////////
var svg41 = new SVG("#svg41");

//////////////// Scaling ////////////////////
var scale41 = new Scale(datasetStaging);

//////////////// Hülle ////////////////////
var hull41 = new Huellen(stagingGroups, svg41.svg, "class41", scale41);
//console.log(hull41.hullVertices);

//////////////// Kreise ////////////////////
var circs41 = new Farbkreise(datasetStaging, svg41.svg, "class41", scale41, function(d){return d.id;}, tooltipIdx, staggGroupsNumber);


///////////////////// BEWEGUNG //////////////////
function moveClusterCirclesLinear(oldNest) {
  // aktualisiert die Daten
  var circles = svg41.svg.selectAll("circle.class41")
    .data(datasetStaging, function(d){return d.id;});
  
  var hull = svg41.svg.selectAll("path.class41")
    .data(stagingGroups);
  
  scale41.domain(datasetStaging);
  // huellenAbgleichen(p1,p2)
  
//   console.log(oldNest);
//   console.log(stagingGroups);
  
  // führt Transitionen aus
  svg41.svg.selectAll("circle.class41")
    .transition()
    .duration(gesStagingDuration)// singleStagingDuration
    //.delay(j*singleStagingDuration)
    .ease(d3.easeQuadInOut)// d3.easeQuadInOut, d3.easeLinear, d3.easePolyInOut.exponent(3)
    .attr("cx", function(d) {return scale41.xScale(d.x);})
    .attr("cy", function(d) {return scale41.yScale(d.y);});

  svg41.svg.selectAll("path.class41")
    .transition()
    .duration(gesStagingDuration)// singleStagingDuration
    //.delay(j*singleStagingDuration)
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
      return makeHull2Path(newHull, scale41);//d.values
    });
}
