const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);

//////////////// Variablen //////////////
var clusterzahl = 3;
var currID = 1;
var transDuration = 1000;
var projZahl = 32;
var richtigeAntwort = 0;
const durationSpan = [500, 2500];
const schrittweite = 250;

//////////////// Datasets ////////////////
var oldDataset = [];
var pos, id, gerade, clusterNo, researchArea, year, keywords;
for(i=0; i < projZahl; i++){
  pos = new Position(Float.getRandFloat(0,width), Float.getRandFloat(0,height));
  id = currID++;
  gerade = new Gerade(new Position(width/2, height/2), pos);
  clusterNo = Math.floor(gerade.getAngle() / (2*Math.PI) * clusterzahl);
  researchArea = forschungsgebiete[Index.getRandInt(0, forschungsgebiete.length-1)];
  keywords = [Keywords.getRandStr(researchArea, clusterNo), Keywords.getRandStr(researchArea, clusterNo), Keywords.getRandStr(researchArea, clusterNo)];
  year = Index.getRandInt(zeitspanne[0], zeitspanne[1]);
  oldDataset.push(new Knoten(pos, id, clusterNo, researchArea, year, keywords));
}
var oldNests = new Nest(oldDataset);

var newDataset = cloneDataset(oldDataset);
projZahl -= 8;
newDataset = newDataset.slice(0,projZahl);
clusterzahl++;// ermöglicht ein neues Cluster
newDataset.forEach(function(d){// Knoten löschen
  if (d.id % 8 == 0) // Clusterwechsel
    d.clusterNo = Math.floor(gerade.getAngle() / (2*Math.PI) * clusterzahl);
});

var newNests = new Nest(newDataset);
newNests.nest.forEach(function(c){// bewegt Knoten
  c.moveVertsCloserTogether(0.2);
});

//////////// Transition ///////////////
var transTable = oldNests.createTransitionNests(newNests);

///////////// Seite ////////////////
d3.select("body")
  .style("width", "350px")//60%
  .style("margin-left", function(){
    return (document.getElementsByTagName("html")[0].clientWidth - 350) / 2 + "px";
  });//20%

d3.select("body")
  .append("p")
  .attr("name", "nummer")
  .text(aufgabenCounter(me))
  .style("margin-top", "-1em")
  .style("text-align", "center");
  

  
//////////////// 
d3.select("body")
  .append("h1")
  .text("Transitionsdauer");
  
d3.select("body")
  .append("p")
  .attr("name", "anweisung")
  .text("Welche Transitionsdauer bevorzugst du und warum?");
  
/////////////// Schieberegeler TransDuration ///////////
var schieberegeler = d3.select("body")
  .append("div")
  .style("text-align", "left");

schieberegeler.append("text")
  .text("Transitionsdauer: ");

schieberegeler.append("label")
  .attr("class", "reglerText")
  .append("text")
  .attr("id", "startduration")
  .style("margin-right", "3px")
  .text(function(){
    return parseSec(durationSpan[0]);
  });
  
schieberegeler.append("input")
  .attr("type", "range")
  .attr("id", "transDurationIn")
  .attr("value", transDuration)
  .attr("min", durationSpan[0])
  .attr("max", durationSpan[1])
  .attr("step", schrittweite);
  
schieberegeler.append("label")
  .attr("class", "reglerText")
  .append("text")
  .attr("id", "endduration")
  .style("margin-left", "3px")
  .text(function(){
    return parseSec(durationSpan[1]);
  });
  
schieberegeler.append("output")
  .attr("id", "transDurationOut")
  .attr("value", "1 s")
  .style("right", function(){
    var regler = document.getElementById("transDurationIn");
    return (100-(regler.value-regler.min)/regler.max*100 - 10).toString()+"px";
  })
  .text("1 s")
  .style("center", "2em");
  
document.getElementById("transDurationIn").value = transDuration;

d3.select("#transDurationIn")
  .on("change", function(){// aktualisiert Variable 
    transDuration = parseInt(this.value);
  })
  .on("input", function(){// aktualisiert Zahl und Verschiebung
    var textContent = parseSec(this.value);
    document.getElementById("transDurationOut").value = textContent;
    d3.select("#transDurationOut")
      .style("right", (100-(this.value-this.min)/this.max*100 + ((textContent.length-2) / 2 * 14)).toString()+"px");
  });
  
