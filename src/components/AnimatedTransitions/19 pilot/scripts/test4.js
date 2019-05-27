const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);

//////////////// Variablen //////////////
var clusterzahl = 3;
var currID = 1;
var positionsRegler = 0;
var transDuration = 1000;
var checkboxen = {};
const targetID = 6;

//////////////// Dataset ////////////////

var dataset = [];
var pos, id, gerade, clusterNo, researchArea, year, keywords;
var forschungsIDs = [1,4,8];
var positionen = [
  [0.5,3,0], [1,4.5,0], [2,4,0], // cluster 0
  [4,3,1], [5,5,1], [5.5,3.5,1],// cluster 1
  [3.5,0.5,2], [4.3,2,2], [6,1.5,2] // cluster 2
];
for(i=0; i < positionen.length; i++){
  pos = new Position(positionen[i][0], positionen[i][1]);
  id = currID++;
  clusterNo = positionen[i][2];
  researchArea = forschungsgebiete[forschungsIDs[id%3]];
  keywords = [Keywords.getRandStr(researchArea, clusterNo), Keywords.getRandStr(researchArea, clusterNo), Keywords.getRandStr(researchArea, clusterNo)];
  year = Index.getRandInt(zeitspanne[0], zeitspanne[1]);
  dataset.push(new Knoten(pos, id, clusterNo, researchArea, year, keywords));
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
  .text("Deutung der Transition I");
  
d3.select("body")
  .append("p")
  .attr("name", "anweisung")
  .text("Das folgende Beispiel zeigt eine Transition von Hüllen, bedingt durch die Projektdaten. Schaue dir folgende Transition an und deute diese.");
  
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
  bereitBtn.btn.remove();
  hinweis.remove();
  
  box.style("width", "30%")
    .style("margin-left", "35%");
    
  var radioBtns = d3.select("body").select("div#platzhalter")
    .append("form");
  radioBtns.append("input")
      .attr("type", "radio")
      .attr("name", "deutung")
      .attr("value", "Ein Cluster hat sich aufgeteilt.")
  radioBtns.append("input")
      .attr("type", "radio")
      .attr("name", "deutung")
      .attr("value", "Genau Zwei Cluster sind zu einem verschmolzen")
  radioBtns.append("input")
      .attr("type", "radio")
      .attr("name", "deutung")
      .attr("value", "Projekte sind verschwunden")
  radioBtns.append("input")
      .attr("type", "radio")
      .attr("name", "deutung")
      .attr("value", "Projekte sind hinzu gekommen");
  
  var input = d3.select("body").select("div#platzhalter")
    .append("input")
    .attr("type", "number")
    .attr("name", "anzahl")
    .attr("id", "anzahl")
    .attr("min", 0)
    .attr("max", 20)
    .attr("size", 2)
    .attr("step", 1)
    .attr("required", true)
    .style("width", "4em")
    .style("float", "right")
    .style("text-align", "left");
  
  var anzNeu = dataset.filter(d => d.year > 2000).length;
  var weiter = new Button(storeDatas, "weiter");
  weiter.btn
    .on("click", function(){// wird ersetzt
      var num = document.getElementById("anzahl").value;
      console.log(num);
      if (num && !isNaN(num) && num <= 20 && num >= 0) {
        storeDatas(me, "Gefiltert, " + anzNeu + ", geschätzt, " + num);
        var index = (websites.indexOf(me)+1) % websites.length;
        window.location.href = websites[index]+".html"; // https://www.w3schools.com/howto/howto_js_redirect_webpage.asp
      }
      else
        alert("Bitte gib eine natürliche Zahl zwischen 0 und 20 ein.");
    });
  
  var positionen = [
    [5,0.8,2], [3.7,4.4,1], [5,3.7,1], // cluster 0 aufgeteilt
    [4,3,1], [5,5,1], [5.5,3.5,1],// cluster 1
    [3.5,0.5,2], [4.3,2,2], [6,1.5,2] // cluster 2
  ];

  //////////// Transition ///////////////
  var oldDataset = cloneDataset(getFilteredData(dataset));
  var oldNests = new Nest(oldDataset);
  
  for(i=0; i < positionen.length; i++){
    pos = new Position(positionen[i][0], positionen[i][1]);
    dataset[i].pos = pos;
    dataset[i].clusterNo = positionen[i][2];
  }
  
  var newNests = new Nest(getFilteredData(dataset));
  var transTable = oldNests.createTransitionNests(newNests);
  
  ////////// Hüllen //////////////
  svg.svg.select("g.hulls").selectAll("path.class42")
    .data(transTable[0].nest, function(d){return d.id;})
    .attr("d", function(d){
      return d.makeHulls2Path(scale);
    });
  
  scale.setDomain(getFilteredData(dataset));
  
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
      .data(new Nest(getFilteredData(dataset)).nest, function(d){return d.id;})
      .attr("d", function(d){
        return d.makePolygons2Path(scale);
      });
  }
  
  ////////// Kreise //////////////
  
  var circles = svg.svg.select("g.circs")
    .selectAll("circle.class42")
    .data(getFilteredData(dataset), function(d){return d.id;});
    
  circles.exit()
    .transition().duration(500)
    .ease(d3.easeBackIn.overshoot(6))
    .attr("r", 0)
    .remove();
    
  circles.filter(c => c.year <= 2000)
    .transition().delay(500)
    .duration(transDuration)
    .ease(d3.easeQuadInOut)
    .attr("cx", function(d) {return scale.xScale(d.pos.x);})
    .attr("cy", function(d) {return scale.yScale(d.pos.y);})
    .style("pointer-events","visible");// https://stackoverflow.com/questions/34605916/d3-circle-onclick-event-not-firing
  
}

  

