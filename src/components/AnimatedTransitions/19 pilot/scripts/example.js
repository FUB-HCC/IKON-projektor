const me = "../" + document.URL.split("/").reverse()[0].slice(0,this.length-5);


d3.select("body")
  .append("h1")
  .text("Pilot Study");
  
d3.select("body")
  .append("p")
  .attr("name", "anweisung")
  .text("Im Folgenden wollen wir die Transitionen von Clustern und deren Hüllen evaluieren. Mache dich dazu mit der Benutzeroberfläche etwas vertraut! Jedes Projekt wird durch einen Punkt dargestellt und hat eine eindeutige ID und findet im Rahmen eines Forschungsgebiets statt. Forschungsgebiete gehören zu einer Disziplin, woraus sich die Farbe der Projekt-Punkte ableitet. Projekte, die sich sehr ähnlich sind, werden einem Cluster zugeordnet und liegen tendenziell näher beieinander.");
  
/////////////// Datas /////////////
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
  
  createForm();
  
});


//////////// Button ////////////
function createForm() {
  var form = d3.select("body")
    .append("form");
    
  //////////// Text / Input ////////////
  var box = d3.select("body").select("form")
    .append("div")
    .attr("class", "box")
    .attr("id", "platzhalter")
    .style("width", "60%")
    .style("margin-left", "20%");

  var hinweis = d3.select("body").select("div#platzhalter")
    .append("p")
    .text("Teilnehmer ID:")
    .style("float", "left")
    .style("padding-right", "-1em")
    .style("text-align", "right")
    .style("width", "50%");
  
  var input = d3.select("body").select("div#platzhalter")
    .append("input")
    .attr("type", "text")
    .attr("name", "teilnehmerID")
    .attr("id", "teilnehmerID")
    .attr("size", 4)
    .attr("required", true)
    .style("width", "6em")
    .style("float", "right")
    .style("text-align", "left");
    
  var bereitBtn = new Button(function(){}, "Es kann losgehen");

//   new LinkButton(me, function(){}, +1, "Es kann losgehen", null);
//   d3.select("a")
//     .attr("href", function(){
//       var index = (websites.indexOf(me)+1) % websites.length;
//       return "sites/" + websites[index]+".html";
//     });
  
  bereitBtn.btn
    .on("click", function(){// wird ersetzt
      var teilnehmer = document.getElementById("teilnehmerID").value;
      
      if (teilnehmer && teilnehmer != undefined && teilnehmer.length == 4) {
        storeDatas("Teilnehmer", teilnehmer);
        window.location.href = "sites/" + websites[1]+".html"; // https://www.w3schools.com/howto/howto_js_redirect_webpage.asp
      }
      else
        alert("Bitte gib deine Teilnehmer ID ein.");
    })
    .attr("type", "submit");
  
}
