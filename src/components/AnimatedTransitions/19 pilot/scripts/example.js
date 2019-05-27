const me = "../" + document.URL.split("/").reverse()[0].slice(0,this.length-5);

var dataset, clusterData, projectParams;
// loading JSON with d3.json
d3.json("c4-t20_tSNE_p30-lr806.json").then(function(data){
  //console.log(data);
  dataset = data.project_data.map(function(d){
    var pos = new Position(d.embpoint[0], d.embpoint[1]);
    var researchArea = forschungsgebiete[Index.getRandInt(0, forschungsgebiete.length-1)];
    var year = Index.getRandInt(zeitspanne[0], zeitspanne[1]);
    var knoten = new Knoten(pos, d.id, d.cluster, researchArea, year, d.words);
    return knoten;
  });
  clusterData = data.cluster_data;
  projectParams = data.params;
  
  //////////////// SVG ////////////////////
  var svg = new SVG("svg");
  
  //////////////// Scaling //////////////
  var scale = new Scale(dataset);
  scale.setDomain(dataset);
  
  //////////////// Kreise ////////////////////
  var circs = new Kreise(dataset, svg, "class42", scale);

  //////////////// Hüllen ////////////////////
  var gruppen = new Nest(dataset);
  var pfade = new Pfade(gruppen, svg, "class42", scale);
  
  //////////// Button ////////////
  new LinkButton(me, function(){}, +1, "Es kann losgehen", null);
  d3.select("a")
    .attr("href", function(){
      var index = (websites.indexOf(me)+1) % websites.length;
      return "sites/" + websites[index]+".html";
    });
});
