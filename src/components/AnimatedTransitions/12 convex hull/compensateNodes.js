////////////// Button //////////////
var buttonUpdate3 = d3.select("body")
  .append("button")
  .text("update");
d3.select("body").append("br");

buttonUpdate3.on("click", function(){
  compensateNodes();
});

//////////////// Datas ////////////////////
var vertices3 = [];

function createVertices(){
  var vertices = [];
  var knotenzahl = Math.random()*5+3;
  var angle = d3.range(knotenzahl)
    .map(function(d){
      return Math.random()*(2*Math.PI);
    }).sort(function(a,b){return b-a});// ordnet die Punkte im Uhrzeigersinn an, da die Hülle auch so verläuft

  vertices = angle.map(function(a){// konvexes Polygon
    var r = Math.random()*20+1;
    var x = r * Math.cos(a);
    var y = r * Math.sin(a);
    return {x: x, y: y};
  });
  // sucht nach dem größten x, fängt bei diesem im Urhzeigersinn an
  var maxX = null;
  var maxXidx;
  vertices.forEach(function(d,i){
    if (maxX == null || d.x > maxX){
      maxX = d.x;
      maxXidx = i;
  }
  });
  // var maxX = d3.max(vertices, function(d,i){return [d.x,d.y,i];}); // funzt nicht richtig
  // fängt beim Punkt mit größtem x an, geht im Uhrzeigersinn
  return vertices.slice(maxXidx).concat(vertices.slice(0,maxXidx));
  // https://www.w3schools.com/jsref/jsref_slice_array.asp
}

vertices3 = createVertices();

////////////////// Scaling ////////////
var xScale3 = d3.scaleLinear()
  .domain([d3.min(vertices3, function(d){return d.x;}), d3.max(vertices3, function(d){return d.x;})])
  .range([0, width]);
var yScale3 = d3.scaleLinear()
  .domain([d3.min(vertices3, function(d){return d.y;}), d3.max(vertices3, function(d){return d.y;})])
  .range([height, 0]);

//////////////// SVG ////////////////////
var svg3 = d3.select("body")
  .append("svg")
  .attr("class", "compensate")
  .attr("width",  width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//////////////// Hülle ////////////////////  
var hullVertices3 = (vertices3.length < 3) ? vertices3 : d3.polygonHull(vertices3);

var hull3 = svg3.selectAll("path.compensate")
  .data([hullVertices3])
  .enter()
  .append("path")
  .attr("class", "compensate")
  //.attr("d", function(d){return "M"+d.join("L")+"Z";})
  .attr("d", function(d){return "M "+d.map(function(d){return [xScale3(d.x), yScale3(d.y)];}).join(" L ")+" Z";})
  .attr('fill', 'pink')
  .attr("fill-opacity", 0.4)
  .attr('stroke', 'pink')
  .attr('stroke-width', '10')
  .style("stroke-linejoin", "round"); // shape the line join
  // http://www.d3noob.org/2014/02/styles-in-d3js.html

///////////// Polygonzug /////////////
var polygon3 = svg3.selectAll("polygon.compensate")
  .data([vertices3])
  .enter()
  .append("polygon")
  .attr("class", "compensate")
  .attr("points", function(d){
    return d.map(function(d){
      return [xScale3(d.x), yScale3(d.y)].join(",");
    }).join(" ");
  })
  .style("fill", "gray")
  .style("fill-opacity", 0.1)
  .style("stroke", "gray")
  .style("stroke-width", 2);
  
/////////////// Zentrum //////////////////
var center3 = d3.polygonCentroid(vertices3
  .map(function(d){return [d.x, d.y]}));

var circM3 = svg3.append("circle")
  .attr("class", "compensatecenter")
  .attr("cx", function(){return xScale3(center3[0]);})
  .attr("cy", function(){return yScale3(center3[1]);})
  .attr("r",  3)
  .style("stroke", "red")
  .style("stroke-width", 1.5)
  .style("fill", "red")
  .style("fill-opacity", 0.5);

//////////////// Kreise ///////////////
var circs3 = svg3.selectAll("circle.compensate")
  .data(vertices3)
  .enter()
  .append("circle")
  .attr("class", "compensate")
  .attr("cx", function(d) {return xScale3(d.x);})
  .attr("cy", function(d) {return yScale3(d.y);})
  .attr("r",  3)
  .style("stroke", "orange")
  .style("stroke-width", 2)
  .style("fill", "yellow");
  
//////////// Axen /////////////
var xAxis3 = d3.axisBottom(xScale3);
var yAxis3 = d3.axisLeft(yScale3).ticks(6);

var xAchse3 = svg3.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis3)
  .append("text")
    .attr("transform", "translate("+width+",-10)")
    .attr("dy", ".71em")
    .style("text-anchor", "left")
    .text("x-Achse");
  
