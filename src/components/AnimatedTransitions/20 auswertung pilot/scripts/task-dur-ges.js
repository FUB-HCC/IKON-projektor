function drawStackedBarsGes(){
  // zeichnet eine Grafik für alle
  table = d3.select("body")
    .append("table");
  // 1. Zeile
  zeile = table.append("tr");
  zelle = zeile.append("td");
  
  // Auflistung der Einzelnen Dauern pro Aufgabe
  var svgGes = new SVG('Gesamt', zelle);
  var scaleGes = new Scale(datasetAll[0]);
      scaleGes.setDomainMidBars(datasetAll[0], personenzahl);
  var barsGes = new MyStackedBars(datasetAll[0], svgGes, scaleGes, tooltipBar, false);// false: nicht proPerson
  var axenGes = new Axen(svgGes, scaleGes, 'Aufgaben-Nr.', 'Totale Dauer pro Person in sec', 'Durchschnittl. Dauer pro Transition in sec');
  var beschrGes = new Legende(svgGes, scaleGes, datasetAll[0], 'Totale Dauer & Animationszahl pro Aufgabe', false);// false: nicht proPerson
  var graphenGes = new Graph(datasetAll[0], svgGes, scaleGes, favDuration);
  
  var relDataset = {
    Person: 'Gesamt',
    Clusterzahl: 0,
    Aufgaben: datasetAll[0].Aufgaben.slice(0,10).map(function(d,i){
      return {
        versuchszahl: d.arr.length / personenzahl,
        dauer: d.med,
        total: d.total,
        aufgabe: i+1
      };
    })
  };
  console.log('relDataset',relDataset);

  
  
  // durchschn. Versuchszahl in Abhängigkeit der mittleren Duration
  zelle = zeile.append("td");
  var svgGes2 = new SVG('Gesamt2', zelle);
  var scaleGes2 = new Scale(relDataset);
      scaleGes2.xScale.domain([d3.min(relDataset.Aufgaben, a => a.dauer), d3.max(relDataset.Aufgaben, a => a.dauer)]);
      scaleGes2.yScale.domain([0, d3.max(relDataset.Aufgaben, a => a.versuchszahl)]);
      scaleGes2.yScale2.domain([0, d3.max(relDataset.Aufgaben, a => a.total / personenzahl)]);
      
  // add the X gridlines
  svgGes2.svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(scaleGes2.xScale)
    .ticks(5)
    .tickSize(-height)
    .tickFormat("")
    );
  // add the Y gridlines
  svgGes2.svg.append("g")
    .attr("class", "grid")
    .call(d3.axisLeft(scaleGes2.yScale)
    .ticks(7)
    .tickSize(-width)
    .tickFormat("")
    );
  
  var xAxis = d3.axisBottom(scaleGes2.xScale).ticks(4);
  var yAxis = d3.axisLeft().scale(scaleGes2.yScale);
  var yAxis2 = d3.axisRight().scale(scaleGes2.yScale2);
  var xAchse = svgGes2.svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
      .attr("transform", "translate(" + (width/2) + ", 23)")
      .attr("font-size", "11px")
      .attr("fill", "black")
      .attr("dy", ".71em")
      .style("text-anchor", "middle")//middle, end
      .text("Mittlere Dauer pro Transition");
  var yAchse = svgGes2.svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
      .attr("transform", "translate(-38," + (height/2) + ") rotate(-90)")
      //.attr("transform", "translate(-38,"+(height/2)+") rotate(-90)")
      .attr("font-size", "11px")
      .style("fill", "red")
      .attr("dy", ".71em")
      .style("text-anchor", "middle")//middle, end
      .text("Mittlere Versuchszahl pro Person");
  var yAchse2 = svgGes2.svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + width + ",0)")
    .call(yAxis2)
    .append("text")
      .attr("transform", "translate(38," + (height/2) + ") rotate(-90)")
      //.attr("transform", "translate(-38,"+(height/2)+") rotate(-90)")
      .attr("font-size", "11px")
      .attr("dy", ".71em")
      .style("text-anchor", "middle")//middle, end
      .text("Mittlere Gesamtdauer pro Person in sec")
      .style("fill", "blue");
  
  //var beschrGes2 = new Legende(svgGes2, scaleGes2, datasetAll[0], 'Mittlere Versuchszahl über die mittlere Dauer');
  var d3Graph = d3.line()
    .x(d => scaleGes2.xScale(d.dauer))
    .y(d => scaleGes2.yScale(d.versuchszahl));
  var graph = svgGes2.svg.select("g.bars")
    .selectAll("path.graph1")
    .data([
      relDataset.Aufgaben.sort(function(a,b){
        return a.dauer - b.dauer;//dauer
      })
    ])
    .enter()
    .append("path")
    .attr("class", "graph1")
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 1.5)
    .attr("d", d3Graph);
      
  var d3Graph2 = d3.line()
    .x(d => scaleGes2.xScale(d.dauer))
    .y(d => scaleGes2.yScale2(d.total / personenzahl));
  var graph2 = svgGes2.svg.select("g.bars")
    .selectAll("path.graph2")
    .data([
      relDataset.Aufgaben.sort(function(a,b){
        return a.dauer - b.dauer;//dauer
      })
    ])
    .enter()
    .append("path")
    .attr("class", "graph2")
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 1.5)
    .attr("d", d3Graph2);
      
  var beschriftung = svgGes2.svg.select("g.beschriftung")
    .selectAll("text.versuche")
    .data(relDataset.Aufgaben)
    .enter()
    .append("text")
    .attr("class", "versuche")
    .text(d => "Aufg. " + d.aufgabe)
    .attr("x", function(d){return scaleGes2.xScale(d.dauer);})
    .attr("y", function(d){
      return scaleGes2.yScale(d.versuchszahl);
    })
    .attr("font-size", "11px")
    .attr("fill", "black")
    .style("text-anchor", "middle")
    .attr("dy", "-0.8ex");
    
//   var beschriftung2 = svgGes2.svg.select("g.beschriftung")
//     .selectAll("text.dauer")
//     .data(relDataset.Aufgaben)
//     .enter()
//     .append("text")
//     .attr("class", "dauer")
//     .text(d => "Aufg. " + d.aufgabe)
//     .attr("x", function(d){return scaleGes2.xScale(d.dauer);})
//     .attr("y", function(d){
//       return scaleGes2.yScale2(d.total / personenzahl);
//     })
//     .attr("font-size", "11px")
//     .attr("fill", "black")
//     .style("text-anchor", "middle")
//     .attr("dy", "-0.8ex");
}
