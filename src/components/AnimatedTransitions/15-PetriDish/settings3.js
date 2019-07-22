//////////////// Konstanten ////////////////////
const margin = {top: 40, right: 40, bottom: 40, left: 40},
  width = 500 - margin.left - margin.right,
  height = 450 - margin.top - margin.bottom,
  radius = 4.5,
  hullOffset = 30;
  
//var colorScheme = d3.schemeCategory10;//schemeDark2;//schemeSet1;// https://github.com/d3/d3-scale-chromatic/blob/master/README.md#schemeCategory10

var colorScheme = ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"];

const disziplinen = [
  {id: 1, farbe: "#1f77b4"},//orange
  {id: 2, farbe: "#ff7f0e"},// pink
  {id: 3, farbe: "#2ca02c"},//green
  {id: 4, farbe: "#d62728"}
];

const forschungsgebiete = [
  { id: 0,
    name: "Naturwissenschaften",
    disziplin: 1
  },
  { id: 1,
    name: "Geochemie, Mineralogie u. Kristallographie",
    disziplin: 1
  },
  { id: 2,
    name: "Geophysik u. Geodäsie",
    disziplin: 1
  },
  { id: 3,
    name: "Geologie u. Paläontologie",
    disziplin: 1
  },
  { id: 4,
    name: "Atmosphären-, Meeres- u. Klimaforschung",
    disziplin: 1
  },
  { id: 5,
    name: "Lebenswissenschaften",
    disziplin: 2
  },
  { id: 6,
    name: "Zoologie",
    disziplin: 2
  },
  { id: 7,
    name: "Agrar-, Forstwissenschaften u. Tiermedizin",
    disziplin: 2
  },
  { id: 8,
    name: "Pflanzenwissenschaften",
    disziplin: 2
  },
  { id: 9,
    name: "Geistes- u. Sozialwissenschaften",
    disziplin: 3
  },
  { id: 10,
    name: "Kunst-, Musik-, Theater- u. Medienwissenschaften",
    disziplin: 3
  },
  { id: 11,
    name: "Geschichtswissenschaften",
    disziplin: 3
  }
];

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
      .domain([0, width])
      .range([0, width]);
    this.yScale = d3.scaleLinear()
      .domain([0, height])
      .range([height, 0]);
  }
  
  setDomain(vertices) {
    // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Functions/set
    this.xScale.domain([getMinXofShapes(vertices), getMaxXofShapes(vertices)]);
    this.yScale.domain([getMinYofShapes(vertices), getMaxYofShapes(vertices)]);
  }
}

////////////////////// Tooltip //////////////
// http://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7
  
var tooltipNode = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) {
    return "ID: " + d.id + "<br>Cluster: " + d.clusterNo + "<br>Pos: (" + d3.format(",.2f")(d.pos.x) + ",  " + d3.format(",.2f")(d.pos.y) + ")<br>Jahr: " + d.year + "<br><span style='color:" +  d3.rgb(colorScheme[d.researchArea.disziplin]) + "'>Fach: " + d.researchArea.name + "</span><br>Keywords: " + d.keywords.join(",<br>" + "&nbsp".repeat(20));
  });

var tooltipCluster = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) {
    return "ID: " + d.id + "<br>major keys: " + d.getKeywords().join(",<br>" + "&nbsp".repeat(22));
  });
  
//////////////// Kreise ///////////////
class Kreise {
  constructor(vertices, svg, klasse, scale) {
    this.circles = svg.svg.select("g.circs")
      .selectAll("circle."+klasse)
      .data(vertices, function(d){return d.id;})
      .enter()
      .append("circle")
      .attr("class", klasse)
      .attr("cx", function(d) {return scale.xScale(d.pos.x);})
      .attr("cy", function(d) {return scale.yScale(d.pos.y);})
      .attr("r", radius)
      .on("mouseover", tooltipNode.show)
      .on("mouseout", tooltipNode.hide)
      // https://github.com/d3/d3-scale-chromatic
      .style("stroke", function(d){
        return d3.rgb(colorScheme[d.researchArea.disziplin]).brighter(2);
      })// .darker(2)
      .style("fill", function(d){
        return d3.rgb(colorScheme[d.researchArea.disziplin]);
      })
      .style("opacity", 1);
    svg.svg.call(tooltipNode);// call the function on the selection
  }
}

//////////////// Hüllen ///////////////
class Pfade {  
  constructor(gruppen, svg, klasse, scale){
    this.nester = gruppen.nest;
    this.hull = svg.svg.select("g.hulls")
      .selectAll("path."+klasse)
      .data(gruppen.nest, function(d){return d.id;})
      .enter()
      .append("path")
      .attr("class", klasse)
      .attr("d", function(c){// c = Cluster{id, polygons}
        return c.makePolygons2Path(scale);}
      )
      .attr('fill', "gray")
      .attr('stroke', "gray")
      .attr('opacity', 0.3)
      .on("mouseover", tooltipCluster.show)
      .on("mouseout", tooltipCluster.hide);
    svg.svg.call(tooltipCluster);// call the function on the selection
  }
}

//////////////// Funktionen ///////////////
function getMinXofShapes(vertices){
  return Math.min(0, d3.min(vertices.filter(function(d){
    return d.year >= zeitspanne[0] && d.year <= zeitspanne[1];
  }), function(d){return d.pos.x;}));
}
function getMaxXofShapes(vertices){
  return d3.max(vertices.filter(function(d){
    return d.year >= zeitspanne[0] && d.year <= zeitspanne[1];
  }), function(d){return d.pos.x;});
}
function getMinYofShapes(vertices){
  return Math.min(0, d3.min(vertices.filter(function(d){
    return d.year >= zeitspanne[0] && d.year <= zeitspanne[1];
  }), function(d){return d.pos.y;}));
}
function getMaxYofShapes(vertices){
  return d3.max(vertices.filter(function(d){
    return d.year >= zeitspanne[0] && d.year <= zeitspanne[1];
  }), function(d){return d.pos.y;});
}
