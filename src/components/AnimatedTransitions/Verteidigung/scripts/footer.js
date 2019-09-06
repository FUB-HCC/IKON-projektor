var footer = d3.select("body")
  .append("footer")
  .attr("id", "footer");

footer.append("p")
  .attr("class", "foot")
  .text("Anja Camara, Animierte Transitionen für die Visualisierung von Veränderungen in Clustering-Ergebnissen, 16. Sep. 2019");

function modifyFooter(site) {
  d3.select("footer")
    .append("a")
    .style("float", "right")
    .style("padding-left", "8px")
    .attr("class", "arrow")
    .style("color", "rgb(0,102,204)")
    .attr("href", function(){
      return nextPage(site);
    })
    .text(" ❭ ");//⊳, ➜
    
  d3.select("footer").append("p")
    .style("float", "right")
    .style("padding-left", "14px")
    .attr("class","foot")
    .text(pageCounter(site));
    
  d3.select("footer")
    .append("a")
    .style("float", "right")
    .style("padding-left", "8px")
    .attr("class", "arrow")
    .style("color", "rgb(0,102,204)")
    /* https://www.w3schools.com/cssref/css3_pr_transform.asp */
//     .style("-ms-transform", "scaleX(-1)") /* IE 9 */
//     .style("-webkit-transform", "scaleX(-1)") /* Safari 3-8 */
//     .style("transform", "scaleX(-1)")
    .attr("href", function(){
      return prevPage(site);
    })
    .text(" ❬ ");// ⊲, ➜
}
