// ////////// Datas ////////////
var dataset = [
  {name: "Maus",    keywords: ["korn", "klein", "feld", "haus", "scheune", "vierbeiner", "säugetier"]},
  {name: "Ratte",   keywords: ["korn", "klein", "feld", "haus", "scheune", "vierbeiner", "säugetier"]},
  {name: "Elefant", keywords: ["laub", "gross", "savanne", "vierbeiner", "säugetier"]},
  {name: "Pferd",   keywords: ["stroh", "gross", "weide", "stall", "vierbeiner", "säugetier"]},
  {name: "Katze",   keywords: ["fleisch", "maus", "fisch", "mittel", "haus", "scheune", "vierbeiner", "säugetier"]},
  {name: "Hund",    keywords: ["fleisch", "schwein", "mittel", "haus", "vierbeiner", "säugetier"]},
  {name: "Amsel",   keywords: ["insekt", "wald", "stadt", "zweibeiner", "klein", "vogel"]},
  {name: "Möve",   keywords: ["fisch", "strand", "zweibeiner", "klein", "vogel"]},
  {name: "Spinne", keywords: ["insekt", "wald", "klein", "achtbeiner", "spinne"]},
  {name: "Skorpion", keywords: ["insekt", "wüste", "klein", "achtbeiner", "spinne"]},
  {name: "Oktopus", keywords: ["fisch", "meer", "gross", "achtbeiner", "weichtier"]},
  {name: "Wal", keywords: ["krill", "meer", "gross", "säugetier"]},
  {name: "Euglena",      keywords: ["bacteria"]},
  {name: "Streptococcus", keywords: ["bacteria"]},
  {name: "Eaty", keywords: ["fremd"]},
];

// ////////////// svg //////////////
var margin = {top: 40, right: 40, bottom: 40, left: 40},
  width = 500 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;
  
var radius = 5;
var duration = 1500;
var normDist = 2.2*radius;
var abstandsSkalar = 2;// regelt, wie weit Elemente voneinander in Abh. der normDist und ihrer #Gemeinsamkeiten sein sollen.
var versuchszahl = 10;

var svg = d3.select("body")
  .append("svg")
  .attr("class", "updateSvg")
  .attr("width",  width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var legende = svg.append("g")
  .attr("class", "legende");
  
// ////////////// Scaling //////////////
xScale = d3.scaleLinear()
  .domain([0, width])// d3.max(dataset, function(d){return d.keywords.length})
  .range([0, width]);
yScale = d3.scaleLinear()
  .domain([0, height])
  .range([height, 0]);
  
function abstandsFunktion(nCommons){
  // nCommons = #Gemeinsamkeiten
  var nDiff = getMaxProximity() - nCommons;
  if (nCommons == 0) // besonders großer Abstand
    return ((nDiff)**1.3+1) * normDist;
  else
    return ((nDiff)**1.1+1) * normDist;
}

//////////////// Tooltips ////////////////////
// http://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7
var tooltip = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) {return "Tier: " + d.name + "<br>Keywords: " + d.keywords.join("<br>&nbsp;&nbsp;");});
  
svg.call(tooltip);// call the function on the selection

// //////////////////// Scatterplot ///////////////////
var circs = svg.selectAll("circle.area")
  .data(dataset)
  .enter()
  .append("circle")
  .attr("class", "area")
  .attr("cx", function(d) {return xScale(Math.random()*width);})
  .attr("cy", function(d) {return yScale(Math.random()*height);})
  .attr("r",  function(d) {return radius;})
  .attr("fill", "yellow")
  .attr("stroke", "orange")
  .attr("stroke-width", "2")
  .on("mouseover", tooltip.show)
  .on("mouseout", tooltip.hide)
  .style("fill-opacity", 0.4)
  .style("stroke-opacity", 1)
  .style("pointer-events", "all");// none
  
 
