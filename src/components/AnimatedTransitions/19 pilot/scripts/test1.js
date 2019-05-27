const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);

//////////////// Variablen //////////////
var clusterzahl = 3;
var currID = 1;
var zeitspanne = [1980,2019];
var positionsRegler = 0;
var transDuration = 1000;
var checkboxen = {};
const targetID = 7;

//////////////// Dataset ////////////////
var dataset = [];
var pos, id, gerade, clusterNo, researchArea, year, keywords;
var positionen = [
  [0.5,7,0], [1.8,6.8,0], [1,5,0], [0.9,3.7,0], [1.5,2.5,0],// 1-5
  [2,3.6,0], [2,4.5,0], [2.3,4.2,0], [3,4.1,0], [3.9,3.3,0],// 7-10
  [4,4.7,0], [3.8,5,0], [4.2,6.2,0], [5.1,4.9,0],// 11-14
  [2.8,3,1], [3,1.2,1], [2.4,0.2,1], [3.9,0.1,1], [4,2,1],//15-19 
  [4.3,2.1,1], [5.2,1,1], [6.2,1,1], //20-22
  [9,3.7,2], [9,5.1,2], [7.5,5,2], [8,6.2,2], [9,6.8,2], [7,6.3,2]
];
for(i=0; i < positionen.length; i++){
  pos = new Position(positionen[i][0], positionen[i][1]);
  id = currID++;
  clusterNo = positionen[i][2];
  researchArea = forschungsgebiete[0];
  keywords = [Keywords.getRandStr(researchArea, clusterNo), Keywords.getRandStr(researchArea, clusterNo), Keywords.getRandStr(researchArea, clusterNo)];;
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
  .text("Objektverfolgung");
  
d3.select("body")
  .append("p")
  .attr("name", "anweisung")
  .text("Das folgende Beispiel zeigt mehrere Cluster. Aufgabe ist es, den blau markierten Punkt in seiner Bewegung zu verfolgen und anschließend auf ihn zu klicken. Achtung: während der Transition behält er nicht seine Färbung.");
  
//////////////// SVG ////////////////////
var svg = new SVG("svg");

//////////////// Scaling ////////////////////
var scale = new Scale(dataset);
scale.setDomain(getFilteredData(dataset));

//////////////// Kreise ////////////////////
var circs = new Kreise(getFilteredData(dataset), svg, "class42", scale);

d3.select("g.circs").selectAll("circle.class42")
  .filter(k => k.id == targetID)
  .style("fill", d3.rgb(colorScheme[0]))// .darker(1)
  .style("stroke", d3.rgb(colorScheme[0]).brighter(2));

//////////////// Hüllen ////////////////////
var gruppen = new Nest(getFilteredData(dataset));
var pfade = new Pfade(gruppen, svg, "class42", scale);

var hinweis = d3.select("body")//.select(".box")
  .append("p")
  .text("Wenn du bereit bist, klicke auf den Button 'bereit'.");

//////////// Buttons /////////////
new LinkButton(me, deleteDatas, -1, "zurück", null);
var btn = new Button(update, "bereit");

//////////// UPDATE /////////////
function update(){    
  d3.select("g.circs").selectAll("circle.class42")
    //.style("pointer-events", "none")
    .on("mouseover", tooltipNodePoor.show)
    .on("mouseout", tooltipNodePoor.hide);
    
  svg.svg.call(tooltipNodePoor);
  
  btn.btn.remove();
  hinweis.text("Klicke auf den Punkt, den du für den blauen Punkt hältst.");
  
  positionen = [
    [0.5,6,0], [2.8,8,0], [2.6,3.7,0], [2,2.7,0], [2.1,5.1,0],// 1-5
    [0.8,4.6,0], [8,7,0], [2.3,6.5,0], [6.3,3.2,0], [5.8,6.7,0],// 6-10
    [5.2,2.7,0], [3.8,6.6,0], [5.8,7.5,0], [6.2,4.5,0],// 11-14
    [2.5,1,1], [3.7,4.5,1], [1.7,1,1], [3.9,1.5,1], [5,4.4,1],//15-19 
    [4.3,0.9,1], [6.2,2.5,1,1], [7.6,0.2,1], //20-22
    [8.3,6,2], [7,3.9,2], [4,5.8,2], [6.3,7.5,2], [9.5,7.7,2], [7.8,7.4,2]
  ];
  
  //////////// Transition ///////////////
  var oldDataset = cloneDataset(dataset);
  var oldNests = new Nest(getFilteredData(oldDataset));
  
  for(i=0; i < positionen.length; i++){
    pos = new Position(positionen[i][0], positionen[i][1]);
    dataset[i].pos = pos;
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
    .transition().duration(transDuration).ease(d3.easeQuadInOut)
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
  d3.select("g.circs").selectAll("circle.class42")
    .filter(k => k.id == targetID)
    .style("fill", function(d) {
      return d3.rgb(colorScheme[d.researchArea.disziplin]);
    })
    .style("stroke", function(d) {
      return d3.rgb(colorScheme[d.researchArea.disziplin])
      .brighter(2);
    });
  
  var moves = svg.svg.select("g.circs")
    .selectAll("circle.class42")
    .data(getFilteredData(dataset), function(d){return d.id;});
    
  moves.transition().duration(transDuration).ease(d3.easeQuadInOut)
    .attr("cx", function(d) {return scale.xScale(d.pos.x);})
    .attr("cy", function(d) {return scale.yScale(d.pos.y);})
    .style("pointer-events","visible");// https://stackoverflow.com/questions/34605916/d3-circle-onclick-event-not-firing
    
  // Kreise erhalten einen Klick-Event
  var allCircs = d3.select("g.circs").selectAll("circle.class42");
  allCircs.on("click", function(clicked){// ein Kreis wurde geklickt      
      var blueCirc = allCircs.filter(b => b.id == targetID)
        .style("fill", d3.rgb(colorScheme[0]))
        .style("stroke", d3.rgb(colorScheme[0]).brighter(2));
      
      var allCircsPos = [];
      allCircs._groups[0].forEach(c => allCircsPos.push(c.__data__.pos));
      var blueCircPos = null;
      blueCirc._groups[0].forEach(b => blueCircPos = b.__data__.pos);
        
      // berechnet das Ergebnis
      const dist = blueCircPos.getDistance(clicked.pos);
      const maxDist = d3.max(allCircsPos, 
        p => blueCircPos.getDistance(p));
       const accuracy = "Objektverfolgung Genauigkeit: " + (100-(dist/maxDist*100)).toString() + "%";
      // erstellt den neuen Link
      new LinkButton(me, storeDatas, +1, "weiter", accuracy);
      
      // Tooltips
      d3.select(this).each(tooltipNodePoor.hide);
      d3.select(this).each(tooltipNode.show);
      
      allCircs
        .on("mouseover", tooltipNode.show)
        .on("mouseout", tooltipNode.hide);
        
      hinweis.text("Zur nächsten Aufgabe geht es mit 'weiter'.");
      
      allCircs.on("click",function(){alert("Klicke den Button 'Weiter'.");});
  });
}

  

