const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);
  
//////////////// Header //////////////////
modifyHeader(me);

/////////// Tabelle ///////////////
var table = layout.append("table");
  
var zeile = table.append("tr")
  .style("border", "0px solid white");
var zelleLinks = zeile.append("td")
  .attr("id", "left")
  .attr("valign", "top")
  .attr("width", "180px");
var zelleMitte = zeile.append("td")
  .attr("id", "middle")
  .attr("valign", "top")
  .attr("width", "400px");
var zelleRechts = zeile.append("td")
  .attr("id", "right")
  .attr("valign", "top")
  .attr("width", "200px");
  
////////////// Transitionsdauer ///////////////
zelleLinks.append("p").text("Transitionsdauer:")
  .style("margin-top", 0);
new DurationRegler(zelleLinks);
zelleLinks.append("br");

////////// Darstellung //////////
zelleLinks.append("p").text("Darstellung:");
var divSelectDarst = zelleLinks.append("div")
  .style("width", "100%")
  .style("text-align", "left");
var selectDarst = divSelectDarst.append("select");
selectDarst.append("option")
  .attr("value", "embpoint")
  .attr("selected", true)
  .text("Scatterplot");
selectDarst.append("option")
  .attr("value", "hexgrid")
  .text("Hexgrid");
selectDarst.append("option")
  .attr("value", "mappoint")
  .text("Gitterplot");
  
selectDarst.on("change", function(){// aktualisiert Variable 
    projectPlot = this.value;
    console.log("Knotenanordnung " + this.value);
    var idx = +document.getElementById("perspective").value;
    transDuration = document.getElementById("transDurationIn").value;
    parseJsonToKnoten("../datafiles/" + clusterResults[idx]);
  });

////////// Färbung //////////
zelleLinks.append("p").text("Projektfarbe:");
var divSelectColor = zelleLinks.append("div")
  .style("width", "100%")
  .style("text-align", "left");
var selectColor = divSelectColor.append("select");
selectColor.append("option")
  .attr("value", "cluster")
  .attr("selected", true)
  .text("Nach Cluster");
selectColor.append("option")
  .attr("value", "researchArea")
  .text("Nach Forschungsgebiet");
  
selectColor.on("change", function(){// aktualisiert Variable 
    projectColorBy = this.value;
    transDuration = 1000;
    console.log("Porjektfarbe nach " + this.value);
    update();
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
    transDuration = 750;
    console.log("Hüllentransparenz " + this.value);
    update();
  });
  




///////////////// SVG ////////////////
width = 400 - margin.left - margin.right;
height = 350 - margin.top - margin.bottom;
var svg = new SVG(zelleMitte).svg;

////////////////// Forschungsgebiete /////////////////////
zelleRechts.append("p").text("Forschungsgebiete:")
  .style("margin-top", 0);
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
    transDuration = 750;
    console.log('Forschungsgebiete ',checkResearchArea);
    update();
  });
  
///////////////////// Parameter ////////////// NEU
const clusterResults = [
  "c4-t19_LDA.json",
  "c4-t23_LDA.json",
  "c4-t22_LDA.json",
  "c6-t20_LDA.json",
  "c7-t20_LDA.json",
  "c7-t22_LDA.json"
];
zelleRechts.append("p").text("Parameterwechsel:");
var divPerspective = zelleRechts.append("div")
  .attr("class", "centerBar")
  .style("width", "100%")
  .style("text-align", "left");
  
divPerspective.append("input")// Schieberegler
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
    transDuration = document.getElementById("transDurationIn").value;
    parseJsonToKnoten("../datafiles/" + clusterResults[this.value]);
  });
  
divPerspective.append("button")// divAnimControl
  .attr("class", "button")
  .attr("type", "button")// default: submit -> let's reload page
  // https://stackoverflow.com/questions/7803814/prevent-refresh-of-page-when-button-inside-form-clicked
  .text("↻ Replay")
  .on("contextmenu", function(d) {
    d3.event.preventDefault();
  })
  .on("click", function(){
    transDuration = document.getElementById("transDurationIn").value;
    replay(svg, tooltipNode, oldDatas, newDatas, tooltipCluster, oldNests, newNests, scale);
  });

  
////////////////// Zeitspanne /////////////////////
zelleRechts.append("p").text("Zeitspanne:");
var divTimeSpan = zelleRechts.append("div")
  .style("width", "100%")
  .style("text-align", "left");
  
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
    transDuration = document.getElementById("transDurationIn").value;
    console.log('Zeitspanne: ',currYearSpan);
    update();
  });

//////////////// ProjectIDs ////////////
var subjectsByID = {};// {<id>: subjectName}

d3.csv("../datafiles/project_ids_to_subject_areas.csv")
  .then(function(dataset){
    dataset.forEach(function(d){
      var id = d.project_id;
      subjectsByID[id] = d.subject_area;
      // macht ein Wörterbuch draus, damit die IDs nachher in O(1) gefunden werden können
    });
    parseJsonToKnoten("../datafiles/" + clusterResults[0]);// initialisiert
  });

///////////////// weitere Funktionen ///////////////
function findSubjectAreaByProjID(id){
  var subjectArea = topicMapping.filter(s => s.name == "Unbekannt")[0];// default
  if (subjectsByID[id] == undefined)
    console.log("ProjectID konnte nicht gefunden werden.");
  else {// Problem, die Namen der Forschungsgebiete sind nicht gleich (==), darum müssen die einzelnen Wörter extrahiert werden
    var subjectName = subjectsByID[id];
    var topic = topicMapping.filter(function(d){
      var arr1 = subjectName.replace("FK ", "")
        .replace("- ", " ").replace("-, ", ", ")
        .replace("Morphologie der Tiere","Evolution")
        .replace("Klinische Tiermedizin","Tiermedizin")
        .replace("Anatomie","Tiermedizin")
        .replace("Physiologie der Tiere","Tiermedizin")
        .replace("Biologie des Verhaltens","Zoologie")
        .replace("Pflanzenökologie","Pflanzenwissenschaften")
        .replace("Entwicklungsbiologie","Evolution")
        .replace("Neuere","Geschichtswissenschaften")
        .replace("Kunstgeschichte","Geschichtswissenschaften")
        .replace("Biologie des Meeres","Meeres")
        .replace("Physik des Erdkörpers","Geophysik")
        .split(", ").map(d => d.split(" und "))
        .reduce((akk,d) => akk.concat(d), []);
      var arr2 = d.name.replace("- ", " ")
        .replace("-, ", ", ")
        .split(", ").map(d => d.split(" und ")).reduce((akk,d) => akk.concat(d), []);
        
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

//////////////// Datasets ////////////////
var pos, id, gerade, clusterNo, researchArea, year, keywords, title, alpha;
//const gelb = d3.color("yellow").darker(1);



//////////////// Footer //////////////////  
modifyFooter(me);
