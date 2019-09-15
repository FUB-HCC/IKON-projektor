const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);
  
//////////////// Header //////////////////
modifyHeader(me);

//////////////// Content //////////////////
linkeSpalte.append("h2").text("Hintergrund");

var auflistung = linkeSpalte.append("ul");
auflistung.append("li")
  .text("Forschungsprojekt IKON des HCC und Museums für Naturkunde Berlin");
auflistung.append("li")
  .text("Prototyp ohne animierte Transitionen");
  
////////////// Dropdown //////////////
const dropDownSelections = [
  {text: "Statischer Wechsel", value: "statisch"},
  {text: "Anim. Trans.", value: "animTrans"},
  {text: "Hüllen anzeigen", value: "showHulls"}
];
problemHullTrait = "statisch";
var dropDownText = dropDownSelections.filter(d => d.value == problemHullTrait)[0].text;

// ort, liste, text, onclickFkt
new DropdownList(rechteSpalte, dropDownSelections, dropDownText,
  function(d){
    problemHullTrait = d.value;
    d3.select(".dropbtn").text(d.text);
    if (problemHullTrait == "statisch") {
      transDuration = 0;
      currHullOpacity = 0;
      showHullText = false;
    }
    else if (problemHullTrait == "animTrans") {
      transDuration = 2000;
      currHullOpacity = 0;
      showHullText = false;
    }
    else {// showHulls
      currHullOpacity = maxHullOpacity;
      showHullText = true;
      transDuration = 2500;
    }
    // in jedem Fall
    parseJsonToKnoten("../datafiles/" + clusterResults[0]);
    playBtn.value = "play";
    playBtn.btn.text("▶");
  }
);
  
///////////////// Buttons ////////////////
function togglePlayBtn(btn) {
  if (btn.value == "play") {
    btn.value = "replay";
    btn.btn.text("◀");
  }
  else {
    btn.value = "play";
    btn.btn.text("▶");
  }
}

var playBtn = new Button(rechteSpalte, "▶", function(){});
  playBtn.btn.on("click", function(){
    if (playBtn.value == "play")
      parseJsonToKnoten("../datafiles/" + clusterResults[1]);
      //startTransition(svg, tooltipNodeUniform, oldDatas, newDatas, tooltipClusterUniform, oldNests, newNests, scale);
    else
      parseJsonToKnoten("../datafiles/" + clusterResults[0]);
      //startTransition(svg, tooltipNodeUniform, newDatas, oldDatas, tooltipClusterUniform, newNests, oldNests, scale);
    togglePlayBtn(playBtn);
  });
rechteSpalte.append("br");

///////////////// SVG ////////////////
width = Math.min(document.getElementById("rechteSpalte")
  .getBoundingClientRect().width, 300) - margin.left - margin.right,
height = 300 - margin.top - margin.bottom;

var svg = (new SVG(rechteSpalte)).svg;


//////////////// Datasets ////////////////
var pos, id, gerade, clusterNo, researchArea, year, keywords, title, alpha;
const gelb = d3.color("yellow").darker(1);
transDuration = 0;
showHullText = false;
currHullOpacity = 0;

//////////////// ProjectIDs ////////////
var subjectsByID = {};// {<id>: subjectName}
const clusterResults = [
  "c4-t19_LDA.json",
  "c7-t22_LDA.json"
];

d3.csv("../datafiles/project_ids_to_subject_areas.csv")
  .then(function(dataset){
    dataset.forEach(function(d){
      var id = d.project_id;
      subjectsByID[id] = d.subject_area;
      // macht ein Wörterbuch draus, damit die IDs nachher in O(1) gefunden werden können
    });
//     fillDataset("../datafiles/c7-t22_LDA.json", false);
//     fillDataset("../datafiles/c4-t19_LDA.json", true);
    parseJsonToKnoten("../datafiles/" + clusterResults[0]);// initialisiert
  });


// function fillDataset(sourceJson, isInit) {
//   d3.json(sourceJson).then(function(datas){
//     var projectData = datas.project_data.map(function(d){
//       pos = new Position(d[projectPlot][0], d[projectPlot][1]);
//       id = d.id;
//       clusterNo = d.cluster;
//       researchArea = findSubjectAreaByProjID(d.id);
//       year = Index.getRandInt(yearSpan[0], yearSpan[1]);
//       keywords = d.words;
//       title = d.title;
//       color = d3.rgb(255,255,0);
//       alpha = 1;
//       return new Knoten(pos, id, clusterNo, researchArea, year, keywords, title, color, alpha);
//       //projectData.push(knoten);
//     });
//     
//     var nest = new Nest(projectData);
//       
//     var clusterData = datas.cluster_data.cluster_colour
//       .map(function(d,i){
//         return {id: i, color: d, 
//           keywords: datas.cluster_data.cluster_words[i]};
//       });
//       
//     if (isInit) {
//       oldDatas = projectData;
//       scale.setDomain(oldDatas);
//       oldNests = nest;
//       oldClusters = clusterData;
//       var circSel = svg.select("g.circs").selectAll("circle.existent")
//         .data(oldDatas, d => d.id);
//       createCircs(circSel, tooltipNode, scale);
//       svg.call(tooltipNode);
//       var hullSel = svg.select("g.hulls").selectAll("path.existent")
//         .data(oldNests.nest, d => d.id);
//       createHulls(hullSel, tooltipCluster, scale);
//       svg.call(tooltipCluster);
//     }
//     else {
//       newDatas = projectData;
//       newNests = nest;
//       newClusters = clusterData;
//     }
//   });
// } Problem ist, dass getCircColor() mit newDatas arbeitet


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


//////////////// Footer //////////////////  
modifyFooter(me);
