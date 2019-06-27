d3.select("body")
  .append("h1")
  .text("Auswertung der Pilot Studie");
var einleitung = d3.select("body")
  .append("p")
  .text("Hier kommen die Auswertungen der Teilnehmer der Pilot Studie.");
  
/////////////// Datas /////////////
Promise.all([
  d3.dsv(";", "dataFiles/results1.csv"),
  d3.dsv(";", "dataFiles/results2.csv"),
  d3.dsv(";", "dataFiles/results3.csv"),
  d3.dsv(";", "dataFiles/results4.csv"),
  d3.dsv(";", "dataFiles/results5.csv")
]).then(function(allData){
  // http://learnjsdata.com/read_data.html
  // http://learnjsdata.com/combine_data.html
  // http://learnjsdata.com/summarize_data.html
  // http://learnjsdata.com/iterate_data.html
  //console.log(d3.merge(allData));
  //console.log('allData',allData);
  var modData = allData.map(function(res){
    return res.map(function(task){
      var antworten = [];
      if (task.Aufgabe == "Teilnehmer")
        return {
          Aufgabe: task.Aufgabe,
          Loesung: task.Loesung,
          Antworten: [task.Deutung]
        };
      for (var i=1; i<=9; i++) {// durchläuft Antworten
        if (task["Antwort"+i] != undefined) {
          if (task["Antwort"+i] == task.Deutung)
            antworten.push({name: task["Antwort"+i], anz: 1});
          else
            antworten.push({name: task["Antwort"+i], anz: 0});
        }
        else if (task.Aufgabe == "test14" && i==1) {// für Aufgabe 14
          antworten.push({start: +task.Deutung.split(",")[0], anz: 1});
          antworten.push({end: +task.Deutung.split(",")[1], anz: 1});
        }
      }
      return {
        Aufgabe: task.Aufgabe,
        Loesung: task.Loesung,
        Antworten: antworten
      };
    });
  });
  //console.log('modData',modData);
  function isEmpty(obj) {
    for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
    }
    return true;
  }
  var reducedData = modData.reduce(function(akk, d){
    if (isEmpty(akk))// Start
      return d;
    else {
      for (var i=0; i<d.length && i<akk.length; i++) {// tests
        if (akk[i].Aufgabe == "Teilnehmer") {
          akk[i].Antworten.push(d[i].Antworten[0]);
        }
        else if (akk[i].Aufgabe == "test14") {
          d[i].Antworten.forEach(function(zeit){
            var gefunden = false;
            for (var j=0; j < akk[i].Antworten.length; j++){
              var akk2 = akk[i].Antworten[j];
              if (akk2.start != undefined && akk2.start == zeit.start){
                akk2.anz += zeit.anz;
                gefunden = true;
                break;
              }
              if (akk2.end != undefined && akk2.end == zeit.end) {
                akk2.anz += zeit.anz;
                gefunden = true;
                break;
              }
            }
            if (! gefunden)
              akk[i].Antworten.push(zeit);
          });
        }
        else {// Deutungen, Animationsart & TransDauer
          akk[i].Antworten.forEach(function(a,j){// durchl. Antworten
            akk[i].Antworten[j].anz += d[i].Antworten[j].anz;
          });
        }
      }
      return akk;
    }
  }, {});// startvalue
  //console.log('reducedData',reducedData);
  
  einleitung.text(einleitung._groups[0][0].innerText + " Gesamtzahl der Teilnehmer: " + reducedData[0].Antworten.length);
  
  var table = d3.select("body").append("table");
  var zeile = table.append("tr");
  
  ///////// Deutung //////////////
  drawVergleich(reducedData, zeile);
  
  ///////// Clusterzahl //////////////
  zeile = table.append("tr");
  drawClusterzahl(reducedData, zeile);
  
  ///////// Animationsart //////////////
  zeile = table.append("tr");
  drawAnimationsart(reducedData, zeile);
  
  ///////// Animationsart //////////////
  zeile = table.append("tr");
  drawDuration(reducedData, zeile);
  
  //-------------------------------------------------
  // Check for the various File API support.
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
  } else {
    alert('The File APIs are not fully supported in this browser.');
  } // https://www.html5rocks.com/en/tutorials/file/dndfiles/
  
});
