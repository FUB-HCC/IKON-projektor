//////////////// Konstanten ////////////////////
const margin = {top: 40, right: 100, bottom: 40, left: 40},
  width = 400 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom,
  radius = 4,
  barPadding = 2;
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

const websites = ["../index", 
  "test10", // neue Knoten + wirken sich nicht auf die Form aus
  "test11", // neue Knoten + Verformung durch diese
  "test08", // Verschiebung
  "test05", // Verschmelzung
  "test13", // Knoten verschwinden + Verformung durch diese aus
  "test04", // ein Cluster teilt sich auf 2 andere auf
  "test09", // Knoten verschwinden + wirken sich nicht auf die Form
  "test06", // Clusterwechsel (alte bleibt bestehen)
  "test07", // Clusterwechsel + neues Cluster
  "test12", // neue Knoten => neues Cluster
  "test14", // Clusterzahl raten (altes Template)
  "test15", // Vergleich: Trans. vs. Überblendung
  "test16", // Transitionsdauer
  "results"
];
/* "test01", // Objektverfolgung 
 * "test02", // Knoten kommen hinzu
 * "test03", // Knoten verschwinden
 */

function aufgabenNr(site){
  return websites.indexOf(site);
}

function aufgabenCounter(site) {
  return "Aufgabe " + aufgabenNr(site) + "/" + (websites.length-2);
}

var allAnswers = [
  // neue Projekte
  "Neue Projekte kamen hinzu. Sie haben die Hüllenform nicht beeinflusst.",
  "Neue Projekte kamen hinzu und veränderten die Hüllenform.",
  "Die Hüllenform hat sich bei konstanter Projektzahl verändert.",
  "Die Cluster haben sich verschoben, aber die Form blieb unverändert.",
  "Das Verschwinden von Projekten beeinflusste die Hüllenform.",
  "Projekte sind verschwunden und beeinflussten nicht die Hüllenform.",
  // del Projekte
  "Alte Projekte haben ein neues Cluster erzeugt.",
  "Neue Projekte haben ein neues Cluster erzeugt.",
  "Projekte kamen hinzu, aber die Clusterzahl blieb konstant.",
  "Ein Cluster hat sich aufgeteilt.",
  "Ein Cluster ist mitsamt der Projekte verschwunden.",
  "Projekte haben das Cluster gewechselt. Ihr altes Cluster exisitert noch.",
  // verschmelzen
  "Cluster sind verschmolzen.",
  "Cluster haben sich bewegt und verformt.",
  "Cluster haben sich aufgeteilt.",
  "Projekte haben das Cluster gewechselt.",
  "Ein neues Cluster ist hinzu gekommen.",
  "Ein Cluster hat sich aufgeteilt und existiert nicht mehr.",
  // aufteilen
  "Ein Cluster hat sich aufgeteilt und existiert noch.",
  "Ein Cluster hat sich aufgeteilt und ein neues ist entstanden.",
  "Ein Projekt ist hinzu gekommen und hat ein neues Cluster gebildet.",
  // clusterwechsel
  "Ein Projekt ist zu einem anderem, existierenden Cluster gewechselt.",
  "Ein Cluster hat ein Projekt an ein anderes existierendes abgegeben."
];

// var allAnswersOrig = [
//   "Ein Cluster hat sich aufgeteilt und existiert nicht mehr.",
//   "Cluster sind zu einem verschmolzen.",
//   "Projekte haben das Cluster gewechselt. Ihr altes Cluster exisitert noch.",
//   "Ein Cluster hat sich aufgeteilt und existiert noch.",
//   "Cluster sind verschmolzen.",
//   "Ein Cluster hat sich aufgeteilt.",
//   "Ein Cluster ist mitsamt der Projekte verschwunden.",
//   "Projekte haben das Cluster gewechselt.",
//   "Ein neues Cluster ist hinzu gekommen.",
//   "Ein Cluster hat sich aufgeteilt und ein neues ist entstanden.",
//   "Ein Projekt ist hinzu gekommen und hat ein neues Cluster gebildet.",
//   "Ein Projekt ist zu einem anderem, existierenden Cluster gewechselt.",
//   "Ein Cluster hat ein Projekt an ein anderes existierendes abgegeben.",
//   "Cluster haben sich aufgeteilt.",
//   "Cluster haben sich bewegt und verformt.",
//   "Projekte sind verschwunden und beeinflussten nicht die Hüllenform.",
//   "Die Cluster haben sich verschoben, aber die Form blieb unverändert.",
//   "Das Verschwinden von Projekten beeinflusste die Hüllenform.",
//   "Die Hüllenform hat sich bei konstanter Projektzahl verändert.",
//   "Neue Projekte kamen hinzu. Sie haben die Hüllenform nicht beeinflusst.",
//   "Neue Projekte kamen hinzu und veränderten die Hüllenform.",
//   "Projekte kamen hinzu, aber die Clusterzahl blieb konstant.",
//   "Neue Projekte haben ein neues Cluster erzeugt.",
//   "Alte Projekte haben ein neues Cluster erzeugt."
// ];

