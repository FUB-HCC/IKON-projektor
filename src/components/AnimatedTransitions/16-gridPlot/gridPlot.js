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

///////////// Auswahl ////////////////
document.getElementById("transparenz").selectedIndex = 0;

//////////// Schieberegeler ////////////
document.getElementById("transDuration")
  .value = duration;
var durOutput = document.getElementById("durationOutput");// = d3.select("output#durationOutput.setduration")
durOutput.value = document.getElementById("transDuration").value/1000;
var outputPos = ((durOutput.value-0.5)/2.5*100).toString()+"%";
//durOutput.style("left", "50%");// "50%"
d3.select("output#durationOutput.setduration")
  .style("left", ((durOutput.value-0.4)/3*100).toString()+"%");
d3.select("#transDuration")
  .on("change", function(){duration = this.value;})
  .on("input", function(){
    //console.log("input",this.value);
    durOutput.value = this.value/1000;
    d3.select("output#durationOutput.setduration")
      .style("left", ((durOutput.value-0.4)/3*100).toString()+"%");
  });
  // https://www.w3schools.com/jsref/dom_obj_event.asp

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
var xScale1 = d3.scaleLinear()
  .domain([-7, 7])
  .range([0, width]);
var yScale1 = d3.scaleLinear()
  .domain([-7, 7])
  .range([height, 0]);
  
/////////////////////// AXEN ///////////////////
var xAxis1 = d3.axisBottom(xScale1)
  .ticks(9);
  //.tickFormat(d3.format(".1%"));
var yAxis1 = d3.axisLeft()
  .scale(yScale1)
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
  .html(function(d){return "ID: " + d.id + "<br>Cluster-Nr.: " + d.clusterNo + "<br>Keywords: " + d.keywords.join(", ");
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
  console.log(data);
  dataset = data.project_data.map(function(d){
    var pos = [
      new Position(d.mappoint[0], d.mappoint[1]),// gridplot
      new Position(d.embpoint[0], d.embpoint[1])// scatterplot
    ];
    var knoten = new Knoten(pos, d.id, d.cluster, "", "", d.words);
    return knoten;
  });
  clusterData = data.cluster_data;
  projectParams = data.params;
  
  //////////////// Scaling //////////////
  xScale1.domain([d3.min(dataset, function(d){return d.pos[idx].x;}), d3.max(dataset, function(d){return d.pos[idx].x;})]);
  yScale1.domain([d3.min(dataset, function(d){return d.pos[idx].y;}), d3.max(dataset, function(d){return d.pos[idx].y;})]);
  
  /////////////////////// AXEN ///////////////////
  svg1.selectAll("g.x.axis").call(xAxis1);
  svg1.selectAll("g.y.axis").call(yAxis1);
  
  ////////////////////// Punkte ///////////////////
  var circs = svg1.select("g.circs").selectAll("circle")
    .data(dataset);
  
  circs.enter()
    .append("circle")
    .attr("cx", function(d) {return xScale1(d.pos[idx].x);})
    .attr("cy", function(d) {return yScale1(d.pos[idx].y);})
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
      return c.getHullVertices(idx)[0].makeHull2Path(xScale1, yScale1, idx);
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





///////////////// UPDATE ///////////////////
function changeTransparenz() {
  if (transparenz == 0)
    transparenz = 0.3;
  else
    transparenz = 0;
  
  svg1.select("g.hulls").selectAll("path.hull")
    .transition().duration(duration).ease(d3.easeQuadInOut)
    .style("opacity", function(){
      if (idx == 0)
        return transparenz;
      else
        return transparenz;//0.3;
    });
}

function changeView(){
  idx = (idx+1) % 2;
  
  ////////////// Button //////////////
  document.getElementById("btn").textContent = "change to " + plotkind[(idx+1)%2];
  if (idx == 1)
    point = "embpoint";// scatterplot
  else
    point = "mappoint";// gridplot
    
  function otherPoint() {// gibt das jeweilige Gegenteil aus
    return (idx+1)%2;
  }
  
  //////////////// Scaling //////////////
  xScale1.domain([d3.min(dataset, function(d){return d.pos[idx].x;}), d3.max(dataset, function(d){return d.pos[idx].x;})]);
  yScale1.domain([d3.min(dataset, function(d){return d.pos[idx].y;}), d3.max(dataset, function(d){return d.pos[idx].y;})]);

  /////////////////////// AXEN ///////////////////
  var t0 = svg1.transition().duration(duration);
  t0.selectAll("g.x.axis").call(xAxis1);
  t0.selectAll("g.y.axis").call(yAxis1);

  ////////////////////// Punkte ///////////////////
  var circs = svg1.select("g.circs").selectAll("circle")
    .data(dataset);
    
  circs.transition().duration(duration).ease(d3.easeQuadInOut)
    .attr("cx", function(d) {return xScale1(d.pos[idx].x);})
    .attr("cy", function(d) {return yScale1(d.pos[idx].y);});
      
  ///////////////////// Hüllen ////////////////////
  var gruppen = new Nest(dataset);
    
  var pfade = svg1.select("g.hulls").selectAll("path.hull")
    .data(gruppen.nest, function(d){return d.id;});
  
  pfade.each(function(c){
    var oldHull = c.getHullVertices(otherPoint())[0];
    var newHull = c.getHullVertices(idx)[0];
    huellen = oldHull.huellenAbgleichen(newHull, idx);
    d3.select(this)
      .attr("d", huellen[0].makeHull2Path(xScale1, yScale1, otherPoint()))
      .transition().duration(duration).ease(d3.easeQuadInOut)
        .style("opacity", function(){
          if (idx == 0)
            return transparenz;
          else
            return 0.3;
        })
        .attr("d", huellen[1].makeHull2Path(xScale1, yScale1, idx))
      .on("end", function(d){
        d3.select(this)
          .attr("d", newHull.makeHull2Path(xScale1, yScale1, idx));
      });
    });
}// Ende Update


/* Quellen:
 * http://learnjsdata.com/read_data.html (V3)
 * http://bl.ocks.org/Jverma/887877fc5c2c2d99be10 (V3)
 * https://github.com/d3/d3/blob/master/CHANGES.md#changes-in-d3-50
 */
