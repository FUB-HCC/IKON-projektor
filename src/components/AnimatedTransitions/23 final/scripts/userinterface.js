/////////// H1 ///////////////
d3.select("body")
  .append("h1")
  .text("Clustering");
  
/////////// Tabelle ///////////////
var table = d3.select("body")
  .append("table");
  
var zeile = table.append("tr")
  .style("border", "0px solid white");
var zelleLinks = zeile.append("td")
  .attr("id", "left")
  .attr("valign", "top")
  .attr("width", "200px");
var zelleMitte = zeile.append("td")
  .attr("id", "middle")
  .attr("valign", "top")
  .attr("width", "400px");
var zelleRechts = zeile.append("td")
  .attr("id", "right")
  .attr("valign", "top")
  .attr("width", "200px");

  
////////////// Transitionsdauer ///////////////
zelleLinks.append("p").text("Transitionsdauer:");
var divTransDur = zelleLinks.append("div")
  .attr("class", "centerBar")
  .style("width", "100%")
  .style("text-align", "left");
  
divTransDur.append("label")// von
  .attr("class", "reglerText")
  .append("text")
  .attr("id", "durVon")
  .style("margin-left", "10px")
  .style("margin-right", "3px")
  .style("white-space", "nowrap")
  .style("display", "inline-block")
  .text(parseSec(durationSpan[0]));
  
divTransDur.append("input")// Schieberegler
  .attr("type", "range")
  .attr("id", "transDurationIn")
  .style("width", "70%")
  .style("display", "inline-block")
  .attr("value", transDuration)
  .attr("min", durationSpan[0])
  .attr("max", durationSpan[1])
  .attr("step", schrittweite);
  
divTransDur.append("label")// bis
  .attr("class", "reglerText")
  .append("text")
  .attr("id", "durBis")
  .style("margin-left", "3px")
  .style("white-space", "nowrap")// https://stackoverflow.com/questions/7300760/prevent-line-break-of-span-element/32941430
  .style("display", "inline-block")
  // https://www.computerhope.com/issues/ch001709.htm
  .text(function(){
    return parseSec(durationSpan[1]);
  });
  
document.getElementById("transDurationIn").value = transDuration;

divTransDur.append("output")// Zahl
  .attr("id", "transDurationOut")
  .attr("value", parseSec(transDuration))
  .text(parseSec(transDuration))
  .style("text-align", "center")
  .style("position", "absolute")
  .style("left", function(){
    // elem.getBoundingClientRect() =>
    // DOMRect {x, y, width, height, top, right, bottom, left}
    // https://www.mediaevent.de/javascript/window-browserfenster.html
    var regler = document.getElementById("transDurationIn");
    var barKoordinates = regler.getBoundingClientRect();
    var scale = d3.scaleLinear()
      .domain([+regler.min, +regler.max])
      .range([barKoordinates.x +6, barKoordinates.x + barKoordinates.width -14]);
    return (scale(transDuration) - 14) + "px";
  })
  .style("top", function(){
    var regler = document.getElementById("transDurationIn");
    var barKoordinates = regler.getBoundingClientRect();
    return (barKoordinates.top - 13) + "px";
  });
  
d3.select("#transDurationIn")
  .on("change", function(){// aktualisiert Variable 
    transDuration = parseInt(this.value);
  })
  .on("input", function(){// aktualisiert Zahl und Verschiebung
    var barKoordinates = this.getBoundingClientRect();
    var scale = d3.scaleLinear()
      .domain([+this.min, +this.max])
      .range([barKoordinates.x +6, barKoordinates.x + barKoordinates.width -14]);
    var barValue = +this.value;
    var textContent = parseSec(barValue);
    // aktualisiert den text
    document.getElementById("transDurationOut").value = textContent;
    // aktualisiert die Position
    d3.select("#transDurationOut")
      .style("left", function(){
        return (scale(barValue) -14) + "px";
      });
  });
  
function parseSec(ms){
  return ((+ms)/1000).toString() + " s";
}

////////// Animationsbuttons //////////
zelleLinks.append("p").text("Animation:");
var divAnimControl = zelleLinks.append("div")
  .style("width", "100%")
  .style("text-align", "left");

// divAnimControl.append("button")
//   .attr("class", "button")
//   .attr("type", "button")// default: submit -> let's reload page
//   // https://stackoverflow.com/questions/7803814/prevent-refresh-of-page-when-button-inside-form-clicked
//   .text("⊲ Zurück")
//   .on("contextmenu", function(d) {
//     d3.event.preventDefault();
//   })
//   .on("click", function(){
//     // ausgangszustand();
//   });
  
