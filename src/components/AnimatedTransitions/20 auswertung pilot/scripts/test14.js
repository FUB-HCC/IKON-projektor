//////////////// Clusterzahl ////////////////////
function drawClusterzahl(reducedData, ort){
  var aufg1 = reducedData.filter(function(d){return d.Aufgabe == "test14"})[0];
  
  var zelle1 = ort.append("td");
  
  zelle1.append("h2").text("Aufgabe " + aufgabenNr(aufg1.Aufgabe) + ": Clusterzahl");
  
  zelle1.append("p")
    .text("Bei dieser Aufgabe ging es darum, die Clusterzahl vor und nach der Transition (Start und Ende) zu erraten, ohne dass die Hüllen angezeigt wurden.");
  
  //////////////// SVG ////////////////////
  var svg1 = new SVG("svg", zelle1);
  svg1.svg.call(tooltipClusterNo);
  
  //////////////// Scaling ///////////////
  var scale1 = new Scale();
  scale1.setDomainClusterzahl(aufg1.Antworten);
  
  //////////////// Rectangles ///////////////
  var rects = new Clusterbars(aufg1, svg1, "egal", scale1);
  
  ///////////////////////// Axen /////////////////////////
  var xAxis1 = d3.axisBottom(scale1.xScale)
    .ticks(6);
    //.tickFormat(d3.formatPrefix(".0M",1e6));// https://github.com/d3/d3-format
  var yAxis1 = d3.axisLeft()
    .scale(scale1.yScale)
    .ticks(5);
    //.tickFormat(d3.format(".0"));// https://github.com/d3/d3-format
    
  var xAchse1 = svg1.svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis1)
    .append("text")
      .attr("transform", "translate(" + (width+10) + ",-3)")
      //.attr("transform", "translate(-38,"+(height/2)+") rotate(-90)")
      .attr("dy", ".71em")
      .style("text-anchor", "start")//middle, end
      .text("Clusterzahl");
//   xAchse1.selectAll("text")
//       .attr("transform", "translate(-6,2) rotate(-45)")
//       .attr("dy", ".71em")
//       .style("text-anchor", "end");
  
  var yAchse1 = svg1.svg.append("g")
    .attr("class", "y axis")
    .call(yAxis1)
    .append("text")
      .attr("transform", "translate(0,-20)")
      //.attr("transform", "translate(-38,"+(height/2)+") rotate(-90)")
      .attr("dy", ".71em")
      .style("text-anchor", "middle")//middle, end
      .text("#Personen");
  const inhaltLeg = [
    {farbe: "#00ff00", text: "Start (richtig)"},
    {farbe: "#007700", text: "Ende (richtig)"},
    {farbe: "#ff0000", text: "Start (falsch)"},
    {farbe: "#770000", text: "Ende (falsch)"}
  ];
  var legende = svg1.svg.append("g")
    .attr("transform", "translate("+width+",0)");
  legende.append("text")
    .attr("x", 10)
    .text("Legende:");
  legende.selectAll("rect.legende")
    .data(inhaltLeg).enter()
    .append("rect")
    .attr("class", "legende")
    .attr("x", 10)
    .attr("y", function(d,i){return i*15+10;})
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", d => d.farbe);
  legende.selectAll("text.legende")
    .data(inhaltLeg).enter()
    .append("text")
    .attr("class", "legende")
    .text(d => d.text)
    .attr("x", 25)
    .attr("y", function(d,i){return i*15+10;})
    .attr("dy", ".71em")
    .style("text-anchor", "start")
    .style("fill", d => d.farbe);
  
  ort.append("td")
    .append("p")
    .text("Hier folgen die verbalen Kommentare.");
}
