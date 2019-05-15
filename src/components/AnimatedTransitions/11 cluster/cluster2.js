// ////////// Datas ////////////
var dataset = [
  {name: "Maus",    keywords: ["korn", "klein", "feld", "haus", "scheune", "vierbeiner"]},
  {name: "Elefant", keywords: ["laub", "gross", "savanne", "vierbeiner"]},
  {name: "Pferd",   keywords: ["stroh", "gross", "weide", "stall", "vierbeiner"]},
  {name: "Katze",   keywords: ["fleisch", "maus", "fisch", "mittel", "haus", "scheune", "vierbeiner"]},
  {name: "Hund",    keywords: ["fleisch", "schwein", "mittel", "haus", "vierbeiner"]},
  {name: "Amsel",   keywords: ["insekt", "wald", "stadt", "zweibeiner", "klein"]},
  {name: "Oktopus", keywords: ["fisch", "meer", "gross", "achtbeiner"]},
  {name: "Ity", keywords: ["fremd"]},
];

// ////////////// svg //////////////
var margin = {top: 20, right: 20, bottom: 40, left: 50},
  width = 600 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;
  
var radius = 5;
var duration = 1500;
var normDist = 3*radius;
var abstandsSkalar = 2;// regelt, wie weit Elemente voneinander in Abh. der normDist und ihrer #Gemeinsamkeiten sein sollen.

var svg = d3.select("body")
  .append("svg")
  .attr("class", "updateSvg")
  .attr("width",  width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// ////////////// Scaling //////////////
xScale = d3.scaleLinear()
  .domain([0, d3.max(dataset, function(d){return d.keywords.length})])
  .range([0, width]);
yScale = d3.scaleLinear()
  .domain([0, d3.max(dataset, function(d){return d.keywords.length})])
  .range([height, 0]);
  
function abstandsFunktion(n){
  // n = #Gemeinsamkeiten
  return 2**n * normDist;
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
  .attr("cx", function(d) {return xScale(Math.random()*d.keywords.length);})
  .attr("cy", function(d) {return yScale(Math.random()*d.keywords.length);})
  .attr("r",  function(d) {return radius;})
  .attr("fill", "yellow")
  .attr("stroke", "orange")
  .attr("stroke-width", "2")
  .on("mouseover", tooltip.show)
  .on("mouseout", tooltip.hide)
  .style("fill-opacity", 40)
  .style("stroke-opacity", 100)
  .style("pointer-events", "all");// none
  
 
// //////////// Funktionen /////////////
var proximitaetsmatrix = Array(dataset.length).fill().map(() => Array(dataset.length).fill(0));
var punktmatrix = Array(dataset.length).fill().map(() => Array(dataset.length).fill(null));

function getCircOf(d){
  // gibt den zur Data d zugehörigen Kreis zurück
  return circs.filter(function(e){return d===e;})._groups[0][0];
}

function getKoords(c){
  // gibt die Koordinaten des Kreises c zurück
  // https://www.javascripture.com/SVGAnimatedLength
  var x = c.cx.animVal.value;
  var y = c.cy.animVal.value;
  return {x: x, y: y};
}

function getDistance(p1, p2){
  // gibt den Abstand zweier Punkte zurück
  // dies ist auch die Länge des Vektors
  var dx = p1.x-p2.x;
  var dy = p1.y-p2.y;
  return Math.sqrt(dx*dx + dy*dy);
}

function vektorNormieren(v){
  var laenge = Math.sqrt(v.x*v.x + v.y*v.y);
  return {x: v.x/laenge, y: v.y/laenge};
}

function vektorMalSkalar(v,lambda){
  return {x: v.x*lambda, y: v.y*lambda};
}

function addVektoren(v1,v2){
  return {x: v1.x + v2.x, y: v1.y + v2.y};
}

function subVektoren(v1,v2){
  return {x: v1.x - v2.x, y: v1.y - v2.y};
}

function schwerpunkt(points){
  // berechnet den Mittelpunkt einer Punktemenge
  if (points.length == 0)
    return null;
  else {
    var v = points[0];
    for (i=1; i<points.length; i+=1)
      v = addVektoren(v,points[i]);
    return vektorMalSkalar(v, 1/points.length);
  }
}

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
  if (n == 0 || p1 === p2)
    return null;
  else {
    var abstand = getDistance(p1,p2);
    var mindestabstand = abstandsFunktion(getMaxProximity()-n); //abstandsSkalar*normDist*(getMaxProximity()+1-n);
    // wie weit sollen sich die Punkte entgegen kommen?
    var weglaenge = (abstand - mindestabstand) / 2;
    var ortsvektor = p1;
    var richtungsvektor = subVektoren(p2,p1);
    var einheitsvektor = vektorNormieren(richtungsvektor);// länge=1
    var wegvektor = vektorMalSkalar(einheitsvektor, weglaenge);
    return addVektoren(wegvektor, ortsvektor);
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
      punktmatrix[i][j] = targetPoint(p1, p2 ,n);
    });
  });
  var s = "Proximitätsmatrix:\n[";
  for (i=0; i<dataset.length; i+=1)
    s = s + proximitaetsmatrix[i] + "] "+dataset[i].name+"\n[";
  console.log(s.slice(0,s.length-2));
}

fillMatrices();

// ///////////// Legende //////////////
var legende = svg.append("g")
  .attr("class", "legende")
  .attr("transform", "translate("+(width/5)+",0)");

for (i=getMaxProximity(); i>=0; i-=1) {
  var maxi = getMaxProximity();
  legende.append("line")
    .attr("x1", abstandsFunktion(maxi)-abstandsFunktion(i))
    .attr("x2", abstandsFunktion(maxi))
    .attr("y1", i*10)
    .attr("y2", i*10)
    .attr("stroke", "black");
  legende.append("text")
    .attr("x", abstandsFunktion(maxi)+2)
    .attr("y", i*10)
    .attr("dy", "0.5ex")
    .style("text-anchor", "left")
    .text(2**i+" * normDist, "+(maxi-i)+" Common(s)");
}

// /////////////// Transition /////////////
function calculateNewPos(i){
  fillMatrices();
  var points = [];
  punktmatrix[i].forEach(function(v){
    if (v !== null)
      points.push(v);
  });
  return schwerpunkt(points);
}

function moveToNewPos() {
  circs.each(function(d,i){
    var c = d3.select(this);//._groups[0][0];
    var pNew = calculateNewPos(i);
    if (pNew != null) {
      c.transition().duration(duration).ease(d3.easeQuadInOut)
        .attr("cx", pNew.x)
        .attr("cy", pNew.y);
    }
  });
}
