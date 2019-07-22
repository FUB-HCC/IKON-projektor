// ////////////// svg //////////////
var margin = {top: 120, right: 40, bottom: 40, left: 40},
  width = 500 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;
  
var radius = 4;

var svg1 = d3.select("body")
  .append("svg")
  .attr("class", "updateSvg")
  .attr("width",  width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//////////////// Tooltips ////////////////////
// http://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7
var tooltip = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d){return "Cluster-Nr.: " + d.cluster + "<br>ID: " + d.id;
  });

svg1.call(tooltip);// call the function on the selection

//////////////// Legende ////////////
var legende = svg1.append("g")
  .attr("class", "legende");

//////////// Datas ////////////
var dataset, clusterData, projectParams;
// loading JSON with d3.json
d3.json("c4-t39_LDA.json").then(function(data){
  console.log(data);
  dataset = data.project_data;
  clusterData = data.cluster_data;
  projectParams = data.params;
  
  //////////////// Scaling //////////////
  var xScale1 = d3.scaleLinear()
    .domain([d3.min(dataset, function(d){return d.point[0];}), d3.max(dataset, function(d){return d.point[0];})])
    .range([0, width]);
  var yScale1 = d3.scaleLinear()
    .domain([d3.min(dataset, function(d){return d.point[1];}), d3.max(dataset, function(d){return d.point[1];})])
    .range([height, 0]);

  /////////////////////// AXEN ///////////////////
  var xAxis1 = d3.axisBottom(xScale1);
    //.ticks(6);
    //.tickFormat(d3.format(".1%"));
  var yAxis1 = d3.axisLeft()
    .scale(yScale1);
    //.ticks(4);
    
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

  ////////////////////// Scatterplot ///////////////////
  var circs = svg1.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function(d) {return xScale1(d.point[0]);})
    .attr("cy", function(d) {return yScale1(d.point[1]);})
    .attr("r",  function(d) {return radius;})
    .attr("fill", function(d) {return clusterData.cluster_colour[d.cluster];})
    .attr("stroke", "black")
    .attr("stroke-width", "1")
    .on("mouseover", tooltip.show)
    .on("mouseout", tooltip.hide)
//     .style("fill-opacity", 0.4)
//     .style("stroke-opacity", 1)
    .style("pointer-events", "all");// none
    
  ///////////////////// Legende ///////////////
  var text = legende.selectAll("text.beschriftung")
    .data(clusterData.cluster_words)
    .enter()
    .append("text")
    .attr("class", "beschriftung")
    .attr("x", function(d,i){return 20+i*100;})
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
        .attr("x", function(word,j){return 20+i*100;})
        .attr("y", function(word,j){return -70+j*10;})
        .attr("dy", "0.5ex")
        .text(function(word){return word;})
        .attr("fill", function(word){return clusterData.cluster_colour[i];})
        .attr("font-weight", "normal");
    });

  /////////////////// Title ///////////////
  svg1.append("text")
    .attr("class", "title")
    .attr("x", -20)
    .attr("y", -100)
    .text(projectParams.clustering + " - " + projectParams.dimreduction + " - " + projectParams.embedding)
    .attr("fill", "black")
    .attr("font-weight", "bold");
});


/* Quellen:
 * http://learnjsdata.com/read_data.html (V3)
 * http://bl.ocks.org/Jverma/887877fc5c2c2d99be10 (V3)
 * https://github.com/d3/d3/blob/master/CHANGES.md#changes-in-d3-50
 */
