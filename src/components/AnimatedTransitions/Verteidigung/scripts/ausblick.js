const me = document.URL.split("/").reverse()[0].slice(0,this.length-5);
  
//////////////// Header //////////////////
modifyHeader(me);

//////////////// Content //////////////////
linkeSpalte.append("h2").text("Verbesserungen");
var auflistung = linkeSpalte.append("ul");
  auflistung.append("li").text("Slider für die Transitionsdauer");
  auflistung.append("li").text("Replaybutton");
  auflistung.append("li").text("Studie zur Transitionsdauer & Choreographie");
  auflistung.append("li").text("D3: Zeitliche Verzerrung (easing) für Intervalle & Timer");

/////////// Schieberegler ///////////////
  rechteSpalte.append("br").style("clear", "both").style("margin", "0.1ex");
var durationDiv = rechteSpalte.append("div")
  .style("padding", "20px 0 4px 0").style("clear", "both");
durationDiv.append("text").text("Transitionsdauer:")
  .style("float", "left")
  .style("position", "relative")
  .style("top", "6px");
new DurationRegler(durationDiv);

/////////////// Replay
rechteSpalte.append("br").style("clear", "both").style("margin", "1ex");
var btn = new Button(rechteSpalte, "Replay ↻", function(){});
btn.btn.style("clear", "both");



//////////////// Footer //////////////////  
modifyFooter(me);
