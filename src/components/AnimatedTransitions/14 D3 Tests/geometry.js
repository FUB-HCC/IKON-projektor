const fehler = 0.0001;

function getRandInt(von,bis) {
  return Math.floor(Math.random()*(bis-von+1)+von);
}

function getCircOf(d){
  // gibt den zur Data d zugehörigen Kreis zurück
  return circs.filter(function(e){return d===e;})._groups[0][0];
}

function equal(r1,r2){
  return Math.abs(r1-r2) < fehler;
}

function isZero(r){
  return equal(r,0);
}

/////////////////// Index ////////////////
function predIdx(i,l) {
  // gibt den Vorgänger des Index i aus
  return (i-1+l) % l;
}

function succIdx(i,l) {
  // gibt den Nachfolger des Index i aus
  return (i+1) % l;
}

///////////////////// PUNKTE /////////////////
function equalPoints(p1,p2){
  return equal(p1.x, p2.x) && equal(p1.y, p2.y);
}

function equalPointsID(p1,p2){
  return equal(p1.id, p2.id);
}

function getDistancePP(p1, p2){
  // gibt den Abstand zweier Punkte zurück
  // dies ist auch die Länge des Vektors
  var dx = p1.x-p2.x;
  var dy = p1.y-p2.y;
  return Math.sqrt(dx*dx + dy*dy);
}

function copyPoint(p){
  return {x: p.x, y: p.y};
}

function copyPointID(p){
  return {x: p.x, y: p.y, id: p.id};
}

function getKoords(c){
  // gibt die Koordinaten des Kreises c zurück
  // https://www.javascripture.com/SVGAnimatedLength
  var x = c.cx.animVal.value;
  var y = c.cy.animVal.value;
  return {x: x, y: y};
}

function getAngle(p1,p2) {// gibt den Winkel aus
  if (equal(p1.x, p2.x))
    return Math.PI/2;
  else // result: [0, 2*pi)
    return (Math.atan2((p2.y-p1.y),(p2.x-p1.x))+2*Math.PI)% (2*Math.PI);
}

function bewegungswinkel(oldPos, newPos){
  var richtungsVektor = makeGerade(oldPos, newPos).richtung;
  var winkel = getAngle({x:0, y:0}, richtungsVektor);
  return winkel;
}

function getQuadrant(winkel) {
  var quadrant = Math.floor(winkel / Math.PI * 2) + 1;
  return quadrant;
}

//////////////// VEKTOREN = PUNKTE /////////////////
function vektorNormieren(v){
  var laenge = vektorLenght(v);
  return {x: v.x/laenge, y: v.y/laenge};
}