// //////////// Funktionen /////////////
var proximitaetsmatrix = Array(dataset.length).fill().map(() => Array(dataset.length).fill(0));
var zielPunktMatrix = Array(dataset.length).fill().map(() => Array(dataset.length).fill(null));
var currPointList = Array(dataset.length).fill(0);


function getMaxProximity() {
  // gibt das Maximum der Proximitaetsmatrix aus
  var max = 0;
  proximitaetsmatrix.forEach(function(zeile){
    zeile.forEach(function(zelle){
      max = max > zelle? max : zelle;
    });
  });
  return max;
}

function targetPoint(p1,p2,n) {// (p1,p2,proximity)
  // gibt den neuen Punkt in Abh. der Proximität zweier Punkte zurück
  // Richtung: p1 -> p2
  if (versuchszahl % 2 == 0 && n == 0){
    // bei jedem 2. Aufruf beeinflussen sich Elemente mit 0 Gemeinsamkeiten nicht
    return null;
  }
  else if (equalPoints(p1,p2))// n == 0 || 
    return null;
  else {// wenn versuchszahl ungerade, stoßen sich Elemente mit 0 Gemeinsamkeiten ab
    var abstand = getDistancePP(p1,p2);
    var mindestabstand = abstandsFunktion(n); //abstandsSkalar*normDist*(getMaxProximity()+1-n);
    // wie weit sollen sich die Punkte entgegen kommen?
    var weglaenge = (abstand - mindestabstand) / 2;
    var ortsvektor = p1;
    var richtungsvektor = subVektoren(p2,p1);
    var einheitsvektor = vektorNormieren(richtungsvektor);// länge=1
    var wegvektor = vektorMalSkalar(einheitsvektor, weglaenge);
    var neuePosition = addVektoren(wegvektor, ortsvektor);
    //console.log("versuchszahl: "+versuchszahl);
    if (versuchszahl % 2 == 0){
      // tut eine Zufallsbewegung hinzu, um optimalere Positionen zu erzeugen
      var randDeltaX = Math.floor(2*Math.random())*2-1;// [-1|1]
      var randDeltaY = Math.floor(2*Math.random())*2-1;
      var randV = {x: randDeltaX * normDist * versuchszahl/2, y: randDeltaY/2 * normDist * versuchszahl};
      return addVektoren(neuePosition, randV);
    }
    else
      return neuePosition;
  }
}

function fillMatrices() {
  dataset.forEach(function(d1,i){
    dataset.forEach(function(d2,j){
      var n = 0;
      if (d1 !== d2){
        d1.keywords.forEach(function(d1Key){
          if (d2.keywords.includes(d1Key))
            n += 1;
        });
      }
      //console.log("=> "+d1.name+" und "+d2.name+" haben "+n+" Gemeinsamkeit(en)");
      proximitaetsmatrix[i][j] = n;
      proximitaetsmatrix[j][i] = n;
      var c1 = getCircOf(d1);
      var c2 = getCircOf(d2);
      var p1 = getKoords(c1);
      var p2 = getKoords(c2);
      zielPunktMatrix[i][j] = targetPoint(p1, p2 ,n);
    });
  });
  var s = "Proximitätsmatrix:\n[";
  for (i=0; i<dataset.length; i+=1)
    s = s + proximitaetsmatrix[i] + "] "+dataset[i].name+"\n[";
  console.log(s.slice(0,s.length-2));
}

fillMatrices();


function cloneMatrix(matrix){
  return Array(matrix.length).fill().map((d,i) => matrix[i].slice());
}

function fillCurrPointList() {
  circs.each(function(d,i){
    var c = d3.select(this);
    currPointList[i] = {x: c.cx, y: c.cy};
  });
}

fillCurrPointList();

