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

function equalPoints(p1,p2){
  return p1.x == p2.x && p1.y == p2.y;
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

function getAngle(p1,p2) {// gibt den Winkel aus
  if (p1.x == p2.x)
    return Math.pi/2;
  else // result: [-pi/2, pi/2]
    return Math.atan2((p2.y-p1.y),(p2.x-p1.x));
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
