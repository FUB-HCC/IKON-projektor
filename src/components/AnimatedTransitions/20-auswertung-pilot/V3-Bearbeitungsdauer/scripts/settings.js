//////////////// Konstanten ////////////////////
const margin = {top: 40, right: 110, bottom: 50, left: 60},
  width = 450 - margin.left - margin.right,
  height = 460 - margin.top - margin.bottom,
  radius = 4,
  barPadding = 2,
  yAbstand = 1;//1.6

var transDur = [];// mögliche Zeiten
for (var i=0; i <= 3; i=i+0.25)
  transDur.push(i);

// gewählte Zeit bei Aufgabe 12
var favDuration = {A: 3, B: 2, C: 3, D: 1.5, E: 1.5, F: 1.5}
var personenzahl = Object.keys(favDuration).length;
favDuration.Gesamt = d3.sum(Object.values(favDuration)) / personenzahl;

d3.select("body")
  .style("font-family", "'Helvetica Neue' Helvetica, Arial, sans-serif")
  .style("background-color", "#ddd")
  .style("font-size", "12px")
  .style("padding", "1ex")
  .style("text-align", "center")
  .style("width", "95%")
  .style("margin-left", "2.5%");

////////////////// SVG ////////////
class SVG {
  // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Klassen
  constructor(id, ort) {
    this.svg = ort.append("div")
      .attr("class", "box")
      .append("svg")
      .attr("id", id)
      .attr("width",  width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("border", "1px solid #999")
      .style("background-color", "#fff")
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    this.svg.append("g").attr("class", "background");
    this.svg.append("g").attr("class", "bars");
    this.svg.append("g").attr("class", "beschriftung");
  }
}

////////////////// Scaling ////////////
class Scale {
  constructor(data){
    this.xScale = d3.scaleLinear()
      .range([0, width])
      .domain([0, 14])// aufgabennummern;
    this.yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([0, height]);
    this.yScale2 = d3.scaleLinear()
      .range([height, 0])
      .domain([0, 3]);
    this.nameScaleX = d3.scaleBand()
      .domain([0,1,2,3,4,5,6,7,8,9,10,11,12,13])// aufgabenNr
      .range([0, width])
      .paddingInner(0.2) // 2 set padding between bands
      .paddingOuter(0.1);// 0.55
      //.align(1);
    this.nameScaleY = d3.scaleBand()
      // https://github.com/d3/d3-scale
      .range([height, 0])// inverse
      .paddingInner(0) // 2 set padding between bands
      .paddingOuter(0) // 0.55
      .domain(transDur);
    this.colorScale = d3.scaleSequential()
      // https://www.d3-graph-gallery.com/graph/custom_color.html
      // https://github.com/d3/d3-scale-chromatic
      .interpolator(d3.interpolateCool)
      .domain([1,3]);
  }
  
  setDomainStackedBars(data) {// pro Person
    // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Functions/set
    this.xScale.domain([1, 14]);// aufgabennummern
    this.yScale.domain([0, d3.max(data, d => d3.max(d.Aufgaben, a => a.total))]);
    this.yScale2.domain([0, 3]);
    this.nameScaleX.domain([0,1,2,3,4,5,6,7,8,9,10,11,12,13]);
    this.nameScaleY.domain(transDur);
    this.colorScale.domain([0,3]);// sekunden
  }
  
  setDomainMidBars(data, personenzahl) {// gesamt
    this.xScale.domain([1, 14]);// aufgabennummern
    this.yScale.domain([0, d3.max(data.Aufgaben, d => d.total) / personenzahl]);
    this.yScale2.domain([0, 3]);
    this.nameScaleX.domain([0,1,2,3,4,5,6,7,8,9,10,11,12,13]);
    this.nameScaleY.domain(transDur);
    this.colorScale.domain([0,3]);// sekunden
  }
}

///////////////// Grid ///////////////
class Gridlines {// https://bl.ocks.org/d3noob/c506ac45617cf9ed39337f99f8511218
  constructor(svg, scale){
    this.yGrid = svg.svg.select("g.background")
      .append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(scale.yScale)
      .ticks(13)
      .tickSize(-width)
      .tickFormat("")
      );
    this.xGrid = svg.svg.select("g.background")
      .append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(scale.nameScaleX)
      .ticks(14)
      .tickSize(-height)
      .tickFormat("")
      );
      