divAnimControl.append("button")
  .attr("class", "button")
  .attr("type", "button")// default: submit -> let's reload page
  // https://stackoverflow.com/questions/7803814/prevent-refresh-of-page-when-button-inside-form-clicked
  .text("↻ Replay")
  .on("contextmenu", function(d) {
    d3.event.preventDefault();
  })
  .on("click", function(){
    update();
  });
  
////////// Darstellung //////////
zelleLinks.append("p").text("Darstellung:");
var divSelectDarst = zelleLinks.append("div")
  .style("width", "100%")
  .style("text-align", "left");
var selectDarst = divSelectDarst.append("select");
selectDarst.append("option")
  .attr("value", "embpoint")
  .attr("selected", true)
  .text("Scatterplot")
selectDarst.append("option")
  .attr("value", "mappoint")
  .text("Honeycomb");
  
selectDarst.on("change", function(){// aktualisiert Variable 
    projectPlot = this.value;
    console.log("Knotenanordnung " + this.value);
    //update();
  });
  
////////// Hüllensichtbarkeit //////////
zelleLinks.append("p").text("Hüllensichtbarkeit:");
var divSelectOpacity = zelleLinks.append("div")
  .style("width", "100%")
  .style("text-align", "left");
var selectOpacity = divSelectOpacity.append("select");
selectOpacity.append("option")
  .attr("value", maxHullOpacity.toString())
  .attr("selected", true)
  .text("Hüllen sichtbar")
selectOpacity.append("option")
  .attr("value", "0")
  .text("Hüllen unsichtbar");
  
selectOpacity.on("change", function(){// aktualisiert Variable 
    currHullOpacity = +this.value;
    console.log("Hüllentransparenz " + this.value);
    update();
  });
  
////////// Färbung //////////
zelleLinks.append("p").text("Projektfarbe:");
var divSelectColor = zelleLinks.append("div")
  .style("width", "100%")
  .style("text-align", "left");
var selectColor = divSelectColor.append("select");
selectColor.append("option")
  .attr("value", "researchArea")
  .attr("selected", true)
  .text("Nach Forschungsgebiet")
selectColor.append("option")
  .attr("value", "cluster")
  .text("Nach Cluster");
  
selectColor.on("change", function(){// aktualisiert Variable 
    projectColorBy = this.value;
    console.log("Porjektfarbe nach " + this.value);
    update();
  });


