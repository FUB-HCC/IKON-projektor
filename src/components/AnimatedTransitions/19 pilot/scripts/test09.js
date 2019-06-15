const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);

//////////////// Variablen //////////////
var clusterzahl = 5;
var currID = 1;
var positionsRegler = 0;
var transDuration = 750;
const targetID = 7;
const projZahl = 150;

//////////////// Dataset ////////////////
var dataset = [];
var pos, id, gerade, clusterNo, researchArea, year, keywords;
for(i=0; i < projZahl; i++){
  pos = new Position(Float.getRandFloat(0,width), Float.getRandFloat(0,height));
  id = currID++;
  gerade = new Gerade(new Position(width/2, height/2), pos);
  clusterNo = Math.floor(gerade.getAngle() / (2*Math.PI) * clusterzahl);
  researchArea = forschungsgebiete[Index.getRandInt(0,3)];
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
  .text("Clusterzahl");
  
d3.select("body")
  .append("p")
  .attr("name", "anweisung")
  .text("Das folgende Beispiel zeigt geclusterte Projekte - jedoch ohne Hüllen. Trage die vermutete Clusterzahl vor und nach der Transition in die Felder ein.");
  
//////////////// SVG ////////////////////
var svg = new SVG("svg");

//////////////// Scaling ////////////////////
var scale = new Scale(dataset);

//////////////// Kreise ////////////////////
var circs = new Kreise(dataset, svg, "class42", scale);

//////////////// Cluster ////////////////////
var gruppen = new Nest(dataset);
gruppen.nest.forEach(function(c) {
  c.moveVertsCloserTogether(0.2);
});

scale.setDomain(dataset);
var huellen = new Pfade(gruppen, svg, "class42", scale);
huellen.hull.style('opacity', 0);
circs.circles
  .attr("cx", function(d) {return scale.xScale(d.pos.x);})
  .attr("cy", function(d) {return scale.yScale(d.pos.y);});


//////////// Text / Input ////////////
var box = d3.select("body")
  .append("div")
  .attr("class", "box")
  .attr("id", "platzhalter");
  
  ///////////// Felder
  box.style("width", "70%")
    .style("margin-left", "15%");
    
  var form = d3.select("body").select("div#platzhalter")
    .append("form");
    
  var labeltext = [
    "Clusterzahl  (vorher)",
    "Clusterzahl (nachher)"
  ];
  
  var labels = form.selectAll("label")
    .data(labeltext)
    .enter()
    .append("label")
      .style("float", "left")
      .style("text-align", "right")
      .style("width", "18em")
      .text(function(d) {return d;})
    .insert("input")
      .attr("type", "number")
      .attr("name", "anzahl")
      .attr("class", "numberInput")
      .attr("id", function(d,i){return "input" + i})
      .attr("min", 0)
      .attr("max", 20)
      .attr("size", 2)
      .attr("step", 1)
      .attr("required", true)
      .style("width", "3em")
      .style("float", "right")
      .style("text-align", "left")
      .style("margin-left", "0.5em");

// var hinweis = d3.select("body").select("div#platzhalter")
//   .append("p")
//   .text("Wenn du bereit bist, klicke auf den Button 'bereit'.");

//////////// Buttons /////////////
new LinkButton(me, deleteDatas, -1, "zurück", null);
var bereitBtn = new Button(update, "bereit");

//////////// UPDATE /////////////
function update(){
  //////////// Transition ///////////////
  dataset.map(function(knoten){
    var newPos = new Position(Float.getRandFloat(0, width/3), Float.getRandFloat(0, height/3));
    knoten.moveBy(newPos);
  });
  
  gruppen.nest.forEach(function(c) {
    c.positioniereCluster(clusterzahl);
    c.moveVertsCloserTogether(0.2);
  });

  scale.setDomain(dataset);
  
  ////////// Kreise
  var circles = svg.svg.select("g.circs")
    .selectAll("circle.class42")
    .data(dataset, function(d){return d.id;});
    
  circles.enter()
    .append("circle")
    .attr("class", "class42")
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
  .merge(circles)
    .transition().duration(transDuration).ease(d3.easeQuadInOut)
    .attr("cx", function(d) {return scale.xScale(d.pos.x);})
    .attr("cy", function(d) {return scale.yScale(d.pos.y);})
    .transition().delay(transDuration)
    .duration(transDuration).ease(d3.easeBackOut.overshoot(6))
    .attr("r", radius)
    .style("pointer-events","visible");// https://stackoverflow.com/questions/34605916/d3-circle-onclick-event-not-firing
    
  var t0 = d3.transition().delay(transDuration+500).duration(0)
    .on("end", createForm);
  
  // Formular
  function createForm() {
    bereitBtn.btn.remove();
    
    ///////////// Save
    var weiter = new Button(storeDatas, "weiter");
    weiter.btn
      .on("click", function(){// wird ersetzt
        var numVorher = document.getElementById("input0").value;
        var numNachher = document.getElementById("input1").value;
        
        if (!numVorher || isNaN(numVorher) || numVorher < 0)
          alert("Bitte gib eine natürliche Zahl zwischen 0 und 20 ein.");
        else if (!numNachher || isNaN(numNachher) || numNachher < 0)
          alert("Bitte gib eine natürliche Zahl zwischen 0 und 20 ein.");
        else {
          storeDatas(me, "Clusterzahl vorher, " + numVorher + ", Clusterzahl nachher, " + numNachher + ", tatsächliche Zahl," + clusterzahl);
          var index = (websites.indexOf(me)+1) % websites.length;
          window.location.href = websites[index]+".html"; // https://www.w3schools.com/howto/howto_js_redirect_webpage.asp
        }
      });
  }
}

  