function vektorLenght(v) {
  return Math.sqrt(v.x*v.x + v.y*v.y);
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

function linkeOrthogonale(v){
  return {x: v.y, y: -v.x};
}

function rechteOrthogonale(v){
  return {x: -v.y, y: v.x};
}

function mittelPunkt(v1,v2){
  return vektorMalSkalar(addVektoren(v1,v2), 0.5);
}

///////////////////// GERADEN /////////////////
function makeGerade(p1,p2){
  // ort = p1
  // richtung = p2-p1
  return {ort: p1, richtung: subVektoren(p2,p1)};
}

function geradePlusOffsetLinks(g, offset){
  // gibt die um "offset" nach links verschobenen Punkte des Orts- und Richtungsvektors aus
  var v = vektorNormieren(linkeOrthogonale(g.richtung));
  v = vektorMalSkalar(v, offset);
  var ortNeu = addVektoren(g.ort, v);
  return {ort: ortNeu, richtung: g.richtung};
}

function geradePlusOffsetRechts(g, offset){
  // gibt die um "offset" nach rechts verschobenen Punkte des Orts- und Richtungsvektors aus
  var v = vektorNormieren(rechteOrthogonale(g.richtung));
  v = vektorMalSkalar(v, offset);
  var ortNeu = addVektoren(g.ort, v);
  return {ort: ortNeu, richtung: g.richtung};
}

function getVektorA(g){
  // g: ort + lambda * richtung
  // A = ort, B = rightung + A
  return g.ort;
}
function getVektorB(g){
  // g: ort + lambda * richtung
  // A = ort, B = rightung + A
  return addVektoren(g.richtung, g.ort);
}

function sindParalleel(g1,g2){
  var ri1 = vektorNormieren(g1.richtung);
  var ri2 = vektorNormieren(g2.richtung);
  return equalPoints(ri1, ri2) || equalPoints(ri1, vektorMalSkalar(ri2, -1));
}

function solutionOfMatrix(m){// in IR^{2x3}
  // m = (A|b) = [g1.ri,  -g2.ri,  g2.o-g1.o]
  // g1.ri != (0,0) && g2.ri != (0,0)
  var l1, l2;
  if (equal(m[0][0], 0)) {
    l2 = m[0][2] / m[0][1];
    l1 = (m[1][2] - l2 * m[1][0]) / m[1][0];
  }
  else if (equal(m[0][1], 0)) {
    l1 = m[0][2] / m[0][0];
    l2 = (m[1][2] - l1 * m[1][1]) / m[1][1];
  }
  else if (equal(m[1][0], 0)) {
    l2 = m[1][2] / m[1][1];
    l1 = (m[0][2] - l2 * m[0][1]) / m[0][0];
  }
  else if (equal(m[1][1], 0)) {
    l1 = m[1][2] / m[1][0];
    l2 = (m[0][2] - l1 * m[0][0]) / m[0][1];
  }
  else {// keine Null vorhanden -> Gauss
    m.forEach(function(zeile,i){
      zeile.forEach(function(d,j){
        m[i][j] = m[i][j] / m[i][0];
      });
    });
    m[1].forEach(function(d,j){
      m[1][j] = m[1][j] - m[0][j];
    });
    return solutionOfMatrix(m); // Rekursion
  }
  return {x: l1, y: l2}; // Anker
}

function schnittPunkt(g1,g2){
  if (sindParalleel(g1,g2))
    return null;
  else {// es gibt eine Lösung
    var ri1 = g1.richtung;
    var ri2 = g2.richtung;
    var deltaO = subVektoren(g2.ort, g1.ort);
    var matrix = [[ri1.x, -ri2.x, deltaO.x],
                  [ri1.y, -ri2.y, deltaO.y]];
    //var lambda = solutionOfMatrix(matrix);
    var lambda2 = (deltaO.y*ri1.x - deltaO.x*ri1.y) / (ri2.x*ri1.y - ri2.y*ri1.x);
    var lambda1 = (deltaO.x - ri2.x*lambda2) / ri1.x;// forall ri1.x != 0
    var lambda = {x: lambda1, y:lambda2};
    sP = addVektoren(g2.ort, vektorMalSkalar(g2.richtung, lambda.y));
    return sP;
  }
}

function closestPoint(p, g) {
  // berechnet den zum Punkt p dichtesten Punkt s auf der Geraden g
  var geradeP = {ort: p, richtung: rechteOrthogonale(g.richtung)};
  return schnittPunkt(g, geradeP);
}

function getDistancePG(p,g){
  // berechnet den Abstand zwischen Punkt p und Gerade g
  var s = closestPoint(p, g);
  return getDistancePP(p,s);
}

function getLengthOfG(g) {
  return getDistancePP(getVektorA(g), getVektorB(g));
}

function isPointAufGerade(p,g){
  var pLiegtAufGerade = isZero(getDistancePG(p,g));
  var dist1 = getDistancePP(p, getVektorA(g));
  var dist2 = getDistancePP(p, getVektorB(g));
  var geradenLaenge = getLengthOfG(g);
  return dist1 <= geradenLaenge && dist2 <= geradenLaenge && pLiegtAufGerade;
}

///////////////////// POLYGONE /////////////////
function copyPolygon(polygon){
  var polygonSnd = [];
  polygon.forEach(function(point){
    polygonSnd.push(copyPoint(point));
  });
  return polygonSnd;
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

// gibt den Punkt und Index mit minimalen / maximalen x/y aus
function getLowestX(liste){
  var minX = null;
  var idx = null;
  var point = null;
  liste.forEach(function(d,i){
    if (minX == null || d.x < minX) {
      minX = d.x;
      idx = i;
      point = {x: d.x, y: d.y};
    }
  });
  return {p: point, i:idx};
}
function getLowestY(liste){
  var minY = null;
  var idx = null;
  var point = null;
  liste.forEach(function(d,i){
    if (minY == null || d.y < minY) {
      minY = d.x;
      idx = i;
      point = {x: d.x, y: d.y};
    }
  });
  return {p: point, i:idx};
}
function getHighestX(liste){
  var maxX = null;
  var idx = null;
  var point = null;
  liste.forEach(function(d,i){
    if (maxX == null || d.x > maxX) {
      maxX = d.x;
      idx = i;
      point = {x: d.x, y: d.y};
    }
  });
  return {p: point, i:idx};
}
function getHighestY(liste){
  var maxY = null;
  var idx = null;
  var point = null;
  liste.forEach(function(d,i){
    if (maxY == null || d.y > maxY) {
      maxY = d.x;
      idx = i;
      point = {x: d.x, y: d.y};
    }
  });
  return {p: point, i:idx};
}

function gegenuhrzeigersinn(points){
  // ordnet Punkte im Gegenuhrzeigersinn um den Mittelpunkt an, angefangen, beim größten x
  var s = schwerpunkt(points);
  var pfad = points.sort(
    // ordnet die Punkte im Gegenuhrzeigersinn an (mathematisch)
    function(a,b){return getAngle(s,a) -getAngle(s,b);}
  );
  var maxX = getHighestX(pfad);
  // fängt beim Punkt mit größtem x an, geht im Uhrzeigersinn
  return pfad.slice(maxX.i).concat(pfad.slice(0,maxX.i));
  // https://www.w3schools.com/jsref/jsref_slice_array.asp
}

function uhrzeigersinn(points){
  // ordnet Punkte im Uhrzeigersinn um den Mittelpunkt an, angefangen, beim größten x
  var s = schwerpunkt(points);
  var pfad = points.sort(
    // ordnet die Punkte im Uhrzeigersinn an
    function(a,b){return getAngle(s,b) -getAngle(s,a);}
  );
  var maxX = getHighestX(pfad);
  // fängt beim Punkt mit größtem x an, geht im Uhrzeigersinn
  return pfad.slice(maxX.i).concat(pfad.slice(0,maxX.i));
  // https://www.w3schools.com/jsref/jsref_slice_array.asp
}

////////////////// HÜLLE = konvexes Polygon //////////////
function calculateHull(points){
  // ordnet die Punkte im Uhrzeigersinn an und übergibt sie als [x,y]-Koordinate an die Funktion d3.polygonHull()
  if (points.length == 0)
    return null;
  else if (points.length == 1)
    return [copyPoint(points[0]), addVektoren(points[0],{x: fehler, y: fehler})];// kopiert den Punkt mit leichtem Versatz, weil mind. 2 Punkte für eine Hülle notwendig sind
  else {
    var pfad = uhrzeigersinn(points);
    var polygon = pfad.map(function(d){return [d.x, d.y];});
    var hull = (polygon.length < 3)? polygon : d3.polygonHull(polygon);
    // https://github.com/d3/d3-polygon
    // d3.polygonHull(polygon) => Uhrzeigersinn
    return hull.map(function(d){return {x: d[0], y: d[1]};});
  }
}

function makeHull2Path(hullVertices, scale) {
  var string = "M ";
  hullVertices.forEach(function(d){
    string = string + scale.xScale(d.x) + " ";
    string = string + scale.yScale(d.y) + " L ";
  });
  // schneidet das L ab und ersetzt es durch Z
  string = string.slice(0,string.length-2) + " Z";
  return string;
}

function makeHullSmooth(hull, offset) {// outdated !!!
  // offset ist die zugegebene Breite, um die die Hülle ausgeweitet wird. Der Punktezug muss in Gegenuhrzeigersinn vorliegen.
  var numberOuterNodes = hull.length;
  // offset wächst dynamisch mit zunehmenden Hüllenknoten
  offset = offset + offset/10*numberOuterNodes;
  var s = schwerpunkt(hull);
  var hullErweitert = [];
  var gerade1, gerade2, gerade1Neu, gerade2Neu;
  var nextI, prevI;
  var pNeuMid, pNeu1, pNeu2;
  for (i=0; i<hull.length; i++) {

    prevI = predIdx(i,hull.length);
    nextI = succIdx(i,hull.length);

    // Vorgängergerade
    gerade1 = makeGerade(hull[prevI], hull[i]);
    gerade1Neu = geradePlusOffsetRechts(gerade1, offset);
    pNeu1 = getVektorB(gerade1Neu);

    // Nachfolgergerade
    gerade2 = makeGerade(hull[nextI], hull[i]);
    gerade2Neu = geradePlusOffsetLinks(gerade2, offset);
    pNeu2 = getVektorB(gerade2Neu);

    // Punkt dazwischen
    if (sindParalleel(gerade1Neu, gerade2Neu))
      pNeuMid = mittelPunkt(pNeu1, pNeu2);
    else {
      pNeuMid = schnittPunkt(gerade1Neu, gerade2Neu);
    }
    // falls dieser zu weit ausschlägt, dann dichter ran holen
    if (getDistancePP(hull[i], pNeuMid) > 1.5*offset) {
      var g = makeGerade(hull[i], pNeuMid);
      g.richtung = vektorMalSkalar(vektorNormieren(g.richtung), 1.5*offset);
      pNeuMid = getVektorB(g);
    }
    // falls dieser zu dicht am Kreis ist, dann weiter weg setzen
    else if (getDistancePP(hull[i], pNeuMid) < 0.9*offset) {
      var g = makeGerade(s, pNeuMid);
      g.richtung = vektorMalSkalar(g.richtung, offset);
      pNeuMid = getVektorB(g);
    }

    hullErweitert.push(pNeu1);
    hullErweitert.push(pNeuMid);
    hullErweitert.push(pNeu2);
  }
  return hullErweitert;
}

function compensateNodeNumber(poly1, poly2) {
  // wird von der Funktion huellenAbgleichen aufgerufen, d.h. die nicht-smoothen(!) Hüllen liegen im Gegenuhrzeigersinn vor und haben die gleichen Anfangsknoten

  var smallerP, biggerP;
  if (poly1.length < poly2.length) {// füllt poly1 auf
    smallerP = poly1;
    biggerP  = poly2;
  }
  else {// füllt poly2 auf
    smallerP = poly2;
    biggerP  = poly1;
  }
//   console.log("smallerP:");
//   console.log(smallerP);
//   console.log("biggerP:");
//   console.log(biggerP);
  var difference = Math.abs(biggerP.length - smallerP.length);
  // findet die Stellen, die aufgefüllt werden müssen
  var i=0;
  while (i<biggerP.length && difference > 0) {
    if (i>=smallerP.length || ! equalPoints(biggerP[i],smallerP[i])) {
      var pred = predIdx(i,smallerP.length);
      var curr = i % smallerP.length;
      var succ = succIdx(i,smallerP.length);
      var geradePredI = makeGerade(smallerP[pred], smallerP[curr]);
      var pBetween = closestPoint(biggerP[i], geradePredI);
      // fügt neuen Punkt vor dem Punkt an der Stelle i ein
      if (isPointAufGerade(pBetween, geradePredI)) {
        // https://www.w3schools.com/jsref/jsref_splice.asp
        smallerP.splice(i,0, pBetween);
      }
      else {// falls der errechnete Punkt außerhalb der Strecke liegt, wird einer Punkte verdoppelt
        var d1 = getDistancePP(biggerP[i], smallerP[curr]);
        var d2 = getDistancePP(biggerP[i], smallerP[pred]);
        if (d1 < d2)
          smallerP.splice(i,0, copyPoint(smallerP[curr]));
        else
          smallerP.splice(i,0, copyPoint(smallerP[pred]));
      }
      difference --;
    }
    i = i+1;
  }
//   console.log("Compensate Node Number - 4 Arrays:");
//   console.log(poly1);
//   console.log(poly2);
//   console.log(smallerP);
//   console.log(biggerP);
  return [poly1, poly2];
}

function huellenAbgleichen(poly1, poly2) {
  // beide nicht-smoothen(!) Hüllen müssen im Gegenuhrzeigersinn vorliegen und es muss sich um Punktmengen mit nur wenig unterschiedlichen Punkten handeln
  // findet gleiche Punkte und bringt sie an den gleichen Index
  // verdoppelt ggf. fehlende Punkte
  var idxP1 = 0; // Anfangsindex des Polygons1
  var idxP2 = 0; // Anfangsindex des Polygons2
  var abbrechen = false;
  var erstesElem = poly1[0];
  var huellen;
//   console.log("alte Hülle:");
//   console.log(poly1);
//   console.log("zukünftige Hülle:");
//   console.log(poly2);
  for (i=0; i<poly1.length; i++){
    for (j=0; j<poly2.length; j++) {
      if (equalPoints(poly1[i], poly2[j])) {
        idxP1 = i;
        idxP2 = j;
        abbrechen = true;
        break;// doppeltes break funktioniert nicht
      }
    }
    if (abbrechen)
      break;
  }// hat gleiche Punkte gefunden
  // bringt diese an die Position 0
//   console.log("idxP1 ",idxP1);
//   console.log("idxP2 ",idxP2);
  var polygon1 = copyPolygon(poly1);
  var polygon2 = copyPolygon(poly2);
  if (idxP1 != idxP2 || idxP1 != 0) {
//    console.log("Bringt gleiches Element nach vorne");
    // https://www.w3schools.com/jsref/jsref_slice_array.asp
    polygon1 = poly1.slice(idxP1).concat(poly1.slice(0, idxP1));
    polygon2 = poly2.slice(idxP2).concat(poly2.slice(0, idxP2));
//     console.log("gleiches Element vorne poly1");
//     console.log(polygon1);
//     console.log("gleiches Element vorne poly2");
//     console.log(polygon2);
  }
  // füllt kürzeres Polygon mit weiteren Punkten auf
  if (polygon1.length != polygon2.length) {
//    console.log("passt Längen an");
    huellen = compensateNodeNumber(polygon1, polygon2);
    polygon1 = huellen[0];
    polygon2 = huellen[1];
  }

  // bringt das ursprüngliche Element wieder nach vorne
  idxP1 = 0;
  while (!equalPoints(polygon1[idxP1],erstesElem) && idxP1 < polygon1.length)
    idxP1++;
  if (idxP1 > 0) {
//    console.log("Bringt ursprüngliches Element wieder nach vorne");
    polygon1 = polygon1.slice(idxP1).concat(polygon1.slice(0, idxP1));
    polygon2 = polygon2.slice(idxP1).concat(polygon2.slice(0, idxP1));
  }
//   console.log("angepasste Hülle: huellen[0]");
//   console.log(polygon1);
//   console.log("Zielhülle: huellen[1]");
//   console.log(polygon2);
  return [polygon1, polygon2];
}

function delUnneccessaryNodes(polygon){
  var i = 0;
  var pred, succ, geradePredI; // midP
  var points = copyPolygon(polygon);
  while (i<points.length && points.length > 2) {// wenn nur 2 Punkte vorhanden, sollen diese nicht gelöscht werden, da mind. 2 für eine Hülle notwendig sind
    pred = points[predIdx(i, points.length)];
    succ = points[succIdx(i, points.length)];
    geradePredSucc = makeGerade(pred, succ);
    //midP = mittelPunkt(pred, succ);
    // gleiche Elemente werden nebeneinander sein
    if (isPointAufGerade(points[i], geradePredSucc) || equalPoints(points[i], pred)) //(equalPoints(points[i], midP))
      points.splice(i, 1);
    else if (equalPoints(points[i], succ))
      points.splice(i, 1);
    else
      i++;
  }
//   console.log("delUnneccessaryNodes:");
//   console.log(points);
  return points;
}
