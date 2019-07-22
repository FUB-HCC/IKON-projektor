const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);

///////////// Seite ////////////////
d3.select("div.layout")
  .append("p")
  .attr("name", "nummer")
  .text(aufgabenCounter(me))
  .style("text-align", "center");

d3.select("div.layout")
  .append("h1")
  .text("Deutung der Transition " + romanize(aufgabenNr(me)));
  
d3.select("div.layout")
  .append("p")
  .attr("name", "anweisung")
  .text("Schaue dir folgende Transition an! Was passiert hier? Beschreibe es in Worten. Wie findest du die Animation? Was könnte man besser machen?");

/////////////// Schieberegeler TransDuration ///////////
var schieberegler = new Schieberegler();
  schieberegler.editSchieberegler();

//////////// Animationsart /////////////  
var selection = new DropDown(d3.select("div.layout"), animCases);

//////////// Buttons /////////////
var form = d3.select("div.layout").append("form")
  .attr("class", "formular");

var timeZeroBtn = new Button(form, function(){return callAusgangszustand();}, "⊲ Startzustand");
//new LinkButton(me, deleteDatas, -1, "zurück", null);
var bereitBtn = new Button(form, function(){
  animDatas.push({animArt: animArt, dauer: transDuration});
  update();
  }, "Bereit");

//////////////// Datasets ////////////////
// loading JSON with d3.json
d3.json("c4-t20_tSNE_p30-lr806.json").then(function(data){
  //console.log(data);
  var dataset = data.project_data.map(function(d){
    var pos = new Position(d.embpoint[0], d.embpoint[1]);
    var knoten = new Knoten(pos, d.id, d.cluster, {}, 2019, d.words);
    return knoten;
  });
  
  //////////////// Scaling //////////////
  var scale = new Scale(dataset);
    scale.setDomain(dataset);
  
  //////////////// SVG ////////////////////
  var svg = new SVG("svg");
  new Kreise (dataset, svg, "projekt", scale);
  new Pfade (new Nest(dataset).nest, svg, "huelle", scale)
  
  // Check for the various File API support.
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
  } else {
    alert('The File APIs are not fully supported in this browser.');
  } // https://www.html5rocks.com/en/tutorials/file/dndfiles/
  
  createForm();
  
});

//////////// UPDATE /////////////
function update(){// nach einmaliger Betätigung erscheinen Buttons
  transitions(svg, newDataset, newNests, transTable, scale);
  
  // Formular
  function createForm() {
    bereitBtn.btn
      .text("↻ Replay")
      .on("click", function(){
        animDatas.push({animArt: animArt, dauer: transDuration});
        replay();
      });
    // https://www.toptal.com/designers/htmlarrows/arrows/
    
    var result = animDatas.map(d => d.animArt + ';' + d.dauer)
      .join(';');
    var weiterBtn = new LinkButton(me, storeDatas, +1, "Zur nächsten Aufgabe ⊳", result);
  }
}
