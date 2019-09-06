const menue = [
  {url: "../index", name: "Start"},
  {url: "toc", name: "Inhalt"},
  {url: "aufgabenstellung", name: "Motivation"},
  {url: "vorUndNachteile", name: "Vor- und Nachteile"},
  {url: "designentscheidungen", name: "Designentscheidungen"},
  {url: "problemstellung", name: "Problemstellung"},
  {url: "final", name: "Prototyp"}
];

const seiten = [
  {url: "../index", name: "Start", menue: menue[0]},
  {url: "toc", name: "Inhalt", menue: menue[1]},
  {url: "aufgabenstellung", name: "Aufgabenstellung", menue: menue[2]},
  {url: "animTrans", name: "Animierte Transitionen", menue: menue[2]},
  {url: "vorUndNachteile", name: "Vor- und Nachteile animierter Transition für Clusteroperationen", menue: menue[3]},
  {url: "designKnoten", name: "Knotentransition", menue: menue[4]},
  {url: "designHuellen", name: "Hüllentransition", menue: menue[4]},
  {url: "designStaging", name: "Choreographie", menue: menue[4]},
  {url: "problemstellung", name: "Problemstellung bei der Hülleninterpolation", menue: menue[5]},
  {url: "final", name: "Prototyp – Projekte in Clustern", menue: menue[6]}
];

function pagenumber(siteUrl){
  return seiten.map(d => d.url).indexOf(siteUrl);
}

function pageCounter(siteUrl) {
  return "Seite " + (pagenumber(siteUrl)) + " / " + (seiten.length-1);
}

function nextPage(siteUrl) {
  if (pagenumber(siteUrl) > 0)
    return seiten[(pagenumber(siteUrl)+1) % seiten.length].url + ".html";
  else
    return "pages/toc.html";
}

function prevPage(siteUrl) {
  if (pagenumber(siteUrl) > 0)
    return seiten[(pagenumber(siteUrl)-1) % seiten.length].url + ".html";
  else
    return "index.html";
}

function pageName(siteUrl) {
  if (pagenumber(siteUrl) >= 0)
    return seiten[pagenumber(siteUrl)].name;
  else
    return "Unbekannt";
}
