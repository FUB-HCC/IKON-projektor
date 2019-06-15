const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);

//////////////// Variablen //////////////
var clusterzahl = 3;
var currID = 1;
var transDuration = 2000;
var projZahl = 32;
var richtigeAntwort = 0;

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
  .style("width", "710px")//60%
  .style("margin-left", function(){
    return (document.getElementsByTagName("html")[0].clientWidth - 710) / 2 + "px";
  });//20%

d3.select("body")
  .append("p")
  .attr("name", "nummer")
  .text(aufgabenCounter(me))
  .style("margin-top", "-1em")
  .style("text-align", "center");

d3.select("body")
  .append("h1")
  .text("Transition vs. Überblendung");
  
d3.select("body")
  .append("p")
  .attr("name", "anweisung")
  .text("Welche Animationsart bevorzugst du und warum?");
  
var links = d3.select("body")
  .append("div")
  .attr("class", "spalte")
  .append("p")
  .text("Transition");
  
var rechts = d3.select("body")
  .append("div")
  .attr("class", "spalte")
  .append("p")
  .text("Überblendung");
  
//////////////// SVG //////////////////// 
var svg1 = links.append("div")
  //.attr("class", "box")
  .append("svg")
  .attr("class", "svg1")
  .attr("width",  width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
svg1.append("g").attr("class", "hulls");
svg1.append("g").attr("class", "circs");
svg1.call(tooltipNode);// call the function on the selection
svg1.call(tooltipCluster);
  
var svg2 = rechts.append("div")
  //.attr("class", "box")
  .append("svg")
  .attr("class", "svg2")
  .attr("width",  width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
svg2.append("g").attr("class", "hulls");
svg2.append("g").attr("class", "circs"); 
svg2.call(tooltipNode);// call the function on the selection
svg2.call(tooltipCluster);

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
  svg1.select("g.hulls").selectAll("path.class42")
    .data(transTable[0].nest, function(d){return d.id;})
    .attr("d", function(d){
      return d.makeHulls2Path(scale);
    });
  
  scale.setDomain(newDataset);
  
  var hulls1 = svg1.select("g.hulls").selectAll("path.class42")
    .data(transTable[1].nest, function(d){return d.id;});
    
  hulls1.transition().ease(d3.easeQuadInOut)
    .delay(500).duration(transDuration-500)
    .attr("d", function(d){
      return d.makeHulls2Path(scale);
    })
    .on("end", showNewDatas);
    
  function showNewDatas(){
    svg1.select("g.hulls").selectAll("path.class42")
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
    .transition().duration(transDuration/2).delay(transDuration/2)
    .attr('opacity', 0.3);
  
  var hulls2 = svg2.select("g.hulls").selectAll("path.class42")
    .data(new Nest(newDataset).nest, function(d){return d.id;});
    
  hulls2.transition().duration(transDuration/2)
    .attr("opacity", 0)
    .transition().duration(0)
    .attr("d", function(d){return d.makePolygons2Path(scale)})
    .transition().duration(transDuration/2)
    .attr("opacity", 0.3);
  
  hulls2.enter()
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
    .transition().duration(transDuration/2).delay(transDuration/2)
    .attr('opacity', 0.3);
  
  ////////// Kreise //////////////
  var circles1 = svg1.select("g.circs")
    .selectAll("circle.class42")
    .data(newDataset, function(d){return d.id;});
    
  circles1.exit()
    .attr("class", "remove")
    .transition().duration(500)
    .ease(d3.easeBackIn.overshoot(6))
    .attr("r", 0)
    .remove();
    
  svg1.select("g.circs")
    .selectAll("circle.class42")
    .transition().delay(500)
    .duration(transDuration)
    .ease(d3.easeQuadInOut)
    .attr("cx", function(d) {return scale.xScale(d.pos.x);})
    .attr("cy", function(d) {return scale.yScale(d.pos.y);})
    .style("pointer-events","visible");// https://stackoverflow.com/questions/34605916/d3-circle-onclick-event-not-firing
    
  var circles2 = svg2.select("g.circs")
    .selectAll("circle.class42")
    .data(newDataset, function(d){return d.id;});
    
  circles2.transition().duration(transDuration/2)
    .style("opacity", 0)
    .transition().duration(0)
    .attr("cx", function(d) {return scale.xScale(d.pos.x);})
    .attr("cy", function(d) {return scale.yScale(d.pos.y);})
    .style("pointer-events","visible")
    .transition().duration(transDuration/2)
    .style("opacity", 1);
    
  circles2.exit()
    .attr("class", "remove")
    .transition().duration(transDuration/2)
    .style("opacity", 0)
    .remove();
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
      
    var cases = [
      "Transition",
      "Überblendung",
      "egal / weiß nicht"
    ];
    //richtigeAntwort = randomizeArray(cases, richtigeAntwort);
    
    var maxLetters = cases.map(s => s.length)
      .reduce(function(akk,d){return Math.max(akk,d)},0);
    console.log(maxLetters);
    var fontSize = 11;
    var boxwidth = fontSize * maxLetters * (2/3);
    console.log(boxwidth);
    box.style("width", function(){return boxwidth + "px"})//30%
      .style("margin-left", function(){
        var w = document.getElementsByTagName("body")[0].style.width;
        w = w.slice(0, w.length-2);
        console.log(w);
        return (parseInt(w) - boxwidth) / 2 + "px";
      })
      .style("margin-bottom", "10px");// "35%"
      
    var form = d3.select("body").select("div#platzhalter")
      .append("form");
    
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
      .text(function(d) {return "  " + d});
    
    var replayBtn = new Button(replay, "replay");
    replayBtn.btn.style("margin-left", "-1px");
    var weiterBtn = new Button(storeDatas, "weiter");
    weiterBtn.btn
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
          storeDatas(me, "Animationsart, " + selected.value);
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
  var circs1 = svg1.select("g.circs")
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
  
  svg1.select("g.circs")
    .selectAll("circle.class42")
    .attr("cx", function(d) {return scale.xScale(d.pos.x);})
    .attr("cy", function(d) {return scale.yScale(d.pos.y);});
    
  var circs2 = svg2.select("g.circs")
    .selectAll("circle.class42")
    .data(oldDataset, function(d){return d.id;});
  circs2.exit()
    .attr("class", "remove")
    .remove();
  circs2.enter()
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
  
  svg2.select("g.circs")
    .selectAll("circle.class42")
    .attr("cx", function(d) {return scale.xScale(d.pos.x);})
    .attr("cy", function(d) {return scale.yScale(d.pos.y);});
    
  //////////////// Hüllen ////////////////////
  var hulls1 = svg1.select("g.hulls")
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
    
  svg1.select("g.hulls")
    .selectAll("path.class42")
    .attr("d", function(c){// c = Cluster{id, polygons}
      return c.makePolygons2Path(scale);}
    );
    
  var hulls2 = svg2.select("g.hulls")
    .selectAll("path.class42")
    .data(oldNests.nest, function(d){return d.id;});
  hulls2.exit()
    .attr("class", "remove")
    .remove();
  hulls2.enter()
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
    
  svg2.select("g.hulls")
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
  

