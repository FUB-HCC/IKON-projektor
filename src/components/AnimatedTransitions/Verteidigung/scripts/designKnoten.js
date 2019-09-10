const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);
  
//////////////// Header //////////////////
modifyHeader(me);

//////////////// Datasets ////////////////
var pos, id, gerade, clusterNo, researchArea, year, keywords, title, color, alpha;
radius = 7, transDuration = 1000;

var datasBewegung = {
  vorher: [
    {x: 1, y: 1, id: 1, cl: 1, color: d3.color("#1f77b4"), alpha: 1}
  ],
  nachher: [
    {x: 6, y: 1, id: 1, cl: 1, color: d3.color("#1f77b4"), alpha: 1}
  ]
};
  fillDataset(datasBewegung.vorher);
  fillDataset(datasBewegung.nachher);
  
var datasColor = {
  vorher: [
    {x: 1, y: 1, id: 1, cl: 1, color: d3.color("#1f77b4"), alpha: 1},
    {x: 2, y: 1, id: 2, cl: 1, color: d3.color("#1f77b4"), alpha: 1},
    {x: 3, y: 1, id: 3, cl: 1, color: d3.color("#1f77b4"), alpha: 1},
    {x: 4, y: 1, id: 4, cl: 1, color: d3.color("#1f77b4"), alpha: 1},
    {x: 5, y: 1, id: 5, cl: 1, color: d3.color("#1f77b4"), alpha: 1},
    {x: 6, y: 1, id: 6, cl: 1, color: d3.color("#1f77b4"), alpha: 1}
  ],
  nachher: [
    {x: 1, y: 1, id: 1, cl: 1, color: d3.color("#1f77b4"), alpha: 1},
    {x: 2, y: 1, id: 2, cl: 1, color: d3.color("#ff7f0e"), alpha: 1},
    {x: 3, y: 1, id: 3, cl: 1, color: d3.color("#1f77b4"), alpha: 1},
    {x: 4, y: 1, id: 4, cl: 1, color: d3.color("#ff7f0e"), alpha: 1},
    {x: 5, y: 1, id: 5, cl: 1, color: d3.color("#ff7f0e"), alpha: 1},
    {x: 6, y: 1, id: 6, cl: 1, color: d3.color("#1f77b4"), alpha: 1}
  ]
};
  fillDataset(datasColor.vorher);
  fillDataset(datasColor.nachher);
  
var datasAddDel = {
  vorher: [
    {x: 1, y: 1, id: 1, cl: 1, color: d3.color("#1f77b4"), alpha: 1},
    {x: 2, y: 1, id: 2, cl: 1, color: d3.color("#1f77b4"), alpha: 1},
    {x: 3, y: 1, id: 3, cl: 1, color: d3.color("#1f77b4"), alpha: 1},
    {x: 4, y: 1, id: 4, cl: 1, color: d3.color("#1f77b4"), alpha: 1},
    {x: 5, y: 1, id: 5, cl: 1, color: d3.color("#1f77b4"), alpha: 1},
    {x: 6, y: 1, id: 6, cl: 1, color: d3.color("#1f77b4"), alpha: 1}
  ],
  nachher: [
    {x: 1, y: 1, id: 1, cl: 1, color: d3.color("#1f77b4"), alpha: 1},
    {x: 3, y: 1, id: 3, cl: 1, color: d3.color("#1f77b4"), alpha: 1},
    {x: 6, y: 1, id: 6, cl: 1, color: d3.color("#1f77b4"), alpha: 1}
  ]
};
  fillDataset(datasAddDel.vorher);
  fillDataset(datasAddDel.nachher);
  
