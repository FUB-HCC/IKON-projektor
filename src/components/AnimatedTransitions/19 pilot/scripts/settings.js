//////////////// Konstanten ////////////////////
const margin = {top: 30, right: 30, bottom: 30, left: 30},
  width = 350 - margin.left - margin.right,
  height = 350 - margin.top - margin.bottom,
  radius = 4;
var zeitspanne = [1990,2019];

var colorScheme = d3.schemeCategory10;//schemeDark2;//schemeSet1;// https://github.com/d3/d3-scale-chromatic/blob/master/README.md#schemeCategory10

const disziplinen = [
  {id: 1, farbe: "#A4782E", name: "Naturwissenschaften"},
  {id: 2, farbe: "#994A49", name: "Lebenswissenschaften"},
  {id: 3, farbe: "#435B22", name: "Geistes- und Sozialwissenschaften"},
  {id: 4, farbe: "#ed9798", name: "Ingenieurwissenschaften"}
];

const forschungsgebiete = [
  { id: 0,
    name: "Geochemie, Mineralogie u. Kristallographie",
    disziplin: 1
  },
  { id: 1,
    name: "Geophysik u. Geodäsie",
    disziplin: 1
  },
  { id: 2,
    name: "Geologie u. Paläontologie",
    disziplin: 1
  },
  { id: 3,
    name: "Atmosphären-, Meeres- u. Klimaforschung",
    disziplin: 1
  },
  { id: 4,
    name: "Zoologie",
    disziplin: 2
  },
  { id: 5,
    name: "Agrar-, Forstwissenschaften u. Tiermedizin",
    disziplin: 2
  },
  { id: 6,
    name: "Pflanzenwissenschaften",
    disziplin: 2
  },
  { id: 7,
    name: "Kunst-, Musik-, Theater- u. Medienwissenschaften",
    disziplin: 3
  },
  { id: 8,
    name: "Geschichtswissenschaften",
    disziplin: 3
  }
];

const websites = ["../index", "test01", "test02", "test03", "test04", "test05", "test06", "test07", "test08", "test09", "results"];

function aufgabenNr(site){
  return websites.indexOf(site);
}

function aufgabenCounter(site) {
  return "Aufgabe " + aufgabenNr(site) + "/" + (websites.length-2);
}

////////////////// SVG ////////////
class SVG {
  // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Klassen
  constructor(id) {
    this.svg = d3.select("body")//.select(".box")//d3.select("#"+id)
      .append("div")
      .attr("class", "box")
      .append("svg")
      .attr("class", id)
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
    return "ID: " + d.id + "<br>Cluster: " + d.clusterNo + "<br>Pos: (" + d3.format(",.2f")(d.pos.x) + " |  " + d3.format(",.2f")(d.pos.y) + ")<br>Jahr: " + d.year + "<br><span style='color:" +  d3.rgb(colorScheme[d.researchArea.disziplin]) + "'>Fach: " + d.researchArea.name + "</span><br>Keywords: " + d.keywords.join(",<br>" + "&nbsp".repeat(20));
  });

var tooltipCluster = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) {
    return "ID: " + d.id + "<br>major keys: " + d.getKeywords().join(",<br>" + "&nbsp".repeat(22));
  });
  
var tooltipNodePoor = d3.tip()// zum Verbergen von Informationen
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d){return "keine Informationen"});
  
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
      .style("opacity", 1)
      .style("pointer-events", "all");
      
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

//////////////// Button ///////////////
class LinkButton {  
  constructor(site, fkt, sign, text, result){
    this.btn = d3.select("body")
      .append("a")// https://stackoverflow.com/questions/16461512/add-a-link-to-another-page-with-d3-js
      .attr("href", function(){
        //event.preventDefault();// https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
        var index = (websites.indexOf(site)+sign) % websites.length;
        return websites[index]+".html";
      })
      //.html(text) // text für <a href></a>
      .append("button")
      .text(text)
      .on("contextmenu", function(d) {
        d3.event.preventDefault();
      })
      .on("click", function(){
        //d3.event.preventDefault();
        //console.log("click",site,text);
        fkt(site, result);
      });
  }// ende Konstruktor
}

class Button {  
  constructor(fkt, text){
    this.btn = d3.select("body")
      .append("button")
      .attr("class", "del")
      .text(text)
      .on("contextmenu", function(d) {
        d3.event.preventDefault();
      })
      .on("click", function(){
        //d3.event.preventDefault();
        //console.log("click",site,text);
        fkt();
      });
  }// ende Konstruktor
}

////////////// Button Funktionen ///////////
function storeDatas(site, res){
  sessionStorage.setItem(site, res);// https://www.w3schools.com/jsref/prop_win_sessionstorage.asp
  localStorage.setItem(site, res);// https://diveintohtml5.info/storage.html
  document.cookie = site + "=" + res;// ; expires=Tue, 31 Dec 2019 12:00:00 UTC; path=thanks.html
  // https://www.w3schools.com/js/js_cookies.asp
  //console.log(site,"Datei hinzugefügt");
}

// https://www.d3-graph-gallery.com/graph/interactivity_button.html
// https://stackoverflow.com/questions/26964006/using-d3-instead-of-jquery-to-process-form-input-causes-re-load-of

function deleteDatas(site, res) {
  sessionStorage.removeItem(site);
  localStorage.removeItem(site);
  document.cookie = site + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  //console.log(site,"letzte Datei gelöscht");
}

function deleteAllDatas(site, res) {
  sessionStorage.clear();
  localStorage.clear();
  document.cookie.split(";").forEach(function(c){
    var key = c.split("=")[0];
    document.cookie = key + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  });
  //console.log(site,"alle Dateien gelöscht");
}

function showDatas(site){
  // window.sessionStorage
  // https://www.w3schools.com/jsref/prop_win_sessionstorage.asp
  
  //alert(document.cookie.split("; ").join("\n"));
  
  //console.log(document.cookie.split("; ").join("\n"));
  // https://www.w3schools.com/js/js_cookies.asp
  //console.log(site,"Daten angezeigt");
  
//   document.cookie.split("; ").forEach(line =>
//     d3.select("body")
//       .append("p")
//       .text(line)
//   );
  
  // erstellt eine Datei mit den Ergebnissen
  // https://stackoverflow.com/questions/2897619/using-html5-javascript-to-generate-and-save-a-file
  // https://www.mediaevent.de/javascript/local-storage.html
  var content = [];
  var keys = Object.keys(localStorage).sort();
  keys.forEach(function(key){
    content.push(key + ": " + localStorage.getItem(key));
  });
  //var content = document.cookie;
  download('results.txt', content.join("\n"));
}

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
}

function cloneDataset(dataset){
  return dataset.map(function(d){return d.copy();});
}

function getFilteredData(datas){// https://stackoverflow.com/questions/39964570/how-to-filter-data-with-d3-js
  return datas.filter(function(node){
    return node.year >= zeitspanne[0] && node.year <= zeitspanne[1];
  });
}
