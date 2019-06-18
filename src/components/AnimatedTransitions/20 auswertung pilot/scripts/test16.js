//////////////// Clusterzahl ////////////////////
function drawDuration(reducedData, ort){
  var aufg3 = reducedData.filter(function(d){return d.Aufgabe == "test16"})[0];
  
  var zelle3 = ort.append("td");
  
  zelle3.append("h2").text("Aufgabe " + aufgabenNr(aufg3.Aufgabe) + ": Transitionsdauer");
  
  zelle3.append("p")
    .text("Bei dieser Aufgabe sollten die Teilnehmer wählen, welche Transitionsdauer sie bevorzugen. Die Transition fand in zwei Schritten statt: Knoten wurden ausgeblendet, danach die Hüllen angepasst und neu skaliert. Das Ausblenden der Knoten betrug 1/4 der Gesamtdauer.");
  
  //////////////// SVG ////////////////////
  var svg3 = new SVG("svg", zelle3);
  svg3.svg.call(tooltipDauer);
  
  //////////////// Scaling ///////////////
  var scale3 = new Scale();
  scale3.setDomainDauer(aufg3.Antworten);
  
  //////////////// Rectangles ///////////////
  var rects3 = new Durationbars(aufg3, svg3, "egal", scale3, tooltipDauer);
  
  ///////////////////////// Axen /////////////////////////
  var xAxis3 = d3.axisBottom(scale3.xScale)
    .ticks(6)
    .tickPadding(-10)
    //.tickFormat(d3.formatPrefix(".2",1e-2));// https://github.com/d3
    .tickFormat(function(d){return d3.format(".2f")(d/1000)});// https://github.com/d3/d3-format
  var yAxis3 = d3.axisLeft()
    .scale(scale3.yScale)
    .ticks(5);
    
  var xAchse3 = svg3.svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis3);
  xAchse3.selectAll("text")// https://bl.ocks.org/d3noob/3c040800ff6457717cca586ae9547dbf
      .attr("transform", "translate(0,7) rotate(-90)")
      .attr("dy", ".71em")
      .style("text-anchor", "end");
  xAchse3.append("text")
      .attr("transform", "translate(" + (width+10) + ",-3)")
      .attr("dy", ".71em")
      .style("text-anchor", "start")//middle, end
      .text("Dauer in s");
  
  var yAchse3 = svg3.svg.append("g")
    .attr("class", "y axis")
    .call(yAxis3)
    .append("text")
      .attr("transform", "translate(0,-20)")
      //.attr("transform", "translate(-38,"+(height/2)+") rotate(-90)")
      .attr("dy", ".71em")
      .style("text-anchor", "middle")//middle, end
      .text("#Personen");
  
  ort.append("td")
    .append("p")
    .text("Die Personen bevorzugen recht unterschiedliche Transitionsdauer. Dies kann sowohl aus der Komplexität der zufällig erzeugten Cluster liegen, als auch an der mentalen Verfassung (z.B. Konzentration der Probanden). Warum? Hier folgen die verbalen Kommentare.");
}