// ///////////// Legende //////////////
for (i=getMaxProximity(); i>=0; i-=1) {
  var maxi = getMaxProximity();
  legende.append("line")
    .attr("x1", 0)
    .attr("x2", abstandsFunktion(i))
    .attr("y1", (maxi-i)*10)
    .attr("y2", (maxi-i)*10)
    .attr("stroke", "black")
    .attr("transform", "translate("+70+",0)");
  legende.append("text")
    .attr("x", 0)
    .attr("y", (maxi-i)*10)
    .attr("dy", "0.5ex")
    .style("text-anchor", "left")
    .text(i+" Common(s)");
}

// /////////////// Transition /////////////
function calculateNewPos(i){
  var points = [];
  zielPunktMatrix[i].forEach(function(v){
    if (v !== null)
      points.push(v);
  });
  return schwerpunkt(points);
}

function moveToNewPos() {
  fillMatrices(); // berechnet die Positionen erneut
  var relatedPointsList = Array(dataset.length).fill(0);
  var minX = null;
  var maxX = null;
  var minY = null;
  var maxY = null;
  circs.each(function(d,i){
    var c = d3.select(this)._groups[0][0];
    relatedPointsList[i] = calculateNewPos(i);
    if (relatedPointsList[i] == null)
      relatedPointsList[i] = getKoords(c);
    // berechnet Extremwerte
    if (relatedPointsList[i] != null) {
      if (minX == null || relatedPointsList[i].x < minX)
        minX = relatedPointsList[i].x;
      else if (maxX == null || relatedPointsList[i].x > maxX)
        maxX = relatedPointsList[i].x;
      if (minY == null || relatedPointsList[i].y < minY)
        minY = relatedPointsList[i].y;
      else if (maxY == null || relatedPointsList[i].y > maxY)
        maxY = relatedPointsList[i].y;
    }
  });
  // Skalierung
  xScale.domain([minX, maxX]);
  yScale.domain([maxY, minY]);
  // bewegt die Kreise
  circs.each(function(d,i){
    var c = d3.select(this);
    if (relatedPointsList[i] != null) {
      c.transition().duration(duration).ease(d3.easeQuadInOut)
        .attr("cx", xScale(relatedPointsList[i].x))
        .attr("cy", yScale(relatedPointsList[i].y));
    }
  });
}

function initMoves() {
  versuchszahl = 10;
  // bewegt Punkte
  var interval = d3.interval(function(timer){
    moveToNewPos();
    versuchszahl -= 1;
    //console.log("timer: "+timer);
    if (timer > duration*10 || versuchszahl <= 0) {
      interval.stop();
      return;
    }
  }, duration);// delay zwischen den Transitionen
}

