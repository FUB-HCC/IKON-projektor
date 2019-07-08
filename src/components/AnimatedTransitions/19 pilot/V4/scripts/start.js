const me = "../" + document.URL.split("/").reverse()[0].slice(0,this.length-5);

//////////////// Datasets ////////////////
var oldDataset = [], newDataset = [];
var pos, id, gerade, clusterNo, researchArea, year, keywords;
var datas = [
  [[1,2,0], [3.8,3.5,0], [6,2,0], [5,5,0]], // cluster0
  [[12,8,1], [11,6,1], [10,8,1], [7,7,1]] // cluster1
];
for(var c in datas){
  for (var p in datas[c]) {
    pos = new Position(datas[c][p][0], datas[c][p][1]);
    id = 10 * parseInt(c) + parseInt(p);
    clusterNo = datas[c][p][2];
    oldDataset.push(new Knoten(pos, id, clusterNo, {}, 2019, ""));
  }
}
var oldNests = new Nest(oldDataset);

datas = [
  [[2,1,0], [1,5,0], [5,1,0], [7,4,0], [3,2,0], [5,3.5,0]], // cluster0
  [[13,8,1], [10,5,1], [9,9,1]] // cluster1
];

for(var c in datas){
  for (var p in datas[c]) {
    pos = new Position(datas[c][p][0], datas[c][p][1]);
    id = 10 * parseInt(c) + parseInt(p);
    clusterNo = datas[c][p][2];
    newDataset.push(new Knoten(pos, id, clusterNo, {}, 2019, ""));
  }
}

var newNests = new Nest(newDataset);
  
var transTable = oldNests.createTransitionNests(newNests);

//////////////// Scaling ////////////////////
var scale1 = new Scale(oldDataset);
  scale1.setDomain(oldDataset);
var scale2 = new Scale(oldDataset);
  scale2.setDomain(oldDataset);

///////////// Seite ////////////////
d3.select("div.layout")
  .append("h1")
  .text("Pilotstudie");
  
d3.select("div.layout")
  .append("p")
  .attr("name", "anweisung")
  .text("Im Folgenden sollen Transitionen von Clustern und deren Hüllen evaluiert werden. Mache dich dazu mit der Benutzeroberfläche etwas vertraut!");
  // Jedes Projekt wird durch einen Punkt dargestellt und hat eine eindeutige Identifikationsnummer (ID). Projekte, die sich sehr ähnlich sind, werden einem Cluster zugeordnet - hier durch eine graue Hülle dargestellt - und liegen tendenziell näher beieinander.
  
 
/////////////// Schieberegeler TransDuration ///////////
var schieberegler = new Schieberegler();
  schieberegler.editSchieberegler();

//////////// Buttons /////////////
var form = d3.select("div.layout").append("form")
  .attr("class", "formular");

var timeZeroBtn = new Button(form, function(){
  return callAusgangszustand();}, "⊲ Startzustand");
  timeZeroBtn.btn.attr("id", "timeZeroBtn");

var bereitBtn = new Button(form, function(){
  if (toolT7 != undefined)
    toolT7.myTooltip.remove();
  update();
  }, "Bereit");
  bereitBtn.btn.attr("id", "replay");
  
d3.select("div.layout").append("br");

/////////////// Spalten & SVG ///////////////
var links = d3.select("div.layout")
  .append("div")
    .attr("class", "spalte")
    .attr("id", "links")
  .append("text")
    .attr("id", "Animationsarten")
    .style("text-align", "center")
    .style("font-weight", "bold")
    .text("Überblendung");
  
var svg1 = new SVG("svg", d3.select("div#links"));
var kreise1 = new Kreise (oldDataset, svg1, "projekt", scale1);
var pfade1 = new Pfade (oldNests, svg1, "huelle", scale1);
  
var rechts = d3.select("div.layout")
  .append("div")
  .attr("class", "spalte")
  .attr("id", "rechts")
  .append("text")
  .style("text-align", "center")
  .style("font-weight", "bold")
  .text("Transition");

var svg2 = new SVG("svg", d3.select("div#rechts"));
var kreise2 = new Kreise (oldDataset, svg2, "projekt", scale2);
var pfade2 = new Pfade (oldNests, svg2, "huelle", scale2);


//////////// UPDATE /////////////
function update(){// nach einmaliger Betätigung erscheinen Buttons
  transitions([svg1, svg2], newDataset, newNests, transTable, [scale1, scale2]);
  
  var t0 = d3.transition()
    .delay(transDuration)
    .duration(1)
    .on("end", createForm);
    
  // Formular
  function createForm() {
    bereitBtn.btn
      .text("↻ Replay")
      .on("click", function(){
        replay();
      });
    // https://www.toptal.com/designers/htmlarrows/arrows/
    
    var frage = d3.select("div.layout")
      .append("p")
      .attr("id", "frage")
      .text("An dieser Stelle stehen Fragen zu den jeweiligen Aufgaben.");
      
    var weiterBtn = new LinkButton(me, function(){}, +1, "Zur ersten Aufgabe ⊳", "");
    //weiterBtn.btn.attr("id", "next");
    toolT8 = new Tooltip(document.getElementById("next"), "Die Pilotstudie startet durch Drücken dieses Buttons.", weiterGehts);
    toolT8.repositionTooltip();
  }
}

function callAusgangszustand(){
  ausgangszustand([svg1, svg2], oldDataset, oldNests, [scale1, scale2]);
}

