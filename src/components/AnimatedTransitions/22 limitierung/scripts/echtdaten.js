
///////////// Seite ////////////////
d3.select("div.layout")
  .append("h1")
  .text("Echtdaten");
  
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
  d3.json("c4-t22_LDA.json"),
  d3.json("c7-t22_LDA.json")
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
        replay();
      });
    // https://www.toptal.com/designers/htmlarrows/arrows/
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
