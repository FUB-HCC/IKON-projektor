// ////////// Datas ////////////
var dataset = [
  {name: 'Maus',    keywords: ['korn', 'klein', 'feld', 'haus', 'scheune', 'vierbeiner']},
  {name: 'Elefant', keywords: ['laub', 'gross', 'savanne', 'vierbeiner']},
  {name: 'Pferd',   keywords: ['stroh', 'gross', 'weide', 'stall', 'vierbeiner']},
  {name: 'Katze',   keywords: ['fleisch', 'maus', 'fisch', 'mittel', 'haus', 'scheune', 'vierbeiner']},
  {name: 'Hund',    keywords: ['fleisch', 'schwein', 'mittel', 'haus', 'vierbeiner']},
  {name: 'Amsel',   keywords: ['insekt', 'wald', 'stadt', 'zweibeiner', 'klein']},
  {name: 'Oktopus', keywords: ['fisch', 'meer', 'gross', 'achtbeiner']},
  {name: 'Ity', keywords: ['fremd']},
];

// ////////////// svg //////////////
var margin = {top: 20, right: 20, bottom: 40, left: 50},
  width = 600 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom;
  
varradius = 5;
var duration = 4000, intervallzeit = 100;

var svg = d3.select("body")
  .append("svg")
  .attr("class", "updateSvg")
  .attr("width",  width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

// ////////////// Scaling //////////////
xScale = d3.scaleLinear()
  .domain([0, d3.max(dataset, function(d){return d.keywords.length})])
  .range([0, width]);
yScale = d3.scaleLinear()
  .domain([0, d3.max(dataset, function(d){return d.keywords.length})])
  .range([height, 0]);

//////////////// Tooltips ////////////////////
// http://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7
var tooltip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-8, 0])
  .html(function(d) {return "Tier: " + d.name + "<br>Keywords: " + d.keywords.join("<br>&nbsp;&nbsp;");});
  
svg.call(tooltip);// call the function on the selection

// //////////////////// Scatterplot ///////////////////
var circs = svg.selectAll("circle.area")
  .data(dataset)
  .enter()
  .append("circle")
  .attr("class", "area")
  .attr("cx", function(d) {return xScale(Math.random()*d.keywords.length);})
  .attr("cy", function(d) {return yScale(Math.random()*d.keywords.length);})
  .attr("r",  function(d) {return radius;})
  .attr("fill", "yellow")
  .attr("stroke", "orange")
  .attr("stroke-width", "2")
  .on("mouseover", tooltip.show)
  .on("mouseout", tooltip.hide)
  .style('fill-opacity', 40)
  .style('stroke-opacity', 100)
  .style('pointer-events', 'all');// none
  
// //////////// Funktionen /////////////
var proximitaetsmatrix = Array(dataset.length).fill().map(() => Array(dataset.length).fill(0));
// https://stackoverflow.com/questions/1295584/most-efficient-way-to-create-a-zero-filled-javascript-array
// https://codereview.stackexchange.com/questions/161013/filling-a-matrix-with-values

function fillProximity() {
  for (i=0; i<dataset.length; i+=1) {
    for (j=i+1; j<dataset.length; j+=1) {
      var n = 0;
      for (k=0; k<dataset[i].keywords.length; k+=1) {
        if (dataset[j].keywords.includes(dataset[i].keywords[k])){
          n += 1;
        }
      }
      console.log("=> "+dataset[i].name +" und " +dataset[j].name + " haben " +n+" Gemeinsamkeit(en)");
      proximitaetsmatrix[i][j] = n;
      proximitaetsmatrix[j][i] = n;
    }
  }
  var s = "Proximitätsmatrix:\n[";
  for (i=0; i<dataset.length; i+=1)
    s = s + proximitaetsmatrix[i] + "]\n[";
  console.log(s.slice(0,s.length-2));
}

function getMax(i) {
  // gibt den Index des linkesten Maximums der Zeile i der proximitaetsmatrix aus
  var m = 0;
  for (j=1; j<proximitaetsmatrix[i].length; j+=1)
    m = proximitaetsmatrix[i][m] > proximitaetsmatrix[i][j]? m:j;
  return m;
}

function distance(obj1, obj2) {
//   var c1 = circs.filter(function(d,j){return i1 == j});
//   var c2 = circs.filter(function(d,j){return i2 == j});
  var dx = obj1.attr("cx")-obj2.attr("cx");
  var dy = obj1.attr("cy")-obj2.attr("cy");
  return Math.sqrt(dx*dx + dy*dy);
}

function goTo(timerValue) {
  svg.selectAll("circle.area").transition()
    .duration(intervallzeit).ease(d3.easeQuadInOut)
    .attr("cx", function(d,i){// https://stackoverflow.com/questions/28390754/get-one-element-from-d3js-selection-by-index
      var other = circs.filter(function(e,j){return j==getMax(i);});
      var thiss = d3.select(this);
      var dist = distance(thiss, other);
      var interpolateX = d3.interpolateNumber(thiss.attr("cx"),  other.attr("cx"));
      if (dist > 2*radius)
        return interpolateX(timerValue);
      else
        return thiss.attr("cx");
    })
    .attr("cy", function(d,i){
      var other = circs.filter(function(e,j){return j==getMax(i);});
      var thiss = d3.select(this);
      var dist = distance(thiss, other);
      var interpolateY = d3.interpolateNumber(thiss.attr("cy"),  other.attr("cy"));
      if (dist > 4*radius)
        return interpolateY(timerValue);
      else
        return thiss.attr("cy");
    });
}

// ///////////// Start-Transition ////////////
fillProximity();

var interval = d3.interval(function(timer){
  if (timer > duration) {
    interval.stop();
    return;
  }
  goTo(timer/duration);
}, intervallzeit);
//goTo();