////////////////// SVG /////////////////////
var svg = zelleMitte.append("svg")
  .attr("width",  width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  svg.append("g").attr("class", "hulls");
  svg.append("g").attr("class", "circs");
  svg.append("g").attr("class", "beschriftung");


////////////////// Forschungsgebiete /////////////////////
zelleRechts.append("p").text("Forschungsgebiete:");
var radios = zelleRechts.selectAll('input[name="forschungsgebiete"]')
  .data(forschungsgebiete);

var labels = radios.enter()
  .append("div")
  .append("label")
  .attr("class", "checkboxen")
  .append("input")
  .attr("type", "checkbox")
  .attr("name", "forschungsgebiete")
  .attr("value", d => d.name)
  .attr("checked", true)
  .each(function(d,i){checkResearchArea[i] = true;});
  
d3.selectAll("label.checkboxen")
  .append("text")
  .text(function(d) {return d.name;})
  .style("color", d => getColorByDisziplin(d));

d3.selectAll('input[name="forschungsgebiete"]')
  .on('change', function(d,i) {
    checkResearchArea[i] = this.checked;
    console.log('Forschungsgebiete ',checkResearchArea);
    update();
  });
  
////////////////// Zeitspanne /////////////////////
zelleRechts.append("p").text("Zeitspanne:");
var divTimeSpan = zelleRechts.append("div")
  //.attr("class", "centerBar")
  .style("width", "100%")
  .style("text-align", "left");
  
// divTimeSpan.append("label")// von
//   .attr("class", "yearText")
//   .append("text")
//   .attr("id", "yearVon")
//   //.style("margin-left", "10px")
//   .style("margin-right", "3px")
//   .style("white-space", "nowrap")
//   .style("display", "inline-block")
//   .text("von:");
  
divTimeSpan.append("input")
  .attr("type", "number")
  .attr("value", yearSpan[0])
  .attr("id", "yearVon")
  .style("width", "3.5em")
  .style("padding", "0px")
  .style("display", "inline-block");
  
divTimeSpan.append("label")// bis
  .attr("class", "yearText")
  .append("text")
  .style("margin-left", "3px")
  .style("white-space", "nowrap")// https://stackoverflow.com/questions/7300760/prevent-line-break-of-span-element/32941430
  .style("display", "inline-block")
  // https://www.computerhope.com/issues/ch001709.htm
  .text("–");// bis
  
divTimeSpan.append("input")
  .attr("type", "number")
  .attr("value", yearSpan[1])
  .attr("id", "yearBis")
  .style("width", "3.5em")
  .style("padding", "0px")
  .style("display", "inline-block");
  
divTimeSpan.append("button")
  .attr("class", "button")
  .attr("type", "button")// default: submit -> let's reload page
  // https://stackoverflow.com/questions/7803814/prevent-refresh-of-page-when-button-inside-form-clicked
  .text("OK")
  .style("padding", "0px")
  .on("contextmenu", function(d) {
    d3.event.preventDefault();
  })
  .on("click", function(){
    var value1 = document.getElementById("yearVon").value;
    var value2 = document.getElementById("yearBis").value;
    if (value1 < value2) {
      currYearSpan[0] = value1;
      currYearSpan[1] = value2;
    }
    else {
      document.getElementById("yearVon").value = value2;
      document.getElementById("yearBis").value = value1;
      currYearSpan[0] = value2;
      currYearSpan[1] = value1;
    }
    console.log('Zeitspanne: ',currYearSpan);
    //update();
  });
  
/////////////// Perspektive /////////////////
const clusterResults = [
  "c4-t19_LDA.json",
  "c4-t23_LDA.json",
  "c4-t22_LDA.json",
  "c6-t20_LDA.json",
  "c7-t20_LDA.json",
  "c7-t22_LDA.json"
];
zelleRechts.append("p").text("Parameterwechsel:");
// var divPerspective = zelleRechts.append("div")
//   .attr("class", "centerBar")
//   .style("width", "100%")
//   .style("text-align", "left");
  
zelleRechts.append("input")// Schieberegler
  .attr("type", "range")
  .attr("id", "perspective")
  .style("width", ((clusterResults.length-1)*1.3) + "em")
  .style("display", "inline-block")
  .attr("value", 0)
  .attr("min", 0)
  .attr("max", clusterResults.length-1)
  .attr("step", 1);
  

d3.select("#perspective")
  .on("change", function(){// aktualisiert Variable 
    console.log("Parameter " + this.value);
    parseJsonToKnoten(clusterResults[this.value]);
  });
  

//////////////// ProjectIDs ////////////
var subjectsByID = {};// {<id>: subjectName}

d3.csv("scripts/project_ids_to_subject_areas.csv")
  .then(function(dataset){
    dataset.forEach(function(d){
      var id = d.project_id;
      subjectsByID[id] = d.subject_area;
      // macht ein Wörterbuch draus, damit die IDs nachher in O(1) gefunden werden können
    });
    parseJsonToKnoten(clusterResults[0]);// initialisiert
  });

//window.onload = parseJsonToKnoten(clusterResults[0]);
  
///////////////// weitere Funktionen ///////////////
function findSubjectAreaByProjID(id){
  var subjectArea = topicMapping[topicMapping.length-1];// default
  if (subjectsByID[id] == undefined)
    console.log("ProjectID konnte nicht gefunden werden.");
  else {// Problem, die Namen der Forschungsgebiete sind nicht gleich (==), darum müssen die einzelnen Wörter extrahiert werden
    var subjectName = subjectsByID[id];
    var topic = topicMapping.filter(function(d){
      var arr1 = subjectName.replace("FK ", "")
        .replace("- ", " ").replace("-, ", ", ")
        .split(", ").map(d => d.split(" und "))
        .reduce((akk,d) => akk.concat(d), []);
      var arr2 = d.name.split(", ").map(d => d.split(" und ")).reduce((akk,d) => akk.concat(d), []);
      return arr1.some(function(word){return arr2.indexOf(word) >= 0});
    });
    if (topic.length > 0)
      subjectArea = topic[0];// shorter than subjectName
    else {
      console.log("Passendes Topic konnte nicht gefunden werden.");
      console.log('id',id,'name',subjectsByID[id]);
    }
  }
  return subjectArea;
}