//////////////// SVG //////////////////// 
var svg = d3.select("body").append("div")
  .style("margin-top", "10px")
  //.attr("class", "box")
  .append("svg")
  .attr("class", "svg")
  .attr("width",  width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
svg.append("g").attr("class", "hulls");
svg.append("g").attr("class", "circs");
svg.call(tooltipNode);// call the function on the selection
svg.call(tooltipCluster);

//////////////// Scaling ////////////////////
var scale = new Scale(oldDataset);
scale.setDomain(oldDataset);

ausgangszustand();

//////////// Text / Input ////////////
var box = d3.select("body")
  .append("div")
  .attr("id", "platzhalter");
  
var hinweis = d3.select("body").select("div#platzhalter")
  .append("p")
  .text("Wenn du bereit bist, klicke auf den Button 'bereit'.");

//////////// Buttons /////////////
new LinkButton(me, deleteDatas, -1, "zurück", null);
var bereitBtn = new Button(update, "bereit");


/////////// Transition ////////////
function transition(){
  ////////// Hüllen //////////////
  svg.select("g.hulls").selectAll("path.class42")
    .data(transTable[0].nest, function(d){return d.id;})
    .attr("d", function(d){
      return d.makeHulls2Path(scale);
    });
  
  scale.setDomain(newDataset);
  
  var hulls1 = svg.select("g.hulls").selectAll("path.class42")
    .data(transTable[1].nest, function(d){return d.id;});
    
  hulls1.transition().ease(d3.easeQuadInOut)
    .delay(transDuration/4).duration(transDuration*3/4)
    .attr("d", function(d){
      return d.makeHulls2Path(scale);
    })
    .on("end", showNewDatas);
    
  function showNewDatas(){
    svg.select("g.hulls").selectAll("path.class42")
      .data(new Nest(newDataset).nest, function(d){return d.id;})
      .attr("d", function(d){
        return d.makePolygons2Path(scale);
      });
  }
  
  hulls1.enter()
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
    .transition().duration(transDuration*3/4).delay(transDuration/4)
    .attr('opacity', 0.3);
  
  ////////// Kreise //////////////
  var circles1 = svg.select("g.circs")
    .selectAll("circle.class42")
    .data(newDataset, function(d){return d.id;});
    
  circles1.exit()
    .attr("class", "remove")
    .transition().duration(500)
    .ease(d3.easeBackIn.overshoot(6))
    .attr("r", 0)
    .remove();
    
  svg.select("g.circs")
    .selectAll("circle.class42")
    .transition().delay(transDuration/4)
    .duration(transDuration*3/4)
    .ease(d3.easeQuadInOut)
    .attr("cx", function(d) {return scale.xScale(d.pos.x);})
    .attr("cy", function(d) {return scale.yScale(d.pos.y);})
    .style("pointer-events","visible");// https://stackoverflow.com/questions/34605916/d3-circle-onclick-event-not-firing
}

//////////// UPDATE /////////////
function update(){
  transition();
  
  var t0 = d3.transition().delay(transDuration).duration(0)
    .on("end", createForm);
  
  // Formular
  function createForm() {
    bereitBtn.btn.remove();
    hinweis.remove();
    
    // https://www.w3schools.com/html/html_form_elements.asp
    var selections = d3.select("body").select("div#platzhalter")
      .append("select");
      
    selections.append("option")
      .attr("selected", true)
      .attr("name", "default")
      .text("Bitte auswählen");
      
    selections = selections.selectAll('option[name="cases"]')
      .data(function(){
        var array = [];
        for (var i = durationSpan[0]; i <= durationSpan[1]; i += schrittweite)
          array.push(i);
        return array;
      });

    var options = selections.enter()
      .append("option")
      .attr("name", "cases")
      .attr("class", "options")
      .attr("value", function(d){return d;})
      .text(function(d){return parseSec(d);});
        
    var replayBtn = new Button(replay, "replay");
    replayBtn.btn.style("margin-left", "-1px");
    var weiterBtn = new Button(storeDatas, "weiter");
    weiterBtn.btn
      .on("click", function(){// wird ersetzt
        var optionsList = document.getElementsByName("cases");
        var selected = undefined;
        for (var i in optionsList) {
          if (optionsList[i].selected) {
            selected = optionsList[i];
            break;
          }
        }
        if (selected != undefined) {
          storeDatas(me, "Prefered time, " + selected.value);
          var index = (websites.indexOf(me)+1) % websites.length;
          window.location.href = websites[index]+".html"; // https://www.w3schools.com/howto/howto_js_redirect_webpage.asp
        }
        else
          alert("Bitte wähle eine Antwort aus.");
      });
  }
}


function ausgangszustand(){
  //////////////// Scaling ////////////////////
  scale.setDomain(oldDataset);
  
  //////////////// Kreise ////////////////////
  var circs1 = svg.select("g.circs")
    .selectAll("circle.class42")
    .data(oldDataset, function(d){return d.id;});
  circs1.exit()
    .attr("class", "remove")
    .remove();
  circs1.enter()
    .append("circle")
    .attr("class", "class42")
    .attr("cx", function(d) {return scale.xScale(d.pos.x);})
    .attr("cy", function(d) {return scale.yScale(d.pos.y);})
    .attr("r", radius)
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
    .style("pointer-events", "all");
  
  svg.select("g.circs")
    .selectAll("circle.class42")
    .attr("cx", function(d) {return scale.xScale(d.pos.x);})
    .attr("cy", function(d) {return scale.yScale(d.pos.y);});
    
  //////////////// Hüllen ////////////////////
  var hulls1 = svg.select("g.hulls")
    .selectAll("path.class42")
    .data(oldNests.nest, function(d){return d.id;});
  hulls1.exit()
    .attr("class", "remove")
    .remove();
  hulls1.enter()
    .append("path")
    .attr("class", "class42")
    .attr("d", function(c){// c = Cluster{id, polygons}
      return c.makePolygons2Path(scale);}
    )
    .attr('fill', "gray")
    .attr('stroke', "gray")
    .attr('opacity', 0.3)
    .on("mouseover", tooltipCluster.show)
    .on("mouseout", tooltipCluster.hide);
    
  svg.select("g.hulls")
    .selectAll("path.class42")
    .attr("d", function(c){// c = Cluster{id, polygons}
      return c.makePolygons2Path(scale);}
    );
}

function replay(){
  ausgangszustand();
  var t0 = d3.transition().duration(500)
    .on("end", transition);
}
  
function parseSec(ms){
  return (parseInt(ms)/1000).toString() + " s";
}