var datasFade = {
  vorher: [
    {x: 1, y: 1, id: 1, cl: 1, color: d3.color("#1f77b4"), alpha: 1},
    {x: 2, y: 1, id: 2, cl: 1, color: d3.color("#1f77b4"), alpha: 1},
    {x: 3, y: 1, id: 3, cl: 1, color: d3.color("#1f77b4"), alpha: 1},
    {x: 4, y: 1, id: 4, cl: 1, color: d3.color("#1f77b4"), alpha: 1},
    {x: 5, y: 1, id: 5, cl: 1, color: d3.color("#1f77b4"), alpha: 1},
    {x: 6, y: 1, id: 6, cl: 1, color: d3.color("#1f77b4"), alpha: 1}
  ],
  nachher: [
    {x: 1, y: 1, id: 1, cl: 1, color: d3.color("#1f77b4"), alpha: nodeOpacity},
    {x: 2, y: 1, id: 2, cl: 1, color: d3.color("#1f77b4"), alpha: nodeOpacity},
    {x: 3, y: 1, id: 3, cl: 1, color: d3.color("#1f77b4"), alpha: 1},
    {x: 4, y: 1, id: 4, cl: 1, color: d3.color("#1f77b4"), alpha: nodeOpacity},
    {x: 5, y: 1, id: 5, cl: 1, color: d3.color("#1f77b4"), alpha: 1},
    {x: 6, y: 1, id: 6, cl: 1, color: d3.color("#1f77b4"), alpha: nodeOpacity}
  ]
};
  fillDataset(datasFade.vorher);
  fillDataset(datasFade.nachher);

function fillDataset(d) {
  for (var i in d) {
    pos = new Position(d[i].x, d[i].y);
    id = d[i].id;
    clusterNo = d[i].cl;
    researchArea = {};
    year = Index.getRandInt(yearSpan[0], yearSpan[1]);
    keywords = [""];
    title = "";
    color = d[i].color;
    alpha = d[i].alpha;
    d[i] = new Knoten(pos, id, clusterNo, researchArea, year, keywords, title, color, alpha);
  }
}

//////////////// Content //////////////////
linkeSpalte.append("h2").text("Zeitliche Verzerrung in der Bewegung:");
  function togglePlayBtn(btn) {
    if (btn.value == "play") {
      btn.value = "replay";
      btn.btn.text("◀");
    }
    else {
      btn.value = "play";
      btn.btn.text("▶");
    }
  }

  var auflistung = linkeSpalte.append("ul");
  /////////////// LINEAR
  var linear = auflistung.append("div")
    .style("margin-bottom", "10px");
    linear.append("li").text("Linear");
    var linearBtn = new Button(linear, "▶", function(){});
    linearBtn.btn.on("click", function(){
      esGibtExit = 0;
      esGibtAggregatOP = 1;
      esGibtEnter = 0;
      if (linearBtn.value == "play") {
        linearSVG.selectAll("circle")
          .data(datasBewegung.nachher, d => d.id)
          .transition()
          .delay(getDelayOfAggregate())
          .duration(getDurationOfAggregate())
          .ease(d3.easeLinear)
          .attr("cx", d => scale.xScale(d.pos.x))
          .attr("cy", d => scale.yScale(d.pos.y));
      }
      else {
        linearSVG.selectAll("circle")
          .data(datasBewegung.vorher, d => d.id)
          .transition()
          .delay(getDelayOfAggregate())
          .duration(getDurationOfAggregate())
          .ease(d3.easeLinear)
          .attr("cx", d => scale.xScale(d.pos.x))
          .attr("cy", d => scale.yScale(d.pos.y));
      }
      togglePlayBtn(linearBtn);
    });
    var linearSVG = linear.append("svg").attr("class", "small");
      linearSVG.call(tooltipNodeUniform);
      linearSVG.call(tooltipClusterUniform);
  /////////////////// SISO
  var siso = auflistung.append("div");
    siso.append("li").text("SI/SO");
    var sisoBtn = new Button(siso, "▶", function(){});
    sisoBtn.btn.on("click", function(){
      esGibtExit = 0;
      esGibtAggregatOP = 1;
      esGibtEnter = 0;
      if (sisoBtn.value == "play")
        startTransition2(sisoSVG, datasBewegung);
      else
        goToAusgangszustand2(sisoSVG, datasBewegung);
      togglePlayBtn(sisoBtn);
    });
    var sisoSVG = siso.append("svg").attr("class", "small");
      sisoSVG.call(tooltipNodeUniform);
      sisoSVG.call(tooltipClusterUniform);

