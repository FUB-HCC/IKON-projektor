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
var maxAnzDurAll, durSpan;

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
    this.svg.append("g").attr("class", "zeichnung");
    this.svg.append("g").attr("class", "beschriftung");
  }
}

////////////////// Scaling ////////////
class Scale {
  constructor(data){
    this.xScale = d3.scaleLinear()
      .range([0, width])
      .domain([0, 14])// aufgabennummern;
    this.yScale = d3.scaleLinear()// transitionsdauer
      .range([height, 0])
      .domain([0, height]);
    this.rScale = d3.scaleLinear()// transitionsdauer
      .range([2, 8])
      .domain([1, 48]);
    this.nameScaleX = d3.scaleBand()
      .domain([1,2,3,4,5,6,7,8,9,10,11,12,13,14])// aufgabenNr
      .range([0, width])
      .paddingInner(0) // 2 set padding between bands
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
      .interpolator(d3.interpolateCool)// interpolateGreens
      .domain([1,3]);
    interquartil(data);
    maxAnzDur(data);
  }
  
  setDomainStackedBars(data) {// pro Person
    // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Functions/set
    this.xScale.domain([1, 14]);// aufgabennummern
    this.yScale.domain([0, 3]);
    this.nameScaleX.domain([0,1,2,3,4,5,6,7,8,9,10,11,12,13]);
    this.nameScaleY.domain(transDur);
    this.colorScale.domain([0,3]);// sekunden
  }
  
  setDomainMidBars(data) {// gesamt
    this.xScale.domain([1, 14]);// aufgabennummern
    this.yScale.domain([0, 3]);
    this.nameScaleX.domain([0,1,2,3,4,5,6,7,8,9,10,11,12,13]);
    this.nameScaleY.domain(transDur);
    this.colorScale.domain([quartilScale(100), 1]);// sekunden
    this.rScale.range([4, this.nameScaleX.bandwidth()/2]);
    this.rScale.domain([1, quartilScale(100)]);
  }
}

function maxAnzDur(dataset){
  maxAnzDurAll = d3.max(dataset, 
    d => d3.max(d.Aufgaben,
      a => d3.max(a.arr,
        dur => a.arr.filter(x => x == dur).length
      )
    )
  );
  //console.log(maxAnzDurAll);
  durSpan = [];
  for (var i=1; i <= maxAnzDurAll; i=i+(Math.floor(maxAnzDurAll-1)/10))
    durSpan.push(i);
}

var quartile, quartilList = [], rangeList = [];
var quartilScale = d3.scaleLinear()
  .range([1,10])// Abbild
  .domain([0,100]);// Input
var rangeScale = d3.scaleLinear()
  .range([1,10])
  .domain([0,9]);

function cap(d) {
  if (d <= rangeList[rangeList.length-1])
    return d;
  else
    return rangeList[rangeList.length-1];
}
function interquartil(data){
  if (quartilList.length == 0) {
    var haufigkeiten = data.map(
      d => d.Aufgaben.map(
        a => d3.max(a.arr,
          dur => a.arr.filter(x => x == dur).length
        )// # häufigste dur.
      )
    ).reduce((akk,d) => akk.concat(d), [])
    .sort((a,b) => a - b);
    var len = haufigkeiten.length-1;
    quartilScale.range([0,len]);
    
    console.log('haufigkeiten',haufigkeiten);
    for (var i=0; i<100; i+=4) {
      var idx = Math.floor(quartilScale(i));
      quartilList.push(haufigkeiten[idx]);
    }
    len = quartilList.length-1;
    quartilScale.range([quartilList[1], quartilList[len]]);
    console.log('quartilList',quartilList);
    rangeScale.range([1, quartilScale(100)]);
    var menge = 15;
    if (quartilScale(100)-quartilScale(0)+1 < menge)
      menge = quartilScale(100)-quartilScale(0)+1;
    rangeScale.domain([0, menge-1]);
    for (var i=0; i<menge; i++)
      rangeList.push(Math.floor(rangeScale(i)));
  }
}

