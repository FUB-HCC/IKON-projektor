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
for(i=0; i < projZahl; i++){
  pos = new Position(Float.getRandFloat(0,width), Float.getRandFloat(0,height));
  id = currID++;
  gerade = new Gerade(new Position(width/2, height/2), pos);
  clusterNo = Math.floor(gerade.getAngle() / (2*Math.PI) * clusterzahl);
  researchArea = forschungsgebiete[Index.getRandInt(0, forschungsgebiete.length-1)];
  keywords = [Keywords.getRandStr(researchArea, clusterNo), Keywords.getRandStr(researchArea, clusterNo), Keywords.getRandStr(researchArea, clusterNo)];
  var rel = Math.floor(projZahl/8);
  if ((i+1) % rel == 0)
    year = Index.getRandInt(2001, 2019);
  else
    year = Index.getRandInt(zeitspanne[0], 2000);
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
  var anzNeu = dataset.filter(d => d.year > 2000).length;
  
  //////////// Transition ///////////////
  var oldDataset = cloneDataset(getFilteredData(dataset));
  var oldNests = new Nest(oldDataset);
  
  zeitspanne[1] = 2000;
  
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
  
  var t0 = d3.transition().delay(transDuration+500).duration(0)
    .on("end", createForm);
  
  // Formular
  function createForm() {
    bereitBtn.btn.remove();
    hinweis.remove();
    
    box.style("width", "70%")
      .style("margin-left", "15%");
      
    var form = d3.select("body").select("div#platzhalter")
      .append("form");
      
    var cases = [
    
      "Projekte sind verschwunden.",// <- richtigeAntwort
      "Projekte sind hinzu gekommen.",
      "Projekte haben das Cluster gewechselt.", 
      "Projekte haben sich verschoben."
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
          storeDatas(me, "Deutung;" + selected.value + ";Lösung;" + radioList[richtigeAntwort].value + ";Antworten; " + cases.join(";"));
          var index = (websites.indexOf(me)+1) % websites.length;
          window.location.href = websites[index]+".html"; // https://www.w3schools.com/howto/howto_js_redirect_webpage.asp
        }
        else
          alert("Bitte wähle eine Antwort aus.");
      });
  }
}

  

