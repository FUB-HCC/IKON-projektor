const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);

//////////////// Variablen //////////////
var clusterzahl = 3;
var currID = 1;
var positionsRegler = 0;
var transDuration = 1000;
var checkboxen = {};
const targetID = 6;
const projZahl = 32;
var richtigeAntwort = 0;

//////////////// Dataset ////////////////

var dataset = [];
var pos, id, gerade, clusterNo, researchArea, year, keywords;
var forschungsIDs = [1,4,8];
var positionen = [
  [[3,7], [5,9], [2,10], [4,8], [3,5]], // cluster 0
  [[6,4], [9,1], [8,6], [10,4]], // cluster 1
  [[2,2], [0,1]] // cluster 2
];
for (var i=0; i < positionen.length; i++){
  for (var j=0; j < positionen[i].length; j++){
    pos = new Position(positionen[i][j][0], positionen[i][j][1]);
    clusterNo = i;
    id = 10*i + j;
    researchArea = forschungsgebiete[forschungsIDs[id%3]];
    keywords = [Keywords.getRandStr(researchArea, clusterNo), Keywords.getRandStr(researchArea, clusterNo), Keywords.getRandStr(researchArea, clusterNo)];
    year = Index.getRandInt(zeitspanne[0], zeitspanne[1]);
    dataset.push(new Knoten(pos, id, clusterNo, researchArea, year, keywords));
  }
}

///////////// Seite ////////////////
d3.select("body")
  .append("p")
  .attr("name", "nummer")
  .text(aufgabenCounter(me))
  .style("margin-top", "-1em")
  .style("text-align", "center");

d3.select("body")
  .append("h1")
  .text("Deutung der Transition " + romanize(aufgabenNr(me)));
  
d3.select("body")
  .append("p")
  .attr("name", "anweisung")
  .text("Schaue dir folgende Transition an! Was passiert hier? Beschreibe es in Worten und finde die passende Antwort im Multiple Choice:");
  
//////////////// SVG ////////////////////
var svg = new SVG("svg");

//////////////// Scaling ////////////////////
var scale = new Scale(dataset);
scale.setDomain(getFilteredData(dataset));

//////////////// Kreise ////////////////////
var circs = new Kreise(getFilteredData(dataset), svg, "class42", scale);

//////////////// Hüllen ////////////////////
var gruppen = new Nest(getFilteredData(dataset));
var pfade = new Pfade(gruppen, svg, "class42", scale);


//////////// Text / Input ////////////
var box = d3.select("body")
  .append("div")
  .attr("class", "box")
  .attr("id", "platzhalter");

var hinweis = d3.select("body").select("div#platzhalter")
  .append("p")
  .text("Wenn du bereit bist, klicke auf den Button 'bereit'.");

//////////// Buttons /////////////
new LinkButton(me, deleteDatas, -1, "zurück", null);
var bereitBtn = new Button(update, "bereit");

//////////// UPDATE /////////////
function update(){
  var positionen = [
  [[3,7], [5,9], [2,10]], // cluster 0
  [[6,4], [9,1], [8,6]], // cluster 1
  [[2,2]] // cluster 2
];
  
  //////////// Transition ///////////////
  var oldDataset = cloneDataset(dataset);
  var oldNests = new Nest(oldDataset);
  
  var newDataset = [];
  oldDataset.forEach(function(k){
    if (k.clusterNo < positionen.length) {
      var line = positionen[k.clusterNo];
      if (k.id < 10*k.clusterNo + line.length)
        newDataset.push(k);
    }
  });
  
  var newNests = new Nest(newDataset);
  var transTable = oldNests.createTransitionNests(newNests);
  
  ////////// Hüllen //////////////
  svg.svg.select("g.hulls").selectAll("path.class42")
    .data(transTable[0].nest, function(d){return d.id;})
    .attr("d", function(d){
      return d.makeHulls2Path(scale);
    });
  
  scale.setDomain(newDataset);
  
  svg.svg.select("g.hulls").selectAll("path.class42")
    .data(transTable[1].nest, function(d){return d.id;})
    .transition().delay(500)
    .duration(transDuration).ease(d3.easeQuadInOut)
    .attr("d", function(d){
      return d.makeHulls2Path(scale);
    })
    .on("end", showNewDatas);
    
  function showNewDatas(){
    svg.svg.select("g.hulls").selectAll("path.class42")
      .data(new Nest(newDataset).nest, function(d){return d.id;})
      .attr("d", function(d){
        return d.makePolygons2Path(scale);
      });
  }
  
  ////////// Kreise //////////////
  var circles = svg.svg.select("g.circs")
    .selectAll("circle.class42")
    .data(newDataset, function(d){return d.id;});
    
  circles.exit()
    .attr("class", "remove")
    .transition().duration(500)
    .ease(d3.easeBackIn.overshoot(6))
    .attr("r", 0)
    .remove();
    
  svg.svg.select("g.circs")
    .selectAll("circle.class42")
    .transition().delay(500)
    .duration(transDuration)
    .ease(d3.easeQuadInOut)
    .attr("cx", function(d) {return scale.xScale(d.pos.x);})
    .attr("cy", function(d) {return scale.yScale(d.pos.y);})
    .style("pointer-events","visible");// https://stackoverflow.com/questions/34605916/d3-circle-onclick-event-not-firing
  
  var t0 = d3.transition().delay(transDuration+500).duration(0)
    .on("end", createForm);
  
  // Formular
  function createForm() {
    bereitBtn.btn.remove();
    hinweis.remove();
    
    box.style("width", "90%")
      .style("margin-left", "5%");
      
    var form = d3.select("body").select("div#platzhalter")
      .append("form");
      
    var cases = [
      "Das Verschwinden von Projekten beeinflusste die Hüllenform.",// <- richtigeAntwort
      "Projekte sind verschwunden und beeinflussten nicht die Hüllenform.",
      "Die Hüllenform hat sich bei konstanter Projektzahl verändert.",
      "Die Cluster haben sich verschoben, aber die Form blieb unverändert."
    ];
    richtigeAntwort = randomizeArray(cases, richtigeAntwort);
    // https://stackoverflow.com/questions/26499844/dynamically-create-radio-buttons-using-d3-js
    // https://stackoverflow.com/questions/28433997/d3-how-to-create-input-elements-followed-by-label-text
    var radios = form.selectAll('input[name="cases"]')
    .data(cases);

    var labels = radios.enter()
      .append("div")
      .style("text-align", "left")
      .append("label")
      .append("input")
      .attr("type", "radio")
      .attr("name", "cases")
      .attr("value", function(d) {return d;});
      
    d3.selectAll("label")
      .append("text")
      .text(function(d) {return " " + d});
    
    var weiter = new Button(storeDatas, "weiter");
    weiter.btn
      .on("click", function(){// wird ersetzt
        var radioList = document.getElementsByName("cases");
        var selected = undefined;
        // https://stackoverflow.com/questions/9618504/how-to-get-the-selected-radio-button-s-value
        for (var i in radioList) {
          if (radioList[i].checked) {
            selected = radioList[i];
            break;
          }
        }
        if (selected != undefined) {
          storeDatas(me, "Deutung, " + selected.value + ", Lösung, " + radioList[richtigeAntwort].value);
          var index = (websites.indexOf(me)+1) % websites.length;
          window.location.href = websites[index]+".html"; // https://www.w3schools.com/howto/howto_js_redirect_webpage.asp
        }
        else
          alert("Bitte wähle eine Antwort aus.");
      });
  }
}

  