var yAchse3 = svg3.append("g")
  .attr("class", "y axis")
  .call(yAxis3)
  .append("text")
    .attr("transform", "translate(20,-12)")
    .attr("dy", ".71em")
    .style("text-anchor", "right")
    .text("y-Achse");

    
///////////// Funktion //////////
function equalNodes(n1,n2){
  var fehler = 0.000001
  return Math.abs(n1.x-n2.x)<fehler && Math.abs(n1.y-n2.y)<fehler;
}

function copyArr(arr){
  var newArr = Array(arr.length).fill();
  arr.forEach(function(d,i){
    newArr[i] = {x: d.x, y: d.y};
  });
  return newArr;
}

//////////////// Transition ///////////
function compensateNodes(){
  // aktualisiert die Daten
  var currVertices = createVertices();
  
  console.log("vertices3:");
  console.log(copyArr(vertices3));
  
  console.log("currVertices:");
  console.log(copyArr(currVertices));
  
  var hinzugefuegteKnoten = false;
  // aktualisiert die Scalings
  xScale3.domain([d3.min(currVertices, function(d){return d.x;}), d3.max(currVertices, function(d){return d.x;})]);
  yScale3.domain([d3.min(currVertices, function(d){return d.y;}), d3.max(currVertices, function(d){return d.y;})]);
  if (currVertices.length != vertices3.length) {
    // schafft Ausgleich der Knotenzahl
    var diffNodes;
    var randPos;
    if (currVertices.length > vertices3.length) {
      // vertices3 wird aufgefüllt
      diffNodes = currVertices.length - vertices3.length;
      for (k=diffNodes; k>0; k--){
        randPos = Math.floor(Math.random()*(vertices3.length-1));
        var randPoint = vertices3[randPos];
        // fügt einen Knoten danach noch einmal ein
        // https://www.w3schools.com/jsref/jsref_splice.asp
        vertices3.splice(randPos+1, 0, {x: randPoint.x, y: randPoint.y});
      }
      // AKTUALISIERT DIE GRAFIKEN
      // --------- Kreise ---------
      
      var currCircs = circs3.data(vertices3);
      currCircs.exit().remove(); // entfernt nicht mehr gebrauchte
      currCircs.enter()
        .append("circle")
        .attr("class","compensate")
        .attr("cx", function(d) {return xScale3(d.x);})
        .attr("cy", function(d) {return yScale3(d.y);});
      // --------- Polygon --------
      polygon3.exit().remove();
      polygon3.data([vertices3]).enter();
        //.append("polygon").attr("class","compensate");
      svg3.selectAll("polygon.compensate")// Polygonzug
        .attr("points", function(d){
          return d.map(function(d){
            return [xScale3(d.x), yScale3(d.y)].join(",");
          }).join(" ");
        });
      // --------- Hülle ---------
      hull3.exit().remove();
      hull3.data([(vertices3.length < 3) ? vertices3 : d3.polygonHull(vertices3)]).enter();
        //.append("path").attr("class","compensate");
      svg3.selectAll("path.compensate")// Hülle
        .attr("d", function(d){return "M"+d.map(function(d){return [xScale3(d.x), yScale3(d.y)];}).join("L")+"Z";});
      
      console.log("|currVertices| > |vertices3|");
      console.log("aufgefüllte vertices3:");
      console.log(copyArr(vertices3));
    }
    else {// currVertices wird aufgefüllt
      hinzugefuegteKnoten = true;
      diffNodes = vertices3.length - currVertices.length;
      var currPoint;
      for (k=diffNodes; k>0; k--){
        randPos = Math.floor(Math.random()*(currVertices.length-1));
        currPoint = currVertices[randPos];
        // fügt einen Knoten danach noch einmal ein
        currVertices.splice(randPos+1, 0, {x: currPoint.x, y: currPoint.y}); 
      }
      
      console.log("|currVertices| < |vertices3|");
      console.log("aufgefüllte currVertices:");
      console.log(copyArr(currVertices));
    }
  }
  // TRANSITION
  var t0 = svg3.transition().duration(3000).ease(d3.easeQuadInOut);
  // --------- Kreise ---------
  circs3.exit().remove();
  circs3.data(currVertices).enter();
    //.append("circle").attr("class","compensate");
  t0.selectAll("circle.compensate")// Kreise
    .attr("cx", function(d) {return xScale3(d.x);})
    .attr("cy", function(d) {return yScale3(d.y);});
  // --------- Polygon ---------
  polygon3.exit().remove();
  polygon3.data([currVertices]).enter();
    //.append("polygon").attr("class","compensate");
  t0.selectAll("polygon.compensate")// Polygonzug
    .attr("points", function(d){
      return d.map(function(d){
        return [xScale3(d.x), yScale3(d.y)].join(",");
      }).join(" ");
    });
  // --------- Hülle ---------
  hull3.exit().remove();
  hull3.data([(currVertices.length < 3) ? currVertices : d3.polygonHull(currVertices)]).enter();
    //.append("path").attr("class","compensate");
  t0.selectAll("path.compensate")// Hülle
    .attr("d", function(d){return "M"+d.map(function(d){return [xScale3(d.x), yScale3(d.y)];}).join("L")+"Z";});
  // --------- Axen ---------
  t0.selectAll("g.x.axis").call(xAxis3);
  t0.selectAll("g.y.axis").call(yAxis3);
  // ----------- Zentrum -----------
  center3 = d3.polygonCentroid(currVertices
    .map(function(d){return [d.x, d.y]}));
  t0.selectAll("circle.compensatecenter")
    .attr("cx", function(){return xScale3(center3[0]);})
    .attr("cy", function(){return yScale3(center3[1]);});
  
  // reduziert doppelte Knoten in currVertices
  if (hinzugefuegteKnoten) {
    for (i=0; i<currVertices.length-1; i++) {
      if (equalNodes(currVertices[i], currVertices[i+1])) {
        currVertices.splice(i+1,1);// entfernt das (i+1)te Elem.
        // https://www.w3schools.com/jsref/jsref_splice.asp
      }
    }
    // --------- Kreise ---------
    circs3.exit().remove();
    circs3.data(currVertices).enter();
      //.append("circle").attr("class","compensate");
    svg3.selectAll("circle.compensate")// Kreise
      .attr("cx", function(d) {return xScale3(d.x);})
      .attr("cy", function(d) {return yScale3(d.y);});
    // --------- Polygon --------
    polygon3.exit().remove();
    polygon3.data([currVertices]).enter();
      //.append("polygon").attr("class","compensate");
    svg3.selectAll("polygon.compensate")// Polygonzug
      .attr("points", function(d){
        return d.map(function(d){
          return [xScale3(d.x), yScale3(d.y)].join(",");
        }).join(" ");
      });
    // --------- Hülle ---------
    hull3.exit().remove();
    hull3.data([(currVertices.length < 3) ? currVertices : d3.polygonHull(currVertices)]).enter()
      .append("path").attr("class","compensate");
    svg3.selectAll("path.compensate")// Hülle
      .attr("d", function(d){return "M"+d.map(function(d){return [xScale3(d.x), yScale3(d.y)];}).join("L")+"Z";});
    
    console.log("currVertices werden wieder reduziert:");
    console.log(copyArr(currVertices));
  }
  vertices3 = currVertices;
}

/* Quellen:
 * https://github.com/d3/d3-polygon/blob/master/README.md#polygonArea
 * https://bl.ocks.org/mbostock/4341699
 * http://bl.ocks.org/hollasch/9d3c098022f5524220bd84aae7623478
 * http://bl.ocks.org/larsenmtl/39a028da44db9e8daf14578cb354b5cb
 */