/////////////// FARBE
linkeSpalte.append("h2").text("Farbwechsel:").style("padding-top", "25px");
  var farbwechsel = linkeSpalte.append("div")
    .style("margin-bottom", "10px");
  var colorBtn = new Button(farbwechsel, "▶", function(){});
    colorBtn.btn.on("click", function(){
      esGibtExit = 0;
      esGibtAggregatOP = 1;
      esGibtEnter = 0;
      if (colorBtn.value == "play")
        startTransition2(farbeSVG, datasColor);
      else
        goToAusgangszustand2(farbeSVG, datasColor);
      togglePlayBtn(colorBtn);
    });
  var farbeSVG = farbwechsel.append("svg").attr("class", "small")
    .style("width", getObjectValues(linearSVG).width + "px");
    farbeSVG.call(tooltipNodeUniform);
    farbeSVG.call(tooltipClusterUniform);
    
rechteSpalte.append("h2").text("Hinzufügen und Entfernen:");
  auflistung = rechteSpalte.append("ul");
  ///////////////////// ALPHA
  var alpha = auflistung.append("div")
    .style("margin-bottom", "10px");
    alpha.append("li").text("α-Wert");
    var alphaBtn = new Button(alpha, "▶", function(){});
    alphaBtn.btn.on("click", function(){
      if (alphaBtn.value == "play") {
        esGibtExit = 1;
        esGibtAggregatOP = 0;
        esGibtEnter = 0;
        alphaSVG.selectAll("circle")
          .data(datasAddDel.nachher, d => d.id).exit()
          .attr("class", "remove")
          .style("opacity", 1)
          .transition()
          .duration(getDurationOfExit())
          .style("opacity", 0)
          .remove();
      }
      else {
        esGibtExit = 0;
        esGibtAggregatOP = 0;
        esGibtEnter = 1;
        alphaSVG.selectAll("circle")
          .data(datasAddDel.vorher, d => d.id).enter()
          .append("circle")
          .attr("class", "existent")
          .attr("cx", d => scale.xScale(d.pos.x))
          .attr("cy", d => scale.yScale(d.pos.y))
          .attr("r", radius)
          .style("opacity", 0)
          .on("mouseover", tooltipNodeUniform.show)// tooltipNode
          .on("mouseout", tooltipNodeUniform.hide)
          // https://github.com/d3/d3-scale-chromatic
          .style("fill", c => getNodeColor(c))
          .style("stroke", c => getNodeColor(c).darker(1))
          .style("stroke-width", strokeWidth + "px")
          .style("pointer-events", "all")
          .transition()
          .delay(getDelayOfEnter())
          .duration(getDurationOfEnter())
          .style("opacity", c => getCircOpacity(c));
      }
      togglePlayBtn(alphaBtn);
    });
    var alphaSVG = alpha.append("svg").attr("class", "small");
      alphaSVG.call(tooltipNodeUniform);
      alphaSVG.call(tooltipClusterUniform);
  
  ////////////////// RADIUS
  var liradius = auflistung.append("div")
    .style("margin-bottom", "10px");
    liradius.append("li").text("Radius");
    var radiusBtn = new Button(liradius, "▶", function(){});
    radiusBtn.btn.on("click", function(){
      if (radiusBtn.value == "play") {
        esGibtExit = 1;
        esGibtAggregatOP = 0;
        esGibtEnter = 0;
        startTransition2(radiusSVG, datasAddDel);
      }
      else {
        esGibtExit = 0;
        esGibtAggregatOP = 0;
        esGibtEnter = 1;
        goToAusgangszustand2(radiusSVG, datasAddDel);
      }
      togglePlayBtn(radiusBtn);
    });
    var radiusSVG = liradius.append("svg").attr("class", "small");
      radiusSVG.call(tooltipNodeUniform);
      radiusSVG.call(tooltipClusterUniform);
    