    this.lines = svg.svg.select("g.background").selectAll("g.grid");
      this.lines.selectAll("path").remove();
    //this.lines = svg.svg.select("g.background").selectAll("g.tick");
      this.lines.selectAll("g.tick").select("line")
        .style("stroke", "lightgrey")
        .style("stroke-opacity", "0.7")
        .style("shape-rendering", "crispEdges");
      this.lines.selectAll("g.tick").select("text").remove();
  }
}


////////////////////// Tooltip //////////////
// http://bl.ocks.org/davegotz/bd54b56723c154d25eedde6504d30ad7
  
var tooltipBar = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) {// {h,y,last,x,number,aufgabe}
    return "Aufgabe: " + (d.aufgabe) + "<br>x: " + (d.x+1) + "<br>y: " + d.y + "<br>Wiederholung: " + d.number + "<br>Dauer: " + d.h + " s";
  });

//////////////// Rectangles ///////////////
class MyStackedBars {  
  constructor(dataset, svg, scale, tooltip, proPerson){
    this.dataset = dataset;
    this.rects = svg.svg.select("g.bars")
      // Gruppen
      .selectAll("g")
      .data(dataset.Aufgaben)
      .enter()
      .append("g")
      //.attr("transform", "translate(0,"+ (-height) +")")
      // Rechtecke
      .selectAll("rect")
      .data(function(aufg,i){// Aufgaben[pos_i]
        return aufg.arr.map(function(dur,j){// arr[pos_j]
          return {
            h: dur, 
            y: (d3.sum(aufg.arr.slice(0,j))), 
            last: aufg.last, 
            x: i, 
            number: j,
            aufgabe: aufg.name
          };
        });
      })
      .enter()
      .append("rect")
      .attr("x", function(d){// {h,y,last,x,number,aufgabe}
        return scale.nameScaleX(d.x);})
      .attr("y", function(d,i){
        if (proPerson)
          return scale.yScale(d.y+d.h) + yAbstand;
        else
          return scale.yScale((d.y+d.h) / personenzahl) + yAbstand;
      })
      .attr("width",  scale.nameScaleX.bandwidth())
      .attr("height", function(d){
        if (proPerson)
          return height-scale.yScale(d.h) - yAbstand;
        else
          return height-scale.yScale(d.h / personenzahl) - yAbstand
      })
      .attr("fill", function(d){
        return scale.colorScale(d.h);
      })
      .on("mouseover", tooltip.show)
      .on("mouseout", tooltip.hide);
    svg.svg.call(tooltip);
  }
}

class Graph {
  constructor(dataset, svg, scale, favDuration) {
    this.d3Graph = d3.line()
      .x(d => scale.nameScaleX(d.aufgabe)+scale.nameScaleX.bandwidth()/2)
      .y(d => scale.yScale2(d.mittel));
    this.graph = svg.svg.select("g.bars")
      .selectAll("path.graph")
      .data([
        dataset.Aufgaben.map(function(d,i) {
          return {mittel: d.med, aufgabe: i};
        })
      ])
      .enter()
      .append("path")
      .attr("class", "graph")
      .attr("fill", "none")
      .attr("stroke", "orange")
      .attr("stroke-width", 1.5)
      .attr("d", this.d3Graph);
    this.d3Line = d3.line()
      .x(d => scale.nameScaleX(d.aufgabe)+scale.nameScaleX.bandwidth()/2)
      .y(d => scale.yScale2(d.fav));
    this.chosen = svg.svg.select("g.bars")
      .selectAll("path.chosenDur")
      .data([
        dataset.Aufgaben.map(function(d,i) {
          return {fav: favDuration[dataset.Person], aufgabe: i};
        })
      ])
      .enter()
      .append("path")
      .attr("class", "chosenDur")
      .attr("fill", "none")
      .attr("stroke", "gray")
      .attr("stroke-width", 0.4)
      .attr("d", this.d3Line);
  }
}


