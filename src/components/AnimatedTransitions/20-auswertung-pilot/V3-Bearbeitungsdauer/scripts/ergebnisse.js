d3.select("body")
  .style("margin", "auto")
  //.style("width", "880px")
  .append("h1")
  .text("Auswertung der Pilot Studie");
  
var dataset, datasetAll;
var aufgaben = new Array(14).fill('Aufgabe ')
  .map(function(a,i){
    return a+ '0'.slice(0, 2-(i+1).toString().length) + (i+1);
  });
  
/////////////// Datas /////////////
Promise.all([
  d3.dsv(";", "dataFiles/results-salif.csv"),
  d3.dsv(";", "dataFiles/results-charleen.csv"),
  d3.dsv(";", "dataFiles/results-rico.csv"),
  d3.dsv(";", "dataFiles/results-christian.csv"),
  d3.dsv(";", "dataFiles/results-roland.csv"),
  d3.dsv(";", "dataFiles/results-kerstin.csv")
]).then(function(allData){
  // http://learnjsdata.com/read_data.html
  // http://learnjsdata.com/combine_data.html
  // http://learnjsdata.com/summarize_data.html
  // http://learnjsdata.com/iterate_data.html
  //console.log(d3.merge(allData));
  dataset = d3.nest()
    .key(d => d[0].Duration)
    .entries(allData)
    .map(function(kv){
      var values = kv.values[0];
      var clusterzahl = +(values[1].Duration);
      values.splice(0,2);// entfernt die ersten 2 Einträge
      values = values.map(d => d.Duration.split(',')
        .map(e => +e/1000)
        .filter(e => e > 0)
      ).map(function(e,i){
        return {arr: e, med: d3.mean(e), last: e[e.length-1], total: d3.sum(e), name: aufgaben[i]};
      });
      return {
        Person: kv.key,
        Clusterzahl: clusterzahl,
        Aufgaben: values
      };
    });
    //rollup(function(values){});
  console.log('dataset',dataset);
  
  personenzahl = dataset.length;
  
  drawStackedBars();
  
  datasetMerge = d3.merge(allData).map(function(d){
    return {
      Aufgabe: d.Aufgabe,
      Duration: d.Duration,
      Person: 'Gesamt'// fügt eine Person hinzu
    };
  });
  datasetAll = d3.nest()
    .key(d => d.Person)// ordnet zuerst nach Person (hier 'Gesamt')
    .key(d => d.Aufgabe)// danach nach Aufgabe
    .entries(datasetMerge)
    .map(function(kvPerson,i){
      var values = kvPerson.values.map(function(kvTask,j){
        var durations = kvTask.values
          .map(a => a.Duration
            .split(',')
            .map(e => +e/1000)
            .filter(e => e > 0)
          )
          .reduce(function(akk,d){return akk.concat(d)}, [])
          .sort();
        return {
          test: kvTask.key,
          name: aufgaben[j],
          med: d3.mean(durations),
          total: d3.sum(durations),
          last: null,
          arr: durations
        };
      });
      return {
        Person: kvPerson.key,
        Clusterzahl: 0,
        Aufgaben: values
      };
    });
  console.log('datasetAll',datasetAll);
  
  drawStackedBarsGes();
  
  //-------------------------------------------------
  // Check for the various File API support.
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
  } else {
    alert('The File APIs are not fully supported in this browser.');
  } // https://www.html5rocks.com/en/tutorials/file/dndfiles/
  
});
