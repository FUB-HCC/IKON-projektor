const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);

//////////////// Variablen //////////////
var clusterzahl = 3;
var currID = 1;
var positionsRegler = 0;
var transDuration = 1000;
var checkboxen = {};
const targetID = 6;
var richtigeAntwort = 0;

//////////////// Dataset ////////////////

var dataset = [];
var pos, id, gerade, clusterNo, researchArea, year, keywords;
var forschungsIDs = [1,4,8];
var positionen = [
  [1,1,0], [2,1.5,0], [2.2,3,0], [1.4,3.6,0], [3,3.5,0], // cluster 0
  [4,6,1], [3.8,8,1], [5,5,1], [4.7,7,1], // cluster 1
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
  .text("Deutung der Transition " + romanize(aufgabenNr(me)));
  
d3.select("body")
  .append("p")
  .attr("name", "anweisung")
  .text("Das folgende Beispiel zeigt eine Transition von Hüllen. Was passiert hier? Beschreibe es in Worten und finde die passende Antwort im Multiple Choice:");
  
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
  [1.2,0.4,0], [3,1,0], [5,1,2], [1,3,0], [3.3,4,0], // cluster 0
  [4.6,5,1], [3,7,1], [6,4.5,1], [4,8,1], // cluster 1
  ];

  //////////// Transition ///////////////
  var oldDataset = cloneDataset(dataset);
  var oldNests = new Nest(oldDataset);
  
  for(i=0; i < positionen.length; i++){
    pos = new Position(positionen[i][0], positionen[i][1]);
    dataset[i].pos = pos;
    dataset[i].clusterNo = positionen[i][2];
  }
  
  var newNests = new Nest(dataset);
  var transTable = oldNests.createTransitionNests(newNests);
  
  ////////// Hüllen //////////////
  svg.svg.select("g.hulls").selectAll("path.class42")
    .data(transTable[0].nest, function(d){return d.id;})
    .attr("d", function(d){
      return d.makeHulls2Path(scale);
    });
  
  scale.setDomain(dataset);
  
  var hulls = svg.svg.select("g.hulls").selectAll("path.class42")
    .data(transTable[1].nest, function(d){return d.id;});
    
  hulls.enter()// bei verschmelzen: einer im exit() drin
    .append("path")
    .attr("class", "enter")
    .attr("d", function(c){// c = Cluster{id, polygons}
      return c.makePolygons2Path(scale);}
    )
    .attr('fill', "gray")
    .attr('stroke', "gray")
    .attr('opacity', 0)
    .style('opacity', 0)
    .on("mouseover", tooltipCluster.show)
    .on("mouseout", tooltipCluster.hide)
    .transition().duration(transDuration)
    .style('opacity', 0.3);
    
  svg.svg.select("g.hulls").selectAll("path.class42")
    .transition().duration(transDuration)
    .ease(d3.easeQuadInOut)
    .attr("d", function(d){
      return d.makeHulls2Path(scale);
    })
    .on("end", showNewDatas);
    
  function showNewDatas(){
    svg.svg.select("g.hulls").selectAll("path.class42")
      .data(new Nest(dataset).nest, function(d){return d.id;})
      .attr("d", function(d){
        return d.makePolygons2Path(scale);
      });
  }
  
  ////////// Kreise //////////////
  var circles = svg.svg.select("g.circs")
    .selectAll("circle.class42")
    .data(dataset, function(d){return d.id;});
    
  circles.transition().duration(transDuration)
    .ease(d3.easeQuadInOut)
    .attr("cx", function(d) {return scale.xScale(d.pos.x);})
    .attr("cy", function(d) {return scale.yScale(d.pos.y);});
    //.style("pointer-events","visible");// https://stackoverflow.com/questions/34605916/d3-circle-onclick-event-not-firing
    
  var t0 = d3.transition().delay(transDuration+500).duration(0)
    .on("end", createForm);
  
  function createForm() {
    //////////////// Formular
    bereitBtn.btn.remove();
    hinweis.remove();
    
    box.style("width", "90%")
      .style("margin-left", "5%");
      
    var form = d3.select("body").select("div#platzhalter")
      .append("form");
      
    var cases = [
      "Ein Cluster hat sich aufgeteilt und ein neues ist entstanden.", // <- richtigeAntwort
      "Ein Projekt ist hinzu gekommen und hat ein neues Cluster gebildet.",
      "Ein Projekt ist zu einem anderem, existierenden Cluster gewechselt.",
      "Ein Cluster hat ein Projekt an ein anderes existierendes abgegeben."
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
    
    // Buttons
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
          storeDatas(me, "Deutung;" + selected.value + ";Lösung;" + radioList[richtigeAntwort].value + ";Antworten; " + cases.join(";"));
          var index = (websites.indexOf(me)+1) % websites.length;
          window.location.href = websites[index]+".html"; // https://www.w3schools.com/howto/howto_js_redirect_webpage.asp
        }
        else
          alert("Bitte wähle eine Antwort aus.");
      });
  }
}

  

