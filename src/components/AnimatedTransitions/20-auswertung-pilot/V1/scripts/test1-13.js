//////////////// Clusterzahl ////////////////////
function drawVergleich(reducedData, ort){
  var teilnehmerzahl = reducedData[0].Antworten.length;
  //console.log('teilnehmerzahl',teilnehmerzahl);
  
  var tests = ["test04", "test05", "test06", "test07", "test08", "test09", "test10", "test11", "test12", "test13"];
  
  var daten4 = reducedData.filter(d => // filtert DeutungsTasks
    tests.some(e => e == d.Aufgabe)
  );  
  console.log('daten4',daten4);
  
  var flatDatas = [];
  daten4.forEach(function(d){
    d.Antworten.forEach(function(a){
      flatDatas.push({
        Aufgabe: d.Aufgabe,
        Loesung: d.Loesung,
        Antwort: a.name,
        Anzahl: a.anz
      });
    });
  });
  console.log('flatDatas',flatDatas);
  
  // listet alle möglichen Antworten auf. Jede kommt genau 1x vor.
//   var allAnswers4 = [];
//   daten4.forEach(function(task){
//     task.Antworten.forEach(function(answer) {
//       if (! allAnswers4.some(t => t == answer.name))
//         allAnswers4.push(answer.name);
//     });
//   });
//   console.log('alle Antworten', allAnswers4);
  
  var zelle4 = ort.append("td");
  
  zelle4.append("h2").text("Aufgabe 1-10: Deutung von Transitionen");
  
  zelle4.append("p")
    .text("Die Teilnehmer sollten mehrere Transitionen deuten. Dabei sollten sie sowohl mündlich sprechen, als auch die Multiple Choice Felder ankreuzen.");
  
  //////////////// SVG ////////////////////  
  var svg4 = zelle4.append("div")
      .attr("class", "box")
      .append("svg")
      .attr("class", "svg")
      .attr("width",  width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg4.append("g").attr("class", "hulls");
    svg4.append("g").attr("class", "circs");
    svg4.call(tooltipDeutung);
  
  //////////////// Scaling ///////////////
  var scale4 = new Scale();
    scale4.setDomainDeutung(daten4, allAnswers, teilnehmerzahl);// Teilnehmerzahl
  
  //////////////// Rectangles ///////////////
  var rects4 = new Deutungsbars(flatDatas, svg4, "egal", scale4, tooltipDeutung, allAnswers);
  
  ///////////////////////// Axen /////////////////////////
  var xAxis4 = d3.axisBottom(scale4.nameScaleX);
    //.ticks(6)
    //.tickPadding(-10);
    //.tickFormat(d3.formatPrefix(".2",1e-2));// https://github.com/d3
    //.tickFormat(function(d){return d3.format(".2f")(d/1000)});// https://github.com/d3/d3-format
  var yAxis4 = d3.axisLeft()
    .scale(scale4.nameScaleY);
    //.ticks(5);
    
  var zAxis4 = d3.axisRight()
    .scale(scale4.yScale)
    .ticks(3);
    
  var xAchse4 = svg4.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis4);
  xAchse4.selectAll("text")// https://bl.ocks.org/d3noob/3c040800ff6457717cca586ae9547dbf
      .attr("transform", "translate(0,1)")
      //.attr("transform", "translate(" + (scale4.nameScaleX.bandwidth() / 2 + 1) + ",12) rotate(-90)")
      .attr("dy", ".71em")
      .style("text-anchor", "middle");// end
  xAchse4.append("text")
      .attr("transform", "translate(" + (width/2) + ", 23)")
      .attr("dy", ".71em")
      .style("text-anchor", "middle")//middle, end
      .text("Transitions-Nr.");
  
  var yAchse4 = svg4.append("g")
    .attr("class", "y axis")
    .call(yAxis4)
    .append("text")
      .attr("transform", "translate(-35," + (height/2) + ") rotate(-90)")
      //.attr("transform", "translate(-38,"+(height/2)+") rotate(-90)")
      .attr("dy", ".71em")
      .style("text-anchor", "middle")//middle, end
      .text("Deutungs-Nr.");
      
  ////////////// Grid /////////////
  function make_x_gridlines() {
    return d3.axisBottom(scale4.nameScaleX).ticks(8);
  }
  function make_y_gridlines() {
    return d3.axisLeft(scale4.nameScaleY).ticks(5);
  }// https://blockbuilder.org/35degrees/23873a64ceec2390c400694b6a8b57d9
  svg4.select("g.hulls").append("g")
    .attr("class","grid")
    .attr("transform","translate(0," + height + ")")
    //.style("stroke-dasharray",("3,3"))
    .style("stroke-width", 0.3)
    .style("opacity", 0.3)
    .call(make_x_gridlines()
      .tickSize(-height)
      .tickFormat("")
    );
  svg4.select("g.hulls").append("g")
    .attr("class","grid")
    //.style("stroke-dasharray",("3,3"))
    .style("stroke-width", 0.3)
    .style("opacity", 0.3)
    .call(make_y_gridlines()
      .tickSize(-width)
      .tickFormat("")
    );
    
  ////////////// Füllung: Verlauf /////////////////
  var defs = svg4.append("defs");
  var gradient = defs.append('linearGradient')
    .attr('id', "fillLinear")
    .attr('x1', '0%')
    .attr('x2', '0%')
    .attr('y1', '100%')
    .attr('y2', '0%');
  gradient.append('stop')
    .attr('offset', '0%')
    .style("stop-color", scale4.colorScale(1))
    .style("stop-opacity", "1");
  gradient.append('stop')
    .attr('offset', '100%')
    .style("stop-color", scale4.colorScale(teilnehmerzahl+1))
    .style("stop-opacity", "1");
  
  ///////// Legende ////////////
  var legende = svg4.append("g")
    .attr("transform", "translate(" + (width+55) + ",0)");
  legende.append("text")
    .attr("x", 0)
    .attr("y", -20)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Legende:");
  legende.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width",  15)
    .attr("height", height)
    .attr("fill", "url(#fillLinear)");
  legende.append("g")
    .attr("class", "y axis")
    .call(zAxis4)
    .attr("transform", "translate(" + 14 + ", 0 )")
    .append("text")
      .attr("transform", "translate(-30," + (height/2) + ") rotate(-90)")
      .attr("dy", ".71em")
      .style("text-anchor", "middle")
      .text("Farbe nach Personenzahl");
      
  legende.append("rect")
    .attr("x", -(scale4.nameScaleX.bandwidth()+8))
    .attr("y", height+20)
    .attr("width",  scale4.nameScaleX.bandwidth())
    .attr("height", scale4.nameScaleY.bandwidth())
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", 1);
  legende.append("text")
    .attr("x", -3)
    .attr("y", height+20)
    .attr("dy", ".71em")
    .style("text-anchor", "start")
    .text("Treffer");
      
  var liste = ort.append("td");
  liste.append("p").text("Legende: Transitions- bzw. Deutungs-Nr.");
    // http://bl.ocks.org/ne8il/5131235
    // https://www.w3schools.com/html/tryit.asp?filename=tryhtml_lists_intro
  liste.append("ol").selectAll('li')
    .data(allAnswers)
    .enter()
    .append("li")
    .html(String);
  
//   ort.append("td")
//     .append("p")
//     .text("Warum? Hier folgen die verbalen Kommentare.");
}
