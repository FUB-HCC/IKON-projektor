var dataset = [5, 10, 15, 20, 25];

d3.select("body").selectAll("p")
    .data(dataset) // counts and parses the data values
    .enter() // creates new data-bound elements (placeholder)
    .append("p") // creates paragraphs
    .text(function(d,i) { return i+":"+d; }).
    style("color", function(d){if (d>15) return "red"; else return "black";});