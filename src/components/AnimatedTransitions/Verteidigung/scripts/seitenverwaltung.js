const menue = [
  {url: "../index", name: "Start"},//0
  //{url: "toc", name: "Inhalt"},
  {url: "aufgabenstellung", name: "Aufgabenstellung"},// 1
  {url: "animTrans", name: "Animierte Transition"},// 2 – Vor- und Nachteile
  {url: "problemstellung", name: "Problemstellung"},// 3
  {url: "pilotstudie", name: "Evaluation"},//4
  {url: "final", name: "Prototyp"},//5
  {url: "ausblick", name: "Ausblick"},//6
  {url: "designentscheidungen", name: "Anhang"}//7
];

const seiten = [
  {url: "../index", name: "Start", menue: menue[0]},
  //{url: "toc", name: "Inhalt", menue: menue[1]},
  {url: "aufgabenstellung", name: "Aufgabenstellung", menue: menue[1]},
  {url: "animTrans", name: "Definition & Anwendung", menue: menue[2]},
  {url: "motivation", name: "Motivation", menue: menue[2]},
  {url: "clusteroperationen", name: "Knoten- & Hüllenoperationen", menue: menue[2]},// Clusteroperationen
  {url: "designempfehlungen", name: "Verwandte Literatur", menue: menue[2]},// Designempfehlungen
  {url: "problemstellung", name: "Hülleninterpolation", menue: menue[3]},
  {url: "loesungsansatz", name: "Lösungsansatz", menue: menue[3]},
  {url: "limitierung", name: "Limitierung", menue: menue[3]},
  {url: "pilotstudie", name: "Pilotstudie", menue: menue[4]},
  {url: "pilotAufgaben", name: "Aufgaben", menue: menue[4]},
  {url: "pilotErgebnisse", name: "Ergebnisse", menue: menue[4]},
  {url: "final", name: "Prototyp – Projekte in Clustern", menue: menue[5]},
  {url: "ausblick", name: "Ausblick", menue: menue[6]},
  {url: "danke", name: "Vielen Dank für Ihre Aufmerksamkeit", menue: menue[6]},
  {url: "designKnoten", name: "Designentscheidungen: Knotentransition", menue: menue[7]},
  {url: "designHuellen", name: "Designentscheidungen: Hüllentransition", menue: menue[7]},
  {url: "designStaging", name: "Designentscheidungen: Choreographie", menue: menue[7]}
];

function pagenumber(siteUrl){
  return seiten.map(d => d.url).indexOf(siteUrl);
}

function pageCounter(siteUrl) {
  if (pagenumber(siteUrl) <= seiten.length-4)
    return "Seite " + (pagenumber(siteUrl)) + " / " + (seiten.length-4);
  else
    return "";
}

function nextPage(siteUrl) {
  if (pagenumber(siteUrl) > 0)
    return seiten[(pagenumber(siteUrl)+1) % seiten.length].url + ".html";
  else
    return "pages/aufgabenstellung.html";
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