function replay(){
//   ausgangszustand([svg1, svg2], oldDataset, oldNests, [scale1,scale2]);
//   transitions([svg1, svg2], newDataset, newNests, transTable, [scale1, scale2]);
  var t0 = d3.transition().duration(250)
    .on("start", function(){
      ausgangszustand([svg1, svg2], oldDataset, oldNests, [scale1,scale2]);
    })
    .on("end", function(){
      transitions([svg1, svg2], newDataset, newNests, transTable, [scale1, scale2]);
    });
}

function whoAmI(){
  return me;
}

//////////// Tutorial ////////////
class Tooltip {
  constructor(ankerElem, text, fkt) {
    this.ankerElem = ankerElem;
    this.myTooltip = d3.select("div.layout")
      .append("div")
      .attr("class", "myTooltip");
      //.style("visibility", "visible")// hidden
    this.myTooltip.append("span")
      .attr("class", "tooltiptext")
      .attr("margin-bottom", "10px")
      .text(text);
    this.myTooltip.append("br");
    this.okayBtn = new Button(this.myTooltip, function(){}, "Okay");
    this.okayBtn.btn
      .style("margin-top", "1ex")
      .style("margin-left", "17ex")
      .style("font-size", "9px")
      .on("click", function(){
        fkt();
      });
  }
  
  repositionTooltip(){
    var anker = this.ankerElem;
    var tooltip = document.getElementsByClassName("myTooltip")[0];
    // elem.getBoundingClientRect() =>
    // DOMRect {x, y, width, height, top, right, bottom, left}
    // https://www.mediaevent.de/javascript/window-browserfenster.html
    var posX = anker.getBoundingClientRect().right;
    var posY = anker.getBoundingClientRect().top;
    var svg = document.getElementsByClassName("svg")[0];
    this.myTooltip
      .style("left", function(){
        //console.log('posX', +posX+3, 'posY', posY, 'clientHeight', tooltip.clientHeight);
        return (+posX+3) + "px"})
      .style("top", (posY - tooltip.clientHeight -3) + "px");
  }
}

var toolT1, toolT2, toolT3, toolT4, toolT5, toolT6, toolT7, toolT8;
hinweis1();

function hinweis1() {
  toolT1 = new Tooltip(document.getElementById("Animationsarten"), "Es gibt zwei Grafiken. Die linke zeigt eine Überblendung vom Start- zum Endzustand und die rechte einen weichen Übergang (Transition).", hinweis2);
  toolT1.repositionTooltip();
}

function hinweis2(){
  toolT1.myTooltip.remove();
  toolT2 = new Tooltip(document.getElementById("replay"), "Dieser Button startet die Animationen und ermöglicht es, diese beliebig oft zu wiederholen.", hinweis3);
  toolT2.repositionTooltip();
}

function hinweis3(){
  toolT2.myTooltip.remove();
  toolT3 = new Tooltip(document.getElementById("timeZeroBtn"), "Dieser Button schaltet zum Ausgangszustand vor der Animation zurück.", hinweis4);
  toolT3.repositionTooltip();
}

function hinweis4(){
  toolT3.myTooltip.remove();
  toolT4 = new Tooltip(document.getElementById("endduration"), "Mit diesem Schieberegler kannst du die Animationsdauer festlegen.", hinweis5);
  toolT4.repositionTooltip();
}

function hinweis5(){
  toolT4.myTooltip.remove();
  toolT5 = new Tooltip(document.getElementsByClassName("projekt")[3], "Jedes Projekt wird durch einen Punkt dargestellt und hat eine eindeutige Identifikationsnummer (ID). Projekte, die sich sehr ähnlich sind, werden einem Cluster zugeordnet und liegen tendenziell näher beieinander.", hinweis6);
  toolT5.repositionTooltip();
}

function hinweis6(){
  toolT5.myTooltip.remove();
  toolT6 = new Tooltip(document.getElementsByClassName("huelle")[2], "Ein Cluster - hier durch eine graue Hülle dargestellt - fasst mehrere Projekte als Einheit zusammen und hat ebenfalls eine Identifikationsnummer (ID).", hinweis7);
  toolT6.repositionTooltip();
}

function hinweis7(){
  toolT6.myTooltip.remove();
  toolT7 = new Tooltip(document.getElementById("replay"), "Los geht's: Drücke diesen Button!", losGehts);
  toolT7.repositionTooltip();
}

function losGehts(){
  toolT7.myTooltip.remove();
}

function weiterGehts(){
  toolT8.myTooltip.remove();
}

/* Elemente:
 * 
 * document.getElementsByClassName("svg")[0]
 * "Es gibt zwei Grafiken. Die linke zeigt einen weichen Übergang (Transition) und die rechte eine Überblendung vom Start- zum Endzustand."
 * 
 * document.getElementById("replay")
 * "Dieser Button startet die Animationen und ermöglicht es, diese beliebig oft zu wiederholen."
 * 
 * document.getElementById("timeZeroBtn")
 * "Dieser Button schaltet zum Ausgangszustand vor der Animation zurück."
 * 
 * document.getElementById("endduration")
 * "Mit diesem Schieberegler kannst du die Animations-dauer festlegen."
 * 
 * document.getElementsByClassName("projekt")[3]
 * "Jedes Projekt wird durch einen Punkt dargestellt und hat eine eindeutige Identifikationsnummer (ID). Projekte, die sich sehr ähnlich sind, werden einem Cluster zugeordnet und liegen tendenziell näher beieinander."
 * 
 * document.getElementsByClassName("huelle")[3]
 * "Ein Cluster - hier durch eine graue Hülle dargestellt - fasst mehrere Projekte als Einheit zusammen und hat ebenfalls eine Identifikationsnummer (ID)."
 */
