var startpunkt = 0;
var zeit = 1500;
var easeTypes = ["easeLinear", "easeQuadInOut", "easePolyInOut", "easeSinInOut", "easeExpInOut", "easeCircleInOut", "easeBackInOut", "easeElasticIn", "easeBounceOut"];

var maxHeight = easeTypes.length*20;

var colorScale = d3.scaleLinear() // d3.scale.linear() mit d3.v3
  .domain([0, easeTypes.length])
  .range([255, 0]);

var svg = d3.select("body")
  .append("svg")
  .attr("width", 600)
  .attr("height", maxHeight);
  
//var g = svg.append("g");

var textLines = svg.selectAll("text")
  .data(easeTypes)
  .enter()
  .append("text")
  .attr("y", function(d,i){return 20*(i+1);})
  .text(function(d){return "d3."+d;})
  .attr("fill", function(d,i) {return "rgb("+colorScale(i)+", 0, 255)";})
  .attr("x", startpunkt)
  .attr("font-family", "sans-serif")
  .attr("font-size", "16px");

function chooseTransition(d,i) {
  var t = d3.transition().duration(zeit);
  var obj = d3.select(this);
  switch (i) {
    case 0: obj.transition(t)
      .ease(d3.easeLinear)// .ease("linear") ab D3 v4: .ease(d3.easeLinear)
      .attr("x",  obj.attr("x")==0? "400" : "0");break;
    case 1: obj.transition(t)
      .ease(d3.easeQuadInOut)// .ease("cubic-in-out") ab D3 v4: .ease(d3.easeQuadInOut)
      .attr("x",  obj.attr("x")==0? "400" : "0");break;
    case 2: obj.transition(t)
      .ease(d3.easePolyInOut)
      .attr("x",  obj.attr("x")==0? "400" : "0");break;
    case 3: obj.transition(t)
      .ease(d3.easeSinInOut)
      .attr("x",  obj.attr("x")==0? "400" : "0");break;
    case 4: obj.transition(t)
      .ease(d3.easeExpInOut)
      .attr("x",  obj.attr("x")==0? "400" : "0");break;
    case 5: obj.transition(t)
      .ease(d3.easeCircleInOut)
      .attr("x",  obj.attr("x")==0? "400" : "0");break;
    case 6: obj.transition(t)
      .ease(d3.easeBackInOut)
      .attr("x",  obj.attr("x")==0? "400" : "0");break;
    case 7: d3.easeElastic.period(0.1);
      obj.transition(t)
      .ease(d3.easeElasticOut)// .ease("elastic") ab D3 v4: .ease(d3.easeElasticIn)
      .attr("x",  obj.attr("x")==0? "400" : "0");break;
    default: obj.transition(t)
      .ease(d3.easeBounceOut)
      .attr("x",  obj.attr("x")==0? "400" : "0");
  };
}

function initSlideIn() {
  textLines.each(chooseTransition);
}

/* Quellen:
 * https://github.com/d3/d3-ease
 * https://visual.ly/blog/creating-animations-and-transitions-with-d3-js/
 */