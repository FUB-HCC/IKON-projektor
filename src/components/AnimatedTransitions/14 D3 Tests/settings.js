//////////////// Konstanten ////////////////////
const margin = {top: 20, right: 20, bottom: 20, left: 30},
  width = 300 - margin.left - margin.right,
  height = 200 - margin.top - margin.bottom,
  radius = 4.5,
  hullOffset = 30;
  
var colorScheme = d3.schemeCategory10;//schemeDark2;//schemeSet1;// https://github.com/d3/d3-scale-chromatic/blob/master/README.md#schemeCategory10

////////////////// SVG ////////////
class SVG {
  // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Klassen
  constructor(id) {
    this.svg = d3.select(id)
      .attr("width",  width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    this.svg.append("g").attr("class", "hulls");
    this.svg.append("g").attr("class", "circs");
  }
  
  get getSvg(){
    return this.svg;
  }
}

////////////////// Scaling ////////////
class Scale {
  constructor(vertices){
    this.xScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, width]);
    this.yScale = d3.scaleLinear()
      .domain([0, 100])
      .range([height, 0]);
  }
  
  domain(vertices) {
    // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Functions/set
    this.xScale.domain([getMinXofShapes(vertices), getMaxXofShapes(vertices)]);
    this.yScale.domain([getMinYofShapes(vertices), getMaxYofShapes(vertices)]);
  }
}

////////////////////// Tooltip //////////////
// http://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7
var tooltipIdx = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d,i) {return "ID: " + i;});// width*d.x + d.y
  
var tooltipID = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) {return "ID: " + d.id + ", Cluster: " + d.cluster;});

var tooltipPos = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) {return "ID: " + 
    d3.format(",.0f")(width*d.x + d.y);});
  
var tooltipCluster = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) {
    return "ID: " + d.key;});
  
//////////////// Kreise ///////////////
class Kreise {
  constructor(vertices, svg, klasse, scale, IDfunc, tooltip) {
    this.circles = svg.selectAll("circle."+klasse)
      .data(vertices, IDfunc)
      .enter()
      .append("circle")
      .attr("class", klasse)
      .attr("cx", function(d) {return scale.xScale(d.x);})
      .attr("cy", function(d) {return scale.yScale(d.y);})
      .attr("r", radius)
      .on("mouseover", tooltip.show)
      .on("mouseout", tooltip.hide)
      //.style("stroke", "red")//function(){return d3.rgb(colorScheme(1).darker(2);})
      //.style("stroke-width", 1)
      //.style("fill", "pink")//function(){return d3.rgb(colorScheme(1));})
      .style("opacity", 1);
    svg.call(tooltip);// call the function on the selection
  }
  
  set setPosition(vertices){
    this.circles.attr("cx", function(d) {return scale.xScale(d.x);});
    this.circles.attr("cy", function(d) {return scale.yScale(d.y);});
  }
  
  set setRadius(radius){
    this.circles.attr("r", radius);
  }
}

class Farbkreise {
  constructor(vertices, svg, klasse, scale, IDfunc, tooltip, groupNumber) {
    this.circles = svg.selectAll("circle."+klasse)
      .data(vertices, IDfunc)
      .enter()
      .append("circle")
      .attr("class", klasse)
      .attr("cx", function(d) {return scale.xScale(d.x);})
      .attr("cy", function(d) {return scale.yScale(d.y);})
      .attr("r", radius)
      .on("mouseover", tooltip.show)
      .on("mouseout", tooltip.hide)
      // https://github.com/d3/d3-scale-chromatic
      .style("stroke", function(d){return d3.rgb(colorScheme[d.id%groupNumber]).brighter(2);})// .darker(2)
      .style("fill", function(d,i){return d3.rgb(colorScheme[d.id%groupNumber]);})
      .style("opacity", 1);
    svg.call(tooltip);// call the function on the selection
  }
  
  set setPosition(vertices){
    this.circles.attr("cx", function(d) {return scale.xScale(d.x);});
    this.circles.attr("cy", function(d) {return scale.yScale(d.y);});
  }
  
  set setRadius(radius){
    this.circles.attr("r", radius);
  }
}

class Huellen {  
  constructor(hullVertices, svg, klasse, scale){
    this.hullVertices = hullVertices;
    this.hull = svg.selectAll("path."+klasse)
      .data(hullVertices)
      .enter()
      .append("path")
      .attr("class", klasse)
      .attr("d", function(d){
        //console.log(hullVertices); // alle Nester
        //console.log(d); // ein Nest
        //console.log(makeHull2Path(calculateHull(d.values), scale));
        return makeHull2Path(d.values, scale);}
      )
      .attr('fill', function(d){
        return d3.rgb(colorScheme[d.key%4]).darker(1);})
      .attr('stroke', function(d){
        return d3.rgb(colorScheme[d.key%4]).darker(1);});//brighter
      //.style("opacity", 0.7)
      //.style("paint-order", "stroke markers fill")
      //.attr('stroke-width', 10)
      //.style("stroke-linejoin", "round");
  }
}

class HuellenGrau {  
  constructor(hullVertices, svg, klasse, scale, IDfunc, tooltip){
    this.hullVertices = hullVertices;
    this.hull = svg.selectAll("path."+klasse)
      .data(hullVertices, IDfunc)
      .enter()
      .append("path")
      .attr("class", klasse)
      .attr("d", function(d){
        return makeHull2Path(d.values, scale);}
      )
      .attr('fill', "gray")
      .attr('stroke', "gray")
      .on("mouseover", tooltip.show)
      .on("mouseout", tooltip.hide);
    svg.call(tooltip);// call the function on the selection
  }
}

//////////////// Funktionen ///////////////
function getMinXofShapes(vertices){
  return Math.min(0, d3.min(vertices, function(d){return d.x;}));
}
function getMaxXofShapes(vertices){
  return d3.max(vertices, function(d){return d.x;});
}
function getMinYofShapes(vertices){
  return Math.min(0, d3.min(vertices, function(d){return d.y;}));
}
function getMaxYofShapes(vertices){
  return d3.max(vertices, function(d){return d.y;});
}
