/////////////// SVG //////////////
const margin = {top: 30, right: 30, bottom: 30, left: 30};
var width = 500 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

////////// Transdur /////////////
const durationSpan = [0, 3000];
var transDuration = 1000, schrittweite = 250;

/////// Hüllen ///////
const maxHullOpacity = 0.3;
var currHullOpacity = 0.3;

/////// Knoten ///////
var projectColorBy = "researchArea";// und "cluster"
var projectPlot = "embpoint"; // und "mappoint"
var checkResearchArea = {};
const forschungsgebiete = topicMapping.sort((a,b) => a.field - b.field).slice(0, topicMapping.length-1);

function getColorByDisziplin(topic){// forschungsgebiet
  return d3.rgb(fieldsMapping.filter(f => f.field == topic.field)[0].color).brighter(1);
}

const yearSpan = [1980, 2019];
var currYearSpan = [yearSpan[0], yearSpan[1]];
const radius = 5, nodeOpacity = 0.5;

////////////// Scaling /////////////
var scale = new Scale();

/////////// Timing ///////////
var esGibtAggregatOP = false;

////////// Datas ///////////
var oldDatas = [], newDatas = [];
var oldNests, newNests, transitionTable;
var oldCluster, newClusters;// {id, color, keywords}
var subjectsByID = {};// {<id>: subjectName}

function fillSubjects(datas) {
  datas.forEach(function(d){
    var id = d.project_id;
    subjectsByID[id] = d.subject_area;
    // macht ein Wörterbuch draus, damit die IDs nachher in O(1) gefunden werden können
  });
  //console.log('subjectsByID',subjectsByID);
}

function parseJsonToKnoten(jsonFilename){
  d3.json(jsonFilename).then(function(dataset){
    newDatas = dataset.project_data.map(function(d){
      var pos = new Position(d[projectPlot][0], d[projectPlot][1]);
      var year = Index.getRandInt(yearSpan[0], yearSpan[1]);
      var subjectArea = topicMapping[topicMapping.length-1];// default
      var id = d.id;
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
      var knoten = new Knoten(pos, d.id, d.cluster, subjectArea, year, d.words, d.title);
      return knoten;
    });
    
    newClusters = dataset.cluster_data.cluster_colour
      .map(function(d,i){
        return {id: i, color: d, 
          keywords: dataset.cluster_data.cluster_words[i]};
      });
      
    if (oldDatas.length == 0)
      init();
  });
}

function getFilteredData() {
  return newDatas.filter(d => d.year >= currYearSpan[0] && d.year <= currYearSpan[1]);
}

function copyDatas() {
  return newDatas.map(d => d.copy());
}


///////////////// Zeichnet Elemente ////////////
function init(){
  // scaling
  scale.setDomain(getFilteredData());
  // circles
  var circSel = svg.select("g.circs").selectAll("circle.enter")
    .data(getFilteredData(), d => d.id);
  createCircs(circSel);
  svg.call(tooltipNode);
  // hulls
  newNests = new Nest(getFilteredData());
  var hullSel = svg.select("g.hulls").selectAll("path.enter")
    .data(newNests.nest, d => d.id);
  createHulls(hullSel);
  svg.call(tooltipCluster);
}

function update() {
  
}
