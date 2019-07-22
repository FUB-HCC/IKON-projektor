d3.select("body")
  .append("h1")
  .text("Auswertung der Pilot Studie");
  
// d3.select("body")
//   .append("p")
//   .attr("name", "anweisung")
//   .text("Im Folgenden wollen wir die Transitionen von Clustern und deren Hüllen evaluieren. Mache dich dazu mit der Benutzeroberfläche etwas vertraut! Jedes Projekt wird durch einen Punkt dargestellt und hat eine eindeutige ID und findet im Rahmen eines Forschungsgebiets statt. Forschungsgebiete gehören zu einer Disziplin, woraus sich die Farbe der Projekt-Punkte ableitet. Projekte, die sich sehr ähnlich sind, werden einem Cluster zugeordnet - hier durch eine graue Hülle dargestellt - und liegen tendenziell näher beieinander.");
  
/////////////// Datas /////////////
var dataset, clusterData, projectParams;
// loading JSON with d3.json
d3.dsv(";", "dataFiles/results1.csv").then(function(data){
  // http://learnjsdata.com/read_data.html
  console.log(data[1]);
  dataset = data;
  
  d3.select("body").append("h2").text("Aufgabe " + aufgabenNr(dataset[1].Aufgabe));
  
  var antworten = ["Antwort1","Antwort2","Antwort3","Antwort4"];
  aufg1 = antworten.map(function(a,i){
    if (dataset[1][a] == dataset[1].Deutung)
      return {x: i, y: 1, los: dataset[1].Loesung, antwort: dataset[1][a]};
    else
      return {x: i, y: 0, los: dataset[1].Loesung, antwort: dataset[1][a]};
  });
  //console.log(aufg1);
  
  //////////////// SVG ////////////////////
  var svg1 = new SVG("svg");
  
  //////////////// Scaling ///////////////
  var scale1 = new Scale(aufg1);
  scale1.setDomain(aufg1);
  
  var nameScale = d3.scaleBand()
    .domain(antworten)
    .range([0, width])
    .paddingInner(0.1) // 2 set padding between bands
    .paddingOuter(0.1);// 0.55
  
  //////////////// Rectangles ///////////////
  var rects = new Rectangles(aufg1, svg1, "egal", scale1);
  
  ///////////////////////// Axen /////////////////////////
  var xAxis1 = d3.axisBottom(nameScale)
    .ticks(3);
    //.tickFormat(d3.formatPrefix(".0M",1e6));// https://github.com/d3/d3-format
  var yAxis1 = d3.axisLeft()
    .scale(scale1.yScale)
    .ticks(5);
    //.tickFormat(d3.format(".0"));// https://github.com/d3/d3-format
    
  var xAchse1 = svg1.svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis1);
  xAchse1.selectAll("text")
      .attr("transform", "translate(-6,2) rotate(-45)")
      .attr("dy", ".71em")
      .style("text-anchor", "end");
//   xAchse1.append("text")
//     .attr("transform", "translate(" + (width/2) + ", 25)")
//     .attr("dy", ".71em")
//     .style("text-anchor", "middle")// https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/text-anchor
//     .text("Antwort");
  
  var yAchse1 = svg1.svg.append("g")
    .attr("class", "y axis")
    .call(yAxis1)
    .append("text")
      .attr("transform", "translate(0,-20)")
      //.attr("transform", "translate(-38,"+(height/2)+") rotate(-90)")
      .attr("dy", ".71em")
      .style("text-anchor", "middle")//middle, end
      .text("Anzahl");
  
  
  // Check for the various File API support.
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
  } else {
    alert('The File APIs are not fully supported in this browser.');
  } // https://www.html5rocks.com/en/tutorials/file/dndfiles/
  
});
