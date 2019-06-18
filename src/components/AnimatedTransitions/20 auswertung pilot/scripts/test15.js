//////////////// Clusterzahl ////////////////////
function drawAnimationsart(reducedData, ort){
  var aufg2 = reducedData.filter(function(d){return d.Aufgabe == "test15"})[0];
  
  var zelle2 = ort.append("td");
  
  zelle2.append("h2").text("Aufgabe " + aufgabenNr(aufg2.Aufgabe) + ": Animationsart");
  
  zelle2.append("p")
    .text("Hier wurde animierte Transition mit Überblendung gegenüber gestellt. Die Teilnehmer sollten die bevorzugte Animationsart wählen.");
  
  //////////////// SVG ////////////////////
  var svg2 = new SVG("svg", zelle2);
  svg2.svg.call(tooltipAnim);
  
  //////////////// Scaling ///////////////
  var scale2 = new Scale();
  scale2.setDomainAnimation(aufg2.Antworten);
  
  //////////////// Rectangles ///////////////
  var rects2 = new Animbars(aufg2, svg2, "egal", scale2, tooltipAnim);
  
  ///////////////////////// Axen /////////////////////////
  var xAxis2 = d3.axisBottom(scale2.nameScaleX)
    .ticks(2);
    //.tickFormat(d3.formatPrefix(".0M",1e6));// https://github.com/d3/d3-format
  var yAxis2 = d3.axisLeft()
    .scale(scale2.yScale)
    .ticks(4);
    //.tickFormat(d3.format(".0"));// https://github.com/d3/d3-format
    
  var xAchse2 = svg2.svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis2);
  xAchse2.selectAll("text")// https://bl.ocks.org/d3noob/3c040800ff6457717cca586ae9547dbf
      .attr("transform", "translate(-2,-1) rotate(-12)")
      .attr("dy", ".71em")
      .style("text-anchor", "end");
  xAchse2.append("text")
      .attr("transform", "translate(" + (width+10) + ",-3)")
      .attr("dy", ".71em")
      .style("text-anchor", "start")//middle, end
      .text("Animationsart");
  
  var yAchse2 = svg2.svg.append("g")
    .attr("class", "y axis")
    .call(yAxis2)
    .append("text")
      .attr("transform", "translate(0,-20)")
      //.attr("transform", "translate(-38,"+(height/2)+") rotate(-90)")
      .attr("dy", ".71em")
      .style("text-anchor", "middle")//middle, end
      .text("#Personen");
  
  ort.append("td")
    .append("p")
    .text("Wie sich leicht erkennen lässt, bevorzugen alle Teilnehmer die Transition. Warum? Hier folgen die verbalen Kommentare.");
}
