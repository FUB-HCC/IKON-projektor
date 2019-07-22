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
  .text("Das folgende Beispiel zeigt geclusterte Projekte - jedoch ohne Hüllen. Trage die vermutete Clusterzahl in das Feld ein.");
  
//////////////// Datasets ////////////////
var dataset, id = 0;
d3.json("c4-t20_tSNE_p30-lr806.json").then(function(data){
  //console.log(data);
  dataset = data.project_data.map(function(d){
    var pos = new Position(d.embpoint[0], d.embpoint[1]);
    var knoten = new Knoten(pos, id++, d.cluster, {}, 2019, d.words);
    return knoten;
  });
  
  // Check for the various File API support.
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
    
    //////////////// Scaling //////////////
    var scale = new Scale(dataset);
      scale.setDomain(dataset);
    
    //////////////// SVG ////////////////////
    var svg = new SVG("svg");
      svg.svg.call(tooltipNodeNoCluster);// call the function on the selection
      
    radius = 4;
    var kreise = new Kreise (dataset, svg, "projekt", scale);
      svg.svg.select("g.circs")
        .selectAll("circle.projekt")
        .on("mouseover", tooltipNodeNoCluster.show)
        .on("mouseout", tooltipNodeNoCluster.hide);
      kreise.label.remove();
        
    //new Pfade (new Nest(dataset), svg, "huelle", scale);
    
    var form = d3.select("div.layout").append("form")
      .attr("class", "formular");
      
    var labels = form.append("label")
      .text("Clusterzahl: ");
      .insert("input")
        .attr("type", "number")
        .attr("name", "anzahl")
        .attr("class", "numberInput")
        .attr("id", "input1")
        .attr("min", 0)
        .attr("max", 20)
        .attr("size", 2)
        .attr("step", 1)
        .attr("required", true)
        .style("width", "3em");
        
    //////////// Buttons /////////////
    //new LinkButton(me, deleteDatas, -1, "zurück", null);
    
    ///////////// Save
    var nextPage;
    var weiter = new Button(d3.select("div.layout"), function(){}, "Lösung");
    weiter.btn
      .on("click", function(){// wird ersetzt
        var nummer = document.getElementById("input1").value;
        if (!nummer || isNaN(nummer) || nummer < 0)
          alert("Bitte gib eine natürliche Zahl zwischen 0 und 20 ein.");
        else {
          storeDatas(me, "Schätzungen;" + nummer + ";Lösung;" + 3);
          var index = (websites.indexOf(me)+1) % websites.length;
          nextPage = websites[index]+".html";
          // löscht das Eingabefeld und ersetzt es durch Text
          //labels.select("te
          //labels.select("input").remove();
          
          // ändert den Link
//           d3.select(this).text("Zur nächsten Aufgabe ⊳");
//           d3.select(this).on("click", function(){
//             window.location.href = nextPage;
//           });
          //window.location.href = websites[index]+".html"; // https://www.w3schools.com/howto/howto_js_redirect_webpage.asp
        }
      });
    
  } else {
    alert('The File APIs are not fully supported in this browser.');
  } // https://www.html5rocks.com/en/tutorials/file/dndfiles/
  
});
