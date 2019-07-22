// ////////////// svg //////////////
var margin = {top: 120, right: 40, bottom: 40, left: 40},
  width = 650 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;
  
var radius = 4;
var plotkind = ["gridplot","scatterplot"];
var idx = 1;
var point;
var transparenz = 0.3;
var duration = 2000;

//////////// SVG ////////////
var svg1 = d3.select("body")
  .append("svg")
  .attr("class", "updateSvg")
  .attr("width",  width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
svg1.append("g").attr("class", "hulls");
svg1.append("g").attr("class", "circs");

//////////////// Scaling //////////////
var xScale = d3.scaleLinear()
  .domain([-1, 1])
  .range([0, width]);
var yScale = d3.scaleLinear()
  .domain([-1, 1])
  .range([height, 0]);
  
/////////////////////// AXEN ///////////////////
var xAxis1 = d3.axisBottom(xScale)
  .ticks(9);
  //.tickFormat(d3.format(".1%"));
var yAxis1 = d3.axisLeft()
  .scale(yScale)
  .ticks(9);
  
var xAchse = svg1.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis1)
  .append("text")
    .attr("transform", "translate(" + (width+10) + ",0)")
    .attr("dy", ".71em")
    .style("text-anchor", "middle")
    .text("x");
  
var yAchse = svg1.append("g")
  .attr("class", "y axis")
  .call(yAxis1)
  .append("text")
    .attr("transform", "translate(0,-12)")
    .attr("dy", ".71em")
    .style("text-anchor", "middle")
    .text("y");

//////////////// Tooltips ////////////////////
// http://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7
var tooltip = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d){return "ID: " + d.id + "<br>Cluster-Nr.: " + d.clusterNo + "<br>Pos: (" + d3.format(",.2f")(d.pos.x) + ", " + d3.format(",.2f")(d.pos.y) + ")<br>Keywords: " + d.keywords.join(",<br>" + "&nbsp".repeat(17));
  });

svg1.call(tooltip);// call the function on the selection

/////////////////// Title ///////////////
var titel = svg1.append("text")
  .attr("class", "title")
  .attr("x", -20)
  .attr("y", -100)
  .attr("fill", "black")
  .attr("font-weight", "bold");
  
//////////////// Legende ////////////
var legende = svg1.append("g")
  .attr("class", "legende");

//////////// Datas ////////////
var dataset, clusterData, projectParams;
// loading JSON with d3.json
d3.json("c4-t20_tSNE_p30-lr806.json").then(function(data){
  var pData = data.project_data;
  var anzDim = pData[0].reducedpoint.length;
  var angleDiff = Math.PI * 2 / anzDim;
  var dist = 0, maxRad = [], angle = 0;
  for (var i=0; i < anzDim; i++) {
    maxRad.push(d3.max(pData, d=> d.reducedpoint[i]));
  }
  dataset = data.project_data.map(function(d){
    var koords = d.reducedpoint;
    for (var i=0; i < anzDim; i++) {
      angle += angleDiff * i * koords[i]/maxRad[i];
      dist += koords[i]/maxRad[i];
    }
    angle = angle / anzDim;
    dist = dist / anzDim;
    var pos = new Position(Math.cos(angle) * dist, Math.sin(angle) * dist);
    var knoten = new Knoten(pos, d.id, d.cluster, "", "", d.words);
    return knoten;
  });
  clusterData = data.cluster_data;
  projectParams = data.params;
  
  //////////////// Scaling //////////////
  xScale.domain([d3.min(dataset, function(d){return d.pos.x;}), d3.max(dataset, function(d){return d.pos.x;})]);
  yScale.domain([d3.min(dataset, function(d){return d.pos.y;}), d3.max(dataset, function(d){return d.pos.y;})]);
  
  /////////////////////// AXEN ///////////////////
  svg1.selectAll("g.x.axis").call(xAxis1);
  svg1.selectAll("g.y.axis").call(yAxis1);
  
  ////////////////////// Punkte ///////////////////
  var circs = svg1.select("g.circs").selectAll("circle")
    .data(dataset);
  
  circs.enter()
    .append("circle")
    .attr("cx", function(d) {return xScale(d.pos.x);})
    .attr("cy", function(d) {return yScale(d.pos.y);})
    .attr("r",  function(d) {return radius;})
    .attr("fill", function(d) {
      return clusterData.cluster_colour[d.clusterNo];
    })
    .style("opacity", 1)
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .on("mouseover", tooltip.show)
    .on("mouseout", tooltip.hide)
    .style("pointer-events", "all");
  
  ///////////////////// Hüllen ////////////////////
  var gruppen = new Nest(dataset);
    
  var pfade = svg1.select("g.hulls").selectAll("path.hull")
    .data(gruppen.nest, function(d,i){return i;});
    
  pfade.enter()
    .append("path")
    .attr("class", "hull")
    .attr("d", function(c){
      return c.getHullVertices().makeHull2Path(xScale, yScale);
    })
    .attr('opacity', 0);
    
  ///////////////////// Legende ///////////////
  var text = legende.selectAll("text.beschriftung")
    .data(clusterData.cluster_words)
    .enter()
    .append("text")
    .attr("class", "beschriftung")
    .attr("x", function(d,i){return i*120;})
    .attr("y", -80)
    .attr("dy", "0.5ex")
    .text(function(wordlist,i){return "Cluster-Nr. " + i;})
    .attr("fill", function(wordlist,i){return clusterData.cluster_colour[i];})
    .attr("font-weight", "bold")
    .each(function(wl,i){
      var textelem = d3.select(this);
      textelem.selectAll("tspan.verse")
        .data(function(wl){return wl;})
        .enter()
        .append("tspan")
        .attr("class", "verse")
        .attr("x", function(word,j){return i*120;})
        .attr("y", function(word,j){return -70+j*10;})
        .attr("dy", "0.5ex")
        .text(function(word){return word;})
        .attr("fill", function(word){return clusterData.cluster_colour[i];})
        .attr("font-weight", "normal");
    });

  /////////////////// Title ///////////////
  titel.text(projectParams.clustering + " - " + projectParams.dimreduction + " - " + projectParams.embedding);
});

/* Quellen:
 * http://learnjsdata.com/read_data.html (V3)
 * http://bl.ocks.org/Jverma/887877fc5c2c2d99be10 (V3)
 * https://github.com/d3/d3/blob/master/CHANGES.md#changes-in-d3-50
 * 
 ,Testdata:
  {
      "cluster": 4,
      "embpoint": [
          2.4942595706627126,
          -3.8001701711461173
      ],
      "error": 1,
      "id": 11111111,
      "mappoint": [
          2.5325562579339893,
          -7.021499803477333
      ],
      "reducedpoint": [
          1,
          1,
          -1,
          -1,
          1,
          1,
          -1,
          -1,
          1,
          1,
          -1,
          -1,
          1,
          1,
          -1,
          -1,
          1,
          1,
          -1,
          -1
      ],
      "title": "GRK 503: Evolutive Transformationen und Faunenschnitte",
      "words": [
          "erde",
          "events",
          "prozesse",
          "seen",
          "transformationen"
      ]
  }
 */
