var dataset = []; // empty array
for (var i = 0; i < 25; i++) {           //Loop 25 times
    var newNumber = Math.round(Math.random() * 30);  //New random number (0-30)
    dataset.push(newNumber);             //Add new number to array
}

d3.select("#hier").selectAll("div")
    .data(dataset) // counts and parses the data values
    .enter() // creates new data-bound elements (placeholder)
    .append("div") // creates paragraphs
    .attr("class", "bar")// alternativ: .classed("bar", true)
    .style("height", function(d){
      var barHeight = d * 5;  //Scale up by factor of 5
      return barHeight+"px";
    })
    .style("margin-right", "2px")
    .style("background-color", function(d,i){return "rgb(0,"+i*255/dataset.length+",150)";})
    ;