// /////////// Color ////////////
function color(i) {// Fabrfunktion
  // https://bl.ocks.org/mbostock/310c99e53880faec2434
  // https://github.com/d3/d3-interpolate/blob/master/README.md#interpolateHcl
  var interpolate = d3.piecewise(d3.interpolateRgb.gamma(5), ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
  var colorScale = d3.scaleLinear()
    .domain([1, getMaxProximity()])
    .range([0,1])
  return interpolate(colorScale(i));
}

function getRandomColor() {// https://stackoverflow.com/questions/1484506/random-color-generator
  var colors = ["YellowGreen", "Yellow", "Violet", "Turquoise", "Tomato", "Teal", "SpringGreen", "SkyBlue", "SeaGreen", "SandyBrown", "Red", "Purple", "Plum", "Peru", "OrangeRed", "Orange", "OliveDrab", "Navy", "Magenta", "MediumVioletRed", "MediumOrchid", "MediumBlue", "Maroon", "LimeGreen", "Lime", "LightSkyBlue", "LightSeaGreen", "LightCoral", "LightPink", "LawnGreen", "Indigo", "GreenYellow", "Green", "GoldenRed", "Gold", "DarkOrange", "DarkMagenta", "DarkGreen", "Cyan", "Crimson", "Chartreuse", "BurlyWood", "Blue", "BlueViolet"];
  // https://www.w3schools.com/tags/ref_colornames.asp
  return colors[Math.floor(Math.random() * colors.length)];
}

function putColor() {// färbt Kreise ein
  // kopiert die Proximitätsmarix
  var proximity = cloneMatrix(proximitaetsmatrix);
  // färbt zuerst Kreise ohne jede Zugehörigkeit ein
  proximity.forEach(function(zeile,i){
    if (zeile.every(function(zelle){return zelle == 0;})) {
      var c = circs.filter(function(d,j){return j == i;});
      c.attr("fill", getRandomColor())
        .style("fill-opacity", 0.8)
        .attr("stroke", "black");// color(groupCounter)
    }
  });
  // färbt Kreise nach höchster Proximität ein
  for (prox=getMaxProximity(); prox>0; prox-=1) {
    // Breitensuche
    var groupCounter = 7;
    proximity.forEach(function(zeile,i){
      zeile.forEach(function(zelle,j){// äußere Schleifen
        var queue = [];
        if (zelle == prox) {// maximale Priximität
          queue.push({a:i, b:j});
          queue.push({a:j, b:i});
          var color = getRandomColor();
          while (queue.length > 0) {
            var p = queue.pop(0);
            if (proximity[p.a][p.b] == prox) {
              var c = circs.filter(function(d,idx){return p.a == idx;});//._groups[0];
              //var c = getCircOf(dataset[p.a]);
              c.attr("fill",   color)
                .style("fill-opacity", 0.8)
                .attr("stroke", "black");// color(groupCounter)
              proximity[p.a][p.b] = 0;
              // sucht in den 2 Zeilen nach Werten gleicher Proximität
              proximity[p.a].forEach(function(cell, k){
                if (cell == prox){
                  queue.push({a:p.a, b:k});
                  queue.push({a:k, b:p.a});
                }
                else // Kreis aus Zeile p.a ist bereits eingefärbt
                  proximity[p.a][k] = 0;
              });
              var s = "MaxProx: "+prox+"\nProximitätsmatrix 2:\n[";
              for (i=0; i<dataset.length; i+=1)
                s = s + proximity[i] + "] "+dataset[i].name+"\n[";
              console.log(s.slice(0,s.length-2));
            }// ende if
          }// ende while
          groupCounter -= 1;
        }// ende if
        //break;
      });// ende spalten
    });// ende zeilen
  }
}


// //////////// Convex Hull ////////////
function getPointOfBiggestAngle(p0){
  // gibt Punkt und Index mit dem größten Winkel zum Punkt p0 aus
  var maxAngle = 0;
  var maxP = p0;
  var idx = null;
  currPointList.forEach(function(p,i){
    var angle = getAngle(maxP,p);
    if (maxAngle < angle) {
      maxAngle = angle;
      maxP = p;
      idx = i;
    }
  });
  return {p: maxP, i: idx};
}

var hull = [];

function getConvexHull() {
  fillCurrPointList();
  //var hull = [];
  var minX = getLowestX(currPointList);
  var p0 = minX.p;// Punkt {x: _, y: _}
  var i0 = minX.i;// index
  hull.push(p0);
  currPointList.pop(i0);// entfernt das 1. Elem
  while (currPointList.length > 0){
    var next = getPointOfBiggestAngle(p0);
    hull.push(next.p);
    currPointList.pop(next.i);
    p0 = next;
  }
  // https://bl.ocks.org/shimizu/fb1323d5d1e6dd8566a6c5046d30946a


// var d3Area = d3.line()//d3.area()
//   .x(function(d){return xScale(d.x);})
//   //.y0(yScale(0))
//   .y(function(d){return yScale(d.y);})
//   .curve(d3.curveBasis);
//   
// svg.selectAll("path.hull")
//   .data([hull])
//   .enter()
//   .append("path")
//   .attr("class", "hull")
//   .attr("fill", "yellow")
//   .attr("fill-opacity", 0.3)
//   .attr("stroke", "orange")
//   .attr("stroke-width", 2)
//   .attr("d", d3Area);
}