function romanize(num) { // https://stackoverflow.com/questions/9083037/convert-a-number-into-a-roman-numeral-in-javascript
  var roman = {
    M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, 
    L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1};
  var str = '';
  for (var i of Object.keys(roman)) {
    var q = Math.floor(num / roman[i]);
    num -= q * roman[i];
    str += i.repeat(q);
  }
  return str;
}

function randomizeArray(arr, initialIndex) {
  var tmp, randI;
  for (var i=0; i < arr.length; i++) {
    randI = Index.getRandInt(0, arr.length-1);
    //console.log("vertausche", i, "und", randI);
    tmp = arr[randI];
    arr[randI] = arr[i];
    arr[i] = tmp;
    //console.log(arr);
    if (initialIndex == i){// passt Stelle an
      initialIndex = randI;
      //console.log("neuer Index", initialIndex);
    }
    else if (initialIndex == randI){// passt Stelle an
      initialIndex = i;
      //console.log("neuer Index", initialIndex);
    }
  }
  return initialIndex;
}

////////////////// SVG ////////////
class SVG {
  // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Klassen
  constructor(id, ort) {
    this.svg = ort.append("div")
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
    this.nameScaleX = d3.scaleBand()
      .domain([])
      .range([0, width])
      .paddingInner(0.2) // 2 set padding between bands
      .paddingOuter(0.1);// 0.55
    this.nameScaleY = d3.scaleBand()
      // https://github.com/d3/d3-scale
      .domain([])
      .range([height, 0])// inverse
      .paddingInner(0.2) // 2 set padding between bands
      .paddingOuter(0.1);// 0.55
    this.colorScale = d3.scaleSequential()
      // https://www.d3-graph-gallery.com/graph/custom_color.html
      // https://github.com/d3/d3-scale-chromatic
      .domain([1,10])
      .interpolator(d3.interpolateBlues);
  }
  
  setDomainDeutung(daten4, allAnswers, anzTN) {
    this.xScale.domain([0, allAnswers.length]);
    this.yScale.domain([0, anzTN]);
    this.colorScale.domain([0, anzTN+1]);
    this.nameScaleX.domain(daten4.map(d =>
      allAnswers.indexOf(d.Loesung)+1
    ).sort(function(a,b){return a-b}));
    this.nameScaleY.domain(allAnswers.map(function(d,i){return i+1}));
  }
  
  setDomainAnimation(vertices) {
    // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Functions/set
    this.xScale.domain([0, vertices.length]);
    this.yScale.domain([0, d3.max(vertices.map(d => d.anz))]);
    this.nameScaleX.domain(vertices.map(d => d.name));
    this.nameScaleY.domain(vertices.map(d => d.name));
  }
  
  setDomainDauer(vertices) {
    // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Functions/set
    this.xScale.domain([0, d3.max(vertices.map(d => +d.name))]);
    this.yScale.domain([0, d3.max(vertices.map(d => d.anz))]);
    this.nameScaleX.domain(vertices.map(d => d.name));
    this.nameScaleY.domain(vertices.map(d => d.name));
  }
  
  setDomainClusterzahl(vertices) {
    this.xScale.domain([0, d3.max(vertices, function(d){
      if (d.start != undefined)
        return d.start;
      else
        return d.end;
    })]);
    this.yScale.domain([0, d3.max(vertices, function(d){
      return d.anz;
    })]);
  }
}

//////////////// Area ///////////////
class Area {  
  constructor(vertices, svg, klasse, scale){
    this.area = d3.area()
      .x(function(d){return scale.xScale(d.x);})
      .y0(scale.yScale(0))
      .y1(function(d){return scale.yScale(d.y);});
    this.line = d3.line()
      .x(function(d){return scale.xScale(d.x);})
      .y(function(d){return scale.yScale(d.y);});
    this.fill = svg.svg.select("g.hulls")
      .selectAll("path."+klasse)
      .datum(vertices)
//       .data([vertices])
//       .enter()
      .attr("class", klasse)
      .attr("d", d3.area()
        .x(function(d){return scale.xScale(d.x);})
        .y0(scale.yScale(0))
        .y1(function(d){return scale.yScale(d.y);})
      )
      .attr("fill", "yellow")
      .style("opacity", 0.3);
//     this.stroke = svg.svg.select("g.hulls")
//       .selectAll("path."+klasse)
//       .data([vertices])
//       .enter()
//       .attr("class", "area")
//       .attr("d", function(){return this.line})
//       .attr("fill", "none")
//       .attr("stroke", "orange")
//       .attr("stroke-width", 2);
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
  
var tooltipClusterNo = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) {// Antworten
    if (d.start != undefined)
      return "Start: " + d.start +"<br>Personenzahl: " + d.anz;
    else
      return "End: " + d.end +"<br>Personenzahl: " + d.anz;
  });
  