class Axen{
  constructor(svg, scale, xBeschriftung, yBeschriftung, yBeschriftung2) {
    this.xAxis = d3.axisBottom(scale.nameScaleX)
      .ticks(20);
    //.tickPadding(-10);
    //.tickFormat(d3.formatPrefix(".2",1e-2));// https://github.com/d3
    //.tickFormat(function(d){return d3.format(".2f")(d/1000)});// https://github.com/d3/d3-format
    this.yAxis = d3.axisLeft()
      .scale(scale.yScale);
    //.ticks(5);
    this.yAxis2 = d3.axisRight()
      .scale(scale.yScale2)
      .ticks(10);
    this.xAchse = svg.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(this.xAxis);
    this.yAchse = svg.svg.append("g")
      .attr("class", "y axis")
      .call(this.yAxis)
      .append("text")
        .attr("transform", "translate(-38," + (height/2) + ") rotate(-90)")
        //.attr("transform", "translate(-38,"+(height/2)+") rotate(-90)")
        .attr("font-size", "11px")
        .attr("fill", "black")
        .attr("dy", ".71em")
        .style("text-anchor", "middle")//middle, end
        .text(yBeschriftung);
    /*this.yAchse2 = svg.svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + width + ", 0)")
      .call(this.yAxis2)
      .append("text")
        .attr("transform", "translate(38," + (height/2) + ") rotate(-90)")
        //.attr("transform", "translate(-38,"+(height/2)+") rotate(-90)")
        .attr("font-size", "11px")
        .attr("fill", "black")
        .attr("dy", "0em")
        .style("text-anchor", "middle")//middle, end
        .text(yBeschriftung2);*/
      
    // Einstellungen
    this.xAchse.selectAll("text")// https://bl.ocks.org/d3noob/3c040800ff6457717cca586ae9547dbf
      .attr("transform", "translate(0,1)")
      .text(x => x+1)
      //.attr("transform", "translate(" + (scale4.nameScaleX.bandwidth() / 2 + 1) + ",12) rotate(-90)")
      .attr("font-size", "11px")
      .attr("fill", "black")
      .attr("dy", ".71em")
      .style("text-anchor", "middle");// end
    this.xAchse.append("text")
      .attr("transform", "translate(" + (width/2) + ", 23)")
      .attr("font-size", "11px")
      .attr("fill", "black")
      .attr("dy", ".71em")
      .style("text-anchor", "middle")//middle, end
      .text(xBeschriftung);
  }
}


