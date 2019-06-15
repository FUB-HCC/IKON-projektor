const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);

//////////////// Variablen //////////////
var clusterzahl = 3;
var positionsRegler = 0;
var transDuration = 1000;
var checkboxen = {};
const targetID = 7;
const projZahl = 32;
var richtigeAntwort = 0;

//////////////// Dataset ////////////////
zeitspanne = [1990,2000];

var dataset = [];
var pos, id, gerade, clusterNo, researchArea, year, keywords;
var forschungsIDs = [1,4,8];
var positionen = [
  [[2,3], [4,4], [4,6], [1,6], [2.5,4.5]], // cluster 0
  [[6,2], [7.5,2], [9,1], [7,4]], // cluster 1
  [[8,6], [8,9], [7,10]] // cluster 2
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
  [[1,2], [4,4], [5,7], [1,6], [2,5.5]], // cluster 0
  [[6,2], [7.5,2], [9,1], [7,3], [7,0]], // cluster 1
  [[8,6], [8,9], [7,10], [6.5,8]], // cluster 2
  [[2,4], [3,5]] // cluster 3
  ];
  
  //////////// Transition ///////////////
  var oldDataset = cloneDataset(dataset);
  var oldNests = new Nest(oldDataset);
  
  var vorhanden;
  for (var i=0; i < positionen.length; i++){
    for (var j=0; j < positionen[i].length; j++){
      pos = new Position(positionen[i][j][0], positionen[i][j][1]);
      clusterNo = i;
      id = 10*i + j;
      researchArea = forschungsgebiete[forschungsIDs[id%3]];
      keywords = [Keywords.getRandStr(researchArea, clusterNo), Keywords.getRandStr(researchArea, clusterNo), Keywords.getRandStr(researchArea, clusterNo)];
      year = Index.getRandInt(zeitspanne[0], zeitspanne[1]);
      vorhanden = dataset.map(d => d.id).some(i => i == id);
      if (!vorhanden)
        dataset.push(new Knoten(pos, id, clusterNo, researchArea, year, keywords));
      else // könnte effektiver programmiert werden
        dataset.filter(d => d.id == id).forEach(d => d.pos = pos);
    }
  }
  
  var newNests = new Nest(getFilteredData(dataset));
  var transTable = oldNests.createTransitionNests(newNests);
  
  ////////// Hüllen //////////////
  var hulls = svg.svg.select("g.hulls").selectAll("path.class42")
    .data(transTable[0].nest, function(d){return d.id;});
    
  hulls.enter()
    .append("path")
    .attr("class", "class42")
    .attr("d", function(c){// c = Cluster{id, polygons}
      return c.makePolygons2Path(scale);}
    )
    .attr('fill', "gray")
    .attr('stroke', "gray")
    .attr('opacity', 0)
    .on("mouseover", tooltipCluster.show)
    .on("mouseout", tooltipCluster.hide)
  .merge(hulls)
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
    .attr('opacity', 0.3)
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
    
  circles.enter()
    .append("circle")
    .attr("class", "new")
    .attr("cx", function(d) {return scale.xScale(d.pos.x);})
    .attr("cy", function(d) {return scale.yScale(d.pos.y);})
    .attr("r", 0)
    .on("mouseover", tooltipNode.show)
    .on("mouseout", tooltipNode.hide)
    // https://github.com/d3/d3-scale-chromatic
    .style("stroke", function(d){
      return d3.rgb(colorScheme[d.researchArea.disziplin]).brighter(2);
    })// .darker(2)
    .style("fill", function(d){
      return d3.rgb(colorScheme[d.researchArea.disziplin]);
    })
    .style("opacity", 1)
    .style("pointer-events", "all")
    .transition().delay(transDuration)
    .duration(500).ease(d3.easeBackOut.overshoot(6))
    .attr("r", radius)
    .style("pointer-events","visible");// https://stackoverflow.com/questions/34605916/d3-circle-onclick-event-not-firing
    
  svg.svg.select("g.circs").selectAll("circle.class42")
    .transition().duration(transDuration).ease(d3.easeQuadInOut)
    .attr("cx", function(d) {return scale.xScale(d.pos.x);})
    .attr("cy", function(d) {return scale.yScale(d.pos.y);});
    
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
      "Neue Projekte haben ein neues Cluster erzeugt.",// <- richtigeAntwort
      "Alte Projekte haben ein neues Cluster erzeugt.",
      "Ein Cluster hat sich aufgeteilt.",
      "Projekte kamen hinzu, aber die Clusterzahl blieb konstant."
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

  