//////////////// Abblenden
rechteSpalte.append("h2").text("Ein- und Ausblenden (α-Wert):").style("padding-top", "25px");
  //rechteSpalte.append("p").text("per Alpha-Wert");
  var abblenden = rechteSpalte.append("div")
    .style("margin-bottom", "10px");
    var fadeBtn = new Button(abblenden, "▶", function(){});
    fadeBtn.btn.on("click", function(){
      esGibtExit = 0;
      esGibtAggregatOP = 1;
      esGibtEnter = 0;
      if (fadeBtn.value == "play")
        startTransition2(abblendenSVG, datasFade);
      else
        goToAusgangszustand2(abblendenSVG, datasFade);
      togglePlayBtn(fadeBtn);
    });
  var abblendenSVG = abblenden.append("svg").attr("class", "small")
    .style("width", getObjectValues(linearSVG).width + "px");
    abblendenSVG.call(tooltipNodeUniform);
    abblendenSVG.call(tooltipClusterUniform);

/////////// Schieberegler ///////////////
var durationDiv = linkeSpalte.append("div")
  .style("padding", "30px 0 4px 0");
  //.attr("class", "spalte");
durationDiv.append("text").text("Transitionsdauer:")
  .style("float", "left")
  .style("position", "relative")
  .style("top", "6px");
new DurationRegler(durationDiv);
  
//////////////// Scale ////////////////
scale.xScale.domain([0.5, 6.5]);
scale.xScale.range([0, getObjectValues(linearSVG).width]);
scale.yScale.domain([0, 2]);
scale.yScale.range([0, getObjectValues(linearSVG).height]);
  
/////////////// Init /////////////////
createCircs(linearSVG.selectAll("circle")
  .data(datasBewegung.vorher, d => d.id), tooltipNodeUniform, scale);
createCircs(sisoSVG.selectAll("circle")
  .data(datasBewegung.vorher, d => d.id), tooltipNodeUniform, scale);

createCircs(farbeSVG.selectAll("circle")
  .data(datasColor.vorher, d => d.id), tooltipNodeUniform, scale);

createCircs(alphaSVG.selectAll("circle")
  .data(datasAddDel.vorher, d => d.id), tooltipNodeUniform, scale);
createCircs(radiusSVG.selectAll("circle")
  .data(datasAddDel.vorher, d => d.id), tooltipNodeUniform, scale);

createCircs(abblendenSVG.selectAll("circle")
  .data(datasFade.vorher, d => d.id), tooltipNodeUniform, scale);



//////////////// Footer //////////////////  
modifyFooter(me);


////////////// Extras ////////////////
function replay2(svg, datas) {
  var t0 = d3.transition()//.duration(0)
    .on("start", function(){goToAusgangszustand2(svg, datas)})
    .on("end", function(){startTransition2(svg, datas)});
}

function startTransition2(svg, datas) {
  var sel = svg.selectAll("circle").data(datas.nachher, d => d.id);
  deleteCircsTrans(sel);
  moveCircsTrans(sel, scale);
  createCircsTrans(sel, tooltipNodeUniform, scale);
}

function goToAusgangszustand2(svg, datas) {
  var sel = svg.selectAll("circle").data(datas.vorher, d => d.id);
  deleteCircsTrans(sel);
  moveCircsTrans(sel, scale);
  createCircsTrans(sel, tooltipNodeUniform, scale);
//   deleteCircs(sel);
//   moveCircs(sel);
//   createCircs(sel);
}
