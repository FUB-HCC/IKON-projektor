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
var oldClusters, newClusters;// {id, color, keywords}

function parseJsonToKnoten(jsonFilename){
  var isInitial = false;
  if (oldDatas.length > 0) {// Transition steht bevor
    oldDatas = copyDatas(newDatas);
    oldNests = new Nest(getFilteredData(oldDatas));
    oldClusters = newClusters.map(function(d){
      return {id: d.id, color: d.color, keywords: d.keywords};
    });
  }
  else
    isInitial = true;
    
  // befüllt neue Daten
  d3.json(jsonFilename).then(function(dataset){
    newDatas = dataset.project_data.map(function(d){
      var pos = new Position(d[projectPlot][0], d[projectPlot][1]);
      var year = Index.getRandInt(yearSpan[0], yearSpan[1]);
      var subjectArea = findSubjectAreaByProjID(d.id);
      var knoten = new Knoten(pos, d.id, d.cluster, subjectArea, year, d.words, d.title);
      return knoten;
    });
    
    newNests = new Nest(getFilteredData(newDatas));
    
    newClusters = dataset.cluster_data.cluster_colour
      .map(function(d,i){
        return {id: i, color: d, 
          keywords: dataset.cluster_data.cluster_words[i]};
      });
    // startet Ablauf  
    if (isInitial)
      init();
    else
      update();
  });
}

function getFilteredData(dataset) {
  return dataset.filter(d => d.year >= currYearSpan[0] && d.year <= currYearSpan[1]);
}

function copyDatas(dataset) {
  return dataset.map(d => d.copy());
}


///////////////// Zeichnet Elemente ////////////
function init(){
  // scaling
  scale.setDomain(newDatas);
  // circles
  var circSel = svg.select("g.circs").selectAll("circle.enter")
    .data(getFilteredData(newDatas), d => d.id);
  createCircs(circSel);
  svg.call(tooltipNode);
  // hulls
  var hullSel = svg.select("g.hulls").selectAll("path.enter")
    .data(newNests.nest, d => d.id);
  createHulls(hullSel);
  svg.call(tooltipCluster);
}

function update() {
  // neu setzen, wenn Zeitspanne erweitert wurde
  newNests = new Nest(getFilteredData(newDatas));
}