var tooltipAnim = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) {return "Name: " + d.name +"<br>Personenzahl: " + d.anz;
  });
  
var tooltipDeutung = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) {return "Aufgaben-Nr:  " + aufgabenNr(d.Aufgabe)  + "<br>Deutungs-Nr.: " + (allAnswers.indexOf(d.Antwort)+1) + "<br>Lösungs-Nr.:  " + (allAnswers.indexOf(d.Loesung)+1) + "<br>Personenzahl: " + d.Anzahl;
  });
  
var tooltipDauer = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) {return "Dauer: " + (parseInt(d.name)/1000) +" s<br>Personenzahl: " + d.anz;
  });
  
var tooltipNodePoor = d3.tip()// zum Verbergen von Informationen
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d){return "keine Informationen"});

//////////////// Rectangles ///////////////
class Deutungsbars {  
  constructor(flatDatas, svg, klasse, scale, tooltip, allAnswers){
    // flatDatas = {Antwort, Anzahl, Aufgabe, Loesung}
    this.rects = svg.select("g.circs")
      .selectAll("rect")
      .data(flatDatas)
      .enter()
      .append("rect")
      .attr("x", function(d){
        return scale.nameScaleX(
          allAnswers.indexOf(d.Loesung)
        +1);
      })
      .attr("y", function(d){
        return scale.nameScaleY(
          allAnswers.indexOf(d.Antwort)
       +1);
      })
      .attr("width",  scale.nameScaleX.bandwidth())
      .attr("height", scale.nameScaleY.bandwidth())
      .attr("fill", function(d,i) {
        return scale.colorScale(d.Anzahl+1);
      })
      .attr("stroke", function(d){
        if (d.Antwort == d.Loesung)
          return "orange";
        else
          return "none";
      })
      .attr("stroke-width", 1)
      .on("mouseover", tooltip.show)
      .on("mouseout", tooltip.hide);
  }
}
  
class Clusterbars {  
  constructor(vertices, svg, klasse, scale){
    this.rects = svg.svg.select("g.circs")
      .selectAll("rect")
      .data(vertices.Antworten)
      .enter()
      .append("rect")
      .attr("x", function(d){
        if (d.start != undefined)
          return scale.xScale(d.start) -scale.xScale(1) / 3;
        else
          return scale.xScale(d.end);
      })
      .attr("y", function(d){
        return scale.yScale(d.anz);})
      .attr("width", scale.xScale(1) / 3)
      .attr("height", function(d){
        return height - scale.yScale(d.anz);
      })
      .attr("fill", function(d,i) {
        if (vertices.Loesung == d.start)
          return "#00ff00";
        else if (vertices.Loesung == d.end)
          return "#007700";
        else if (d.start != undefined && vertices.Loesung != d.start)
          return "#ff0000";
        else
          return "#770000";
      })
      .on("mouseover", tooltipClusterNo.show)
      .on("mouseout", tooltipClusterNo.hide);
  }
}

class Animbars {  
  constructor(vertices, svg, klasse, scale, tooltip){
    this.rects = svg.svg.select("g.circs")
      .selectAll("rect")
      .data(vertices.Antworten)
      .enter()
      .append("rect")
      .attr("x", function(d){
        return scale.nameScaleX(d.name);
      })
      .attr("y", function(d){
        return scale.yScale(d.anz);})
      .attr("width", scale.nameScaleX.bandwidth())
      .attr("height", function(d){
        return height - scale.yScale(d.anz);
      })
      .attr("fill", function(d,i) {
        return "#0000aa";
      })
      .on("mouseover", tooltip.show)
      .on("mouseout", tooltip.hide);
  }
}

class Durationbars {  
  constructor(vertices, svg, klasse, scale, tooltip){
    this.rects = svg.svg.select("g.circs")
      .selectAll("rect")
      .data(vertices.Antworten)
      .enter()
      .append("rect")
      .attr("x", function(d){
        return scale.xScale(+d.name) -15/2 +barPadding;
      })
      .attr("y", function(d){
        return scale.yScale(d.anz);})
      .attr("width", 15 - 2*barPadding)
      .attr("height", function(d){
        return height - scale.yScale(d.anz);
      })
      .attr("fill", function(d,i) {
        return "#0000aa";
      })
      .on("mouseover", tooltip.show)
      .on("mouseout", tooltip.hide);
  }
}

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
    content.push(key + "; " + localStorage.getItem(key));
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