class Legende {
  constructor(svg, scale, dataset, titel, proPerson) {
    // Überschrift
    this.grafikname = svg.svg.select("g.beschriftung")
      .append("text")
      .text(function(){
        if (dataset.Person.length == 1)
          return "Person " + dataset.Person + ": " + titel;
        else
          return dataset.Person + ": " + titel;
      })
      .attr("font-size", "11px")
      .attr("fill", "black")
      .attr("x", (width/2))
      .attr("y", -20)
      .style("font-weight", "bold")
      .style("text-anchor", "middle");
    // Gruppe für Legende
    this.gruppe = svg.svg.select("g.beschriftung")
      .append("g")
      .attr("transform", "translate(" + (width+30) + ", 15)");
      // Legendentitel
      this.legendenName = this.gruppe.append("text")
        .text("Dauer in s")
        .attr("font-size", "11px")
        .attr("fill", "black")
        .attr("x", 0)
        .attr("y", -5)
        .attr("dy", "-0.4ex");
      // Legendenrechtecke
      this.legende = this.gruppe.selectAll("rect")
        .data(transDur.slice(1,transDur.length).reverse())
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", function(d,i){return i*12;})
        .attr("width",  15)
        .attr("height", 10)
        .attr("fill", d => scale.colorScale(d));
      /*this.gruppe.append("rect")
        .attr("x", 0)
        .attr("y", 12.6*12)
        .attr("width",  15)
        .attr("height", 2)
        .attr("fill", "orange");
      this.gruppe.append("rect")
        .attr("x", 0)
        .attr("y", 13.7*12)
        .attr("width",  15)
        .attr("height", 0.4)
        .attr("fill", "gray");*/
      // Legendenbeschriftung
      this.labels = this.gruppe.selectAll("text.legende")
        .data(transDur.slice(1,transDur.length).reverse())
        .enter()
        .append("text")
        .attr("class", "legende")
        .text(d => d + ' s')
        .attr("font-size", "11px")
        .attr("fill", "black")
        .attr("x", 20)
        .attr("y", function(d,i){return (i+1)*12;})
        .attr("dy", "-0.5ex");
      /*this.gruppe.append("text")
        .attr("class", "legende")
        .text("Mittel")
        .attr("font-size", "11px")
        .attr("fill", "black")
        .attr("x", 20)
        .attr("y", 13*12)
        .attr("dy", "-0.2ex");
      this.gruppe.append("text")
        .attr("class", "legende")
        .text("fav. Dauer")
        .attr("font-size", "11px")
        .attr("fill", "black")
        .attr("x", 20)
        .attr("y", 14*12)
        .attr("dy", "-0.2ex");*/
    // Barbeschriftung
    this.barlabel = svg.svg.select("g.beschriftung")
      .selectAll("text.total")
      .data(dataset.Aufgaben)
      .enter()
      .append("text")
      .attr("class", "total")
      .text(function(d){
        if (proPerson)
          return d.arr.length;
        else// https://github.com/d3/d3-format
          return d3.format("d")(d.arr.length / personenzahl);
      })
      .attr("x", function(d,i){return scale.nameScaleX(i) + scale.nameScaleX.bandwidth()/2;})
      .attr("y", function(d,i){
        if (proPerson)
          return scale.yScale(d.total);
        else
          return scale.yScale(d.total / personenzahl);
      })
      .attr("font-size", "11px")
      .attr("fill", "black")
      .style("text-anchor", "middle")
      .attr("dy", "-0.5ex");
  }
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

//////////// Event Listener zum Speichern der SVG ////////////
document.addEventListener('keypress', changeView);
// https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
function changeView(keypress) {
  console.log(keypress);
  if (keypress.key == "p") {
    var zip = new JSZip();// https://jalara-studio.de/mit-javascript-eine-zip-datei-erstellen
    if (! JSZip.support.arraybuffer )
      console.log( "ArrayBuffer wird nicht unterstützt." );
    if (! JSZip.support.uint8array )
      console.log( "Uint8Array wird nicht unterstützt." );
    if (! JSZip.support.blob )
      console.log( "Blob wird nicht unterstützt." );
    
    var inhalt;
    for (var p in Object.keys(favDuration)) {
      var person = Object.keys(favDuration)[p];
      inhalt = createSVGcontent(person);
      zip.file("Pilot-Results-Bearbeitungsdauer-Person" + person + ".svg", inhalt);
    }
    /*zip.generateAsync({type:"base64"}).then(function(base64){
      location.href = "data:application/zip; base64," + base64;
    });*/
    zip.generateAsync({type:"blob"}).then(function(blob) {
      saveAs(blob, "Pilotstudie-Auswertung-Bearbeitungsdauer.zip");
    });
  }// ende if key=='p'
}

function createSVGcontent(person){
  // https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
  var svgElem;
  var svgElements = document.getElementsByClassName("svg");
    svgElem = document.getElementById(person);
  svgElem.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  var svgData = svgElem.outerHTML;
  var preface = '<?xml version="1.0" standalone="no"?>\r\n';
  return preface + svgData;
}

function saveImage(){// speichert ein einzelnes SVG
  // https://stackoverflow.com/questions/23218174/how-do-i-save-export-an-svg-file-after-creating-an-svg-with-d3-js-ie-safari-an
  var svgElem = document.getElementsByClassName("svg")[0];
  //var svgElem = document.getElementById("rechts").lastChild;
  svgElem.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  var svgData = svgElem.outerHTML;
  var preface = '<?xml version="1.0" standalone="no"?>\r\n';
  var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
  var svgUrl = URL.createObjectURL(svgBlob);
  var downloadLink = document.createElement("a");
  downloadLink.href = svgUrl;
  downloadLink.download = "test14-final.svg";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
