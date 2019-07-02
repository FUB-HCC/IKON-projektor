const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);

///////////// Seite ////////////////
d3.select("div.layout")
  .append("p")
  .attr("name", "nummer")
  .text(aufgabenCounter(me))
  .style("text-align", "center");

d3.select("div.layout")
  .append("h1")
  .text("Clusterzahl");
  
d3.select("div.layout")
  .append("p")
  .attr("name", "anweisung")
  .text("Die folgende Grafik zeigt Cluster ohne Hüllen. Kannst du die Anzahl der Cluster erraten? Helfen Hüllen dabei, Cluster zu visualisieren?");
  
/////////// Settings ///////////
radius = 4;
var idx=0;

var oldDataset, newDataset, oldNests, newNests, transTable, scale, schieberegler, form, timeZeroBtn, bereitBtn, svg, kreise, pfade;

//////////////// Datasets ////////////////
/*"c4-t20_tSNE_p30-lr806.json"
 * c4-t19_LDA.json // naja 5-4
 * c4-t23_LDA.json // nett 4-4
 * c4-t22_LDA.json // super 3-3
 * c6-t20_LDA.json // nett 3-5
 * c7-t20_LDA.json // nett 3-5
 * c7-t22_LDA.json // gut 3-6
 */
//d3.json("c4-t20_tSNE_p30-lr806").then(function(data){}
Promise.all([
  d3.json("c4-t19_LDA.json"),
  d3.json("c4-t23_LDA.json")
]).then(function(allData){
  //console.log(allData);
  oldDataset = allData[0].project_data.map(function(d){
    var pos = new Position(d.embpoint[0], d.embpoint[1]);
    var knoten = new Knoten(pos, (idx++), d.cluster, {}, 2019, d.words);//d.id
    return knoten;
  });
  idx = 0;
  newDataset = allData[1].project_data.map(function(d){
    var pos = new Position(d.embpoint[0], d.embpoint[1]);
    var knoten = new Knoten(pos, (idx++), d.cluster, {}, 2019, d.words);
    return knoten;
  });
  
  // Check for the various File API support.
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
    
    oldNests = new Nest(oldDataset);
    newNests = new Nest(newDataset);
    transTable = oldNests.createTransitionNests(newNests);
    
    //////////////// Scaling //////////////
    scale = new Scale(oldDataset);
      scale.setDomain(oldDataset);
      
    /////////////// Schieberegeler TransDuration ///////////
    schieberegler = new Schieberegler();
      schieberegler.editSchieberegler();

    //////////// Buttons /////////////
    form = d3.select("div.layout").append("form")
      .attr("class", "formular");

    timeZeroBtn = new Button(form, function(){
      return callAusgangszustand();}, "⊲ Startzustand");

    bereitBtn = new Button(form, function(){
      setStorageContent(me, transDuration);
      update();
      }, "Bereit");
    
    //////////////// SVG ////////////////////
    svg = new SVG("svg", d3.select("div.layout"));
      svg.svg.call(tooltipNodeNoCluster);
    kreise = new Kreise (oldDataset, svg, "projekt", scale);
      kreise.circles
        .on("mouseover", tooltipNodeNoCluster.show)
        .on("mouseout", tooltipNodeNoCluster.hide);
      kreise.label.style("opacity", 0);
    pfade = new Pfade (oldNests, svg, "huelle", scale);
      pfade.label.style("display", "none");// https://www.w3schools.com/jsref/prop_style_display.asp
      pfade.hull.style("display", "none");// "visibility", "hidden"
      
  } else {
    alert('The File APIs are not fully supported in this browser.');
  } // https://www.html5rocks.com/en/tutorials/file/dndfiles/
});


///////////// Funktionen /////////////
//////////// UPDATE /////////////
function update(){// nach einmaliger Betätigung erscheinen Buttons
  transitions([null, svg], newDataset, newNests, transTable, [null, scale]);
  
  var t0 = d3.transition()
    .delay(transDuration)
    .duration(1)
    .on("end", createForm);
    
  // Formular
  function createForm() {
    bereitBtn.btn
      .text("↻ Replay")
      .on("click", function(){
        updateStorageContent(me, transDuration);
        replay();
      });
    // https://www.toptal.com/designers/htmlarrows/arrows/
    
    var form = d3.select("div.layout").append("form");
    
    var label = form.append("label")
        //.style("float", "left")
        //.style("text-align", "right")
        .style("width", "18em")
        .text("Vermutete Clusterzahl: ")
      .insert("input")
        .attr("type", "number")
        .attr("name", "anzahl")
        .attr("class", "numberInput")
        .attr("id", "input1")
        .attr("min", 1)
        .attr("max", 100)
        .attr("size", 2)
        .attr("step", 1)
        .attr("required", true)
        .style("width", "3em");
        
    var text = form.append("text")
      .text("");
    
    var enterBtn = new Button(form, function(){
      var nummer = document.getElementById("input1").value;
      if (!nummer || isNaN(nummer) || nummer < 1)
        alert("Bitte gib eine natürliche Zahl zwischen 1 und 100 ein.");
      else {// gültige Eingabe getätigt
        text.text(nummer)
          //.style("margin-right", "3em")
          .style("font-weight", "bold");
          
        label.remove();
        enterBtn.btn.remove();
        
        pfade.hull
          .style("display", "inline")// https://www.w3schools.com/jsref/prop_style_display.asp
          .style('opacity', 0)
          .transition().duration(2000)
          .style('opacity', hullOpacity);
        pfade.label
          .style("display", "inline")
          .style('opacity', 0)
          .transition().duration(2000)
          .style('opacity', 1);
        
        var weiterBtn = new LinkButton(me, setStorageContent, +1, "Pilotstudie beenden", {key: "Clusterzahl", value: nummer});
      }// ende if-else gültige Eingabe
    }, "Eingabe bestätigen");
  }// ende funktion createForm
}// ende Funktion Update

function callAusgangszustand(){
  ausgangszustand([null, svg], oldDataset, oldNests, [null,scale]);
}

function replay(){
//   ausgangszustand([null, svg], oldDataset, oldNests, [null,scale]);
//   transitions([null, svg], newDataset, newNests, transTable, [null, scale]);
  var t0 = d3.transition().duration(250)
    .on("start", function(){
      ausgangszustand([null, svg], oldDataset, oldNests, [null,scale]);
    })
    .on("end", function(){
      transitions([null, svg], newDataset, newNests, transTable, [null, scale]);
    });
}

function whoAmI(){
  return me;
}
