const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);

//////////////// Variablen //////////////
var clusterzahl = 3;
var currID = 1;
var positionsRegler = 0;
var transDuration = 1000;
var checkboxen = {};
const targetID = 6;
const projZahl = 32;

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
  .text("Änderungswahrnehmung II");
  
d3.select("body")
  .append("p")
  .attr("name", "anweisung")
  .text("Das folgende Beispiel zeigt alle Projekte bis zum Jahr 2019. Aufgabe ist es, die Anzahl der gefilterten Projekte möglichst gut zu schätzen. Anders formuliert: wie viele Projekte verschwinden? Achtung: Die Animationsdauer ist kurz und eine Wiederholung ist nicht möglich.");
  
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
  d3.select("g.circs").selectAll("circle.class42")
    .on("mouseover", tooltipNodePoor.show)
    .on("mouseout", tooltipNodePoor.hide);
    
  svg.svg.call(tooltipNodePoor);
  bereitBtn.btn.remove();
  
  box.style("width", "30%")
    .style("margin-left", "35%");
  hinweis.text("Anzahl:")
    .style("float", "left")
    //.style("position", "absolute")
    .style("padding-right", "-1em")
    .style("text-align", "right")
    .style("width", "20%");
  
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
  
}

  