///////////////// Grid ///////////////
class Gridlines {// https://bl.ocks.org/d3noob/c506ac45617cf9ed39337f99f8511218
  constructor(svg, scale){
    this.yGrid = svg.svg.select("g.background")
      .append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(scale.nameScaleY)
      //.ticks(13)
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
  
var tooltipCirc = d3.tip()
  .attr("class", "d3-tip")
  .offset([-8, 0])
  .html(function(d) {// d={dur,nummer,anz,name,med,total}
    return "Aufgabe: " + (d.name) + "<br>x: " + (d.nummer+1) + "<br>Dauer: " + d.dur + "<br>Medium: " + d.med + "<br>Häufigkeit: " + d.anz;
  });
  
/////////////////// Circles /////////////////
class Circles{
  constructor(dataset, svg, scale, tooltip, proPerson){
    this.rects = svg.svg.select("g.zeichnung")
      // Gruppen
      .selectAll("g")
      .data(dataset.Aufgaben)
      .enter()
      .append("g")// Untergruppe
      .selectAll("circle")
      .data(function(aufg, i){
        var object = aufg.arr.map(function(dur,j){// arr[pos_j]
          return {
            dur: dur,// y-Wert
            nummer: i,// x-Wert
            anz: 1,
            name: aufg.name,
            med: aufg.med,
            total: aufg.total
          };
        })
        .reduce(function(akk,d){
          // d={dur,nummer,anz,name,med,total}
          var duration = d.dur.toString();
          if (akk[duration] == undefined)
            akk[duration] = d;
          else
            akk[duration].anz += 1;
          return akk;// wichtig!!!
        }, {});
        var keys = Object.keys(object);
        return keys.reduce(function(akk,k) {
          akk.push(object[k]);
          return akk;// WICHTIG!!!
        }, []);
      })
      .enter()
      .append("circle")// d={dur,nummer,anz,name,med,total}
      .attr("cx", d => scale.nameScaleX(d.nummer) + scale.nameScaleX.bandwidth()/2)
      .attr("cy", d => scale.nameScaleY(d.dur) + scale.nameScaleY.bandwidth()/2)
      .attr("r",  function(d){
        //console.log('quartilList',quartilList);
        if (d.anz > quartilList[quartilList.length-1]) {
          //console.log(d.anz, quartilList[quartilList.length-1])
          return scale.rScale(quartilList[quartilList.length-1]);
        }
        else
          return scale.rScale(d.anz);
      })
      //.attr("fill", d => scale.colorScale(cap(d.anz)))
      .attr("fill", d3.rgb(27,217,172))
      //.attr("stroke", d => scale.colorScale(d.anz))
      .on("mouseover", tooltip.show)
      .on("mouseout", tooltip.hide);
    svg.svg.call(tooltip);
  }
}

//////////////// Rectangles ///////////////
class MyStackedBars {  
  constructor(dataset, svg, scale, tooltip, proPerson){
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
//     this.d3Graph = d3.line()
//       .x(d => scale.nameScaleX(d.aufgabe)+scale.nameScaleX.bandwidth()/2)
//       .y(function(d){
//         var verschiebung = d3.scaleLinear()
//           .domain([3, 0])
//           .range([0, scale.nameScaleY.bandwidth()]);
//         return scale.yScale(d.med) - verschiebung(d.med) + scale.nameScaleY.bandwidth()/2;// orig: d => scale.yScale(d.med)
//       });
//     this.graph = svg.svg.select("g.zeichnung")
//       .selectAll("path.graph")
//       .data([
//         dataset.Aufgaben.map(function(d,i) {
//           return {med: d.med, aufgabe: i};
//         })
//       ])
//       .enter()
//       .append("path")
//       .attr("class", "graph")
//       .attr("fill", "none")
//       .attr("stroke", "gray")
//       .attr("stroke-width", 1.3)
//       .attr("d", this.d3Graph);
    this.d3Line = d3.line()
      .x(d => scale.nameScaleX(d.aufgabe) + scale.nameScaleX.bandwidth() / 2)
      .y(function(d){
        var verschiebung = d3.scaleLinear()
          .domain([3, 0])
          .range([0, scale.nameScaleY.bandwidth()]);
        return scale.yScale(d.fav) - verschiebung(d.fav) + scale.nameScaleY.bandwidth()/2;// orig: d => scale.yScale(d.fav)
      });
    this.chosen = svg.svg.select("g.zeichnung")
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
      .attr("stroke", "orange")
      .attr("stroke-width", 1)
      .attr("d", this.d3Line);
    this.label = svg.svg.select("g.beschriftung")
      .append("text")
      .attr("x", width)
      .attr("y", function(){
        var verschiebung = d3.scaleLinear()
          .domain([3, 0])
          .range([0, scale.nameScaleY.bandwidth()]);
        var fav = favDuration[dataset.Person];
        return scale.yScale(fav) - verschiebung(fav) + scale.nameScaleY.bandwidth()/2;
      })
      .text("fav. Dauer")
      .attr("font-size", "11px")
      .attr("fill", "black")
      .attr("dy", "0.7ex");
  }
}


class Axen{
  constructor(svg, scale, xBeschriftung, yBeschriftung, yBeschriftung2) {
    this.xAxis = d3.axisBottom(scale.nameScaleX)
      .ticks(10);
    //.tickPadding(-10);
    //.tickFormat(d3.formatPrefix(".2",1e-2));// https://github.com/d3
    //.tickFormat(function(d){return d3.format(".2f")(d/1000)});// https://github.com/d3/d3-format
    this.yAxis = d3.axisLeft()
      .scale(scale.nameScaleY);
//     this.yAxis2 = d3.axisRight()
//       .scale(scale.yScale);
//     //.ticks(5);
    this.xAchse = svg.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(this.xAxis);
    this.yAchse = svg.svg.append("g")
      .attr("class", "y axis")
      .call(this.yAxis)
      .append("text")
        .attr("transform", "translate(-51," + (height/2) + ") rotate(-90)")
        //.attr("transform", "translate(-38,"+(height/2)+") rotate(-90)")
        .attr("font-size", "11px")
        .attr("fill", "black")
        .attr("dy", ".71em")
        .style("text-anchor", "middle")//middle, end
        .text(yBeschriftung);
//     this.yAchse2 = svg.svg.append("g")
//       .attr("class", "y axis")
//       .call(this.yAxis2)
//       .append("text")
//         .attr("transform", "translate(-48," + (height/2) + ") rotate(-90)")
//         //.attr("transform", "translate(-38,"+(height/2)+") rotate(-90)")
//         .attr("font-size", "11px")
//         .attr("fill", "black")
//         .attr("dy", ".71em")
//         .style("text-anchor", "middle")//middle, end
//         .text(yBeschriftung);
      
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
      /*// Legendentitel
      this.legendenName = this.gruppe.append("text")
        .text("Häufigkeit")
        .attr("font-size", "11px")
        .attr("fill", "black")
        .attr("x", 0)
        .attr("y", -5)
        .attr("dy", "-0.4ex");
      // Legendenrechtecke
      this.legende = this.gruppe.selectAll("rect")
        .data(rangeList)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", function(d,i){return (rangeList.length-1-i)*12;})
        .attr("width",  15)
        .attr("height", 10)
        .attr("fill", d => scale.colorScale(d));
//       this.gruppe.append("rect")
//         .attr("x", 0)
//         .attr("y", 16.6*12)
//         .attr("width",  15)
//         .attr("height", 1.3)
//         .attr("fill", "gray");
      this.gruppe.append("rect")
        .attr("x", 0)
        .attr("y", 16.2*12)//17.7
        .attr("width",  15)
        .attr("height", 1)
        .attr("fill", "orange");
      // Legendenbeschriftung
      this.labels = this.gruppe.selectAll("text.legende")
        .data(rangeList)
        .enter()
        .append("text")
        .attr("class", "legende")
        .text(function(d,i){
          if (i==rangeList.length-1)
            return "≥ " + d;
          else
            return d;
        })
        .attr("font-size", "11px")
        .attr("fill", "black")
        .attr("x", 20)
        .attr("y", function(d,i){return (rangeList.length-i)*12;})
        .attr("dy", "-0.5ex");
//       this.gruppe.append("text")
//         .attr("class", "legende")
//         .text("Mittel")
//         .attr("font-size", "11px")
//         .attr("fill", "black")
//         .attr("x", 20)
//         .attr("y", 17*12)
//         .attr("dy", "-0.2ex");
      this.gruppe.append("text")
        .attr("class", "legende")
        .text("fav. Dauer")
        .attr("font-size", "11px")
        .attr("fill", "black")
        .attr("x", 20)
        .attr("y", 16.5*12)//18*12
        .attr("dy", "-0.2ex");*/
    // Circbeschriftung
    this.dotlabel = svg.svg.select("g.beschriftung")
      .selectAll("g.aufgabenlabel")
      .data(dataset.Aufgaben)
      .enter()
      .append("g")// Untergruppe
      .attr("class", "aufgabenlabel")
      .selectAll("text.total")
      .data(function(aufg, i){
        var object = aufg.arr.map(function(dur,j){// arr[pos_j]
          return {
            dur: dur,// y-Wert
            nummer: i,// x-Wert
            anz: 1,
            name: aufg.name,
            med: aufg.med,
            total: aufg.total
          };
        })
        .reduce(function(akk,d){
          // d={dur,nummer,anz,name,med,total}
          var duration = d.dur.toString();
          if (akk[duration] == undefined)
            akk[duration] = d;
          else
            akk[duration].anz += 1;
          return akk;// wichtig!!!
        }, {});
        var keys = Object.keys(object);
        return keys.reduce(function(akk,k) {
          akk.push(object[k]);
          return akk;// WICHTIG!!!
        }, []);
      })
      .enter()
      .append("text")// d={dur,nummer,anz,name,med,total}
      .attr("class", "total")
      .text(d => d.anz)
      .attr("x", d => scale.nameScaleX(d.nummer) + scale.nameScaleX.bandwidth()*0.5)
      .attr("y", d => scale.nameScaleY(d.dur) + scale.nameScaleY.bandwidth()/2)
      .attr("font-size", "11px")
      .attr("fill", "black")
      .style("text-anchor", "middle")
      .attr("dy", function(d){
        if (d.anz > quartilList[quartilList.length-1]) {
          return -(1+scale.rScale(quartilList[quartilList.length-1])) + "px";
        }
        else
          return -(1+scale.rScale(d.anz)) + "px";
      });
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
      zip.file("Pilot-Results-Transitionsdauer-Person" + person + ".svg", inhalt);
    }
    /*zip.generateAsync({type:"base64"}).then(function(base64){
      location.href = "data:application/zip; base64," + base64;
    });*/
    zip.generateAsync({type:"blob"}).then(function(blob) {
      saveAs(blob, "Pilotstudie-Auswertung-Transitionsdauer.zip");
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
